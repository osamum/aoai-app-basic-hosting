//画像生成モデルのデプロイ
param accountName string // 既存の Azure OpenAI (Cognitive Services) アカウント名

resource aoai 'Microsoft.CognitiveServices/accounts@2023-05-01' existing = {
  name: accountName
}

resource dalle3 'Microsoft.CognitiveServices/accounts/deployments@2025-04-01-preview' = {
  name: 'dall-e-3'
  parent: aoai
  properties: {
    model: {
      name: 'dall-e-3'
      version: '3.0'
      format: 'OpenAI'
    }
  }
}