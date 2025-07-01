// deploy-aoai-models.bicep
// Azure OpenAI モデル (gpt-4o-mini, dall-e-3, text-embedding-ada-002) を既存の Cognitive Services (OpenAI) リソースにデプロイします。
// 既存の Cognitive Services アカウント名とリソースグループ名をパラメータ化しています。

param accountName string // 既存の Azure OpenAI (Cognitive Services) アカウント名

resource aoai 'Microsoft.CognitiveServices/accounts@2023-05-01' existing = {
  name: accountName
}

resource gpt4oMini 'Microsoft.CognitiveServices/accounts/deployments@2024-05-01-preview' = {
  name: 'gpt-4o-mini'
  parent: aoai
  properties: {
    model: {
      name: 'gpt-4o-mini'
      version: '2024-07-18'
      format: 'OpenAI'
    }
  }
}

resource dalle3 'Microsoft.CognitiveServices/accounts/deployments@2025-04-01-preview' = {
  name: 'dall-e-3'
  parent: aoai
  properties: {
    model: {
      name: 'dall-e-3'
      version: '3'
      format: 'OpenAI'
    }
  }
}

resource embeddingAda002 'Microsoft.CognitiveServices/accounts/deployments@2024-06-01' = {
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

// 各モデルのバージョンは 2025年6月時点の最新を指定しています。必要に応じて公式ドキュメントでご確認ください。
