# Fingger Platform Web Client Project

## 必要条件

以下のライブラリをインストールしてください。

- NodeJS v18 以降
- pnpm 7 以降
- dotnet sdk 6 以降

合わせて、当プロジェクトでは Azure AppConfig を使用しているため、<br>
Azure アカウント登録ならびに開発者グループ追加が必要です。

## セットアップ

### Webクライアントの準備

リポジトリをクローンしたあと、モジュールをインストールします。

```bash
pnpm i
```

次にAzureのユーザ認証をします。

```bash
az login
```
実行するとブラウザが立ち上がり認証手続きが開始されます。<br>
完了するとユーザディレクトリ以下に認証ファイルが保存されます。

認証が成功したら、Webアプリ設定情報を取得します。

```bash
pnpm appconfig
```

### API サーバーの準備

ローカル環境で API サーバーを起動するため、下記 URL の手順に従ってセットアップを行ってください。

https://github.com/flaggs-inc/fingger-pf-api-server#getting-started

Web クライアント、 API サーバーが起動できる状態になったら開発準備完了です。

## 各種操作

### 開発用サーバーの起動

```bash
pnpm dev
```
[http://localhost:3000](http://localhost:3000) でウェブサーバーが起動します。<br>
ファイル更新を検知して、都度コンパイルが実施されます。

### ソースビルド

```bash
pnpm build
```
ソースをコンパイルして、SSRで動作させるコードを生成します。

### ローカル環境での動作確認

ビルドしたファイルはローカル開発環境で確認が可能です。

２通りの方法があります。

#### 1) Vite:preview

Vite の preview サーバーを起動します。<br>
開発モードと同様に [http://localhost:3000](http://localhost:3000) でウェブサーバーが起動します。

```bash
pnpm preview
```

#### 2) Node:Express

Azure Webapp で起動するサーバーをローカルで起動します。<br>
ビルド時に使用した appconfig 情報に依存して 起動するポート番号が変動します。

```bash
node index
```

### AppConfig 上の情報を同期

プロジェクトルート下で次のコマンドを実行することで、 `appconfig.json` ファイルが生成されます。

```bash
pnpm appconfig
```

`set-env` と組み合わせると環境を指定して `appconfig.json` を生成することができます。

```bash
pnpm set-env [環境名] appconfig
```

`[環境名]` を指定しないときは `local` が自動的にセットされます。

例）`branch4` 環境の AppConfig 情報を取得する場合

```bash
pnpm set-env branch4 appconfig
```

### 各環境のビルドについて

以下のリモートブランチにプッシュしたタイミングで、GitHub Actions により以下の操作が行われます。

- `develop`: branch1 環境へデプロイ
- `staging`: stg 環境へデプロイ
- `main`:
  - 本番環境の standby スロットへデプロイ
  - `stable1`, `stabel2` 環境へのデプロイ

その他の環境へのデプロイは GitHub Actions 上で可能です。

### 環境名について

選択できる環境名は以下になります。

- `local` : ローカル環境
- `branch1` : branch1環境
- `branch2` : branch2環境
- `branch3` : branch3環境
- `branch4` : branch4環境
- `dev1` : dev1環境
- `dev2` : dev2環境
- `stable1` : stable1環境
- `stable2` : stable2環境
- `stg` : stg環境
- `prod` : prd環境

### API コード生成

`fingger-pf-api-server` で生成された、Swaggerのスキーマをもとにリクエスト処理の実装を自動生成しています。

#### 生成手順

APIが更新されたときは、以下の手順で最新のAPIリクエストコードへ更新してください。

1. `fingger-pf-api-server` でローカルに API サーバーを立ち上げる

`fingger-pf-api-server/FinggerPlatform.Server` 内に移動してください
``` bash
dotnet run
```

2. プロジェクトルート上で下記コマンドを実行して、APIのリクエストコードを生成

```bash
pnpm openapi
```

3. `src/fingger`以下に実装コードが生成されます

### GitHub Actions 一覧

- `deploy` : ブランチ、環境を指定してデプロイ
- `release` : 本番環境向け。本番環境用の standby スロットを公開用スロットとスワップして、公開内容を入れ替えます。
- `sync-dev` : `dev1`, `dev2` 環境へのデプロイを行います。
- `sync-stable` : `stable1`, `stable2` 環境へのデプロイを行います。
  - `main` ブランチへのプッシュにより自動実行されます。

### メンテナンスモードについて

プロジェクトルート直下に、 `maintenance.json` というファイルを設置して Web サーバーを再起動することでメンテナンスモードとして起動することができます。

`maintenance.json` ファイルは以下のような内容にすることでメンテナンス画面に適宜文言が表示されます。

```json
{
    "title": "ただいまメンテナンス中です<br>Under maintenance",
    "subtitle": "メンテナンス日時",
    "date": "20XX/XX/XX HH:mm ～ 20XX/XX/XX HH:mm",
    "message": "<p>ご利用の皆様にはご迷惑をおかけし、申し訳ございません。<br>メンテナンス終了までしばらくお待ち下さい。</p>"
}
```
