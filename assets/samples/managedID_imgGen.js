// Azure マネージド ID を使用した認証    
const { 
    DefaultAzureCredential, 
    getBearerTokenProvider 
} = require("@azure/identity");

const credential = new DefaultAzureCredential();
const scope = "https://cognitiveservices.azure.com/.default";
const azureADTokenProvider = getBearerTokenProvider(credential, scope);

const { AzureOpenAI } = require('openai');
const dotenv = require('dotenv');
dotenv.config();
const endpoint = process.env['IMAGE_GENERATOR_ENDPOINT'] || process.env['AZURE_OPENAI_ENDPOINT'];
//const apiKey = process.env['IMAGE_GENERATOR_API_KEY'] || process.env['AZURE_OPENAI_API_KEY'];
let settings = null,isAvailable = false;
const settingJSON = process.env['IMAGE_GENERATOR_SETTINGS'];
if(settingJSON){
    settings = JSON.parse(settingJSON);
    //デプロイメント名と API バージョンが指定されていたら Image Generator が利用可能とみなす
    isAvailable = settings.deploymentName && settings.apiVersion ? true : false;
}

async function ganarateImage(prompt) {
    const deploymentName = settings.deploymentName;
    const apiVersion = settings.apiVersion;
    const size = settings.imageSize;
    const style = settings.imageStyle;
    const n = 1; //生成する画像の枚数　dall-e-3 は 1 枚のみ

    try {
        //Azure OpenAI クライアントの初期化 (Azure マネージド ID を使用した認証)
        const client = new AzureOpenAI({ endpoint, apiKey:'',azureADTokenProvider, deployment, apiVersion });
        const results = await client.images.generate({
            prompt,
            size: size,
            n: n,
            style: style, // or 'natural'
        });

        return results.data[0].url;
    } catch (err) {
        return err.message;
    }
}

module.exports = { ganarateImage, isAvailable };