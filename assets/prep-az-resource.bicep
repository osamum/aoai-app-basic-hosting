@description('リソースをデプロイするリージョン（通常リソース）')
param location string = 'Japan West'

@description('Azure OpenAI をデプロイするリージョン')
param aoaiLocation string = 'East US'

@description('デプロイ日時（省略時は自動生成）')
param deploymentTimestamp string = utcNow('yyyyMMddHHmm')

// タイムスタンプ + 短いハッシュで一意性を保証
var uniqueSuffix = toLower('${deploymentTimestamp}-${take(uniqueString(deploymentTimestamp), 4)}')
// ストレージアカウント用（ハイフン不可のため）
var storageUniqueSuffix = toLower('${deploymentTimestamp}${take(uniqueString(deploymentTimestamp), 4)}')

// 共通タグ
var commonTags = {
  deployedAt: deploymentTimestamp
  environment: 'workshop'
}

// App Service プラン
resource appServicePlan 'Microsoft.Web/serverfarms@2024-04-01' = {
  name: 'plan-${uniqueSuffix}'
  location: location
  tags: commonTags
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
  tags: commonTags
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      linuxFxVersion: 'NODE|22-lts'
    }
  }
}

// Azure Cognitive Search
resource searchService 'Microsoft.Search/searchServices@2023-11-01' = {
  name: 'aisearch-${uniqueSuffix}'
  location: location
  tags: commonTags
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
  name: take('st${storageUniqueSuffix}', 24)
  location: location
  tags: commonTags
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {}
}

// Blob コンテナー rag-data-store
resource blobContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2022-09-01' = {
  name: '${storageAccount.name}/default/rag-data-store'
  properties: {}
  dependsOn: [
    storageAccount
  ]
}

// Azure OpenAI アカウント
resource aoai 'Microsoft.CognitiveServices/accounts@2025-10-01-preview' = {
  name: 'aoai-${uniqueSuffix}'
  location: aoaiLocation
  tags: commonTags
  sku: {
    name: 'S0'
  }
  kind: 'OpenAI'
  properties: {
    customSubDomainName: 'aoai-${uniqueSuffix}'
  }
}


resource gpt5chat 'Microsoft.CognitiveServices/accounts/deployments@2025-10-01-preview' = {
  name: 'gpt-5-chat'
  parent: aoai
  sku: {
    name: 'GlobalStandard'
    capacity: 150
  }
  dependsOn: [
    aoai
  ]
  properties: {
    model: {
      name: 'gpt-5-chat'
      version: '2025-10-03'
      format: 'OpenAI'
    }
    versionUpgradeOption: 'OnceNewDefaultVersionAvailable'
    raiPolicyName: 'Microsoft.DefaultV2'
  }
}

resource embedding3small 'Microsoft.CognitiveServices/accounts/deployments@2025-10-01-preview' = {
  name: 'text-embedding-3-small'
  parent: aoai
  dependsOn: [
    gpt5chat
  ]
  properties: {
    model: {
      name: 'text-embedding-3-small'
      version: '1'
      format: 'OpenAI'
    }
  }
}
