# 準備 2: Azure AI Search のインデックスの作成

演習用アプリケーションの RAG の機能を有効化するために、Azure AI Search のインデックスを作成します。

## Blob コンテナーへのドキュメントのアップロード

Azure AI Serch で検索を行うためのドキュメントを Azure Storage Blob コンテナーにアップロードします。

具体的な手順は以下のとおりです。

\[**手順**\]

1. ここまでの作業でデプロイされた Azure Storage Account リソース `storage(ランダムな値)`を開き、\[**BLOB コンテナー**\] メニューをクリックして、`rag-data-store` をクリックします
   
    ![Azure Blob Container](images/check_storageBlob.png) 


2. 遷移した画面上部の \[**↑ アップロード**\] ボタンをクリックすると、画面右に \[**Blob のアップロード**\] ブレードが表示されます

    「**ファイルをこちらにドラッグ アンド ドロップまたはファイルの参照**」と書かれた灰色のボックス内に以下の検証用のダミーデータのファイルをドラッグ アンド ドロップするか、\[**ファイルの参照**\]リンクをクリックしてファイルを選択します

    - [**RAG 検証用ダミーデータ**](assets/RAG_TestData.txt)

    アップロード エリアにファイル名が表示されたら、\[**ファイルのアップロード**\] ボタンをクリックします

    ![ファイルのアップロード](images/storage_blob_upload.png)

    アップロードが完了すると、アップロードしたファイルが一覧に表示されます。

    続いてアクセス許可の設定を行います。
    
3. Azure Storage Account の画面で、\[設定\]-\[**構成**\] メニューをクリックします。遷移した画面で \[**Azure portal で Microsoft Entra 認可を既定にする**\] の設定を **有効** にし、画面上部の \[**保存**\] ボタンをクリックします。

    ![Azure Storage の Microsoft Entra 認可](images/storage_allow_entraAuth.png)

    この設定は Azure AI Search で Azure Storage Account 上のデータにアクセスしてインデックスを作成する際に必要な設定の一部です。

ここまでの手順で Azure Storage アカウントへのデータのアップロードが完了しました。

<br>

## Azure AI Search マネージド ID の有効化とアクセス許可

Azure AI Search のインデックス作成にインポート ウィザードを使用しますが、その際、Azuze Storage へのアクセスにキー認証が選択できなくなったためマネージド ID 認証を使用する必要があります。

ここではマネージド ID 認証に必要な設定を行います。

具体的な手順は以下のとおりです。

\[**手順**\]

1. ここまでの作業でデプロイされた Azure AI Search リソース `search(ランダムな値)` を開き、\[設定\]-\[**ID**\] メニューをクリックします

    遷移した画面で \[**状態**\] の設定を **オン** にし、画面上部の \[**保存**\] ボタンをクリックします。

    ![Azure AI Search マネージド ID の設定](images/AISearch_managedID_Enable.png)

    これでこの Azure AI Search リソースにマネージド ID が付与されました。

2. Azure AI Search リソースにマネージド ID が有効になると \[**Azure ロールの割り当て**\] ボタンが表示されるのでクリックします

    ![Azure AI Search マネージド ID の設定](images/AISearch_managedID_Enabled.png)

3. \[**Azure ロールの割り当て**\] 画面に遷移するので、画面上部の \[**+ ロールの割り当ての追加**\] ボタンをクリックします

    画面右側に \[**ロールの割り当ての追加**\] ブレードが表示されるので各項目のドロップダウン リストを以下のように設定します

    |項目 | 設定値 |
    |---|---|
    |スコープ| **ストレージ** |
    |サブスクリプション| この演習に使用しているもの |
    |リソース| この演習でデプロイした Azure Storage アカウント |
    |役割| **ストレージ BLOB データ閲覧者** |

    ![Azure AI Search マネージド ID の設定](images/AISearch_roll_assign.png)

    設定が完了したら、画面下部の \[**保存**\] ボタンをクリックします。

ここまでの作業で Azure AI Search のマネージド ID を有効にし、指定した Azure Storage アカウントの BLOB コンテナーにデータの閲覧者してアクセスできるようになりました。

<br>

## Azure AI Search インデックスの作成

Azure Blob コンテナーにアップロードしたドキュメントを Azure AI Search を使用してベクトル検索できるようにインデックスを作成します。

具体的な手順は以下のとおりです。

\[**手順**\]

1. 作業中の Azure AI Search リソース `search(ランダムな値)` の \[概要\] 画面を開き、画面上部の \[**データのインポートとベクター化**\] ボタンをクリックします

    ![Azure AI Search インポート ウィザード](images/AISearch_menu_inport.png)

2. \[**データのインポートとベクター化**\] 画面に遷移し、データソースの選択メニューが表示されるので、\[** Azure Blob Storage**\] タイルをクリックします 
   
    ![データソースの選択](images/AISearch_select_datasource.png)

3. シナリオの選択画面に遷移するので、\[**RAG**\] タイルをクリックします

    ![シナリオの選択](images/AISearch_select_scenario.png)

4. \[**Azure Blob Storage の構成**] 画面に遷移するので、各項目を以下のように設定します
   
    |項目 | 設定値 |
    |---|---|
    |サブスクリプション| この演習に使用しているサブスクリプション |
    |ストレージ アカウント| この演習でデプロイしたストレージ アカウント|
    |BLOB コンテナー| `rag-data-store` |
    |BLOB フォルダー| 既定のまま |
    |解析モード| **テキスト** |
    |マネージド ID の種類| **システム 割り当て** |

    ![Azure Blob Storage の構成](images/AISearch_select_settingStorage.png)

    各項目の設定か完了したら \[**次へ**\] ボタンをクリックします

    ![Azure Blob Storage の構成](images/AISearch_config_blobStorage.png)