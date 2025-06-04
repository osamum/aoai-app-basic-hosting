# 準備 2: Azure OpenAI リソースへの AI モデルのデプロイ

前の手順でデプロイされた Azure OpenAI リソースに AI モデルをデプロイし、リソースへの接続情報を入手します。これらの情報は、この後の準備作業で演習用アプリケーションの設定に使用します。

## AI モデルのデプロイ

デプロイする AI モデルは以下の 3 つです。

| モデル | 種類 | 用途 |
|----|---|---|
| gpt-4o-mini | テキスト生成 | 会話 |
| dall-e-3 | 画像生成 | 画像の生成 |
| text-embedding-ada-002 | 埋め込み | 検索ワードのベクトル化 |

この作業も Bicep を使用して自動でデプロイを行いますが、手動で行いたい場合は Bicep を使用した手順の後に手動の手順へのリンクを用意していますので、そちらを参照してください。

Bicep を使用して AI モデルをデプロイする手順は以下のとおりです。

\[**手順**\]

1. 各 AI モデルをデプロイするための Bicep ファイルをダウンロードします。
   - [言語モデル用](./assets/prep-llm.bicep)
   - [埋め込みモデル用](./assets/prep-embedding.bicep)
   - [画像生成モデル用](./assets/prep-img_gen.bicep)

2. Azure ポータルにログインし、画面右上にある Cloud Shell アイコンをクリックして Cloud Shell 画面を開きます
    ![Cloud Shell](./images/cloudShell_menu.png)

3. Cloud Shell 画面のメニュー [ファイルの監理] - [アップロード] を選択し、ダウンロードした各モデル用の bicep ファイルをアップロードします
    
     ![Cloud Shell Menu](./images/cloudShell_upload.png)

     ![](./images//cloudShell_selectedfiles.png)

4. ファイルのアップロードが完了したら以下のコマンドを実行してアップロードしたファイルがリストされることを確認します。
   
    ```bash
    ls
    ```
5. 以下のコマンドを実行します。デプロイ中のリソース使用の競合を避けるため、以下の各コマンドが完了するのを待って実行してください。

    またパラメーター `accountName` には、前の手順でデプロイした Azure OpenAI リソースの名前を指定してください。

    * 埋め込みモデルのデプロイ
  
        ```bash
        az deployment group create --resource-group AOAI-AppEnv-handson --template-file prep-embedding.bicep --parameters accountName=%Azure OpenAI リソースの名前% 
        ```
    * 画面生成モデルのデプロイ
  
        ```bash
        az deployment group create --resource-group AOAI-AppEnv-handson --template-file prep-img_gen.bicep --parameters accountName=%Azure OpenAI リソースの名前% 
        ```
    * 言語モデルのデプロイ
  
        ```bash
        az deployment group create --resource-group AOAI-AppEnv-handson --template-file prep-llm.bicep  --parameters accountName=%Azure OpenAI リソースの名前% 
        ```



Azure ポータル画面でデプロイされた Azure OpenAI リソースのアイコンをクリックしてを開き、以下の手順に従い各 AI モデルをデプロイしてください。

なお、この手順は [Azure OpenAI アプリケーション開発ハンズオン](https://github.com/osamum/AOAI-first-step-for-Developer)コンテンツに遷移するので、**デプロイが完了したら次の演習には進まずにこのページに戻ってきてください**。

* [Azure AI Foundry から言語モデル gpt-4o-mini のデプロイ](https://github.com/osamum/AOAI-first-step-for-Developer/blob/main/Ex01-2.md)
* [Azure AI Foundry から埋め込みモデル : text-embedding-ada-002 のデプロイ](https://github.com/osamum/AOAI-first-step-for-Developer/blob/main/Ex01-3.md)
* [Azure AI Foundry から画像生成モデル : dall-e-3 のデプロイ](https://github.com/osamum/AOAI-first-step-for-Developer/blob/main/Ex01-4.md)

---

* <a target="_blank" href="https://github.com/osamum/AOAI-first-step-for-Developer/blob/main/Ex01-2.md">Azure AI Foundry から言語モデル gpt-4o-mini のデプロイ</a>
* <a target="_blank" href="https://github.com/osamum/AOAI-first-step-for-Developer/blob/main/Ex01-3.md">Azure AI Foundry から埋め込みモデル : text-embedding-ada-002 のデプロイ</a>
* <a target="_blank" href="https://github.com/osamum/AOAI-first-step-for-Developer/blob/main/Ex01-4.md">Azure AI Foundry から画像生成モデル : dall-e-3 のデプロイ</a>

<br>

## 接続情報の取得

Azure OpenAI サービスでは複数の種類の異なる AI モデルをデプロイできますが、Azure OpenAI サービスがデプロイされたリージョンがサポートしているモデルであれば API のエンドポイントのサブドメインと API キーは同じものを使用することができます。
