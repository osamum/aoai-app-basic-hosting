# 準備 4 : Azure への演習用アプリケーションのデプロイ

ローカル環境で正常動作が確認できた演習用アプリケーションを [準備 1 : Azure リソースの作成](prep01.md) で作成しておいた Azure App Service にデプロイします。

この準備作業では、作成済みの Azure App Service に対し、環境変数を設定し、その後、GitHub リポジトリを介してアプリケーションをデプロイします。

この準備作業では、Azure App Service へのアプリケーションの配置はもちろん、GitHub Action を使用した CI/CD 環境も構築されます。

## 1. Azure App Service の環境変数の設定

Azure App Service の環境変数の設定は、Azutre Portal や Azure CLI の以下のコマンドで行えますが、各環境変数ごとに設定するのは手間がかかるので Bicep を使用して一括で設定します。

具体的な手順は以下のとおりです。

\[**手順**\]

1. 以下の内容をメモ帳などのテキストエディタに貼り付け、環境変数の設定の中身をコメントに従い書き換えます

    ``` bicep
    param siteName string
    param location string = resourceGroup().location

    resource appService 'Microsoft.Web/sites@2022-03-01' existing = {
    name: siteName
    }

    resource appSettings 'Microsoft.Web/sites/config@2022-03-01' = {
     name: '${siteName}/appsettings'
     properties: {
        'SCM_DO_BUILD_DURING_DEPLOYMENT' : 'true'
        'AZURE_OPENAI_ENDPOINT' : 'AzureOpenAI サービスのエンドポイント'
        'AZURE_OPENAI_API_KEY' : 'AzureOpenAI サービスの API キー'
        'LM_SETTINGS' : '{"deploymentName":"gpt-4o-mini", "apiVersion":"2024-05-01-preview", "conversationLength":"10", "tokenLimit":"20000"}'
        'EMBEDDING_SETTINGS' : '{"deploymentName":"dall-e-3", "apiVersion":"2024-06-01", "imageSize":"1024x1024","imageStyle":"vivid"}'
        'SEARCH_ENDPOINT' : 'Azure AI Search のエンドポイント'
        'SEARCH_API_KEY' : 'Azure AI Search の API キー'
        'SEARCH_SETTINGS' : '{"indexName":"reg-index","fieldName":"text_vector","thresholdScore":"5.8"}'
     }
    }
    ```

    上記の内容を `prep-app-env.bicep` という名前で保存します

2. [Azure ポータル](https://portal.azure.com)にログインし、画面右上にある Cloud Shell アイコンをクリックして Cloud Shell 画面を開きます

    ![Cloud Shell](./images/cloudShell_menu.png)

3. Cloud Shell 画面のメニュー \[ファイルの監理\] - \[アップロード\] を選択し、作成した `prep-app-env.bicep` ファイルをアップロードします

    ![Cloud Shell Menu](./images/cloudShell_upload.png)
    
    ファイルのアップロードが完了したら以下のコマンドを実行してアップロードしたファイルがリストされることを確認します。

    ```bash
    ls
    ```
5. アップロードした Bicep ファイルを使用して Azure リソースをデプロイします。実行するコマンドは以下のとおりです。

    ```bash
    az deployment group create --resource-group AOAI-AppEnv-handson --template-file prep-app-env.bicep --parameters siteName=環境変数を設定する Azure App Service の名前
    ```
    
    Bicep の実行が完了するまで待ちます。

6. デプロイが完了したら Azure App Service のプロパティ画面を開き、画面左のメニュー \[設定\] - \[**環境変数**\]をクリックします
   
    環境変数の一覧が表示されるので、Bicep に記述した環境変数が正しく設定されていることを確認します。

    ![Azure App Service Settings](./images/AppSrv_setting_env.png)

    もし、足りないものや誤っているものがあれば、同画面で直接修正してください。

ここまでの作業で、Azure App Service に環境変数が設定されました。

なお、Bicep を使用すると、既存の環境変数が全て上書きされてしまうので、既存の環境変数に設定を追加する場合は、Azure Portal の UI や 以下のコマンドを使用してください。

```
az webapp config appsettings set \
  --name <app-service-name> \
  --resource-group <rg-name> \
  --settings MY_ENV_VAR=value
```

<br>

## 2. GitHub リポジトリからのアプリケーションのデプロイ

Azure App Service を GitHub リポジトリからアプリケーションをデプロイするように構成します。

この設定が完了すると、開発者がアプリケーションのコードを GitHub リポジトリの指定したブランチにプッシュするたびに、Azure App Service に自動的にデプロイされます。

具体的な手順は以下のとおりです。

\[**手順**\]

1. [Azure ポータル](https://portal.azure.com)で Azure App Service のプロパティ画面を開き、画面左のメニュー \[デプロイ\] - \[**デプロイ センター**\]をクリックします

    \[デプロイ センター\] 画面が表示されるので、\[設定\] タブ内の \[**ソース \***\] ドロップダウン ボックスで \[**GitHub**\] を選択します。

    ![Azure App Service Deploy Center](./images/AppSrv_deploy_gitHub.png)