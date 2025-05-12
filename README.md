# 題名未定！
## コンセプトとこだわり
1.**星空**：星空はあくまで背景ですが、観測地点、観測時間によって見える星の場所が再現されており、観測地点や観測時間は変更することが可能になっています。地球の歳差運動や、恒星の固有運動も考慮されており、各時間、場所においてリアルな星の配置を再現しています。

2.**短冊**

## 簡単なコード解説(もはや備忘録)(コードは書かない)(←は？)
### 星空の再現に関して
星の赤緯、赤経、bv色指数、等級(<=6.5)、固有運動、の値をヒッパルコス星表から取得しています。
#### 1.赤緯、赤経の値を観測地点からの位置に変換する
赤緯、赤経はそれぞれ、天の赤道、春分点が基準となっており、観測地点からの見え方とは異なります。また、これらの値は全てJ2000.0が基準となっているため、実際に再現したい時間のユリウス日をもとに調整する必要があります。
* 固有運動の補正

  ヒッパルコス星表の固有運動の値は1年あたり何ミリ秒角移動するかを、赤経、赤緯それぞれについて記録してあるものです。まずはこれを度数法に直し(/3600000)、J2000.0からの経過年数をかけて、(赤緯方向の固有運動に関しては、さらにcos(赤経)をかけて補正する必要があります。)それを赤緯、赤経に加算します。
      
* 歳差運動の考慮

　上記の操作で固有運動を考慮することができたので、今度はそれを使って歳差運動による恒星の移動を計算します。こちらは[astronomia](https://github.com/commenthol/astronomia)を用いて計算しています。

* 観測地域、観測時刻の考慮

 これで地球から見た星の動きが考慮された恒星の赤緯赤経が取得できたため、観測地点の緯度経度、観測時刻を考慮して、観測地点からの見え方を計算します。

## 使用ライブラリ

* astronomia（MIT License）  
  Copyright (c) 2013 Sonia Keys  
  Copyright (c) 2016 Commenthol  
  [GitHub リポジトリ]https://github.com/commenthol/astronomia

## 使用データ

### Stellarium Skycultures - Western
* データ元: [stellarium/stellarium-skycultures](https://github.com/Stellarium/stellarium-skycultures)
* 該当ファイル: `western/index.json`(本プロジェクトでは`/src/index.json`に使用)
* 著者: Stellarium's team

  **ライセンス情報**  
- `stellarium/stellarium-skycultures/western/index.json`（元データ）: [Creative Commons Attribution-ShareAlike (CC BY-SA)](https://creativecommons.org/licenses/by-sa/4.0/deed.ja)  
- `/src/index.json`（改変後のデータ）: 同上（CC BY-SA）

  **変更点**
- 元データの 583 行目および 598 行目に記載されていた `"thin"` を削除しました。
