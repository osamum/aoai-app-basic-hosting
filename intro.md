# はじめに

このハンズオンでは Azure OpenAI サービスを使用するアプリケーションをサービスとしてホストするための環境を実際に構築します。

このハンズオンを通じて、Azure OpenAI サービスを利用するアプリケーションをホストするための基本的な設定と運用に必要な知識を習得できます。

演習で構築するシステム構成は、 [Azure ランディング ゾーンでの Azure OpenAI チャット ベースライン アーキテクチャ](https://learn.microsoft.com/ja-jp/azure/architecture/ai-ml/architecture/baseline-azure-ai-foundry-chat) と [Azure でホストされる Web アプリケーションのベースライン](https://learn.microsoft.com/ja-jp/azure/architecture/web-apps/app-service/architectures/baseline-zone-redundant)を元にし、かつ、ログや監視、バックアップ、Production/Staging 環境(デプロイスロット)、セキュリティなどの運用に必要な設定を含むように一部変更を加えています。

今回のハンズオンで最終的に構築されるシステム構成図は以下のようになります。

![このハンズオンで構築するシステム構成図](images/handson-systemConfigDiagram.png)

ただし、一気にすべての構築を行うと理解が難しくなるため、複数の演習に分割して順を追って設定を行います。

<br>

# デプロイされるアプリケーションについて

このハンズオンで使用するアプリケーションは、以下の GitHub リポジトリから入手します。 

このアプリケーションは [Node.js](https://nodejs.org/ja/) と [Express](https://expressjs.com/ja/) を使用して構築されており、Azure OpenAI サービスを利用して以下の機能を有しています。

![ハンズオンで使用するアプリケーションの画面](images/handson_chottoGPT.png)