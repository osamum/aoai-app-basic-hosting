param accountName string // 既存の Azure OpenAI (Cognitive Services) アカウント名

resource aoai 'Microsoft.CognitiveServices/accounts@2023-05-01' existing = {
  name: accountName
}

resource embeddingAda002 'Microsoft.CognitiveServices/accounts/deployments@2025-04-01-preview' = {
  name: 'text-embedding-ada-002'
  parent: aoai
  properties: {
    model: {
      name: 'text-embedding-ada-002'
      version: '2'
      format: 'OpenAI'
    }
  }
}