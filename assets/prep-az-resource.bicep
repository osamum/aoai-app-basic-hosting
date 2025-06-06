@description('リソースをデプロイするリージョン（通常リソース）')
param location string = 'Japan East'

@description('Azure OpenAI をデプロイするリージョン')
param aoaiLocation string = 'East US'

@description('作成するリソースに付加するランダムな値')
param randomString  string = utcNow()

var uniqueSuffix = toLower(randomString)

// App Service プラン
resource appServicePlan 'Microsoft.Web/serverfarms@2024-04-01' = {
  name: 'plan-${uniqueSuffix}'
  location: location
  sku: {
    name: 'B1'
    tier: 'Basic'
  }
  kind: 'linux'
  properties: {
	reserved: true
	}
}

// App Service
resource appService 'Microsoft.Web/sites@2024-04-01' = {
  name: 'botApp-${uniqueSuffix}'
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      linuxFxVersion: 'NODE|22-lts'
    }
  }
}

// Azure Cognitive Search
resource searchService 'Microsoft.Search/searchServices@2020-08-01' = {
  name: 'aisearch-${uniqueSuffix}'
  location: location
  sku: {
    name: 'standard'
  }
  properties: {
    replicaCount: 1
    partitionCount: 1
  }
}

// Storage Account（小文字・ハイフンなし制限）
resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: 'storage${uniqueSuffix}'
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {}
}

// Blob コンテナー rag-data-store
resource blobContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2022-09-01' = {
  name: 'storage${uniqueSuffix}/default/rag-data-store'
  properties: {}
  dependsOn: [
    storageAccount
  ]
}

// Azure OpenAI アカウント
resource aoai 'Microsoft.CognitiveServices/accounts@2023-05-01' = {
  name: 'aoai-${uniqueSuffix}'
  location: aoaiLocation
  sku: {
    name: 'S0'
  }
  kind: 'OpenAI'
  properties: {
    apiProperties: {
      // モデルデプロイ用プロパティは必要に応じて追加
    }
  }
}


resource gpt4oMini 'Microsoft.CognitiveServices/accounts/deployments@2025-04-01-preview' = {
  name: 'gpt-4o-mini'
  parent: aoai
  dependsOn: [
    aoai
  ]
  properties: {
    model: {
      name: 'gpt-4o-mini'
      format: 'OpenAI'
    }
  }
}

resource embeddingAda002 'Microsoft.CognitiveServices/accounts/deployments@2025-04-01-preview' = {
  name: 'text-embedding-ada-002'
  parent: aoai
  dependsOn: [
    gpt4oMini
  ]
  properties: {
    model: {
      name: 'text-embedding-ada-002'
      version: '2'
      format: 'OpenAI'
    }
  }
}

resource dalle3 'Microsoft.CognitiveServices/accounts/deployments@2025-04-01-preview' = {
  name: 'dall-e-3'
  parent: aoai
  dependsOn: [
    embeddingAda002
  ]
  properties: {
    model: {
      name: 'dall-e-3'
      version: '3.0'
      format: 'OpenAI'
    }
  }
}
