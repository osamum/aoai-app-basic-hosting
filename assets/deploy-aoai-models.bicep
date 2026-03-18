// deploy-aoai-models.bicep
// Azure OpenAI モデル (gpt-4o-mini, dall-e-3, text-embedding-ada-002) を既存の Cognitive Services (OpenAI) リソースにデプロイします。
// 既存の Cognitive Services アカウント名とリソースグループ名をパラメータ化しています。

param accountName string // 既存の Azure OpenAI (Cognitive Services) アカウント名

resource aoai 'Microsoft.CognitiveServices/accounts@2025-10-01-preview' existing = {
  name: accountName
}

resource gpt5chat 'Microsoft.CognitiveServices/accounts/deployments@2025-10-01-preview' = {
  name: 'gpt-5-chat'
  parent: aoai
  properties: {
    model: {
      name: 'gpt-5-chat'
      version: '2025-10-03'
      format: 'OpenAI'
    }
  }
}

resource embedding3small 'Microsoft.CognitiveServices/accounts/deployments@2025-10-01-preview' = {
  name: 'text-embedding-3-small'
  parent: aoai
  properties: {
    model: {
      name: 'text-embedding-3-small'
      version: '1'
      format: 'OpenAI'
    }
  }
}

// 各モデルのバージョンは 2026年3月時点の最新を指定しています。必要に応じて公式ドキュメントでご確認ください。
