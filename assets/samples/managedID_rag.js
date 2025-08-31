// Azure マネージド ID を使用した認証    
const {
    DefaultAzureCredential,
    getBearerTokenProvider
} = require("@azure/identity");

// keyless authentication    
const credential = new DefaultAzureCredential();
const scope = "https://cognitiveservices.azure.com/.default";
const azureADTokenProvider = getBearerTokenProvider(credential, scope);

const { AzureOpenAI } = require('openai');
const { SearchClient, AzureKeyCredential } = require('@azure/search-documents');

const dotenv = require('dotenv');
dotenv.config();

//埋め込み用のエンドポイントとキーが個別に指定されている場合はそれを読む
const embedding_endpoint = process.env['EMBEDDING_ENDPOINT'] || process.env['AZURE_OPENAI_ENDPOINT'];
//const embedding_apiKey = process.env['EMBEDDING_API_KEY'] || process.env['AZURE_OPENAI_API_KEY'];

const search_endpoint = process.env['SEARCH_ENDPOINT'];
//const search_apiKey = process.env['SEARCH_API_KEY'];

//インデックス名その他の設定値を取得
const settings = JSON.parse(process.env['SEARCH_SETTINGS']);
const embedding_settings = JSON.parse(process.env['EMBEDDING_SETTINGS']);
const embedding_deployment = embedding_settings.deployName;
const apiVersion = embedding_settings.apiVersion;

let isAvailable = search_endpoint ? true : false;

//テキストをベクトルデータに変換する関数
async function getEmbedding(text) {
    //埋め込みモデルのクライアントを作成  (Azure マネージド ID を使用した認証)
    const embeddingClient = new AzureOpenAI({ endpoint: embedding_endpoint, apiKey: '', azureADTokenProvider, deployment: embedding_deployment, apiVersion });
    const embeddings = await embeddingClient.embeddings.create({ input: text, model: '' });
    return embeddings.data[0].embedding;
}

//問い合わせメッセージを受け取って検索を実行す
async function findIndex(queryText) {
    const thresholdScore = settings.thresholdScore;
    try {
        const embedding = await getEmbedding(queryText);
        const result = await searchWithVectorQuery(embedding, queryText);

        //スコアがしきい値以上の場合は、検索結果を付加して言語モデルに回答の生成を依頼するメッセージを返す
        //意図した判断とならない場合は、console.log(result.score) でスコアを確認して thresholdScore の値を調整
        if (result != null && result.score >= thresholdScore) {
            console.log('Found it in RAG data.');
            return '以下の [question] の内容に対し、[content]の内容を使用して回答してください。'
                + 'ただし[question]に対し[content]の内容に回答に必要な情報がないと判断した場合は[content]の内容を無視して回答してください\n\n'
                + `[question]\n${queryText}\n\n[content]\n${result.document.chunk}`;
        } else {
            return queryText;
        }
    } catch (error) {
        console.error('Error in findIndex(RAG.js)', error.message);
        return error.message;
    }
}

// ベクトル化されたクエリを使用して検索を実行
async function searchWithVectorQuery(vectorQuery, queryText) {
    const search_fieldName = settings.fieldName;
    const search_indexName = settings.indexName;
    //Azure AI Search のクライアントを作成 (Azure マネージド ID を使用した認証)
    const searchClient = new SearchClient(search_endpoint, search_indexName, credential);
    const searchResults = await searchClient.search(queryText, {
        vector: {
            fields: [search_fieldName],
            kNearestNeighborsCount: 3,
            value: vectorQuery,
        },
    });
    for await (const result of searchResults.results) {
        // クエリベクトルに最も近いものを返す
        return result;
    }
}

module.exports = { findIndex, isAvailable };