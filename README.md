# 題名未定！
## コンセプトとこだわり
1.**星空**：星空はあくまで背景ですが、観測地点、観測時間によって見える星の場所が再現されており、観測地点や観測時間は変更することが可能になっています。地球の歳差運動や、恒星の固有運動も考慮されており、各時間、場所においてリアルな星の配置を再現しています。

2.**短冊**:

## 簡単なコード解説(もはや備忘録)(コードはあんまり書かない)(←は？)
### 星空の再現に関して
星の赤緯、赤経、bv色指数、等級(<=6.5)、固有運動、HIP番号の値をヒッパルコス星表から取得しています。
#### 1.赤緯、赤経の値を観測地点からの位置に変換する
赤緯、赤経はそれぞれ、天の赤道、春分点が基準となっており、観測地点からの見え方とは異なります。また、これらの値は全てJ2000.0が基準となっているため、実際に再現したい時間のユリウス日をもとに調整する必要があります。
* 固有運動の補正

  ヒッパルコス星表の固有運動の値は1年あたり何ミリ秒角移動するかを、赤経、赤緯それぞれについて記録してあるものです。まずはこれを度数法に直し(/3600000)、J2000.0からの経過年数をかけて、(赤緯方向の固有運動に関しては、さらにcos(赤経)をかけて補正する必要があります。)それを元の赤緯、赤経に加算します。
      
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
  詳しく知るのは諦めましたが、たぶん球面上の三角形における余弦定理を用いたら導出できるっぽいです。<br>
  今回は上記サイト内の式を用いました。<br>
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
  >>`LST_RAD`：地方恒星時(ラジアン),
  
  >>`RA_Rad`:恒星の赤経(ラジアン),
  
  >>`DEC_Rad`:恒星の赤緯(ラジアン),
  
  >>`HA_RAD`:時角(ラジアン),
  
  >>`lat_RAD`：観測地点の緯度(ラジアン)(北緯:+,南緯:-),
  
  >>`Alt_Rad`:観測地点からの恒星の高度(ラジアン),
  
  >>`Az_RAD`:観測地点からの恒星の方位角(ラジアン)

* 角度情報から3D空間座標への変換

  ここは三角関数の簡単な考え方だけなので軽く書いておきます。↓実際のコード
  ```JS
  const star_x = starDistance * Math.cos(Alt_Rad) * Math.cos(Az_Rad);
  const star_y = starDistance * Math.sin(Alt_Rad);
  const star_z = starDistance * Math.cos(Alt_Rad) * Math.sin(Az_Rad);
  ```
  
※これらの情報は初学者である私が必死にかき集めてきた情報なので、間違いが含まれている可能性があります。
  
