# K-means法によるクラスタリングとウォード法による階層的クラスタリング
## 概要
これは2019/7/8に行われた埼玉大学の授業「人工知能」の課題に対する解答を与えるプログラムである。

## 実行方法
```
$ git clone https://github.com/basd4g/clustering.AI.2019.SU.git
$ cd clustering.AI.2019.SU
$ node ./index.js
```

## 環境
依存: node.js  
バージョン: v12.6.0

## 各ファイルについて
### index.js
メインプログラム

### readme.md
このファイル

### result.txt
index.jsの実行結果
以下により作成した
```
$ touch result.txt
$ node ./index.js > result.txt
```

## プログラムの流れ
- 初期データセットをclustersに与える。
- K-means法の適用
rewriteClusterLabel()でクラスタの重心計算を行い、最も近い重心のクラスタラベルに書き換える
これをクラスタの割当に変化がなくなるまで繰り返し行う
- ウォード法による階層的クラスタリング
joinCluster()で最も近いクラスタを求め、結合する。
クラスタ数が1つになるまで繰り返す。