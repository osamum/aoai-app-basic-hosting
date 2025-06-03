# AOAI App Basic Hosting Hands-on

## 概要

このハンズオンは [Azure OpenAI サービス](https://learn.microsoft.com/ja-jp/azure/architecture/ai-ml/architecture/azure-openai-baseline-landing-zone)を使用するアプリケーションをサービスとしてホストするための環境を構築するハンズオンです。

Microsoft Azure 上に実際にリソースを作成し、Azure OpenAI サービスを使用して動作する演習用アプリケーションをデプロイして Azure のベースライン アーキテクチャに準拠した運用環境を構築します。

演習で構築するシステム構成は [Azure ランディング ゾーンでの Azure OpenAI チャット ベースライン アーキテクチャ](https://learn.microsoft.com/ja-jp/azure/architecture/ai-ml/architecture/baseline-openai-e2e-chat) を元にしていますが、演習に使用するアプリケーションは **Azure AI Foundry プロジェクトを使用しない**一般的な構成であるため [Azure でホストされる Web アプリケーションのベースライン](https://learn.microsoft.com/ja-jp/azure/architecture/web-apps/app-service/architectures/baseline-zone-redundant)に沿いつつ一部に変更を加えています。

![構築するシステム構成](./images/basic_system_structure.png)

## 目的

Azure のベースライン アーキテクチャとして紹介されている環境の構築方法を学ぶことと、演習終了後に実際に運用を構築する際の設定手順の参照として利用できるようにすることを目的としています。

<br>

## ハンズオンの内容

このハンズオンでは、事前準備を含めシナリオに沿って以下の内容を学習します。

### 事前準備

* Bicep を使用した演習で使用する Azure リソースの作成
* リポジトリ テンプレートを使用した演習用アプリケーション用リポジトリの作成
* App Service への GitHub リポジトリからアプリケーションのデプロイ
* Azure AI Search のインデックス作成

### ハンズオンの演習

* App Service 自動認証
* Key Vault へのキーの登録
* マネージド ID によるサービス間認証
* アプリケーションのゾーン冗長
* 仮想ネットワークの構築と閉域化
* 仮想ネットワークピアリング
* プライベートエンドポイントの作成
* 仮想マシンと Bastion を使用した Jump Box の構築
* Application Gateway を介した Web アプリケーションの公開
* DDOS Protection の有効化

以下の項目については [Azure App Service ハンズオン](https://github.com/osamum/Azure-AppService-handson)の手順を使用して学習します。

* App Service のホスティングに関する設定の確認
* App Service ログの設定と有効化
* バックアップ
* デプロイ スロット
* GitHub リポジトリを使用した CI/CD
* 可用性設定
    - スケールアップ
    - スケールアウト
    - 自動スケーリング
* 高度なログ監視
    - メトリック アラートの設定
    - Log Analytics を使用したログの分析
    - Application Insights 使用したアプリケーションの監視
  
<br>

## 対象者

クラウドサービスにおれる IaaS、PaaS、SaaS の違いを理解しており、Azure の基本的な操作に慣れている方を対象としています。

具体的には Microsoft 資格試験である MCP AZ-900 を取得されているか、取得者と同程度の知識を有している方を対象としています。

MCP AZ-900 の内容については以下をご覧ください。

* [試験 AZ-900: Microsoft Azure の基礎の学習ガイド](https://learn.microsoft.com/ja-jp/credentials/certifications/resources/study-guides/az-900)

<br>

## ハンズオンの前提条件

このハンズオンでは、以下のアカウントとツール類が必要となります。

アカウント

* [**Microsoft Azure** アカウント](https://learn.microsoft.com/ja-jp/dotnet/azure/create-azure-account)
* [**GitHub** アカウント](https://github.com/signup)
  
    (※) Visual Studio Code 等から Azure App Service へのデプロイ方法をご存じの場合は、GitHub アカウントがなくても一部の演習をスキップしてハンズオンを実施することができます。

ツール

  * [**Visual Studio Code**](https://code.visualstudio.com/)
  * [**Node.js**](https://nodejs.org/ja/)
  * [**Git ツール**](https://git-scm.com/downloads)
  
    (※) GitHub リポジトリから zip 形式でのダウンロードの方法をご存じの場合は、Git ツールがなくても一部の演習をスキップしてハンズオンを実施することができます。

## 事前準備

1. Azure リソースの作成
2. Azure OpenAI リソースへの AI モデルのデプロイ
3. Azure AI Search のインデックス作成
4. 演習用アプリケーションの GitHub リポジトリの作成とクローン
5. 演習用アプリケーションのローカルでの動作確認
6. GitHub リポジトリからの演習用アプリケーションの Azure App Service へのデプロイ

<br>

## 演習

1. アプリケーションをホストするための基本的な設定
    1. 構成情報の確認
    2. ログの有効化
    3. バックアップの設定
    4. デプロイ スロットの作成
    5. 可用性設定
       1. 可用性ゾーンの設定
       2. スケールアップ
       3. スケールアウト
       4. 自動スケーリング
    6. 高度なログ監視
       1. メトリック アラートの設定
       2. Log Analytics を使用したログの分析
       3. Application Insights 使用したアプリケーションの監視
 2. セキュリティと Azure サービス間の認証設定
    1. App Service 自動認証
    2. Key Vault へのキーの登録と利用
    3. マネージド ID によるサービス間認証
 3. サービスの閉域化
    1. Jump Box の構築
       1. 仮想ネットワークの構築
       2. 仮想マシンの作成
       3. Bastion の構築
    2. プライベートエンドポイントの作成
       1. App Service のプライベート エンドポイントの作成
       2. Azure AI Search のプライベート エンドポイントの作成
       3. Azure OpenAI サービスのプライベート エンドポイントの作成
          - 仮想ネットワークピアリングの設定
    3. 閉域化された App Service へのアプリケーションのデプロイ
       - GitHub Selfhosted Runner のインストールと設定
4. Application Gateway を介した Web アプリケーションの公開
    1. Application Gateway の作成
    2. Application Gateway の設定
    3. Application Gateway を介した Web アプリケーションの公開
    4. DDoS Protection の有効化
 5. オプション : Azure API Management Service を介した Azure OpenAI サービスの利用 
    1. Azure API Management Service のデプロイ
    2. Azure OpenAI サービスの API の登録
    3. ルール設定
   
<br>
  
   ---

## LICENSE

このドキュメントに記載されている情報 (URL や他のインターネット Web サイト参照を含む) は、将来予告なしに変更することがあります。別途記載されていない場合、このソフトウェアおよび関連するドキュメントで使用している会社、組織、製品、ドメイン名、電子メール アドレス、ロゴ、人物、場所、出来事などの名称は架空のものです。実在する商品名、団体名、個人名などとは一切関係ありません。お客様ご自身の責任において、適用されるすべての著作権関連法規に従ったご使用をお願いいたします。

マイクロソフトは、このドキュメントに記載されている内容に関し、特許、特許申請、商標、著作権、またはその他の無体財産権を有する場合があります。別途マイクロソフトのライセンス契約上に明示の規定のない限り、このドキュメントはこれらの特許、商標、著作権、またはその他の知的財産権に関する権利をお客様に許諾するものではありません。

製造元名、製品名、URL は、情報提供のみを目的としており、これらの製造元またはマイクロソフトのテクノロジを搭載した製品の使用について、マイクロソフトは、明示的、黙示的、または法令によるいかなる表明も保証もいたしません。製造元または製品に対する言及は、マイクロソフトが当該製造元または製品を推奨していることを示唆するものではありません。掲載されているリンクは、外部サイトへのものである場合があります。これらのサイトはマイクロソフトの管理下にあるものではなく、リンク先のサイトのコンテンツ、リンク先のサイトに含まれているリンク、または当該サイトの変更や更新について、マイクロソフトは一切責任を負いません。リンク先のサイトから受信した Web キャストまたはその他の形式での通信について、マイクロソフトは責任を負いません。マイクロソフトは受講者の便宜を図る目的でのみ、これらのリンクを提供します。また、リンクの掲載は、マイクロソフトが当該サイトまたは当該サイトに掲載されている製品を推奨していることを示唆するものではありません。

Copyright (c) Microsoft Corporation. All rights reserved.
 