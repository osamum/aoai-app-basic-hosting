# 準備 1 : Azure リソースの作成

ハンズオンの演習で使用する Azure リソースを作成します。

この準備作業では **Bicep** を使用して以下の Azure リソースを**自動作成**します。

* **リソースグループ** (※これはコマンドで手動で作成します)
    | 項目 | 値 |
    |----|---|
    | リソースグループ名 | `AOAI-AppEnv-handson` |
    | リージョン | `Japan East` |

* **Azure App Service**
    | 項目 | 値 |
    |----|----|
    | リソースグループ | `AOAI-AppEnv-handson` |
    | 名前 | `botApp-(ユニークな値)` |
    | 公開 | コード |
    | ランタイムスタック | Node 22 TLS|
    | オペレーティング システム | Linux |
    | リージョン | `Japan East` |
    | 価格プラン | B1 |

    その他の設定は既定のまま

* **Azure Storage Account**
    | 項目 | 値 |
    |----|----|
    | リソースグループ | `AOAI-AppEnv-handson` |
    | ストレージ アカウント名 | `storage-(ユニークな値)` |
    | リージョン | `Japan East` |
    | パフォーマンス | Standard |
    | アカウントの種類 | StorageV2 (汎用 v2) |
    | 冗長性 | LRS |

    * **BLOB コンテナー**
        | 項目 | 値 |
        |----|----|
        | 名前 | `rag-data-store` |

    その他の設定は既定のまま

* **Azure AI Search**
    | 項目 | 値 |
    |----|----|
    | リソースグループ | `AOAI-AppEnv-handson` |
    | 名前 | `aisearch-(ユニークな値)` |
    | リージョン | `Japan East` |
    | 価格レベル | Standard  |

    その他の設定は既定のまま

* **Azure OpenAI Service**
    | 項目 | 値 |
    |----|----|
    | リソースグループ | `AOAI-AppEnv-handson` |
    | 名前 | `aoai-(ユニークな値)` |
    | リージョン | `East US` |
    | 価格レベル | Standard 0|

    * **デプロイされる AI モデル**
        | モデル | 種類 | 用途 |
        |----|---|---|
        | gpt-4o-mini | テキスト生成 | 会話 |
        | dall-e-3 | 画像生成 | 画像の生成 |
        | text-embedding-ada-002 | 埋め込み | 検索ワードのベクトル化 |

    その他の設定は既定のまま


なお、Bicep を使用せずに Azure Portal や Azure CLI を使用して手動で作成しても構いませんが、リソースの作成先のリージョンは Azure OpenAI Service だけが `East US` で、他のリソースは `Japan East` となるのでご注意ください。

Bicep 使用して Azure リソースを自動作成する場合の手順は以下のとおりです。

\[**手順**\]

1. 以下の Bicep ファイルをダウンロードします。
   - [prep-az-resource.bicep](./assets/prep-az-resource.bicep)
  
