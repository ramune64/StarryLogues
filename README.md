# 題名未定！
## コンセプトとこだわり
1.**星空**：星空はあくまで背景ですが、観測地点、観測時間によって見える星の場所が再現されており、観測地点や観測時間は変更することが可能になっています。地球の歳差運動や、恒星の固有運動も考慮されており、各時間、場所においてリアルな星の配置を再現しています。

2.**短冊**

## 簡単なコード解説(もはや備忘録)(コードはあんまり書かない)(←は？)
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
   まずは、観測時刻におけるGST(グリニッジ恒星時)を求めます。
 
   `GST = 280.46061837 + (JD - 2451545.0)*1.00273791 * 24 * 15`

  >> JD：観測時刻のユリウス日,
 
  >> 2451545.0：J2000.0におけるユリウス日,
 
  >> 1.00273791:1太陽日＝1.00273791恒星日(理科年表より),
 
  >> 280.46061837:J.2000.0におけるGST(変換サイトから計算したので合ってるかは不明(おい))(Stellariumと同じような場所になってるからきっと合ってる)

  このGSTから観測地点の経度(西経:+,東経:-)を引いたらLST(地方恒星時)の出来上がりです

  これを用いていよいよ観測地点からの見え方を計算できます。<br> 
  計算方法は[こちら](https://astrogreg.com/convert_ra_dec_to_alt_az.html)を参考にしました。<br>
  詳しく知るのは諦めましたが、多分球面上の三角形における余弦定理を用いたら導出できるっぽいです。<br>
  今回は上記サイトのSpherical Astronomy (Robin Green) 2.36, 2.37を用いました。<br>
  天体の赤緯赤経時角、観測地点の緯度経度を用いて計算しています。
  ↓実際のコード
  ``` JS
  const HA_Rad = LST_Rad - RA_Rad;//時角
  const sinAlt = Math.sin(DEC_Rad) * Math.sin(lat_Rad) + Math.cos(DEC_Rad) * Math.cos(lat_Rad) * Math.cos(HA_Rad);
  const Alt_Rad = Math.asin(sinAlt);
  const cosAz = (Math.sin(DEC_Rad) - Math.sin(Alt_Rad) * Math.sin(lat_Rad)) / (Math.cos(Alt_Rad) * Math.cos(lat_Rad));
  const sinAz = -Math.cos(DEC_Rad) * Math.sin(HA_Rad) / Math.cos(Alt_Rad);
  const Az_Rad = Math.atan2(sinAz, cosAz);
  ```

* 角度情報から3D空間座標への変換

  ここは三角関数の簡単な考え方だけなので軽く書いておきます。↓実際のコード
  ```JS
  const star_x = starDistance * Math.cos(Alt_Rad) * Math.cos(Az_Rad);
  const star_y = starDistance * Math.sin(Alt_Rad);
  const star_z = starDistance * Math.cos(Alt_Rad) * Math.sin(Az_Rad);
  ```
  
#### 2.星の名前、星座名、星座線の取得に関して



### 花火風の演出について
メインコンテンツには、「七夕の短冊(願い)を星に届ける」というものがあるが、この届けた短冊の数が27を超えた場合、歌詞を設置する際に出てくる星のパーティクルが花火のように散らばるようになります。<br>
このパーティクルは1つずつ移動方向が定められていますが、仮に移動方向を「y座標について平行」のようにしたら高度の絶対値が大きくなるほど見えずらくなってしまいます。そのため、それぞれの星が散らばる方向の基準となる座標軸は、カメラの向きによって変える必要があるのです。<br>
具体的には、歌詞のオブジェクトが置かれた位置の原点からの方向ベクトルと直交する平面の座標系を移動するようにしないといけません。

## 使用ライブラリ

* astronomia（MIT License）  
  Copyright (c) 2013 Sonia Keys  
  Copyright (c) 2016 Commenthol  
  [GitHub リポジトリ](https://github.com/commenthol/astronomia)

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
