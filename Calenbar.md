Calenbar
=================

A JS Library for booking table with horizontal, daily calendar.

## 概要

- 日単位の横スクロールカレンダーの描画・UI操作・API操作を実現する
- SVGで描く(Snap.svg使う)
- 1項目1行
- 予約レコードを示す矩形は1日単位で配置可能
  + 他の予約レコードと交差することは許されない
- ガントチャートではないので、予約レコード同士の紐付きは存在しない


## インターフェイス

### 構築

- 描画対象のDOM要素/ID
- 各種リスナー登録
- 行リスト
  + [row-id, row-name, customData]
- 初期レコードリスト
  + [{record-id, row-id, start-date, finish-date, customData}, ..]
- 行頭のカスタムレンダリング関数
- レコードのカスタムレンダリング関数


初期表示位置は現在日付を中央にする
スタイルはクラス名を公開してCSSで記述させる


### 操作

- 新規に予約レコードを配置する (API/UI)
  + UIではレコードがない場所でドラッグすると新規配置
- 既存予約レコードを移動・変形する (API/UI)
  + APIでは開始日・終了日の更新
  + UIでは右端・左端のハンドルをドラッグすることで
- 既存レコードを削除する (API)
  + APIは確認コールバックを受け取るように作る
  + UI操作は作らない
    * レコードのクリック→ポップアップ表示させて編集・削除など利用側に作らせる
- 全てのレコードを取得する (API)
- IDでレコードを検索する (API)
- 現在の表示中央取得/変更 (API)
  + year, month, date で日付を扱う

### イベント

- 新規に予約レコードを配置したとき
- 既存予約レコードを移動・変形したとき
- 既存予約レコードをクリック/ダブルクリックしたとき
- 既存レコードを削除したとき
- 表示中央が変更されたとき


## 参考

http://snapsvg.io/docs/
https://codepen.io/pigabo/pen/eAiLF
http://www.h2.dion.ne.jp/~defghi/svgMemo/svgMemo_03.htm

http://momentjs.com/docs/