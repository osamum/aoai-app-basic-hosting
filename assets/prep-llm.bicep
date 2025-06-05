//LLM モデルのデプロイ
param accountName string // 既存の Azure OpenAI (Cognitive Services) アカウント名

resource aoai 'Microsoft.CognitiveServices/accounts@2023-05-01' existing = {
  name: accountName
}

resource gpt4oMini 'Microsoft.CognitiveServices/accounts/deployments@2025-04-01-preview' = {
  name: 'gpt-4o-mini'
  parent: aoai
  properties: {
    model: {
      name: 'gpt-4o-mini'
      format: 'OpenAI'
    }
  }
}
