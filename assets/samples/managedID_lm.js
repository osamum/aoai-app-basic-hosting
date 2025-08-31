// Azure マネージド ID を使用した認証    
const { 
DefaultAzureCredential, 
getBearerTokenProvider 
} = require("@azure/identity");

const credential = new DefaultAzureCredential();
const scope = "https://cognitiveservices.azure.com/.default";
const azureADTokenProvider = getBearerTokenProvider(credential, scope);

//ライブラリの参照
const { AzureOpenAI } = require('openai');
const dotenv = require('dotenv');
dotenv.config();
const myFunctions = require('./funcs');
const imageGen = require('./imgGen');

const endpoint = process.env['AZURE_OPENAI_ENDPOINT'];
//const apiKey = process.env['AZURE_OPENAI_API_KEY'];

//設定情報をロード
const settings = JSON.parse(process.env['LM_SETTINGS']);

//言語モデルとユーザーの会話を保持するための配列
var messages = [
    {
        //通常のシステムメッセージ
        role: "system", content: "あなたは誠実なアシスタントです。質問に対し、回答すべき情報が知識にない場合には正直にその旨を伝えます。"

        /* Web 検索機能を有効にするには以下のシステムメッセージを使用します
        role: "system", content: "あなたは誠実なアシスタントです。質問に対し、回答すべき情報が知識にない場合には、"
            + "文字列 $_SEARCHSTRING: に続けてインターネットを検索して情報を得るための検索文字列だけを返してください。"
            + "\n例) $_SEARCHSTRING:今日の東京の天気"
        */
    }
];

//保持する会話の個数
const conversationLength = settings.conversationLength;

let mkWebSearchResultFlag = false;

//Azure OpenAI にメッセージを送信する関数
async function sendMessage(message, imageUrls) {
    let body;

    if (imageUrls && imageUrls.length > 0) {
        /*
        画像が指定されていたら、リクエストの message 要素の content の内容を以下のように作成
        content: [{type:'text', text: message},{type:'image_url',image_url:{ur:imageUrl}},{複数画像の場合}] };
        */
        let _content = [];
        _content.push({ type: 'text', text: message });
        for (const imageUrl of imageUrls) {
            //トークンの消費量を抑えたい場合は detail プロパティを 'auto' から 'low' に変更
            _content.push({ type: 'image_url', image_url: { url: imageUrl, detail: 'auto' } });
        }
        message = { role: 'user', content: _content };
        body = { messages: [message], max_tokens: 100, stream: false };
    } else {
        //Web 検索の結果から回答を生成する場合、token の消費を避けるためにメッセージを会話履歴に記録しない
        if (mkWebSearchResultFlag) {
            body = { messages: [{ role: 'user', content: message }] };
            mkWebSearchResultFlag = false;
        } else {
            if (message) addMessage({ role: 'user', content: message });
            body = {
                messages: messages, tools: tools, tool_choice: 'auto'
            }
        }
    }

    try {
        const deployment = settings.deploymentName;
        const apiVersion = settings.apiVersion;
        //Azure OpenAI クライアントの初期化 (Azure マネージド ID を使用した認証)
        const client = new AzureOpenAI({ endpoint, apiKey:'',azureADTokenProvider, deployment, apiVersion });
        const result = await client.chat.completions.create(body);
        for (const choice of result.choices) {
            if (choice.message.tool_calls) {
                return sendFunctionResult(choice.message);
            } else {
                const resposeMessage = choice.message.content;
                mkWebSearchResultFlag = (resposeMessage.indexOf('$_SEARCHSTRING:') === 0);
                //言語モデルが Web 検索を選択した場合、token の消費を避けるために回答を会話履歴に記録しない
                if (!mkWebSearchResultFlag) {
                    addMessage({ role: 'assistant', content: resposeMessage });
                }
                return resposeMessage;
            }
        }

    } catch (error) {
        console.log('Error in sendMessage(lm.js)', error.message);
        return 'メッセージが正しく処理できませんでした。';
    }

}

//保持する会話の個数を調整する関数
function addMessage(message) {
    if (messages.length >= conversationLength) messages.splice(1, 1);
    messages.push(message);
}

//会話履歴をリセットする
function resetConversation() {
    messages.length = 0;
}


// tools スキーマの設定
//ここに FunctionCall で呼ばれる関数の設定を追加する
const tools = [
    {
        type: 'function',
        function: {
            name: 'get_GitHubUser_info',
            description: 'GitHub アカウントの情報を返す',
            parameters: {
                type: 'object',
                properties: {
                    userName: {
                        type: 'string',
                        description: 'GitHub のユーザー名、アカウント名、もしくは ID',
                    }
                },
                required: ['userName'],
            },
        },
    },
    {
        type: 'function',
        function: {
            name: 'get_current_date_time',
            description: '現在のシステム時刻を返します。この関数は引数は必要ありません',
            parameters: {
                type: 'object',
                properties: {},
            },
        },
    }
];

//画像生成のエンドポイントとキーが設定されてたら画像生成機能を有効にする
if (imageGen.isAvailable) {
    tools.push(
        {
            type: 'function',
            function: {
                name: 'generate_image',
                description: '指定されたプロンプトに基づいて画像を生成します',
                parameters: {
                    type: 'object',
                    properties: {
                        prompt: {
                            type: 'string',
                            description: '生成したい画像の概要を指定します。例: "恰好良いオートバイのイラストを描いてください"'
                        }
                    },
                    required: ['prompt']
                }
            }
        }
    );
}

//実際の関数を呼び出す
async function routingFunctions(name, args) {
    console.log('Function Calling: ' + name);
    switch (name) {
        case 'get_GitHubUser_info':
            return JSON.stringify(await myFunctions.getGitHubUserinfo(args.userName));
        case 'get_current_date_time':
            return await myFunctions.getCurrentDatetime();
        case 'generate_image':
            console.log('\nAI : 画像を生成しています。この処理には数秒かかる場合があります。');
            return await imageGen.ganarateImage(args.prompt);

        default:
            return '要求を満たす関数がありませんでした。';
    }
}

//アプリケーション内で実行した関数の結果を言語モデルに返す
async function sendFunctionResult(returnMessage) {
    const toolCall = returnMessage.tool_calls[0];
    const args = JSON.parse(toolCall.function.arguments);
    const functionResponse = await routingFunctions(toolCall.function.name, args);
    //関数の処理結果を言語モデルに送信
    addMessage({
        role: "function",
        name: toolCall.function.name,
        content: functionResponse,
    });
    return await sendMessage();
}

module.exports = { sendMessage, resetConversation };