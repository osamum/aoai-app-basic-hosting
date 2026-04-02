# 改訂履歴

以下の内容を更新しました。

## 2026 年 4 月 2 日

* 構築するシステムが使用する日本側のリージョンを Japan East から Japan West に変更 
* 演習用アプリケーションが使用する Azure OpenAI サービス モデルの変更
   * 言語モデル : gpt-4o-mini → gpt-5-chat
   * 埋め込みモデル : text-embedding-ada-002 → text-embedding-3-small
   * 画像生成モデル : DALL-E 3 → 画像生成機能を使用しない構成に変更
* 演習用アプリケーションが使用する OpenAI モデルと演習で使用するリージョンの変更にあわせ、環境作成用の [prep-az-resource.bicep](assets/prep-az-resource.bicep) ファイルを更新
* 以下の演習の手順を現在の Azure ポータルの UI と挙動に合わせて更新
   * 演習 3-3-2 : Log Analytics を使用したログの分析 
     * [2. App Service への診断設定の追加](Ex03-3-2.md#2-app-service-%E3%81%B8%E3%81%AE%E8%A8%BA%E6%96%AD%E8%A8%AD%E5%AE%9A%E3%81%AE%E8%BF%BD%E5%8A%A0)
     * [3. Azure OpenAI サービスへの診断設定の追加](Ex03-3-2.md#3-azure-openai-%E3%82%B5%E3%83%BC%E3%83%93%E3%82%B9%E3%81%B8%E3%81%AE%E8%A8%BA%E6%96%AD%E8%A8%AD%E5%AE%9A%E3%81%AE%E8%BF%BD%E5%8A%A0)
   * 演習 5-2 : AI Search の閉域化設定 - [仮想ネットワークのピアリング設定](Ex05-2.md#4--%E4%BB%AE%E6%83%B3%E3%83%8D%E3%83%83%E3%83%88%E3%83%AF%E3%83%BC%E3%82%AF%E3%81%AE%E3%83%94%E3%82%A2%E3%83%AA%E3%83%B3%E3%82%B0%E8%A8%AD%E5%AE%9A)
 
## 2026 年 1 月 5 日

以下の演習を追加しました。

* [**演習 5-4 : App Service へのカスタムドメインの設定**](Ex05-4.md) 
* [**演習 6-1 : Application Gateway を介したアプリケーションの公開(HTTPS)**](Ex06-1.md) 
* [**【補足】　Azure Key Vault で権限のロール割り当てが正しいにもかかわらず、証明書やシークレット、キーの操作ができない場合のトラブルシュート**](wkard-keyVault-roll.md) 

<br>

---

🏚️　[README に戻る](README.md)