#### 2.星の名前、星座名、星座線の取得に関して
星座線のデータ、星座名(学名)は[Stellarium](https://stellarium.org/)の[GitHubリポジトリ](https://github.com/Stellarium/stellarium-skycultures)内のデータ(一部改変)を使用しました。
また、星座名(日本語)は[こちらのページ](https://www.nao.ac.jp/new-info/constellation2.html)より学名と日本語の対応を取得しています。

星の名前はWikiPedia上の[国際天文学連合が固有名を定めた恒星の一覧](https://ja.wikipedia.org/wiki/%E5%9B%BD%E9%9A%9B%E5%A4%A9%E6%96%87%E5%AD%A6%E9%80%A3%E5%90%88%E3%81%8C%E5%9B%BA%E6%9C%89%E5%90%8D%E3%82%92%E5%AE%9A%E3%82%81%E3%81%9F%E6%81%92%E6%98%9F%E3%81%AE%E4%B8%80%E8%A6%A7)
より、恒星のカタカナ表記とHR図における番号(簡潔な表現方法が不明)を取得し、[こちらのページ](https://www.kotenmon.com/star/catalog/hip_4.html)よりヒッパルコス番号とHR図における番号の対応を取得し、恒星のカタカナ表記とヒッパルコス番号の対応を得ています。

### 花火風の演出について
メインコンテンツには、「七夕の短冊(願い)を星に届ける」というものがありますが、この届けた短冊の数が27を超えた場合、歌詞を設置する際に出てくる星のパーティクルが花火のように散らばるようになります。<br>
このパーティクルはそれぞれの星（パーティクル）に対して個別に移動方向が設定されています。しかし、もし単純に「y軸方向に平行な平面上を移動する」といった一様な方向を指定してしまうと、高度（y座標）の絶対値が大きい星ほど視認性が下がり、見た目のバランスが悪くなってしまいます。<br>
そのため、それぞれの星が散らばる方向の基準となる座標軸は、原点から見た位置関係に応じて動的に定める必要があります。<br>
具体的には、**原点**から**歌詞のオブジェクトが置かれた位置**(球面上の任意の点)への**方向ベクトル**と直交する平面上でパーティクルが散るようにします。<br>
こうすることで、星が常に画面に対して自然な向きで広がるようになり、視覚的にも違和感のない表現が可能になります。

* 基準となる平面の軸を作る

  まず歌詞のオブジェクトが置かれた座標における、球面との接平面の法線ベクトルを求めます。<br>
  次に、この**法線ベクトルと直交する1本目のベクトル**(軸1)を計算します。今回は、成分が (0, 1, 0) のベクトルとの外積で作成し、ほぼ平行だった場合は (1, 0, 0) に切り替えています。<br>
  次に、**2本目のベクトル**(軸2)を計算します。このベクトルは、法線ベクトルとも、軸1とも直交している必要があるため、この2つのベクトルの外積で求めます。<br>
  以下がそのコードです<br>
  ```JS
  const normal = new THREE.Vector3(position.x, position.y, position.z).normalize();//(0,0,0)から目標座標への単位ベクトル
  const temp = new THREE.Vector3(0, 1, 0);
  if (Math.abs(normal.dot(temp)) > 0.99) {//内積が1だと平行だよね(単位ベクトルどうしの場合)
      temp.set(1, 0, 0);  // ほぼ平行な場合は別の軸を使う
  }
  this.axis1 = new THREE.Vector3().crossVectors(normal, temp).normalize();
  this.axis2 = new THREE.Vector3().crossVectors(normal, this.axis1).normalize();
  ```
  これで平面の軸を求めることができました。あとは移動方向を計算するだけです。

* 自分で作った座標平面上で移動方向を計算する

  直交する座標軸（たとえば XY平面）上で、角度θ方向に進むときの座標は一般に以下のように求められます：

  `X=cosθ`
  
  `Y=sinθ`

  ここで、この式の意味を考えてみます。<br>
  これらの式は、<br>
  「**x軸方向の単位ベクトルにcosθ倍、y軸方向の単位ベクトルにsinθ倍のベクトルを足し合わせた結果**」として表現されています。<br>
  つまり、各軸の単位ベクトルにそれぞれ重みをつけて加算するという意味になります。<br>
  今回は軸が`this.axis1`と`this.axis2`であるため、以下のようなコードになります。<br>
  ```JS
  // 軸1にcosθ、軸2にsinθの重みをかけて合成する
  for (let i = 0; i < this.count ; i++) {
      if(i<20){
          const angle = (Math.PI * 2 / 20) * i;
          const direction = new THREE.Vector3()
              .addScaledVector(this.axis1, Math.cos(angle))
              .addScaledVector(this.axis2, Math.sin(angle));
          dir = direction.clone().multiplyScalar(0.06);
      }else if(20<=i&&i<40){
          const angle = (Math.PI * 2 / 20) * (i-20);
          const direction = new THREE.Vector3()
              .addScaledVector(this.axis1, Math.cos(angle))
              .addScaledVector(this.axis2, Math.sin(angle));
          dir = direction.clone().multiplyScalar(0.12);
      }else{
          const angle = (Math.PI * 2 / 20) * (i-40);
          const direction = new THREE.Vector3()
              .addScaledVector(this.axis1, Math.cos(angle))
              .addScaledVector(this.axis2, Math.sin(angle));
          dir = direction.clone().multiplyScalar(0.09);
      }
  }
  ```
  (めっちゃ冗長で草)
  こうすることにより、花火のように多方に散らばるような演出を作ることが可能になります。

### 正距円筒図法による画像の出力について
[こちら](https://campkougaku.com/2023/03/21/cube-map2/)を参考に、
1.CubeMapを取得
2.CubeMapを正距円筒図法で全天球画像に変換
という手順で作成しています。

考え方はまるっきり上記サイトを参考にしているのでここで多くは語りません。

(上記サイトで行われている「のりしろ追加」に関しては~~めんどくさかったので~~実装していません)
(不慣れなJSだからしょうがない)(Pythonならやってた。)

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
