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
* [**Visual Studio Code**](https://code.visualstudio.com/)
    * [Azure Tools 拡張機能パック](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack)
* [**Node.js**](https://nodejs.org/ja/)
* [**Git ツール**](https://git-scm.com/downloads)
  
   (※) GitHub リポジトリから zip 形式でのダウンロードの方法をご存じの場合は、Git ツールがなくても一部の演習をスキップしてハンズオンを実施することができます。

<br>

## 演習

1. [Azure リソースの作成とアプリケーションのデプロイ](Ex01.md)
   1. [Azure リソースの作成](Ex01-1.md)
   2. [演習用アプリケーションの入手と実行](Ex01-2.md)
   3. [演習用アプリケーションの RAG の有効化](Ex01-3.md)
   4. [演習用アプリケーションの Azure へのデプロイ](Ex01-4.md)

2. [アプリケーションをホストするための基本的な設定](Ex02.md)
    1. [構成情報の確認](Ex02-1.md)
    2. [ログの有効化](Ex02-2.md)
    3. [バックアップの設定](Ex02-3.md)
       1. [演習 2-3-1 : アプリケーションのバックアップ](Ex02-3-1.md)
       2. [演習 2-3-2 : Azure Storage Blob のデータ保護機能とバックアップ](Ex02-3-2.md)
       3. [演習 2-3-3 : Azure AI Search 関連のバックアップ](Ex02-3-3.md)
 3. [演習 3 : Advanced な可用性と監視の設定](Ex03.md)
    1. [演習 3-1 : デプロイ スロットの作成](Ex03-1.md)
       1. [演習 3-1-1 : App Service のデプロイ スロットの作成と設定](Ex03-1.md#1-app-service-%E3%81%AE%E3%83%87%E3%83%97%E3%83%AD%E3%82%A4-%E3%82%B9%E3%83%AD%E3%83%83%E3%83%88%E3%81%AE%E4%BD%9C%E6%88%90%E3%81%A8%E8%A8%AD%E5%AE%9A)
       2. [演習 3-1-2 : GitHub Actions を使用した CI/CD 環境の構築](Ex03-1.md#2-github-actions-%E3%82%92%E4%BD%BF%E7%94%A8%E3%81%97%E3%81%9F-cicd-%E7%92%B0%E5%A2%83%E3%81%AE%E6%A7%8B%E7%AF%89)
       3. [演習 3-1-3 : スロットのスワップ](Ex03-1.md#3-%E3%82%B9%E3%83%AD%E3%83%83%E3%83%88%E3%81%AE%E3%82%B9%E3%83%AF%E3%83%83%E3%83%97)
    2. [演習 3-2 : 可用性設定](Ex03-2.md)
       1. [演習 3-2-1. 可用性ゾーンの設定](Ex03-2-1.md)
       2. [演習 3-2-2 : スケールアップの設定](Ex03-2-2.md)
       3. [演習 3-2-3 : スケールアウトの設定](Ex03-2-3.md)
    3. [高度なログ監視](Ex03-3.md)
       1. [演習 3-3-1 : メトリック アラートの設定](Ex03-3-1.md)
       2. [演習 3-3-2 : Log Analytics を使用したログの分析](Ex03-3-2.md)
       3. [演習 3-3-3 : Application Insights 使用したアプリケーションの監視](Ex03-3-3.md)
 4. セキュリティと Azure サービス間の認証設定
    1. App Service 自動認証
    2. Key Vault へのキーの登録と利用
    3. マネージド ID によるサービス間認証
 5. サービスの閉域化
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
3. Application Gateway を介した Web アプリケーションの公開
    1. Application Gateway の作成
    2. Application Gateway の設定
    3. Application Gateway を介した Web アプリケーションの公開
    4. DDoS Protection の有効化
 4. オプション : Azure API Management Service を介した Azure OpenAI サービスの利用 
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
 