2. [Azure ポータル](https://portal.azure.com)にログインし、画面右上にある Cloud Shell アイコンをクリックして Cloud Shell 画面を開きます

    ![Cloud Shell](./images/cloudShell_menu.png)
   
3. Cloud Shell 画面で、以下のコマンドを実行してリソースグルーブ `AOAI-AppEnv-handson` を作成します
   ```bash
   az group create --name AOAI-AppEnv-handson --location "Japan East"
   ```

   Cloud Shell で以下のコマンドを実行してリソースグループ `AOAI-AppEnv-handson` が作成されていることを確認します。

    ```bash
    az group list --query "[?name=='AOAI-AppEnv-handson']" --output table
    ```

4. Cloud Shell 画面のメニュー \[ファイルの監理\] - \[アップロード\] を選択し、ダウンロードした `prep-az-resource.bicep` ファイルをアップロードします

    ![Cloud Shell Menu](./images/cloudShell_upload.png)
    
    ファイルのアップロードが完了したら以下のコマンドを実行してアップロードしたファイルがリストされることを確認します。

    ```bash
    ls
    ```
5. アップロードした Bicep ファイルを使用して Azure リソースをデプロイします。実行するコマンドは以下のとおりです。

    ```bash
    az deployment group create --resource-group AOAI-AppEnv-handson --template-file prep-az-resource.bicep
    ```

    この Bicep ファイルは作成する各リソースにタイムスタンプを付与したユニークな名前を付けてリソースを作成します。

    デプロイが完了するまで時間がかかるので、しばらく待ちます(※)。

    (※) デプロイ時間はタイミングによって異なりますが、通常は 3 ～ 10 分程度で完了します。

6. デプロイが完了したら Azire ポータル画面で `AOAI-AppEnv-handson` リソースグループを開き、以下のリソースが作成されていることを確認します。

   - Azure OpenAI Service
   - Azure AI Search
   - Azure App Service
   - Azure App Service Plan
   - Azure Storage Account

   ![Azure Resources](./images/deproyed_resources.png)

7. デプロイされた Azure Storage Account リソース `storage(ランダムな値)`を開き、\[**BLOB コンテナー**\] メニューをクリックして、`rag-data-store` という名前の BLOB コンテナーが作成されていることを確認します。
   
    ![Azure Blob Container](images/check_storageBlob.png) 

8. デプロイされた AI モデルを確認します。 Azure OpenAI サービスのリソース `aoai-(ランダムな値)` を開き、\[**概要**\] メニュー画面内にある \[Explore and deploy\] ボックス内の \[**Explore Azure AI Foundry Portal**\]ボタンをクリックします

    ![Explore Azure AI Foundry Portal ボタン](./images/DeployModel_OpenAIStudio.png)

9.  Azure AI Foundry が開かれるので、画面左のメニューバーから \[**デプロイ**\] をクリックします

    ![Azure AI Foundry デプロイメニュー](./images/AOAIStudio_menu_Deploy.png)

10. `gpt-4o-mini`、`text-embedding-ada-002`、`dall-e-3` の 3 つのモデルがリストされることを確認します。もし、リストされていない場合は、画面上部の \[**モデルのデプロイ**\] ボタンをクリックして、モデルを選択し、デプロイを行ってください。

    ![ハンズオンで使用するAzure OpenAI サービスのモデル一覧](./images/aoai_models.png)


ここまでの手順で演習で使用する Azure リソースの作成と AI モデルのデプロイが完了しました。

### AI モデルを手動でデプロイする方法

 もし、ここまでの手順でデプロイがうまくいかなかった場合、Azure のリソースについては前述の情報を参考に Azure Portal や Azure CLI を使用して手動で作成してください。
 
 AI モデルについては以下の手順を参考にデプロイしてください。

なお、この手順は [Azure OpenAI アプリケーション開発ハンズオン](https://github.com/osamum/AOAI-first-step-for-Developer)コンテンツに遷移するので、デプロイが完了したら**次の演習には進まずに**このページに戻ってきてください。

* <a target="_blank" href="https://github.com/osamum/AOAI-first-step-for-Developer/blob/main/Ex01-2.md">Azure AI Foundry から言語モデル gpt-4o-mini のデプロイ</a>
* <a target="_blank" href="https://github.com/osamum/AOAI-first-step-for-Developer/blob/main/Ex01-3.md">Azure AI Foundry から埋め込みモデル : text-embedding-ada-002 のデプロイ</a>
* <a target="_blank" href="https://github.com/osamum/AOAI-first-step-for-Developer/blob/main/Ex01-4.md">Azure AI Foundry から画像生成モデル : dall-e-3 のデプロイ</a>
  
<br>



## 接続情報の取得

デプロイした Azure OpenAI サービスの接続情報を取得します。これらの情報は、演習用アプリケーションの設定に使用します。

具体的な手順については以下のリンク先のドキュメントの手順を参照してください。

* [**Azure OpenAI サービスの接続情報の入手**](https://github.com/osamum/AOAI-first-step-for-Developer/blob/main/Ex03-0.md#%E6%8E%A5%E7%B6%9A%E6%83%85%E5%A0%B1%E3%81%AE%E5%85%A5%E6%89%8B)

この手順は [Azure OpenAI アプリケーション開発ハンズオン](https://github.com/osamum/AOAI-first-step-for-Developer)コンテンツに遷移するので、接続情報をメモしたら**次の演習には進まずに**このページに戻ってきてください。

## 次へ

👉　[**準備 2: 演習用アプリケーションの入手と実行**](prep02.md)

---

👈　[事前準備](prep.md)

🏚️　[README に戻る](README.md)

