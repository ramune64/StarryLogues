import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { precess } from 'astronomia';//歳差運動取得用
import { gsap, toArray } from "gsap";
import { Player } from "textalive-app-api";
import { MeshLine, MeshLineMaterial } from 'three.meshline';


const width = window.innerWidth;
const height =  window.innerHeight;

// レンダラーを作成
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: document.querySelector('#myCanvas'),
    alpha: false
});
renderer.setSize(width, height);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.autoClear = false; 

// シーンを作成
const scene = new THREE.Scene();

// カメラを作成
const camera = new THREE.PerspectiveCamera(60, width / height, 0.01, 5000);
// カメラの初期座標を設定（X座標:0, Y座標:0, Z座標:0）
camera.position.set(0, 3, 0);


import modelUrl from './telescope3.glb?url';
let telescope;
const loader = new GLTFLoader();
loader.load(modelUrl, function (gltf) {
    console.log("Loaded GLTF:", gltf); // <- ここで構造確認
    console.log("Children:", gltf.scene.children);
    gltf.scene.traverse((child) => {
        console.log(child.type, child.name);
        if (child.isMesh) {
            child.material.transparent = false;
            child.material.opacity = 1;
            child.visible = true;
            console.log(child.material);
        }
    });
    gltf.scene.scale.set(1, 1, 1); // 必要なら 10 や 0.1 に変えて調整
    gltf.scene.position.set(2,0,0);
    gltf.scene.rotation.y = Math.PI / 2;
    telescope = gltf.scene;
    scene.add(gltf.scene);
    
});
/* import modelUrl2 from './water.glb?url';
const loader2 = new GLTFLoader();
loader2.load(modelUrl2, function (gltf) {
    console.log("Loaded GLTF:", gltf); // <- ここで構造確認
    console.log("Children:", gltf.scene.children);
    gltf.scene.traverse((child) => {
      console.log(child.type, child.name);
      if (child.isMesh) {
        child.material.transparent = false;
        child.material.opacity = 1;
        child.visible = true;
        console.log(child.material);
      }
    });
    gltf.scene.scale.set(1, 1, 1); // 必要なら 10 や 0.1 に変えて調整
    gltf.scene.position.set(0,0,-1)
    scene.add(gltf.scene);
    
}); */




const textureLoader = new THREE.TextureLoader();
// 各種マップを読み込む

import normalURL from './textures/normal.png?url'; 
import RoughnessURL from './textures/Roughness.png?url'; 
const diffuseMap = textureLoader.load('textures/color.png');   // カラーマップ
const normalMap = textureLoader.load(normalURL);     // ノーマルマップ
const roughnessMap = textureLoader.load(RoughnessURL); // ラフネスマップ（任意）

// マテリアルに適用
const material = new THREE.MeshStandardMaterial({
    color: 0x6DFFF6,
    normalMap: normalMap,
    roughnessMap: roughnessMap,
    metalness: 0.2, // 必要に応じて
    roughness: 0.4,
    envMapIntensity: 1
});
material.needsUpdate = true;
// 平面ジオメトリ（幅500, 高さ500）
const geometry = new THREE.PlaneGeometry(6000, 6000,1,1);

// メッシュ作成
const plane = new THREE.Mesh(geometry, material);

// 初期状態だとYZ平面に立っているので、X軸まわりに -90度 回転させて、XZ平面に変更
plane.rotation.x = -Math.PI / 2;

// 中心を (0, 0, 0) に配置（デフォルトです）
plane.position.set(0, 0, 0);
//scene.add(plane);  

const light = new THREE.AmbientLight(0xFFFFFF, 0.1);
scene.add(light);

// 平行光源
/* const light = new THREE.DirectionalLight(0xFFFFFF);
light.intensity = 1; // 光の強さを倍に
light.position.set(0, 1, 0); // ライトの方向
// シーンに追加
scene.add(light); */

/* const light = new THREE.HemisphereLight(0x888888, 0xDDDDFF, 10);
scene.add(light); */





//tick();
//import hdriUrl from './kloppenheim02puresky2k.hdr?url';
//import hdriUrl from './rogland_clear_night_2k2.hdr?url';
/* import hdriUrl from './qwantani_night_2k.hdr?url';

// PMREM生成器（環境マップ変換用）
const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();

const rgbeLoader = new RGBELoader();
rgbeLoader.load(hdriUrl, (texture) => {
    const envMap = pmremGenerator.fromEquirectangular(texture).texture;
    scene.environment = envMap;
    scene.background = envMap;
    scene.environment.encoding = THREE.sRGBEncoding;
    scene.environmentIntensity = 0;
    scene.backgroundIntensity = 0.04;


    texture.dispose();
    pmremGenerator.dispose();
}); */

// OrbitControls を設定
/* const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // 慣性を加える
controls.dampingFactor = 0.25; // 慣性の強さ */
/* controls.screenSpacePanning = false; // 水平方向のみパン
controls.enablePan = false;
controls.enableZoom = false;
controls.minPolarAngle = 0; // 真上
controls.maxPolarAngle = Math.PI; // 真下 */


// パン（平行移動）無効化
/* controls.enablePan = false;

// 回転の範囲を制限（必要に応じて）
controls.minPolarAngle = 0; // 真上
controls.maxPolarAngle = Math.PI; // 真下 */

let isMouseDown = false;
let previousMousePosition = { x: 0, y: 0 };
let yaw = -Math.PI / 2;   // 左右
let pitch = 0; // 上下
let isLooked = false;
camera.rotation.y = yaw;
camera.rotation.x = pitch;

const canvas = document.getElementById("myCanvas");

canvas.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    if(!at_main_content){
        previousMousePosition.x = e.clientX;
        previousMousePosition.y = e.clientY;
    }
    if(at_main_content && !in_transition_telescope){
        if (document.pointerLockElement === canvas) {
            document.exitPointerLock();
        } else {
            canvas.requestPointerLock();
        }
    }
    
});
let ignoreNextMouseMove = false;

document.addEventListener('pointerlockchange', () => {
    if (document.pointerLockElement === canvas) {
        console.log("Pointer lock 開始");
        ignoreNextMouseMove = true;
        document.addEventListener('mousemove', onMouseMove, false);
    } else {
        console.log("Pointer lock 終了");
        document.removeEventListener('mousemove', onMouseMove, false);
        console.log("Pointer lock 終了2");
    }
});
function onMouseMove(event) {
    /* if (ignoreNextMouseMove) {
        ignoreNextMouseMove = false;
        return; // 最初の1回をスキップ！
    } */

    const movementX = event.movementX || 0;
    const movementY = event.movementY || 0;

    // movementX/Y を使ってカメラ角度を調整
    yaw += movementX * 0.0005;
    pitch += movementY * 0.0005;
    const maxPitch = Math.PI / 2 - 0.01;
    const minPitch = -Math.PI / 2 + 0.01;
    pitch = Math.max(minPitch, Math.min(maxPitch, pitch));
    camera.rotation.order = 'YXZ';
    camera.rotation.y = yaw;
    camera.rotation.x = pitch;
    //console.log(yaw,pitch);
}

document.addEventListener('mouseup', () => {
    if(at_main_content && !in_transition_telescope){
        //document.exitPointerLock();
    }
    isMouseDown = false;
});

document.addEventListener('mousemove', (e) => {
    if (!isMouseDown){return}
    if(!at_main_content){
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;
        previousMousePosition.x = e.clientX;
        previousMousePosition.y = e.clientY;
        if(!at_main_content){
            yaw += deltaX * 0.003;
            pitch += deltaY * 0.003;
        }else{
            yaw += deltaX * 0.0009;
            pitch += deltaY * 0.0009;
        }
        const maxPitch = Math.PI / 2 - 0.01;
        const minPitch = -Math.PI / 2 + 0.01;
        pitch = Math.max(minPitch, Math.min(maxPitch, pitch));
        camera.rotation.order = 'YXZ';
        camera.rotation.y = yaw;
        camera.rotation.x = pitch;
    }
    //console.log(yaw,pitch);
})

let isTouching = false;

canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
        isTouching = true;
        previousMousePosition.x = e.touches[0].clientX;
        previousMousePosition.y = e.touches[0].clientY;
    }
});
canvas.addEventListener('touchmove', (e) => {
    if (!isTouching || e.touches.length !== 1) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - previousMousePosition.x;
    const deltaY = touch.clientY - previousMousePosition.y;

    previousMousePosition.x = touch.clientX;
    previousMousePosition.y = touch.clientY;

    if(!at_main_content){
        yaw += deltaX * 0.003;
        pitch += deltaY * 0.003;
    }else{
        yaw += deltaX * 0.0009;
        pitch += deltaY * 0.0009;
    }
    const maxPitch = Math.PI / 2 - 0.01;
    const minPitch = -Math.PI / 2 + 0.01;
    pitch = Math.max(minPitch, Math.min(maxPitch, pitch));
    camera.rotation.order = 'YXZ';
    camera.rotation.y = yaw;
    camera.rotation.x = pitch;
});
canvas.addEventListener('touchend', () => {
    isTouching = false;
});
function tick() {
    requestAnimationFrame(tick);

  // 箱を回転させる
    camera.rotation.x += 0.01;
    camera.rotation.y += 0.01;

  // レンダリング
    renderer.render(scene, camera);
}
let time = 0;


const raycaster = new THREE.Raycaster();
raycaster.params.Points.threshold = 30;
const mouse = new THREE.Vector2();

const canvas_panel = document.createElement('canvas');

const ctx = canvas_panel.getContext('2d');
ctx.canvas.width = 960;
ctx.canvas.height = 540;
// 背景


var target_data = "data:image/png;base64,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"

// 背景
ctx.fillStyle = 'rgba(255, 255, 255, 0)';
ctx.fillRect(0, 0, canvas_panel.width, canvas_panel.height);

const img = new Image();
let panel; // panelを外で定義しておく
img.onload = () => {
    ctx.drawImage(img, 0, 0);
    // テキスト描画
    ctx.fillStyle = 'lightblue';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = '100px sans-serif';
    ctx.fillText('望遠鏡', 960/2+100, 540/2-100); // 中央寄りに


    // Canvas を Three.js のテクスチャに変換
    const texture_panel = new THREE.CanvasTexture(canvas_panel);
    texture_panel.needsUpdate = true;

    // 平面ジオメトリ（縦横比をキャンバスと一致させると綺麗）
    const geometry_panel = new THREE.PlaneGeometry(2, 1); // 縦横 = 2:1
    geometry_panel.translate(2 / 2, 1 / 2, 0);
    const material_panel = new THREE.MeshBasicMaterial({
    map: texture_panel,
    transparent: true,
    opacity: 1.5,
    side: THREE.DoubleSide, // 裏からも見えるようにしたいなら
    alphaTest: 0.1,         
    depthWrite: false       
    });
    panel = new THREE.Mesh(geometry_panel, material_panel);

    // 表示位置を調整（カメラから見えるところに）
    panel.position.set(1, 3, 0);
    panel.rotation.y = -Math.PI/2
    panel.visible = false;
    scene.add(panel);
}
img.src = target_data;

const chTime_x_list = { "y5":[0,0.09],
                        "y4":[0.091,0.18],
                        "y3":[0.181,0.27],
                        "y2":[0.271,0.36],
                        "y1":[0.361,0.45],
                        "m2":[0.52,0.61],
                        "m1":[0.611,0.70],
                        "d2":[0.77,0.86],
                        "d1":[0.861,0.95],
                        "h2":[0.36,0.44],
                        "h1":[0.441,0.52],
                        "f2":[0.6,0.685],//minやとmonthのmと被るなぁ。せや！秒が"second"なら分は"first"でもいいやろ！！
                        "f1":[0.686,0.77]
                    };
const chTime_y_list = { "up1":[1,0.935],
                        "down1":[0.595,0.525],
                        "up2":[0.485,0.425],
                        "down2":[0.12,0.05]
                    };
//時間変更を記録する変数
let CT_year,CT_month,CT_day,CT_hour,CT_min,CT_sec;
function isValidDate(y, m, d) {//不正な日時を入れられると自動で繰り越される仕様を利用
    const date = new Date(y, m - 1, d);
    return  date.getFullYear() === y &&
            date.getMonth() === m - 1 &&
            date.getDate() === d;
}
function getMaxDay(year, month) {
    return new Date(year, month, 0).getDate(); //前月の末日
}

let mousedown_on_telescope = false;
canvas.addEventListener('mousedown', (event) => {
    if(!at_main_content){
    const element = event.currentTarget;
    
    //canvas上のマウスのXY座標
    const x = event.clientX - element.offsetLeft;
    const y = event.clientY - element.offsetTop;

  //canvasの幅と高さを取得
    const w = element.offsetWidth;
    const h = element.offsetHeight;

    //マウス座標を-1〜1の範囲に変換
    mouse.x = (x/w)*2-1;
    mouse.y = -(y/h)*2+1;

    // マウス位置からRayを発射
    scene.updateMatrixWorld(); // 必須: ワールド行列の更新
    raycaster.setFromCamera(mouse, camera);

    var allObjects;
    if(!changing_time && !moving_location && !transitioning){
        allObjects = scene.children.filter(obj => obj !== panel && obj !== star_panel && obj !== star_panel_time); // panelを除外
        particle_list.forEach(particles=>{
            allObjects = allObjects.filter(obj => obj !== particles);
        })
    }else{
        allObjects = scene.children.filter(obj => obj === star_panel_time); 
    }
    if(changing_location_Q!=0){//地域変更の設定中なら何にも反応しないように
        allObjects=[];
    }
    // オブジェクトとの交差を検出
    const intersects = raycaster.intersectObjects(allObjects,true);
    console.log(intersects);
    const meshHits = intersects.filter(i => i.object.isMesh);//Points
    
    console.log(meshHits);
    
    // 交差したオブジェクトがあればイベントを発火
    if (meshHits.length > 0) {
        const object = meshHits[0].object;
        if(!changing_time){
            let group = object;
            while (group.parent && !group.parent.name) {
                group = group.parent;
            }
            if (group.parent) {
                group = group.parent;
            }
            //console.log('クリックされたグループ:', group.name);
            if(group.name == "望遠鏡"){
                mousedown_on_telescope = true;
            }
        }else{
            let simulatedDate = getSimulatedDate();
            simulatedDate = new Date(simulatedDate.getTime() + offsetHours * 60 * 60 * 1000); 
            let year = simulatedDate.getFullYear();
            let month = simulatedDate.getMonth() + 1;
            let day = simulatedDate.getDate();
            let hour = simulatedDate.getHours();
            let min = simulatedDate.getMinutes();
            
            console.log(meshHits[0].uv);
            const click_uv = meshHits[0].uv;
            for(let keyx in chTime_x_list){
                console.log(keyx);
                console.log(chTime_x_list[keyx]);
                if(chTime_x_list[keyx][0] < click_uv.x && click_uv.x < chTime_x_list[keyx][1]){
                    for(let keyy in chTime_y_list){
                        if(chTime_y_list[keyy][0] > click_uv.y && click_uv.y > chTime_y_list[keyy][1]){
                            if("up1" == keyy){
                                console.log(keyy);
                                if(keyx.includes("y")){//クリックされたのがならyearの値に関する場所
                                    const digit = Number(keyx.replace("y",""));
                                    console.log("digit:",digit);
                                    
                                    if(digit==5){
                                        
                                        if(CT_year>=90000){//もしyearの5桁目が最大なら0に
                                            CT_year -= 90000;
                                        }else{
                                            CT_year += 10000;
                                        }
                                    }else if(digit==4){
                                        
                                        if((CT_year)%10000>=9000){
                                            CT_year -= 9000;
                                        }else{
                                            CT_year += 1000;
                                        }
                                    }else if(digit==3){
                                        
                                        if((CT_year)%1000>=900){
                                            CT_year -= 900;
                                        }else{
                                            CT_year += 100;
                                        }
                                    }else if(digit==2){
                                        
                                        if((CT_year)%100>=90){
                                            CT_year -= 90;
                                        }else{
                                            CT_year += 10;
                                        }
                                    }else if(digit==1){
                                        
                                        if((CT_year)%10>=9){
                                            CT_year -= 9;
                                        }else{
                                            CT_year += 1;
                                        }
                                    }
                                }else if(keyx.includes("m")){
                                    let oldCT_month = CT_month;
                                    const digit = Number(keyx.replace("m",""));
                                    if(digit==2){
                                        if((CT_month)%10<3){//1の位が3以上なら操作しない
                                            if(CT_month>=10){
                                                CT_month-=10;
                                            }else{
                                                CT_month+=10;
                                            }
                                        }
                                    }else{
                                        if((CT_month)%10>=9){
                                            CT_month-=8;
                                        }else{
                                            CT_month+=1;
                                        }
                                        if((CT_month)%10>=3 && CT_month>=10){//1の位が3以上になるときに10の位が1なら0に
                                            CT_month-=10
                                        }
                                    }
                                    if(CT_month==0){
                                        CT_month = oldCT_month;
                                    }
                                    let Max_day = getMaxDay(CT_year,CT_month);
                                    if(Max_day<CT_day){
                                        CT_day = Max_day;
                                    }
                                }else if(keyx.includes("d")){
                                    const digit = Number(keyx.replace("d",""));
                                    let old_CT_day = CT_day;
                                    if(digit==2){
                                        let m_Threshold;
                                        if(CT_month==2){
                                            m_Threshold = 20;
                                        }else{
                                            m_Threshold = 30;
                                        }
                                        if(CT_day>=m_Threshold){
                                            CT_day-=m_Threshold;
                                        }else{
                                            CT_day+=10;
                                        }
                                    }else{
                                        if((CT_day)%10>=9){
                                            CT_day-=9;
                                        }else{
                                            CT_day+=1;
                                        }
                                    }
                                    if(!isValidDate(CT_year,CT_month,CT_day)){
                                        CT_day = old_CT_day;
                                    }
                                }
                            }
                            if("down1" == keyy){
                                if(keyx.includes("y")){//クリックされたのがならyearの値に関する場所
                                    const digit = Number(keyx.replace("y",""));
                                    console.log("digit:",digit);
                                    
                                    if(digit==5){
                                        
                                        if(CT_year<10000){//もしyearの5桁目が最大なら0に
                                            CT_year += 90000;
                                        }else{
                                            CT_year -= 10000;
                                        }
                                    }else if(digit==4){
                                        
                                        if((CT_year)%10000<1000){
                                            CT_year += 9000;
                                        }else{
                                            CT_year -= 1000;
                                        }
                                    }else if(digit==3){
                                        
                                        if((CT_year)%1000<100){
                                            CT_year += 900;
                                        }else{
                                            CT_year -= 100;
                                        }
                                    }else if(digit==2){
                                        
                                        if((CT_year)%100<10){
                                            CT_year += 90;
                                        }else{
                                            CT_year -= 10;
                                        }
                                    }else if(digit==1){
                                        
                                        if((CT_year)%10==0){
                                            CT_year += 9;
                                        }else{
                                            CT_year -= 1;
                                        }
                                    }
                                }else if(keyx.includes("m")){
                                    let oldCT_month = CT_month;
                                    const digit = Number(keyx.replace("m",""));
                                    if(digit==2){
                                        if((CT_month)%10<3){//1の位が3以上なら操作しない
                                            if(CT_month<10){
                                                CT_month+=10;
                                            }else{
                                                CT_month-=10;
                                            }
                                        }
                                    }else{
                                        if((CT_month)%10==1){
                                            CT_month+=8;
                                        }else{
                                            CT_month-=1;
                                        }
                                        if((CT_month)%10>=3 && CT_month>=10){//1の位が3以上になるときに10の位が1なら0に
                                            CT_month-=10;
                                        }
                                    }
                                    if(CT_month==0){
                                        CT_month = oldCT_month;
                                    }
                                    let Max_day = getMaxDay(CT_year,CT_month);
                                    if(Max_day<CT_day){
                                        CT_day = Max_day;
                                    }
                                }else if(keyx.includes("d")){
                                    const digit = Number(keyx.replace("d",""));
                                    let old_CT_day = CT_day;
                                    if(digit==2){
                                        let m_Threshold;
                                        if(CT_month==2){
                                            m_Threshold = 20;
                                        }else{
                                            m_Threshold = 30;
                                        }
                                        if(CT_day<10){
                                            CT_day+=m_Threshold;
                                        }else{
                                            CT_day-=10;
                                        }
                                    }else{
                                        if((CT_day)%10==0){
                                            CT_day+=9;
                                        }else{
                                            CT_day-=1;
                                        }
                                    }
                                    if(!isValidDate(CT_year,CT_month,CT_day)){
                                        CT_day = old_CT_day;
                                    }
                                }
                            }
                            if("up2" == keyy){
                                if(keyx.includes("h")){
                                    const digit = Number(keyx.replace("h",""));
                                    let old_CT_hour = CT_hour;
                                    if(digit==2){
                                        let max2;
                                        if((CT_hour)%10>3){
                                            max2 = 10;
                                        }else{
                                            max2 = 20;
                                        }
                                            if(CT_hour>=max2){
                                                CT_hour -= max2;
                                            }else{
                                                CT_hour += 10;
                                            }
                                        
                                    }else{
                                        if((CT_hour)%10==9){
                                            CT_hour -= 9;
                                        }else{
                                            CT_hour += 1;
                                        }
                                        if((CT_hour)%10>=4 && CT_hour >= 20){
                                            CT_hour -= 20;
                                        }
                                    }
                                    if(CT_hour>=24){
                                        CT_hour = old_CT_hour;
                                    }
                                }
                                if(keyx.includes("f")){
                                    const digit = Number(keyx.replace("f",""));
                                    if(digit==2){
                                        if(CT_min>=50){
                                            CT_min -= 50;
                                        }else{
                                            CT_min += 10;
                                        }
                                    }else{
                                        if((CT_min)%10==9){
                                            CT_min -= 9;
                                        }else{
                                            CT_min += 1;
                                        }
                                    }
                                }
                            }
                            if("down2" == keyy){
                                if(keyx.includes("h")){
                                    const digit = Number(keyx.replace("h",""));
                                    if(digit==2){
                                        let max2;
                                        if((CT_hour)%10>3){
                                            max2 = 10;
                                        }else{
                                            max2 = 20;
                                        }
                                            if(CT_hour<10){
                                                CT_hour += max2;
                                            }else{
                                                CT_hour -= 10;
                                            }
                                    }else{
                                        if((CT_hour)%10==0){
                                            CT_hour += 9;
                                        }else{
                                            CT_hour -= 1;
                                        }
                                        if((CT_hour)%10>=4 && CT_hour >= 20){
                                            CT_hour -= 20;
                                        }
                                    }
                                }
                                if(keyx.includes("f")){
                                    const digit = Number(keyx.replace("f",""));
                                    if(digit==2){
                                        if(CT_min<10){
                                            CT_min += 50;
                                        }else{
                                            CT_min -= 10;
                                        }
                                    }else{
                                        if((CT_min)%10==0){
                                            CT_min += 9;
                                        }else{
                                            CT_min -= 1;
                                        }
                                    }
                                }
                            }
                            change_show_time(CT_year,CT_month,CT_day,CT_hour,CT_min);
                        }
                    }
                }
            }
        }
    }
}
    
});
canvas.addEventListener('mouseup', (event) => {
    if(!at_main_content){
    const element = event.currentTarget;
    
    //canvas上のマウスのXY座標
    const x = event.clientX - element.offsetLeft;
    const y = event.clientY - element.offsetTop;

  //canvasの幅と高さを取得
    const w = element.offsetWidth;
    const h = element.offsetHeight;

    //マウス座標を-1〜1の範囲に変換
    mouse.x = (x/w)*2-1;
    mouse.y = -(y/h)*2+1;

    // マウス位置からRayを発射
    scene.updateMatrixWorld(); // 必須: ワールド行列の更新
    raycaster.setFromCamera(mouse, camera);

    var allObjects;
    if(!changing_time && !moving_location && !transitioning){
        allObjects = scene.children.filter(obj => obj !== panel && obj !== star_panel && obj !== star_panel_time); // panelを除外
    }else{
        allObjects = scene.children.filter(obj => obj === star_panel_time); 
    }
    if(changing_location_Q!=0){//地域変更の設定中なら何にも反応しないように
        allObjects=[];
    }
    if(telescope.visible == false || in_transition_telescope){
        allObjects = allObjects.filter(obj => obj!==telescope);
    }
    // オブジェクトとの交差を検出
    const intersects = raycaster.intersectObjects(allObjects,true);
    console.log(intersects);
    const meshHits = intersects.filter(i => i.object.isMesh);//Points
    
    console.log(meshHits);
    
    // 交差したオブジェクトがあればイベントを発火
    if (meshHits.length > 0) {
        const object = meshHits[0].object;
        if(!changing_time){
            let group = object;
            while (group.parent && !group.parent.name) {
                group = group.parent;
            }
            if (group.parent) {
                group = group.parent;
            }
            
            if(group.name == "望遠鏡" && mousedown_on_telescope == true){
                console.log('クリックされたグループ:', group.name);
                mousedown_on_telescope = false;
                into_telescope();
                //ここからメインコンテンツに移動する。
                //
            }
        }
    }
}
});
const geometry_hide_panel = new THREE.PlaneGeometry(10, 10);  // 板のサイズ（カメラの前に大きく配置）
const material_hide_panel = new THREE.MeshBasicMaterial({
    color: 0xffffff, // 白色に設定
    opacity: 10,      // 最初は完全に不透明
    transparent: true // 透明にする
});

const hide_plane = new THREE.Mesh(geometry_hide_panel, material_hide_panel);
let at_main_content = false;
const show_time_and_location_ele = document.getElementById("show_time_and_location");
const telescope_filter_img = document.getElementById("telescope_filter");
const info_icon = document.getElementById("info_icon");
const info_operate_ele = document.getElementById("info_operate");
const close_parent_info_button = document.getElementById("close_parent_info");
const galaxy_img = document.getElementById("galaxy_img");
const select_galaxy_ele = document.getElementById("select_galaxy");
let in_transition_telescope = false;
function into_telescope(){
    in_transition_telescope = true;
    at_main_content = true;
    panel.visible = false;
    change_constellation_name_button.parentElement.style.display = "none";
    change_location_button.parentElement.style.display = "none";
    change_time_button.parentElement.style.display = "none";
    show_time_and_location_ele.style.display = "none";
    
    canvas.style.cursor = "auto";
    const tl = gsap.timeline();
    // 目標の回転（rad）
    const targetRotation = {
        x: -30 * Math.PI / 180,
        y: -Math.PI / 2,
        z: 0
    };
    camera.rotation.order = "YXZ";
    //camera.position.set(0.9,2.3,0)
    // アニメーション実行（2秒でイージング）
    tl.to(camera.rotation, {
        duration: 1,
        x: targetRotation.x,
        y: targetRotation.y,
        z: targetRotation.z,
        ease: "power3.out"
    });
    tl.to(camera.position, {
        x: 0.9,
        y: 2.3,
        z: 0,
        duration: 1,
        ease: "power2.inOut"
    });
    tl.to(camera,{
        zoom:9,
        duration: 1,
        ease: "power2.inOut",
        onUpdate: () => {
            camera.updateProjectionMatrix();
        },
        onComplete:()=>{
            hide_plane.position.set(1, 0, 0); // カメラの前に配置（距離を調整）
            hide_plane.rotation.y = -Math.PI/2
            scene.add(hide_plane);
            hide_plane.material.transparent = true;
        }
    });
    tl.to(camera.position,{
        x:0,
        y:1,
        z:0,
        duration:0
    });
    tl.to(camera,{
        zoom:3,
        duration: 0,
        onUpdate: () => {
            telescope.visible = false;
            camera.updateProjectionMatrix();
        }
    })
    const targetRotation2 = {
        x: 45 * Math.PI / 180,
        y: -Math.PI / 2,
        z: 0
    };
    tl.to(camera.rotation, {
        duration: 0,
        x: targetRotation2.x,
        y: targetRotation2.y,
        z: targetRotation2.z,
    });
    tl.to(hide_plane.material.color,{
        duration: 1,
        r: 0,
        g: 0,
        b: 0,
        
        //opacity: 0.3,
        onStart:()=>{
            
            telescope_filter_img.style.display = "block";
            galaxy_img.style.display = "block";
            
            /* telescope_filter_img.classList.add("opacity_animation");
            galaxy_img.classList.add("opacity_animation"); */
        },
        onComplete: () => {
            telescope_filter_img.classList.add("opacity_animation");
            galaxy_img.classList.add("size_animation");
            select_galaxy_ele.style.display = "block";
            telescope_filter_img.classList.add("opacity_animation");
            yaw = -Math.PI / 2;   // 左右
            pitch = 45 * Math.PI / 180; // 上下
            //scene.remove(hide_plane);
            //in_transition_telescope = false;
        }
    })
}

info_icon.addEventListener("click",()=>{
    info_icon.style.display = "none";
    info_operate_ele.style.display = "block";
})
close_parent_info_button.addEventListener("click",()=>{
    info_icon.style.display = "block";
    info_operate_ele.style.display = "none";
})

const canvas_star_panel = document.createElement('canvas');

const ctx_star = canvas_star_panel.getContext('2d');
ctx_star.canvas.width = 960;
ctx_star.canvas.height = 540;
const img2 = new Image();
let star_panel; // panelを外で定義しておく
let texture_panel;

img2.onload = () => {
    ctx_star.drawImage(img2, 0, 0);
    // テキスト描画
    ctx_star.fillStyle = 'lightblue';
    ctx_star.textAlign = 'center'; ctx_star.textBaseline = 'middle';
    ctx_star.font = '70px sans-serif';
    /* ctx_star.fillText('ああああああああ', 960/2+100, 540/2+100);
    ctx_star.fillText('あああああああ座', 960/2+100, 540/2-100); */


    // Canvas を Three.js のテクスチャに変換
    texture_panel = new THREE.CanvasTexture(canvas_star_panel);
    texture_panel.needsUpdate = true;

    // 平面ジオメトリ（縦横比をキャンバスと一致させると綺麗）
    const geometry_panel = new THREE.PlaneGeometry(200, 100);
    geometry_panel.translate(200 / 2, 100 / 2, 0);
    const material_panel = new THREE.MeshBasicMaterial({
    map: texture_panel,
    transparent: true,
    opacity: 0.7,
    side: THREE.DoubleSide, // 裏からも見えるようにしたいなら
    alphaTest: 0.1,         
    depthWrite: false,      
    });
    star_panel = new THREE.Mesh(geometry_panel, material_panel);

    star_panel.position.set(700, 10, 0);
    star_panel.rotation.y = -Math.PI/2
    star_panel.visible = false;
    scene.add(star_panel);
}
img2.src = target_data;

let panel_pos = {x:0,y:0,z:0};

import starnameURL from "./hip2star_name_japanese.json?url"
var HIP2StarName;
fetch(starnameURL).then(res=>res.json()).then(starnamejson=>HIP2StarName = starnamejson)
import constellationsURL from "./constellations_name_table.json?url"
var ConNative2JaName;
fetch(constellationsURL).then(res=>res.json()).then(conmejson=>ConNative2JaName = conmejson)
let inmusicGalaxy = false;
canvas.addEventListener('mousemove', (event) => {
    if(!at_main_content){
    // マウス座標を正規化（-1から1の範囲に変換）
    
    
    const element = event.currentTarget;
    
    //canvas上のマウスのXY座標
    const x = event.clientX - element.offsetLeft;
    const y = event.clientY - element.offsetTop;

    //canvasの幅と高さを取得
    const w = element.offsetWidth;
    const h = element.offsetHeight;

    //マウス座標を-1〜1の範囲に変換
    mouse.x = (x/w)*2-1;
    mouse.y = -(y/h)*2+1;

    // ワールド行列の更新
    scene.updateMatrixWorld();  // シーン内のオブジェクトのワールド行列を更新
    raycaster.intersectObject(panel, false);
    // マウス位置からRayを発射
    raycaster.setFromCamera(mouse, camera);
    var allObjects;
    if(!changing_time && !moving_location && !inmusicGalaxy){
        allObjects = scene.children.filter(obj => obj !== panel && obj !== star_panel && obj !== star_panel_time); // panelを除外
        particle_list.forEach(particles=>{
            allObjects = allObjects.filter(obj => obj !== particles);
        })
    }else{
        allObjects = scene.children.filter(obj => obj === star_panel_time); 
        //console.log(allObjects);
    }
    if(changing_location_Q!=0){//地域変更の設定中なら何にも反応しないように
        allObjects=[];
    }
    if(telescope.visible == false){
        allObjects = allObjects.filter(obj => obj!==telescope);
        particle_list.forEach(particles=>{
            allObjects = allObjects.filter(obj => obj !== particles);
        })
    }
    // オブジェクトとの交差を検出
    const intersects = raycaster.intersectObjects(allObjects, true);
    const pointHits = intersects.filter(i => i.object.isPoints)
    const meshHits = intersects.filter(i => i.object.isMesh);
    //console.log(meshHits)
    //console.log(pointHits);
    // 交差したオブジェクトがあればカーソルをポインターに変更
    let hit_telescope = false;
    if (meshHits.length > 0) {
        const object = meshHits[0].object;
        let group = object;
        while (group.parent && !group.parent.name) {
            group = group.parent;
        }
        if (group.parent){
            group = group.parent;
        }

        if(group.name=="望遠鏡" && !transitioning && !moving_location){
            console.log(transitioning);
            hit_telescope = true;
            panel.visible = true;
            star_panel.visible = false;
            //console.log(meshHits[0].point);
            //panel.position.set(meshHits[0].point.x,meshHits[0].point.y,meshHits[0].point.z);
            panel_pos.x = meshHits[0].point.x
            panel_pos.y = meshHits[0].point.y
            panel_pos.z = meshHits[0].point.z
            document.body.style.cursor = 'pointer'; // ポインターに変更
        }else{
            panel.visible = false;
            document.body.style.cursor = 'auto'; // 通常のカーソルに戻す
        }
    } else {
        panel.visible = false;
        document.body.style.cursor = 'auto'; // 通常のカーソルに戻す
    }
    if(pointHits.length > 0 && !hit_telescope){
        let hit_constellations = [];
        pointHits.forEach(point => {
            //console.log(point.index);
            const index = point.index;
            const hip = hipNumbers[index];
            //console.log(hip);
            const constellations = constellations_stars[hip];
            //console.log(constellations);
            if(constellations){
                //console.log(point);
                hit_constellations.push([point.distanceToRay,hip,constellations,point]);
            }
        });
        if(hit_constellations.length > 0){
            //console.log(hit_constellations);
            let min_dis = Infinity;
            let min_index;
            let index = 0;
            hit_constellations.forEach(element => {
                let ray_distance = element[0];
                if(min_dis > ray_distance){
                    min_dis = ray_distance;
                    min_index = index;
                }
                index++;
            });
            //console.log(hit_constellations[min_index]);
            const hip = hit_constellations[min_index][1];
            const constellation = hit_constellations[min_index][2];
            const min_object = hit_constellations[min_index][3];
            star_panel.position.set(min_object.point.x,min_object.point.y,min_object.point.z);
            star_panel.visible = true;
            ctx_star.clearRect(0, 0, canvas_star_panel.width, canvas_star_panel.height);
            ctx_star.drawImage(img2, 0, 0);
            ctx_star.fillStyle = 'lightblue';
            ctx_star.textAlign = 'center'; ctx_star.textBaseline = 'middle';
            ctx_star.font = '100px nikokaku';
            let star_name = "";
            let constellation_name = "";
            HIP2StarName.forEach(element => {
                const hip_num = element.hip_number;
                if(hip_num==hip){
                    star_name = element.name;
                    //console.log(star_name);
                    return
                }
            });
            constellation.forEach(element => {
                if(constellation_name!==""){
                    constellation_name+="/";
                }
                //console.log(element);
                if(conste_name_Ja){
                    for (const item of ConNative2JaName) {
                        if(item[element]){
                            //console.log(item[element]);
                            constellation_name+=item[element].JaName+"座";
                            return
                        }
                    }
                }else{
                    constellation_name += element;
                }
            })
            
            ctx_star.fillText(star_name, 960/2+100, 540/2-100);
            ctx_star.font = '130px nikokaku';
            if(conste_name_Ja){
                if(constellation_name.length >= 7){
                    let fonst_size = 130 - (constellation_name.length - 6) * 9
                    ctx_star.font = `${fonst_size}px nikokaku`;
                    //ctx_star.font = '75px nikokaku';
                }
            }else{
                if(constellation_name.length >= 9){
                    let fonst_size = 130 - (constellation_name.length - 7) * 8
                    ctx_star.font = `${fonst_size}px nikokaku`;
                    //ctx_star.font = '75px nikokaku';
                }
            }
            ctx_star.fillText(constellation_name, 960/2+100, 540/2+150);
            texture_panel.needsUpdate = true;
        }else{
            star_panel.visible = false;
        }
        
    }
}
});

//ホイール動作によるズームイン/アウト
canvas.addEventListener('wheel', (event) => {
    event.preventDefault();
    if(!at_main_content){
        camera.zoom += event.deltaY * -0.001;
        camera.zoom = Math.max(0.9, Math.min(5, camera.zoom));
        camera.updateProjectionMatrix(); // ← これ大事！
    }
});

const canvas_change_time = document.createElement('canvas');

const ctx_change_time = canvas_change_time.getContext('2d');
ctx_change_time.canvas.width = 1390;
ctx_change_time.canvas.height = 540;

var star_panel_time;

const img3_data = "data:image/png;base64,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"

// --- フォントを読み込む Promise ---
import fontUrl from './fonts/Makinas-4-Flat.otf';
const fontPromise = new Promise((resolve, reject) => {
    const font = new FontFace('MyFont', `url(${fontUrl})`);
    font.load().then(loadedFont => {
        document.fonts.add(loadedFont);
        resolve(); // フォント読み込み完了
    }).catch(reject);
});
// --- 画像を読み込む Promise ---
var img3;
const imagePromise = new Promise((resolve, reject) => {
    img3 = new Image();
    img3.onload = () => resolve(img3);
    img3.onerror = reject;
    img3.src = img3_data;  // base64またはURL
});


function change_show_time(year,month,day,hour,min){
    console.log("clear");
    ctx_change_time.clearRect(0, 0, ctx_change_time.canvas.width, ctx_change_time.canvas.height);
    
    ctx_change_time.drawImage(img3, 0, 0);
    ctx_change_time.font = '180px MyFont';
    ctx_change_time.fillStyle = "#92c1e4";
    //数字から各桁の数字を取出す(絶対もっとスマートな方法あるって)
    const y5 = Math.floor(year/10000);
    const y4 = Math.floor((year-y5*10000)/1000);
    const y3 = Math.floor((year-y5*10000-y4*1000)/100);
    const y2 = Math.floor((year-y5*10000-y4*1000-y3*100)/10);
    const y1 = Math.floor((year-y5*10000-y4*1000-y3*100-y2*10)/1);
    const m1 = Math.floor(month/10);
    const m2 = Math.floor((month-m1*10)/1);
    const d1 = Math.floor(day/10);
    const d2 = Math.floor((day-d1*10)/1);
    console.log("h:",hour);
    const h1 = Math.floor(hour/10);
    const h2 = Math.floor((hour-h1*10)/1);

    const min1 = Math.floor(min/10);
    const min2 = Math.floor((min-min1*10)/1);
    ctx_change_time.fillText(y5, 60, 125);
    ctx_change_time.fillText(y4, 190, 125);
    ctx_change_time.fillText(y3, 310, 125);
    ctx_change_time.fillText(y2, 440, 125);
    ctx_change_time.fillText(y1, 560, 125);

    ctx_change_time.fillText(m1, 780, 125);
    ctx_change_time.fillText(m2, 900, 125);

    ctx_change_time.fillText(d1, 1130, 125);
    ctx_change_time.fillText(d2, 1250, 125);
    ctx_change_time.fillStyle = "#4c59ab";
    ctx_change_time.font = '160px MyFont';
    
    ctx_change_time.fillText(h1, 560, 395);
    ctx_change_time.fillText(h2, 670, 395);

    ctx_change_time.fillText(min1, 900, 395);
    ctx_change_time.fillText(min2, 1005, 395);
    if(texture_panel_time){
        texture_panel_time.needsUpdate = true;
    }

    
}
var texture_panel_time;
Promise.all([fontPromise, imagePromise])
.then(([_,img3])=>{
    ctx_change_time.canvas.width = 1390;
    ctx_change_time.canvas.height = 540;
    
    
    ctx_change_time.fillStyle = "#92c1e4";
    ctx_change_time.textAlign = 'center'; ctx_change_time.textBaseline = 'middle';
    let simulatedDate = getSimulatedDate();
    simulatedDate = new Date(simulatedDate.getTime() + offsetHours * 60 * 60 * 1000); 
    year = simulatedDate.getFullYear();
    month = simulatedDate.getMonth() + 1;
    day = simulatedDate.getDate();
    hour = simulatedDate.getHours();
    min = simulatedDate.getMinutes();
    sec = simulatedDate.getSeconds();
    change_show_time(year,month,day,hour,min);
    ctx_change_time.drawImage(img3, 0, 0);

    texture_panel_time = new THREE.CanvasTexture(canvas_change_time);
    texture_panel_time.needsUpdate = true;
    const geometry_panel_time = new THREE.PlaneGeometry(200, 100);
    //geometry_panel_time.translate(200 / 2-5, 100 / 2+10, 0);
    const material_panel_time = new THREE.MeshBasicMaterial({
        map: texture_panel_time,
        //color:0xFFFFFF,
        transparent: true,
        opacity:   0.7,
        side: THREE.DoubleSide,
        alphaTest: 0.1
    });
    star_panel_time = new THREE.Mesh(geometry_panel_time, material_panel_time);
    star_panel_time.quaternion.copy(camera.quaternion);
    star_panel_time.position.set(100,0,0);
    star_panel_time.visible = false;
    scene.add(star_panel_time);
});
let changing_time = false;

const set_now_button = document.getElementById("set_now");
const change_time_button = document.getElementById("change_time");
const return_set_time_button = document.getElementById("return_set_time");
const warn_past_ele = document.getElementById("warn_past");
const warn_close_button = document.getElementById("close_parent");
const operate_button_text = document.getElementById("operate_button_text");
change_time_button.addEventListener("click",()=>{
    if(!changing_time){
        const dir = new THREE.Vector3();
        camera.getWorldDirection(dir); // カメラの向いている方向ベクトル
        dir.multiplyScalar(100); // 距離100の位置にする

        const panelPosition = new THREE.Vector3().copy(camera.position).add(dir); // カメラ位置からdir方向に100進んだ点

        star_panel_time.position.copy(panelPosition); // パネルをその位置へ
        star_panel_time.quaternion.copy(camera.quaternion);
        let simulatedDate = getSimulatedDate();
        console.log(offsetHours);
        simulatedDate = new Date(simulatedDate.getTime() + offsetHours * 60 * 60 * 1000); 
        let year = simulatedDate.getFullYear();
        let month = simulatedDate.getMonth() + 1;
        let day = simulatedDate.getDate();
        let hour = simulatedDate.getHours();
        let min = simulatedDate.getMinutes();
        console.log("hour:",hour);
        if(CT_year === undefined){
            CT_year = year;
        }
        if(CT_month === undefined){
            CT_month = month;
        }
        if(CT_day === undefined){
            CT_day = day;
        }
        if(CT_hour === undefined){
            CT_hour = hour;
        }
        if(CT_min === undefined){
            CT_min = min;
        }
        change_show_time(year,month,day,hour,min);
        star_panel_time.visible = true;
        operate_button_text.innerText = "決定！！";
        change_time_button.style.fontSize = "30pt";
        set_now_button.style.display = "block";
        set_now_button.parentElement.style.display = "block";
        return_set_time_button.style.display = "block";
        return_set_time_button.parentElement.style.display = "block";
        change_location_button.parentElement.style.display = "none";
        panel.visible = false;
        star_panel.visible = false;
        telescope.visible = false;
        change_constellation_name_button.parentElement.style.display = "none";
        changing_time = !changing_time; 
        update_back_tanzaku();
    }else{
        let local_time = new Date(CT_year,CT_month-1,CT_day,CT_hour,CT_min);
        if(local_time.getTime()<=new Date()){
            warn_past_ele.style.display = "block";
            canvas.style.pointerEvents = "none";
            return_set_time_button.style.pointerEvents = "none";
            return_set_time_button.style.opacity = 0.3;
            set_now_button.style.pointerEvents = "none";
            set_now_button.style.opacity = 0.3;
            change_time_button.style.pointerEvents = "none";
            change_time_button.style.opacity = 0.3;
            update_back_tanzaku();
            
        }else{
            CT_year=CT_month=CT_day=CT_hour=CT_min = undefined;
            /* let offsetMinutes = new Date().getTimezoneOffset();
            let offsetHours = -offsetMinutes / 60;//現地時間とutcとの差をげっちゅ */
            let offsetHours = 9;//ここは本題じゃないのでそんなに凝らないことにします。よってUTC+9で固定。
            console.log(offsetHours);
            // UTCに変換
            let utc = new Date(local_time.getTime() - offsetHours * 60 * 60 * 1000); // -9時間
            let year = utc.getUTCFullYear();
            let month = utc.getUTCMonth() + 1;
            let day = utc.getUTCDate();
            let hour = utc.getUTCHours();
            let min = utc.getUTCMinutes();
            //baseDate = utc; // スタート時刻 (年, 月-1, 日, 時, 分, 秒)
            //startTime = performance.now(); // 実時間の開始点
            move_time(year,month,day,hour,min);
            star_panel_time.visible = false;
            operate_button_text.innerText = "時間を変更する";
            change_time_button.style.fontSize = "18pt";
            set_now_button.style.display = "none";
            set_now_button.parentElement.style.display = "none";
            return_set_time_button.style.display = "none";
            return_set_time_button.parentElement.style.display = "none";
            change_location_button.parentElement.style.display = "block";
            change_constellation_name_button.parentElement.style.display = "none";
            telescope.visible = true;
            changing_time = !changing_time; 
            update_back_tanzaku();
        }
        
    }
    
})
warn_close_button.addEventListener("click",()=>{
    warn_past_ele.style.display = "none";
    canvas.style.pointerEvents = "auto";
    return_set_time_button.style.pointerEvents = "auto";
    return_set_time_button.style.opacity = 1;
    set_now_button.style.pointerEvents = "auto";
    set_now_button.style.opacity = 1;
    change_time_button.style.pointerEvents = "auto";
    change_time_button.style.opacity = 1;
})

set_now_button.addEventListener("click",()=>{

    let local_time = new Date();
    CT_year=CT_month=CT_day=CT_hour=CT_min = undefined;
    // UTCに変換
    let utc = new Date(local_time.getTime() - offsetHours * 60 * 60 * 1000); // -9時間
    let year = utc.getUTCFullYear();
    let month = utc.getUTCMonth() + 1;
    let day = utc.getUTCDate();
    let hour = utc.getUTCHours();
    let min = utc.getUTCMinutes();
    //baseDate = utc; // スタート時刻 (年, 月-1, 日, 時, 分, 秒)
    //startTime = performance.now(); // 実時間の開始点
    move_time(year,month,day,hour,min,true);
    star_panel_time.visible = false;
    operate_button_text.innerText = "時間を変更する";
    change_time_button.style.fontSize = "18pt";
    set_now_button.parentElement.style.display = "none";
    return_set_time_button.parentElement.style.display = "none";
    change_location_button.parentElement.style.display = "block";
    change_constellation_name_button.parentElement.style.display = "block";
    telescope.visible = true;

    changing_time = !changing_time; 
    update_back_tanzaku();
})
return_set_time_button.addEventListener("click",()=>{
    star_panel_time.visible = false;
    CT_year=CT_month=CT_day=CT_hour=CT_min = undefined;
    operate_button_text.innerText = "時間を変更する";
    change_time_button.style.fontSize = "18pt";
    set_now_button.style.display = "none";
    set_now_button.parentElement.style.display = "none";
    return_set_time_button.style.display = "none";
    return_set_time_button.parentElement.style.display = "none";
    change_location_button.parentElement.style.display = "block";
    telescope.visible = true;
    change_constellation_name_button.parentElement.style.display = "block";

    changing_time = !changing_time;
    update_back_tanzaku();
})

const change_location_button = document.getElementById("change_location")
const location_firstQ_ele = document.getElementById("location_firstQ");
const return_change_location_button = document.getElementById("return_change_location");
const firstQ_options = document.getElementsByClassName("firstQ_child");
const japan_options = document.getElementsByClassName("japan_option_child");
const world_options = document.getElementsByClassName("world_option_child");
const japan_option_ele = document.getElementById("japan_option");
const world_option_ele = document.getElementById("world_option");
let changing_location_Q = 0;//地域変更の質問のレベル

//座標が取得できるまでは無効
firstQ_options[0].style.opacity = 0.3;
firstQ_options[0].style.pointerEvents = "none";

change_location_button.addEventListener("click",()=>{
    location_firstQ_ele.style.display = "flex";
    change_time_button.style.opacity = 0.3;
    change_location_button.style.opacity = 0.3;
    change_location_button.style.pointerEvents = "none";
    change_time_button.style.pointerEvents = "none";
    return_change_location_button.style.display = "block";
    return_change_location_button.parentElement.style.display = "block";
    change_constellation_name_button.parentElement.style.display = "none";
    panel.visible = false;
    star_panel.visible = false;
    telescope.visible = false;
    changing_location_Q = 1;
    update_back_tanzaku();
});
return_change_location_button.addEventListener("click",()=>{
    changing_location_Q -= 1;
    change_Qnum();
})

function change_Qnum(){
    if(changing_location_Q == 0){
        change_time_button.style.opacity = 1;
        change_location_button.style.opacity = 1;
        change_location_button.style.pointerEvents = "auto";
        change_time_button.style.pointerEvents = "auto";
        
        return_change_location_button.parentElement.style.display = "none";
        location_firstQ_ele.style.display = "none";
        japan_option_ele.style.display = "none";
        world_option_ele.style.display = "none";
        panel.visible = true;
        star_panel.visible = true;
        telescope.visible = true;
        change_constellation_name_button.parentElement.style.display = "block";
        update_back_tanzaku();
    }else if(changing_location_Q == 1){
        location_firstQ_ele.style.display = "flex";
        japan_option_ele.style.display = "none";
        world_option_ele.style.display = "none";
        update_back_tanzaku();
    }
}

location_firstQ_ele.addEventListener("click",(e)=>{
    if(e.target == firstQ_options[1]){
        location_firstQ_ele.style.display = "none";
        japan_option_ele.style.display = "flex";
        changing_location_Q = 2;
    }else if(e.target == firstQ_options[2]){
        location_firstQ_ele.style.display = "none";
        world_option_ele.style.display = "flex";
        changing_location_Q = 2;
    }else if(e.target == firstQ_options[0]){
        location_ele.innerText = "あなたの地域";
        to_latitude = user_lat;
        to_longitude = user_lon;
        from_latitude = latitude;
        from_longitude = longitude;
        loc_move_start = performance.now();
        moving_location = true;
        changing_location_Q = 0;
        change_Qnum();
    }
});

//各年の緯度経度。緯度は北緯が+,経度は東経が+。
const location_list = {
    "札幌":[43.06277778,141.355],
    "仙台":[38.26808333,140.8695],
    "東京":[35.68947222,139.69175],
    "名古屋":[35.18144722,136.90636667],
    "大阪":[34.7875,135.50172222],
    "広島":[34.38527778,132.455277778],
    "福岡":[33.59011111,130.401722222],
    "那覇":[26.21222222,127.679166666],
    "アメリカ":[38.9041,-77.0171],
    "中国":[39.9035,116.388],
    "インド":[28.61,77.23],
    "オーストラリア":[-35.3081,149.124],
    "ブラジル":[-15.7801,-47.9292],
    "ケニア":[-1.29233,36.82]
};
let latitude = location_list["東京"][0];
let longitude = location_list["東京"][1];
let user_lat = location_list["東京"][0];
let user_lon = location_list["東京"][1];
let enabled_user_location = false;
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
    function(position) {
        user_lat = position.coords.latitude;
        user_lon = position.coords.longitude;
        /* console.log("緯度:", latitude);
        console.log("経度:", longitude); */
        enabled_user_location = true;
        firstQ_options[0].style.opacity = 1;
        firstQ_options[0].style.pointerEvents = "auto";
    },
    function(error) {
        console.log("disenable");
        enabled_user_location = false;
        latitude = location_list["東京"][0]
        longitude = location_list["東京"][1];
    }
    );
    } else {
        console.log("disenable2");
        enabled_user_location = false;
        latitude = location_list["東京"][0]
        longitude = location_list["東京"][1];
}
let to_latitude,to_longitude;
let from_latitude,from_longitude;
const location_ele = document.getElementById("location");
japan_option_ele.addEventListener("click",(e)=>{
    if(Array.from(japan_options).includes(e.target)){
        location_ele.innerText = e.target.innerText;
        to_latitude = location_list[e.target.innerText][0];
        to_longitude = location_list[e.target.innerText][1];
        from_latitude = latitude;
        from_longitude = longitude;
        loc_move_start = performance.now();
        moving_location = true;
        changing_location_Q = 0;
        change_Qnum();
    }
})
world_option_ele.addEventListener("click",(e)=>{
    if(Array.from(world_options).includes(e.target)){
        location_ele.innerText = e.target.innerText;
        to_latitude = location_list[e.target.innerText][0];
        to_longitude = location_list[e.target.innerText][1];
        from_latitude = latitude;
        from_longitude = longitude;
        loc_move_start = performance.now();
        moving_location = true;
        changing_location_Q = 0;
        change_Qnum();
    }
})

let moving_location = false;
let loc_move_start;
function update_location(){
if(moving_location){
    change_time_button.parentElement.style.display = "none";
    change_location_button.parentElement.style.display = "none";
    change_constellation_name_button.parentElement.style.display = "none";
    telescope.visible = false;
    const now = performance.now();
    const diff_lat = to_latitude - from_latitude;//緯度を動かす量
    const diff_lon = to_longitude - from_longitude;//経度を動かす量
    const prog = (now - loc_move_start) / 1000;//時間的な進捗
    const easedprog = easeInOutCubic(prog);
    latitude = from_latitude + diff_lat*easedprog;
    longitude = from_longitude + diff_lon*easedprog;
    if(prog>=1){
        latitude = to_latitude;
        longitude = to_longitude;
        moving_location = false;
        change_time_button.parentElement.style.display = "block";
        change_location_button.parentElement.style.display = "block";
        change_constellation_name_button.parentElement.style.display = "block";
        telescope.visible = true;
    }
}
}

const change_constellation_name_button = document.getElementById("change_constellation_name");
const constellation_name_ele = document.getElementById("constellation_name");
let conste_name_Ja = true;
change_constellation_name_button.addEventListener("click",()=>{
    conste_name_Ja = !conste_name_Ja;
    if(conste_name_Ja){
        constellation_name_ele.innerText = "日本語";
    }else{
        constellation_name_ele.innerText = "学名";
    }
})


// レンダリング
//renderer.render(scene, camera);
const axesHelper = new THREE.AxesHelper( 1000 );
scene.add( axesHelper );

// ブルームエフェクトの設定
const renderScene = new RenderPass(scene, camera);

// UnrealBloomPassの作成
const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(width, height), // レンダリングのサイズ
    0.4,  // ブルーム強度
    0.1,  // ブルームの半径
    0.85  // 鮮明さ
);
bloomPass.threshold = 0.0;
renderer.sortObjects = false;
const renderTarget = new THREE.WebGLRenderTarget(width, height, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat
});
// EffectComposerを作成し、エフェクトを追加
const composer = new EffectComposer(renderer);
composer.renderToScreen = true; 
composer.addPass(renderScene);
composer.addPass(bloomPass);
composer.render();



function directionToCubeUV(dir) {
    const absX = Math.abs(dir.x);
    const absY = Math.abs(dir.y);
    const absZ = Math.abs(dir.z);
    let face, u, v;
    //とりあえず左上を(0,0)とする。
    // X軸に最も近い方向
    if (absX >= absY && absX >= absZ) {
        if (dir.x > 0) {
            face = 'px';  // +X方向
            u = ((dir.z / dir.x) * 0.5 +0.5);  // Z方向をUVにマップ1
            v = 1-((dir.y / dir.x) * 0.5 + 0.5); // Y方向をUVにマップ1
        } else {
            face = 'nx';  // -X方向
            u = 1-((dir.z / dir.x) * -0.5 + 0.5);//1
            v = 1-((dir.y / dir.x) * -0.5 + 0.5);//1
        }
    }
    // Y軸に最も近い方向
    else if (absY >= absX && absY >= absZ) {
        if (dir.y > 0) {
            face = 'py';  // +Y方向
            u = (dir.z / dir.y) * 0.5 + 0.5;
            v = (dir.x / dir.y) * 0.5 + 0.5;//1
        } else {
            face = 'ny';  // -Y方向
            u = ((dir.z / dir.y) * -0.5 + 0.5);
            v = 1-((dir.x / dir.y) * -0.5 + 0.5);
        }
    }
    // Z軸に最も近い方向
    else {
        if (dir.z > 0) {
            face = 'pz';  // +Z方向
            u = 1-((dir.x / dir.z) * 0.5 + 0.5);//1
            v = 1-((dir.y / dir.z) * 0.5 + 0.5);//1
        } else {
            face = 'nz';  // -Z方向
            u = ((dir.x / dir.z) * -0.5 + 0.5);//1
            v = 1-((dir.y / dir.z) * -0.5 + 0.5);//1
        }
    }

    return { face, u, v };
}

function getPixelFromFace(faceCanvas, u, v,face) {
    const ctx = faceCanvas.getContext('2d');
    const x = Math.min(Math.floor(u * faceCanvas.width), faceCanvas.width - 1);
    const y = Math.min(Math.floor(v * faceCanvas.height), faceCanvas.height - 1);
    /* console.log("f",face);
    console.log("x",x);
    console.log("y",y); */
    return ctx.getImageData(x, y, 1, 1).data;
}

const directions = [
    { name: 'px', lookAt: [1, 0, 0], up: [0, 1, 0] },
    { name: 'nx', lookAt: [-1, 0, 0], up: [0, 1, 0] },
    { name: 'py', lookAt: [0, 1, 0], up: [-1, 0, 0] },
    { name: 'ny', lookAt: [0, -1, 0], up: [1, 0, 0] },
    { name: 'pz', lookAt: [0, 0, 1], up: [0, 1, 0] },
    { name: 'nz', lookAt: [0, 0, -1], up: [0, 1, 0] }
];

const size = 512*3;

function get_6dir_img() {

    const faceImages = [];
    const gl = renderer.getContext();
    const originalPosition = camera.position.clone();
    const originalUp = camera.up.clone();
    const originalFov = camera.fov;
    const originalAspect = camera.aspect;
    const originalDirection = camera.getWorldDirection(new THREE.Vector3()).clone();
    const originalLookAt = originalPosition.clone().add(originalDirection);
    const original_zoom = camera.zoom;
    camera.fov = 90;
    camera.aspect = 1;
    camera.zoom = 1;
    camera.updateProjectionMatrix();
    

    for (const dir of directions) {
        // 新しいカメラを作成
        //const cam = new THREE.PerspectiveCamera(90, 1, 0.1, 10000);
        camera.position.set(0,0,0)
        camera.up.fromArray(dir.up);
        const lookAtVector = new THREE.Vector3().fromArray(dir.lookAt).add(camera.position);
        camera.lookAt(lookAtVector);
        renderer.setSize(size, size);
        composer.setSize(size, size);
        
          // Composerのサイズをターゲットに合わせる
        
        // ピクセルデータを格納するための配列
        const pixels = new Uint8Array(size * size * 4);  // RGBA

        // レンダーターゲットを指定
        const framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

        composer.render();
        gl.readPixels(0, 0, size, size, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        // imageData を作成して読み取ったピクセルデータを設定
        const imageData = ctx.createImageData(size, size);
        canvas.dataset.name = dir.name;

    // ピクセルを上下反転してコピー
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const destIdx = (y * size + x) * 4;
            const srcIdx = ((size - y - 1) * size + x) * 4;

            imageData.data[destIdx]     = pixels[srcIdx];
            imageData.data[destIdx + 1] = pixels[srcIdx + 1];
            imageData.data[destIdx + 2] = pixels[srcIdx + 2];
            imageData.data[destIdx + 3] = 255; // pixels[srcIdx + 3]; 透明度
        }
    }
    ctx.putImageData(imageData, 0, 0);
        
        // 作成した画像をfaceImagesに追加
        //document.body.appendChild(canvas);
        faceImages.push(canvas);
    }
    const faceMap = {};
    for (const face of faceImages) {
        faceMap[face.dataset.name] = face;
}
    renderer.setSize(width, height);
    composer.setSize(width, height);
    composer.render();
    camera.position.copy(originalPosition);
    camera.up.copy(originalUp);
    camera.fov = originalFov;
    camera.aspect = originalAspect;
    camera.lookAt(originalLookAt);
    camera.zoom = original_zoom;
    camera.updateProjectionMatrix();

    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = size*2;
    outputCanvas.height = size;
    const ctx = outputCanvas.getContext('2d');
    const outputImageData = ctx.createImageData(outputCanvas.width, outputCanvas.height);
    for (let y = 0; y < outputCanvas.height; y++) {
        for (let x = 0; x < outputCanvas.width; x++) {
            // 正距円筒におけるピクセルの方向ベクトルを計算
            const theta = (x / outputCanvas.width) * 2 * Math.PI - Math.PI;
            const phi = -((y / outputCanvas.height) * Math.PI -0.5*Math.PI);

            const dir = new THREE.Vector3(
                Math.cos(theta) * Math.cos(phi),
                Math.sin(phi),
                Math.sin(theta) * Math.cos(phi)
            );
            const { face, u, v } = directionToCubeUV(dir);
            if(/* face.includes("ny")||face.includes("pz") */ true){
            const pixel = getPixelFromFace(faceMap[face], u, v,face);
            const idx = (y * outputCanvas.width + x) * 4;
            outputImageData.data[idx + 0] = pixel[0];
            outputImageData.data[idx + 1] = pixel[1];
            outputImageData.data[idx + 2] = pixel[2];
            outputImageData.data[idx + 3] = 255;
            }
            
        }
    }
    ctx.putImageData(outputImageData, 0, 0);
    const link = document.createElement('a');
    link.download = 'output.png';
    link.href = outputCanvas.toDataURL('image/png');
    link.click();
}

function downloadComposerOutput() {
    const gl = renderer.getContext();

    // 画像サイズを取得
    const width = renderer.domElement.width;
    const height = renderer.domElement.height;

    // ピクセルデータを格納するための配列
    const pixels = new Uint8Array(width * height * 4);  // RGBA

    // レンダーターゲットを指定
    const framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

    composer.render();
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // imageData を作成して読み取ったピクセルデータを設定
    const imageData = ctx.createImageData(width, height);


    // ピクセルを上下反転してコピー
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const destIdx = (y * width + x) * 4;
            const srcIdx = ((height - y - 1) * width + x) * 4;

            imageData.data[destIdx]     = pixels[srcIdx];
            imageData.data[destIdx + 1] = pixels[srcIdx + 1];
            imageData.data[destIdx + 2] = pixels[srcIdx + 2];
            imageData.data[destIdx + 3] = 255; // pixels[srcIdx + 3]; 透明度
        }
    }
    ctx.putImageData(imageData, 0, 0);
    
    // ダウンロードリンク作成
    const link = document.createElement('a');
    link.download = 'output.png';
    link.href = canvas.toDataURL('image/png');
    link.click();

}

show_time_and_location_ele.addEventListener("click",()=>{
    //downloadComposerOutput();
    get_6dir_img();
})

//リアルな星空の背景をヒッパルコス星表で作ろう！
//等級と大きさの変換
function vmagToSize(vmag){
    const minSize = 0.1;
    const maxSize = 6.5*6.5;
    return Math.max(minSize, maxSize - vmag*6.5);
}
//B-V色指数から色温度(K)へ変換
function bv2Temperature(bv) {
    return 4600 * ((1 / (0.92 * bv + 1.7)) + (1 / (0.92 * bv + 0.62)));
}
//CIE xy 色度図なるものを用いて色空間の座標を求めるらしい
function temperatureToXYZ(tempK) {
    let x, y;

    if (tempK >= 1667 && tempK <= 4000) {
        x = -0.2661239 * 1e9 / (tempK ** 3) - 0.2343580 * 1e6 / (tempK ** 2) +
            0.8776956 * 1e3 / tempK + 0.179910;
    } else if (tempK > 4000 && tempK <= 25000) {
        x = -3.0258469 * 1e9 / (tempK ** 3) + 2.1070379 * 1e6 / (tempK ** 2) +
            0.2226347 * 1e3 / tempK + 0.240390;
    } else {
        x = 0.31271;
    }

    
    y = -3.000 * (x ** 2) + 2.870 * x - 0.275;

    const Y = 1.0;
    const X = (Y / y) * x;
    const Z = (Y / y) * (1 - x - y);

    return [X, Y, Z];
}
//座標からRGBに変換するらしい
function xyzToRgb([X, Y, Z]) {
    let r =  3.2406 * X - 1.5372 * Y - 0.4986 * Z;
    let g = -0.9689 * X + 1.8758 * Y + 0.0415 * Z;
    let b =  0.0557 * X - 0.2040 * Y + 1.0570 * Z;

    // clamp
    return [
        Math.max(0, Math.min(1, r)),
        Math.max(0, Math.min(1, g)),
        Math.max(0, Math.min(1, b))
    ];
}
//彩度の補正
function boostColor([r, g, b], factor = 2) {
    const avg = (r + g + b) / 3;
    r = avg + (r - avg) * factor*1.8;
    g = avg + (g - avg) * factor*0.2;
    b = avg + (b - avg) * factor*0.2;
    return [
        Math.max(0, Math.min(1, r)),
        Math.max(0, Math.min(1, g)),
        Math.max(0, Math.min(1, b))
    ];
}

//まとめたもの
function bvToRgb(bv) {
    const temp = bv2Temperature(bv);
    const xyz = temperatureToXYZ(temp);
    return boostColor(xyzToRgb(xyz));
}

// ユリウス日を求める関数（UTC基準）
function getJulianDate(year,month,day,hour,min,sec) {
    /* const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const hour = date.getUTCHours();
    const min = date.getUTCMinutes();
    const sec = date.getUTCSeconds(); */
    

    const targetDate = Date.UTC(year, month - 1, day, hour, min, sec);
    const baseDate = Date.UTC(2000, 0, 1, 12);
    const baseJD = 2451545.0; // 2000-01-01 12:00 UT

    const msPerDay = 1000 * 60 * 60 * 24;
    const JD = baseJD + (targetDate - baseDate) / msPerDay;;
    //console.log(JD)
    return JD
}

//LST(地方恒星時を計算)
function getLST(year,month,day,hour,min,sec, longitudeDeg) {
    // 1. 日付をUTCで取得
    const JD = getJulianDate(year,month,day,hour,min,sec);          // ユリウス日（UTC）
    const D = JD - 2451545.0; // J2000.0 からの経過日数

    // GSTの計算(度)
    let GST = 280.46061837 + 360.98564736629 * D;//280.46...が、J2000.0でのGST(らしい)//360.98564736629

    // 経度を足してLSTに変換（東経はプラス、西経はマイナス）
    let LST = GST + longitudeDeg;

    // 0〜360度に正規化
    LST = (LST % 360 + 360) % 360;

    return LST;
}

const time_ele = document.getElementById("time");

// 日本時間（例：2025年1月1日 23:00）
//const jst = new Date(year,month,day,hour,min,sec);
let local_time = new Date();

time_ele.innerText = `${local_time.getFullYear()}年${local_time.getMonth()+1}月${local_time.getDate()}日${local_time.getHours()}時${local_time.getMinutes()}分`;

/* let offsetMinutes = new Date().getTimezoneOffset();
let offsetHours = -offsetMinutes / 60;//現地時間とutcとの差をげっちゅ */
let offsetHours = 9;//ここは本題じゃないのでそんなに凝らないことにします。よってUTC+9で固定。
//console.log(offsetHours);
// UTCに変換
let utc = new Date(local_time.getTime() - offsetHours * 60 * 60 * 1000); // -9時間
let year = utc.getUTCFullYear();
let month = utc.getUTCMonth() + 1;
let day = utc.getUTCDate();
let hour = utc.getUTCHours();
let min = utc.getUTCMinutes();
let sec = utc.getUTCSeconds();
let baseDate = utc; // スタート時刻 (年, 月-1, 日, 時, 分, 秒)
let startTime = performance.now(); // 実時間の開始点

let frameCount = 0;
let rate_1ms = 1;
function getSimulatedDate() {
    const now = performance.now();
    if (transitioning) {
        change_time_button.parentElement.style.display = "none";
        change_location_button.parentElement.style.display = "none";
        change_constellation_name_button.parentElement.style.display = "none";
        telescope.visible = false;
        const elapsed = now - transitionStartTime;
        let t = elapsed / transitionDuration;

        if (t >= 1) {
            transitioning = false;
            baseDate = new Date(transitionToTime);;
            startTime = performance.now();
            change_time_button.parentElement.style.display = "block";
            change_location_button.parentElement.style.display = "block";
            change_constellation_name_button.parentElement.style.display = "block";
            telescope.visible = true;
            return transitionToTime;
        }

        const easedT = easeInOutCubic(t);
        const diffMs = transitionToTime - transitionFromTime;
        const simulatedTime = new Date(transitionFromTime.getTime() + diffMs * easedT);
        return simulatedTime;
    } else {
        // 通常の時間進行
        const elapsedMs = now - startTime;
        return new Date(baseDate.getTime() + elapsedMs * rate_1ms);
    }
    //const simulatedYear = baseDate.getUTCFullYear() + frameCount*10;
    //frameCount++;
    //return new Date(Date.UTC(simulatedYear, 0, 1, 0, 0, 0));
}
//日時が更新されたらそこに天球を移動させる。
/* 
utcを渡しましょう。ややこしや。
*/
let transitionDuration = 7000; // 7秒
let transitionStartTime = null;
let transitionFromTime = null;
let transitionToTime = null;
let transitioning = false;

function move_time(n_year, n_month, n_day, n_hour, n_min,set_now=false) {//0=>現在時刻に合わせる
    transitionStartTime = performance.now();
    transitionFromTime = getSimulatedDate();
    transitionToTime = new Date(Date.UTC(n_year, n_month - 1, n_day, n_hour, n_min, 0));
    transitioning = true;
    const thousandYears = 1000 * 365.25 * 24 * 60 * 60 * 1000; // ミリ秒
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    if(Math.abs(transitionToTime-transitionFromTime)>=thousandYears){
        transitionDuration = 20000;
    }else if(Math.abs(transitionToTime-transitionFromTime)<=thirtyDays){
        transitionDuration = 3000;
    }else{
        transitionDuration = 7000;
    }
    if(set_now){
        transitionToTime = new Date(transitionToTime.getTime()+transitionDuration);
        const now = new Date(); // ローカルタイム
        const nowUTC = new Date(now.getTime() - offsetHours*60 * 60 * 1000);
        transitionToTime = new Date(nowUTC.getTime() + transitionDuration);
    }
}
function easeInOutCubic(x){//イージング関数はチートシートを参照しました。
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}


var stars_data,constellations_data;
var star_geometry;
var line_geometorlies = [];

function update_star() {
    const simulatedDate = getSimulatedDate();
    const local_time = new Date(simulatedDate.getTime() + offsetHours *60 *60 *1000);
    time_ele.innerText = `${local_time.getFullYear()}年${local_time.getMonth()+1}月${local_time.getDate()}日${local_time.getHours()}時${local_time.getMinutes()}分`;
    update_location();
    year = simulatedDate.getFullYear();
    month = simulatedDate.getMonth() + 1;
    day = simulatedDate.getDate();
    hour = simulatedDate.getHours();
    min = simulatedDate.getMinutes();
    sec = simulatedDate.getSeconds();
    //console.log(year,month,day,hour,min,sec);
    const LST_Deg = getLST(year,month,day,hour,min,sec,longitude);
    const LST_Rad = LST_Deg*Math.PI/180
    const lat_Deg = latitude//35.6895014;//観測点の緯度(北緯)
    const lat_Rad = lat_Deg*Math.PI/180
    //let JD = getJulianDate(year,month,day,hour,min,sec);
    //console.log(JD)
    //console.log(JD2);
    //console.log(delta_RA_deg);
    const star_positions = star_geometry.attributes.position.array;
    //console.log(star_positions);
    let star_index = 0;
    var raDec;
    var newRaDec;
    const year_diff = year - 2000;
    stars_data.forEach(star => {
        
        const RA_Deg = star.ra_deg;//RA(度数法)(春分点の赤経からの距離)(J.2000.0)
        
        //const RA_Deg = raw_RA_Deg + delta_RA_deg;

        const DEC_Deg = star.dec_deg;//DEC(度数法)(天の赤道からの距離)

        //固有運動を考慮
        const pm_ra_deg = star.pm_ra / 3600000 *Math.cos(DEC_Deg*Math.PI/180);//ミリ秒角=>度
        const pm_dec_deg = star.pm_dec / 3600000;
        const new_ra_deg = star.ra_deg + pm_ra_deg * year_diff;
        const new_dec_deg = star.dec_deg + pm_dec_deg * year_diff;
        const new_ra_rad = new_ra_deg * Math.PI / 180;
        const new_dec_rad = new_dec_deg * Math.PI / 180;
        //ラジアンに変換
        //let RA_Rad = RA_Deg*Math.PI/180
        //let DEC_Rad = DEC_Deg*Math.PI/180
        let RA_Rad = new_ra_rad;
        let DEC_Rad = new_dec_rad;

        raDec = { ra: RA_Rad, dec: DEC_Rad };
        //console.log(raDec);
        //console.log(JD)
        newRaDec = precess.position(raDec, 2000, year,0,0);//歳差運動による誤差まで自力で求めたかったが力及ばず...無念...
        //console.log(newRaDec);
        //観測点からの高さを求める
        RA_Rad = newRaDec.ra;
        DEC_Rad = newRaDec.dec;
        const HA_Rad = LST_Rad - RA_Rad
        const sinAlt = Math.sin(DEC_Rad) * Math.sin(lat_Rad) + Math.cos(DEC_Rad) * Math.cos(lat_Rad) * Math.cos(HA_Rad);
        //sinAlt = Math.max(-1, Math.min(1, sinAlt));
        const Alt_Rad = Math.asin(sinAlt);
        //観測点からの左右の角度を求める
        const cosAz = (Math.sin(DEC_Rad) - Math.sin(Alt_Rad) * Math.sin(lat_Rad)) / (Math.cos(Alt_Rad) * Math.cos(lat_Rad));
        const sinAz = -Math.cos(DEC_Rad) * Math.sin(HA_Rad) / Math.cos(Alt_Rad);
        let Az_Rad = Math.atan2(sinAz, cosAz);
        //let Az_Deg = 360-Az_RAD*180/Math.PI

        //console.log("Dec,RA:",DEC_Deg,RA_Deg);
        //console.log("Alt,Az:",Alt_Rad*180/Math.PI,Az_Rad*180/Math.PI);
        //赤道座標系から直交する空間座標系に変換
        /* const star_x = starDistance * Math.cos(DEC_Rad) * Math.cos(RA_Rad);
        const star_y = starDistance * Math.sin(DEC_Rad);
        const star_z = starDistance * Math.cos(DEC_Rad) * Math.sin(RA_Rad); */
        const star_x = starDistance * Math.cos(Alt_Rad) * Math.cos(Az_Rad);
        const star_y = starDistance * Math.sin(Alt_Rad);
        const star_z = starDistance * Math.cos(Alt_Rad) * Math.sin(Az_Rad);
        hipPosition[star.hip_number] = new THREE.Vector3(star_x, star_y, star_z);
        star_positions[star_index] = star_x;
        star_positions[star_index+1] = star_y;
        star_positions[star_index+2] = star_z;
        star_index+=3;
    })
    //console.log(raDec.ra/Math.PI*180);
    //console.log(newRaDec.ra/Math.PI*180);
    //console.log(newRaDec.dec/Math.PI*180-raDec.dec/Math.PI*180);
    //console.log(delta_RA_deg);
    //console.log(Object.keys(hipPosition).length)
    //console.log(star_index);
    star_geometry.attributes.position.needsUpdate = true;

    let constellations_index = 0;
    //console.log(line_geometorlies);
    let error_count = 0;
    constellations_data.constellations.forEach(constellation => {
        
        constellation.lines.forEach(line=>{
            //console.log(constellations_index);
            let line_geometory = line_geometorlies[constellations_index];
            let line_geometory_pos = line_geometory.attributes.position.array;
            //console.log(line_geometory_pos.length);
            constellations_index +=1;
            //console.log(line)
            //const linePositions = [];
            //if(constellation.common_name.native=="Cassiopeia"){
            for(let i = 0; i < line.length-1; i++){
                const hip1 = line[i];
                const hip2 = line[i + 1];
                if(hip1 == "thin"){
                    continue
                }

                const pos1 = hipPosition[hip1];
                const pos2 = hipPosition[hip2];
                if (pos1 && pos2) {
                    line_geometory_pos[i * 6 + 0] = pos1.x;
                    line_geometory_pos[i * 6 + 1] = pos1.y;
                    line_geometory_pos[i * 6 + 2] = pos1.z;
                    line_geometory_pos[i * 6 + 3] = pos2.x;
                    line_geometory_pos[i * 6 + 4] = pos2.y;
                    line_geometory_pos[i * 6 + 5] = pos2.z;
                }else{
                    error_count++;
                }
            }
            if(error_count > 0){
                //scene.add(lineMesh);
            }
            line_geometory.attributes.position.needsUpdate = true;
            line_geometory.computeBoundingSphere();
            //}
        })
    })
    //console.log(error_count);
    requestAnimationFrame(update_star);
    animate();
    composer.render();
}



// 星を配置する距離(天球の半径)
let starDistance = 600;
var star_material;
const hipPosition = {}; //HIP番号と位置を対応づける辞書
const hipNumbers = [];
let constellations_stars = {};
var star_points;
var constellation_lines = [];

import jsonurl from "./star_table.json?url"
import constellationsurl from "./index.json?url"
//fetch(jsonurl)
//こうしないと読み込み完了の順番によっては星座が表示されないよねあはは
Promise.all([
    fetch(jsonurl).then(res => res.json()),
    fetch(constellationsurl).then(res => res.json())
])
.then(([stars, constellations]) =>{
    stars_data = stars;
    constellations_data = constellations;
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const sizes = [];
    const intensities = [];
    

    const color = new THREE.Color();
    const simulatedDate = getSimulatedDate();

    let year = simulatedDate.getFullYear();
    let month = simulatedDate.getMonth() + 1;
    let day = simulatedDate.getDate();
    let hour = simulatedDate.getHours();
    let min = simulatedDate.getMinutes();
    let sec = simulatedDate.getSeconds();
    // 日本時間（例：2025年1月1日 23:00）
    const jst = new Date(year,month,day,hour,min,sec);
    // UTCに変換
    const utc = new Date(jst.getTime() - 9 * 60 * 60 * 1000); // -9時間
    year = utc.getUTCFullYear();
    month = utc.getUTCMonth() + 1;
    day = utc.getUTCDate();
    hour = utc.getUTCHours();
    min = utc.getUTCMinutes();
    sec = utc.getUTCSeconds();
    
    //console.log(getLST(year,month,day,hour,min,sec,139.75));
    const LST_Deg = getLST(year,month,day,hour,min,sec,longitude);
    const LST_Rad = LST_Deg*Math.PI/180
    const lat_Deg = latitude;//観測点の緯度(北緯)
    const lat_Rad = lat_Deg*Math.PI/180
    const year_JD = getJulianDate(year,month,day,hour,min,sec);
    const delta_RA_deg = (360 / 25772) * (year_JD - 2451545.0)/365.25;
    //console.log(delta_RA_deg);

    stars.forEach(star => {
        const raw_RA_Deg = star.ra_deg;//RA(度数法)(春分点の赤経からの距離)(J.2000.0)
        
        const RA_Deg = raw_RA_Deg + delta_RA_deg;

        const DEC_Deg = star.dec_deg;//DEC(度数法)(天の赤道からの距離)
        //ラジアンに変換
        let RA_Rad = RA_Deg*Math.PI/180
        let DEC_Rad = DEC_Deg*Math.PI/180
        let raDec = { ra: RA_Rad, dec: DEC_Rad };
        let newRaDec = precess.position(raDec, 2000, year,0,0);//歳差運動による誤差まで自力で求めたかったが力及ばず...無念...
        
        RA_Rad = newRaDec.ra;
        DEC_Rad = newRaDec.dec;

        //観測点からの高さを求める
        const HA_Rad = LST_Rad - RA_Rad
        const sinAlt = Math.sin(DEC_Rad) * Math.sin(lat_Rad) + Math.cos(DEC_Rad) * Math.cos(lat_Rad) * Math.cos(HA_Rad);
        const Alt_Rad = Math.asin(sinAlt);
        //観測点からの左右の角度を求める
        const cosAz = (Math.sin(DEC_Rad) - Math.sin(Alt_Rad) * Math.sin(lat_Rad)) / (Math.cos(Alt_Rad) * Math.cos(lat_Rad));
        const sinAz = -Math.cos(DEC_Rad) * Math.sin(HA_Rad) / Math.cos(Alt_Rad);
        let Az_Rad = Math.atan2(sinAz, cosAz);
        
        const star_x = starDistance * Math.cos(Alt_Rad) * Math.cos(Az_Rad);
        const star_y = starDistance * Math.sin(Alt_Rad);
        const star_z = starDistance * Math.cos(Alt_Rad) * Math.sin(Az_Rad);
        //見かけの等級
        const vmag = star.vmag

        positions.push(star_x, star_y, star_z);
        hipPosition[star.hip_number] = new THREE.Vector3(star_x, star_y, star_z);
        hipNumbers.push(star.hip_number);

        const star_intensity = Math.max(1.1 - star.vmag / 6.5, 0.0)+9;
        //color.setRGB(star_intensity, star_intensity, star_intensity);
        intensities.push(star_intensity)
        
        const sRGB = bvToRgb(star.bv_color)
        color.setRGB(sRGB[0],sRGB[1],sRGB[2]);
        colors.push(color.r, color.g, color.b);

        const size = vmagToSize(vmag);
        sizes.push(size);
        //console.log(size);
    })
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('customColor', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
    geometry.setAttribute('intensity', new THREE.Float32BufferAttribute(intensities, 1));
    geometry.setAttribute('hipNumbers', new THREE.Float32BufferAttribute(hipNumbers, 1));
    star_geometry = geometry;
    const star_img = "data:image/png;base64,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"
    star_material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0.0 },
            pointTexture: { value: new THREE.TextureLoader().load(star_img) }//円形の画像データ
        },
        vertexShader: `
            attribute float intensity;
            attribute float size;
            attribute vec3 customColor;
            attribute float hipNumbers;
            varying vec3 vColor;
            varying float vIntensity;
            varying float vRandom;
        
            void main() {
                vRandom = fract(sin(hipNumbers) * 43758.5453);
                vColor = customColor;
                vIntensity = intensity;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z); // 遠近法補正
                //gl_PointSize = size;
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            uniform sampler2D pointTexture;
            uniform float time;
            varying vec3 vColor;
            varying float vIntensity;
            varying float vRandom;
        
            void main() {
                float speed = 1.0 + vRandom * 2.0; 
                float flicker = 0.6 + 0.4 * sin(time * speed + vRandom * 6.28);
                vec4 texColor = texture2D(pointTexture, gl_PointCoord);
                vec3 finalColor = vColor * vIntensity * flicker;
                gl_FragColor = vec4(finalColor, 1.0) * texColor;
            }
        ` ,
        transparent: true,
        depthWrite: false,
        sizeAttenuation: false,
        vertexColors: true
    });
    const points = new THREE.Points(geometry,star_material);
    star_points = points;
    scene.add(points);
    const line_colors = [0x7dbbe6,0xd74443,0x4c59ab,0xe0e34c,0xe2e67d,0xeccbdc];
    
    constellations.constellations.forEach(constellation => {
        let line_color = line_colors[Math.floor(Math.random()*line_colors.length)]
        constellation.lines.forEach(line=>{
            let error_count = 0;
            //console.log(line)
            const linePositions = [];
            //if(constellation.common_name.native=="Cassiopeia"){
            for(let i = 0; i < line.length-1; i++){
                const hip1 = line[i];
                const hip2 = line[i + 1];

                if(!constellations_stars[hip1]){
                    constellations_stars[hip1] = [];
                }
                if(!constellations_stars[hip2]){
                    constellations_stars[hip2] = [];
                }
                if(!constellations_stars[hip1].includes(constellation.common_name.native)){
                    constellations_stars[hip1].push(constellation.common_name.native);
                }
                if(!constellations_stars[hip2].includes(constellation.common_name.native)){
                    constellations_stars[hip2].push(constellation.common_name.native);
                }
                const pos1 = hipPosition[hip1];
                const pos2 = hipPosition[hip2];
                if (pos1 && pos2) {
                    linePositions.push(pos1.x, pos1.y, pos1.z);
                    linePositions.push(pos2.x, pos2.y, pos2.z);
                }else{
                    console.log(hip1);
                    console.log(hip2);
                    error_count++;
                }
            }
            //}
            const lineGeometry = new THREE.BufferGeometry();
            lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
            const lineMaterial = new THREE.LineBasicMaterial({
                color: line_color, 
                transparent: true, 
                opacity: 0.7,
                depthWrite: false,  
                depthTest: true,   
            });
            
            const lineMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
            line_geometorlies.push(lineGeometry);
            if(error_count == 0){
                scene.add(lineMesh);
                constellation_lines.push(lineMesh);
            }
        })
    })
    //console.log("1:",error_count);
    update_star();
    //get_6dir_img();
    
})





//星座の描画

/* fetch(constellationsurl)
.then(res => res.json())
.then(constellations => {
    
}) */
const angle_parent = document.getElementById("angle_parent");
const angle_45 = document.createElement("div");
angle_45.innerText = "45";
angle_45.classList.add("angles");
angle_45.style.fontSize = "20pt"
angle_45.style.top = "25%";
angle_parent.appendChild(angle_45);
const angle_90 = document.createElement("div");
angle_90.innerText = "90";
angle_90.classList.add("angles");
angle_90.style.fontSize = "20pt"
angle_90.style.top = "0%";
angle_parent.appendChild(angle_90);
const angle_0 = document.createElement("div");
angle_0.innerText = "0";
angle_0.classList.add("angles");
angle_0.style.fontSize = "20pt"
angle_0.style.top = "50%";
angle_parent.appendChild(angle_0);

const angle_m45 = document.createElement("div");
angle_m45.innerText = "-45";
angle_m45.classList.add("angles");
angle_m45.style.fontSize = "20pt"
angle_m45.style.top = "75%";
angle_parent.appendChild(angle_m45);
const angle_m90 = document.createElement("div");
angle_m90.innerText = "-90";
angle_m90.classList.add("angles");
angle_m90.style.fontSize = "20pt"
angle_m90.style.top = "100%";
angle_parent.appendChild(angle_m90);


const direction_parent = document.getElementById("direction_parent");

//西と東を逆にしてしまっていたので、変数は変えずに画像だけ入れ替えて解決（おいコラ）
import northURL from "./imgs/北.png";
import eastURL from "./imgs/西.png";
import southURL from "./imgs/南.png";
import westURL from "./imgs/東.png";
const direction_N = document.createElement('img');
direction_N.src = northURL;
direction_N.classList.add("directions");
direction_N.style.left = '50%';
direction_parent.appendChild(direction_N);
const direction_E = document.createElement('img');
direction_E.src = eastURL;
direction_E.classList.add("directions");
direction_E.style.left = '0%';
direction_parent.appendChild(direction_E);
const direction_S = document.createElement('img');
direction_S.src = southURL;
direction_S.classList.add("directions");
direction_S.style.left = '150%';
direction_parent.appendChild(direction_S);
const direction_W = document.createElement('img');
direction_W.src = westURL;
direction_W.classList.add("directions");
direction_W.style.left = '100%';
direction_parent.appendChild(direction_W);    

function compute_left_rate_E(r){
    let left_rate_E;
    if(r>180){
        left_rate_E = 50 - (360-r) /90 *50;
    }else{
        left_rate_E = 100 - (90-r) /90 *50;
    }return left_rate_E;
}

function animate() {
    //requestAnimationFrame(animate);
    time += 0.01;
    //bloomPass.strength = 0.4 + 0.3 * Math.sin(time); // 0.2〜0.8くらい
    let panel_updown = 0.1*Math.sin(time/1.12);
    /* camera.zoom += 0.01;
    console.log(camera.zoom); */
    //camera.updateProjectionMatrix(); 
    if(star_material){
        star_material.uniforms.time.value = performance.now() * 0.001;
    }
    if(panel){
        //console.log(panel_pos);
        panel.position.set(panel_pos.x,panel_pos.y+panel_updown,panel_pos.z);
    }
    if(star_panel){
        //star_panel.up.copy(camera.up);
        //star_panel.lookAt(-3,3,-1);
        star_panel.quaternion.copy(camera.quaternion);
    }
    /* if(star_panel_time){
        star_panel_time.quaternion.copy(camera.quaternion);
    } */
    //console.log(camera.position.x,camera.position.y,camera.position.z);
    //renderer.render(scene, camera);
    const clock = new THREE.Clock();
    const delta = clock.getDelta();
    // パーティクル更新
    if(explosions){
        for (let i = explosions.length - 1; i >= 0; i--) {
            explosions[i].update(delta);
            if (explosions[i].isDead()) {
            explosions[i].dispose();
            explosions.splice(i, 1); // 削除
            }
        }
    }


    const rotate_y = ((camera.rotation.y/Math.PI*180)%360+360)%360;

    let left_rate_N = 100 - (360-rotate_y) /180 *100;
    direction_N.style.left = `${left_rate_N}%`;

    let left_rate_W = 100 - (270-rotate_y) /180 *100;
    direction_W.style.left = `${left_rate_W}%`;

    let left_rate_S = 100 - (180-rotate_y) /180 *100;
    direction_S.style.left = `${left_rate_S}%`;
    let left_rate_E = compute_left_rate_E(rotate_y);
    direction_E.style.left = `${left_rate_E}%`;

    const rotate_x = ((camera.rotation.x/Math.PI*180)%360);
    
    const scaled_x = (rotate_x + 90) / 180 * 100;
    
    angle_45.style.top = `${scaled_x-25}%`;
    angle_0.style.top = `${scaled_x}%`;
    angle_90.style.top = `${scaled_x-50}%`;
    angle_m45.style.top = `${scaled_x+25}%`;
    angle_m90.style.top = `${scaled_x+50}%`;
    
    if(InPreparationSong){
        galaxy_img_scale *= 1.0002;
        //galaxy_img_scale = Math.min(galaxy_img_scale,1.6);
        galaxy_img.style.transform = `scale(${galaxy_img_scale}) translateX(-50%) translateY(-50%)`;
    }else if(InPreparationSong === false){
        galaxy_img_scale *= 1.009;
        galaxy_img.style.transform = `scale(${galaxy_img_scale}) translateX(-50%) translateY(-50%)`;
        console.log(getComputedStyle(galaxy_img).height);
        if(galaxy_img_scale>=20){
            console.log(getComputedStyle(galaxy_img).height);
            InPreparationSong=undefined;
            galaxy_img_scale = 1;
            //galaxy_img.style.display = "none";
            galaxy_img.classList.add("fade_out");
            let tl = gsap.timeline();
            tl.to(camera,{
                duration:1,
                onComplete:()=>{
                    //star_points.visible = false;
                    starDistance = 200;
                    constellation_lines.forEach(element => {
                        element.visible = false;
                    });
                }
            })
            /* tl.to(hide_plane.material.color,{
                duration: 1,
                r: 1,
                g: 1,
                b: 1,
                onComplete: () => {
                    //scene.remove("hide_plane");
                    galaxy_img.style.display = "none";
                }
            },1) */
            tl.to(hide_plane.material,{
                duration: 1,
                
                opacity: 0,
                onComplete: () => {
                    hide_plane.visible = false;
                    scene.remove(hide_plane);
                    galaxy_img.style.display = "none";
                    in_transition_telescope = false;
                    start_observe_button.style.pointerEvents = "auto";
                    start_observe_button.style.opacity = 1;
                    start_observe_button.style.display = "flex";
                    observe_gauge_ele.style.display = "block";
                    loading.style.display = "none";
                    tanzaku_space.style.display = "block";
                    name_galaxy.innerText = "観測中の銀河："+player.data.song.name;
                }
            })
        }
    }
    update_back_tanzaku();
}
const tanzaku_space = document.getElementById("tanzaku_space_wrapper");
const start_observe_button = document.getElementById("start_observe");
const observe_gauge_ele = document.getElementById("observe_gauge");
const gauge_mask = document.getElementById("gauge_mask");
const gauge_star = document.getElementById("gauge_star");
const play_button = document.getElementById("play_button");

import stop_button_img from "./imgs/play_stop.png";
import play_button_img from "./imgs/play_button.png";
start_observe_button.addEventListener("click",()=>{
    console.log(player.isPlaying);
    if(!player.isPlaying){
        player.requestPlay();
        hasEverPlayed = true;
        
        
    }else{
        player.requestPause();
        /* play_button.src = play_button_img;
        start_dbserve_child.innerText = "観測を再開する"; */
    }
})
function update_gauge(progress){
    gauge_mask.style.height = `${100-progress}%`;
    gauge_star.style.top = `${100-progress}%`;
}
import back_star_img from "./imgs/star.png";
const back_star_count = 40;
const filter_list = [
    "hue-rotate(270deg) saturate(7)",
    "hue-rotate(90deg) saturate(4)",
    "hue-rotate(330deg) saturate(3)",
    "hue-rotate(155deg) saturate(13)",
    "hue-rotate(38deg) saturate(3)",
    "hue-rotate(158deg) saturate(19)"
]
for(let i=0;i<back_star_count;i++){
    const img = document.createElement('img');
    img.classList.add("back_star");
    img.src = back_star_img;
    img.style.top = Math.max(2, Math.min(90,Math.random()** 1.5 * 100 ))+ '%';
    img.style.left = Math.max(20, Math.min(80,Math.random() * 100 )) + '%';
    img.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 360}deg) scale(${0.8 + Math.random()})`;
    img.style.filter = filter_list[Math.floor(Math.random()*filter_list.length)];
    observe_gauge_ele.appendChild(img);
}

const back_telescope_button = document.getElementById("back_telescope");
for(let i=0;i<12;i++){
    const img = document.createElement('img');
    img.src = back_star_img;
    img.style.top = Math.random() * 100 + '%';
    img.style.left = Math.random() * 100  + '%';
    img.style.transform = ` rotate(${Math.random() * 360}deg) scale(${0.8 + Math.random()})`;
    img.style.filter = filter_list[Math.floor(Math.random()*filter_list.length)];
    back_telescope_button.appendChild(img);
}


const backTanzakus = document.getElementsByClassName("back_tanzaku");
const back_song_buttons = document.getElementsByClassName("back_song_button");
function update_back_tanzaku(){
    Array.from(backTanzakus).forEach(backTanzaku=>{
        //console.log(backTanzaku.parentElement.children[0]);
        const rect = backTanzaku.parentElement.children[0].getBoundingClientRect();
        backTanzaku.style.width = rect.width + "px";
        backTanzaku.style.height = rect.height + "px";
        backTanzaku.style.left = backTanzaku.parentElement.children[0].offsetLeft + "px";
        backTanzaku.style.top = backTanzaku.parentElement.children[0].offsetTop + "px";
    })
    Array.from(back_song_buttons).forEach(back_song_button=>{
        const rect = back_song_button.parentElement.children[0].getBoundingClientRect();
        back_song_button.style.width = rect.width + "px";
        back_song_button.style.height = rect.height + "px";
        back_song_button.style.left = back_song_button.parentElement.children[0].offsetLeft + "px";
        back_song_button.style.top = back_song_button.parentElement.children[0].offsetTop + "px";
    })
}
update_back_tanzaku();

//ボタンの背景
import star_img4 from "./imgs/star4.png"
import star_img5 from "./imgs/star5.png"
import star_img7 from "./imgs/star7.png"
import nagareboshi_img from "./imgs/nagareboshi.png"
import sasanoha_img from "./imgs/sasanoha.png"
import hanabi_img from "./imgs/hanabi.png"
import milkyway_img from "./imgs/milkyway.png"
let button_back_imgs = [
    star_img4,
    star_img5,
    nagareboshi_img,
    star_img7,
    sasanoha_img,
    hanabi_img
];
const operate_buttons = document.getElementsByClassName("operate_button");
const song_buttons = document.getElementsByClassName("song_button");
const back_song_button = document.getElementsByClassName("back_song_button");
Array.from(operate_buttons).concat(Array.from(song_buttons),Array.from(backTanzakus),Array.from(back_song_button)).forEach(button=>{
    for(let i=0;i<6;i++){
    const img = document.createElement('img');
    img.classList.add("back_star");
    img.src = button_back_imgs[Math.floor(Math.random()*button_back_imgs.length)];
    img.style.top = Math.max(2, Math.min(90,Math.random() * 100 ))+ '%';
    img.style.left = Math.max(20, Math.min(80,Math.random() * 100 )) + '%';
    img.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 360}deg) scale(${0.8 + Math.random()})`;
    img.style.filter = filter_list[Math.floor(Math.random()*filter_list.length)];
    button.appendChild(img);
    }
    const img = document.createElement('img');
    img.classList.add("back_milkyway");
    img.src = milkyway_img;
    img.style.top = Math.max(40, Math.min(80,Math.random() * 100 ))+ '%';
    img.style.left = Math.max(20, Math.min(90,Math.random() * 100 )) + '%';
    img.style.transform = `translate(-50%, -50%) scale(${1.5 + Math.random()})`;
    img.style.filter = filter_list[Math.floor(Math.random()*filter_list.length)];
    button.appendChild(img);
});

const Composers = [
    "加賀(ネギシャワーP)",
    "雨良 Amala",
    "99piano",
    "ど～ぱみん",
    "きさら",
    "海風太陽"
];



/* Array.from(backTanzakus).forEach(button=>{
    for(let i=0;i<6;i++){
    const img = document.createElement('img');
    img.classList.add("back_star");
    img.src = button_back_imgs[Math.floor(Math.random()*button_back_imgs.length)];
    img.style.top = Math.max(2, Math.min(90,Math.random() * 100 ))+ '%';
    img.style.left = Math.max(20, Math.min(80,Math.random() * 100 )) + '%';
    img.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 360}deg) scale(${0.8 + Math.random()})`;
    img.style.filter = filter_list[Math.floor(Math.random()*filter_list.length)];
    button.appendChild(img);
    }
}); */


const player = new Player({
    app: { 
        token: "DfQ7Ozb9tNOqKrHJ" 
        },
    valenceArousalEnabled :true,
    vocalAmplitudeEnabled :true
    });


//let rylic_ele = document.getElementById("rylic");




const galaxy_container_song_ele = document.getElementById("galaxy_container_song");
galaxy_container_song_ele.addEventListener("click",(e)=>{
    for(let i=0;i<6;i++){
        if(e.target === song_buttons[i]){
            console.log(i);
            load_music(i);
        }
    }
})

function load_music(num){
    // ストリートライト / 加賀(ネギシャワーP)
    if(num == 0){
    player.createFromSongUrl("https://piapro.jp/t/ULcJ/20250205120202", {
        video: {
        beatId: 4694275,
        chordId: 2830730,
        repetitiveSegmentId: 2946478,
        lyricId: 67810,
        lyricDiffId: 20654
        }
    });
    }else if(num == 1){
    //アリフレーション / 雨良 Amala
    player.createFromSongUrl("https://piapro.jp/t/SuQO/20250127235813", {
        video: {
         // 音楽地図訂正履歴
        beatId: 4694276,
        chordId: 2830731,
        repetitiveSegmentId: 2946479,
        
         // 歌詞URL: https://piapro.jp/t/GbYz
         // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FSuQO%2F20250127235813
        lyricId: 67811,
        lyricDiffId: 20655
        }
    });
    }else if(num==2){
        // インフォーマルダイブ / 99piano
        player.createFromSongUrl("https://piapro.jp/t/Ppc9/20241224135843", {
            video: {
            // 音楽地図訂正履歴
            beatId: 4694277,
            chordId: 2830732,
            repetitiveSegmentId: 2946480,
            
            // 歌詞URL: https://piapro.jp/t/77V2
            // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FPpc9%2F20241224135843
            lyricId: 67812,
            lyricDiffId: 20656
            },
        });
    }else if(num==3){
        // ハロー、フェルミ。 / ど～ぱみん
        player.createFromSongUrl("https://piapro.jp/t/oTaJ/20250204234235", {
            video: {
            // 音楽地図訂正履歴
            beatId: 4694278,
            chordId: 2830733,
            repetitiveSegmentId: 2946481,
            
            // 歌詞URL: https://piapro.jp/t/lbO1
            // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FoTaJ%2F20250204234235
            lyricId: 67813,
            lyricDiffId: 20657
            },
        });
    }else if(num==4){
        // パレードレコード / きさら
        player.createFromSongUrl("https://piapro.jp/t/GCgy/20250202202635", {
            video: {
            // 音楽地図訂正履歴
            beatId: 4694279,
            chordId: 2830734,
            repetitiveSegmentId: 2946482,
                        // 歌詞URL: https://piapro.jp/t/FJ5N
            // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FGCgy%2F20250202202635
            lyricId: 67814,
            lyricDiffId: 20658
            },
        });
    }else if(num==5){
        // ロンリーラン / 海風太陽
        player.createFromSongUrl("https://piapro.jp/t/CyPO/20250128183915", {
            video: {
            // 音楽地図訂正履歴
            beatId: 4694280,
            chordId: 2830735,
            repetitiveSegmentId: 2946483,
            
            // 歌詞URL: https://piapro.jp/t/jn89
            // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FCyPO%2F20250128183915
            lyricId: 67815,
            lyricDiffId: 20659
            },
        });
    }
    InPreparationSong = true;
    select_galaxy_ele.style.display = "none";
    loading.style.display = "block";
    loading.style.transform = "translateX(-50%) scale(0.2)";
    loading.style.top = "80%";
    loading.style.left = "90%";
    loading_txt.innerText = "移動中..."
    fit_loading_parent();
}
function fit_loading_parent(){
    const parent = document.getElementById("loading");
    const childs = Array.from(parent.children);
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    childs.forEach(child => {
        const rect = child.getBoundingClientRect();
        const parentRect = parent.getBoundingClientRect();

        const left = rect.left - parentRect.left;
        const top = rect.top - parentRect.top;
        const right = left + rect.width;
        const bottom = top + rect.height;

        minX = Math.min(minX, left);
        minY = Math.min(minY, top);
        maxX = Math.max(maxX, right);
        maxY = Math.max(maxY, bottom);
        
    });
    parent.style.width = (maxX - minX) + 'px';
    parent.style.height = (maxY - minY) + 'px';
}
fit_loading_parent();

let InPreparationSong;
let galaxy_img_scale = 1;
let last_pos = 0;
let last_nomal_pos = 0;
let updateCount = 0;
let finished_loop = false;
let medianVA;
let max_A = -Infinity;
let max_V = -Infinity;
let min_A = Infinity;
let min_V = Infinity;

//let rylic;
let current;
let prev;
let last_beat;
let change_duration_ms = 100;
let change_from;
let ignor_count;
let appear_last_word = false;

let beat_index = 0;
let isStopped = true;
let hasEverPlayed = false;
const except_pos = ["P","M"];
const back_list = ["!","！","?","？",")","）","」","'","、",","];
const front_list = ["(","（","「"];
const middle_list = ["’","'"];
const S_except = ["“", '"', "”"];;

let Max_Vo_A = -Infinity;
let min_VO_A = Infinity;

const loading_gray = document.getElementById("loading_gray");
const loading = document.getElementById("loading");
const loading_txt = document.getElementById("loading_txt");
let current_wishList;

let num_found_tanzaku;
const name_galaxy = document.getElementById("name_galaxy");
const finaly_tanzaku_num = document.getElementById("finaly_tanzaku_num");
player.addListener({
    onAppReady: (app) => {
        if (!app.managed) {
            console.log("準備完了");
            //load_music(5);//デバッグ用
            loading_gray.style.display = "none";
            loading.style.display = "none";
        }
    },
    onVideoReady:(video)=>{
        console.log("動画情報:", video);
        current = null;
        prev = null;
        last_beat = null;
        make_tanzaku_and_place();
        current_wishList = wishList;
        InPreparationSong = false;
        num_found_tanzaku = 0;
        found_tanzaku.innerText = num_found_tanzaku;
        
    },
    onPlay:()=>{
        console.log("play");
        isStopped = false;
        
        if(hasEverPlayed){
            play_button.src = stop_button_img;
            start_dbserve_child.innerText = "観測を中断する";
        }
    },
    onPause:()=>{
        
        console.log("pause");
        const isEnd = player.timer.position >= player.video.duration - 100;
        if (!isEnd) {
            play_button.src = play_button_img;
            start_dbserve_child.innerText = "観測を再開する";
        }else{
            start_dbserve_child.innerText = "観測完了！！！";
            start_observe_button.style.pointerEvents = "none";
            start_observe_button.style.opacity = 0.5;
            finaly_tanzaku_num.innerText = num_found_tanzaku;
            back_telescope.style.display = "block";
            all_wrapper.style.display = "block";
            update_back_tanzaku();
        }
        if(!hasEverPlayed){
            start_dbserve_child.innerText = "観測を開始する";
        }
    },
    onStop:()=>{
        console.log("stop");
        isStopped = true;
        hasEverPlayed = false;
        play_button.src = play_button_img;
        start_dbserve_child.innerText = "観測を開始する";
    },
    onTimerReady:()=>{
        console.log("楽曲準備完了")
        console.log(player);
        console.log(player.data.song);
        
        isStopped = true;
        hasEverPlayed = false;
        play_button.src = play_button_img;
        start_dbserve_child.innerText = "観測を開始する";
        //player.requestPlay();
        ignor_count = 0;
        let rylic = player.video.firstWord;
        while(rylic){
            let v = player.getValenceArousal(rylic.startTime).v;
            let a = player.getValenceArousal(rylic.startTime).a
            max_A = Math.max(max_A,a);
            min_A = Math.min(min_A,a);
            max_V = Math.max(max_V,v);
            min_V = Math.min(min_V,v);
            
            min_VO_A = Math.min(min_VO_A,player.getVocalAmplitude(rylic.startTime));
            Max_Vo_A = Math.max(Max_Vo_A,player.getVocalAmplitude(rylic.startTime));
            rylic =rylic.next;
        }
        //console.log(max_A,min_A,max_V,min_V);

        finished_loop = true;
        //player.timer.seek(96937);
        medianVA = player.getMedianValenceArousal();
        console.log(Max_Vo_A,min_VO_A);
        
    },
    onTimeUpdate : (pos) =>{
        let bv;
        updateCount++;
        //console.log("再生位置のアップデート:", pos, "ミリ秒");
        const duration = player.video.duration;
        //console.log(pos);
        if(!(pos > 500 && last_pos < 1000 && updateCount <= 5)){
            update_gauge(pos/duration*100);
            last_pos = pos;
        }
        
        //console.log(currentChar)
        const beat = player.findBeat(pos+50);
        if(beat != last_beat && updateCount > 5){
            //console.log(filter_list[beat_index%6]);
            //console.log(beat_index);
            gauge_star.style.filter = filter_list[beat_index%6];
            change_from = performance.now();
            beat_index++;
        }
        if(change_from !== undefined && performance.now() - change_from >= change_duration_ms){
            change_from = undefined;
            gauge_star.style.filter = "";
        }

        last_beat = beat;
        //console.log(beat);
        if(!appear_last_word){
            current = current||player.video.firstWord//player.video.findWord(pos+100);
        }else{
            current == undefined;
            //console.log("finished");
        }
        //console.log("upDate_time");
        
        
        // current が前回の歌詞と異なる場合に処理を行う
            
        
        //console.log(current.startTime);
            //console.log("loop");
            //console.log(loop_count);
        // 新しい文字が発声されようとしている
        //console.log(current.text);
        //console.log(current.startTime);
        //console.log(finished_loop);
        /* if(!finished_loop){
            ignor_count = 0;
        }    */while (current && current.startTime < pos + 100 && updateCount > 5) {
            if(!appear_last_word && prev !== current){
                if(current == player.video.lastWord){
                    appear_last_word = true;
                    //console.log("last word");
                }
                if (current && current.text) {
                    const va = player.getValenceArousal(current.startTime);
                    const v = va.v//Math.max(0,Math.min(1,va.v*1.2));
                    const a = va.a//Math.max(0,Math.min(1,va.a*1.2));
                    const normalizedA = (a - min_A) / (max_A - min_A);
                    const normalizedV = (v - min_V) / (max_V - min_V);
                    const VO_A = player.getVocalAmplitude(current.startTime);
                    const normalized_VO_A = (VO_A - min_VO_A) / (Max_Vo_A - min_V);
                    //console.log(normalizedV);
                    /* const v1 = (v + 1) / 2;
                    const a1 = (a + 1) / 2; */
                    
                    const minBV = -0.4;
                    const maxBV = 2.0;
                    //const mixed = -centeredV + centeredA;
                    bv = minBV + (1-normalizedA)*(maxBV-minBV)+0.2;
                    
                    const minbright = 0.5;
                    const maxbright = 2;
                    const bright = minbright + normalizedV*(maxbright-minbright);
                    
                    const min_size = 0.7;
                    const max_siza = 1.4
                    const size = min_size + normalized_VO_A*(max_siza-min_size);
                    //console.log(size);
                    //bv = minBV + (maxBV - minBV) * -1*centeredA;
                    //console.log(bv);
                    ///console.log(player.getVocalAmplitude(current.startTime));
                    finished_loop = false;
                    console.log(current);
                    //console.log(beat);
                    //console.log("チェック用");
                    let text = "";
                    
                    if(ignor_count>0){
                        //console.log("ignor", ignor_count, "現在のスキップ対象:", current.text);
                        ignor_count--;
                        if(current.next !== null){
                            //console.log("next is existing");
                            if(current.next.pos == "S" &&  front_list.some(front => current.next.text.includes(front))){
                                //console.log("front_S");
                                ignor_count += 1;
                            }
                        }
                    }else{
                        //console.log("not ignor");
                        if(current.next !== null){
                            //console.log("next is existing");
                            if(current.next.pos == "S" &&  front_list.some(front => current.next.text.includes(front))){
                                //console.log("front_S");
                                ignor_count = 1;
                            }
                        }
                        if(current?.next){
                            //console.log("exists next");
                            if(current?.next.pos == "S"){
                                if(current?.next.parent === current.parent && !front_list.some(front => current?.next.text.includes(front))){
                                    //console.log("現在の歌詞:",current.previous.text + current.text);
                                    if(middle_list.some(middle => current?.next.text.includes(middle))){
                                        ignor_count = 2;
                                        text = current.text + current?.next.text + current?.next?.next.text;
                                        //console.log("middle_S2");
                                    }else{
                                        ignor_count = 1;
                                        text = current.text + current?.next.text;
                                        //console.log("not_middle");
                                    }
                                }
                            }
                            if(current.next.pos == "N"){
                                //console.log("NNNN");
                                if(middle_list.some(middle => current.next.text.includes(middle))){
                                    ignor_count = 2;
                                    //console.log("middle_S1");
                                    text = current.text + current?.next.text + current?.next?.next.text;
                                    
                                }
                                if(current.pos == "N" && current.parent == current?.next.parent && current.language == current?.next.language){
                                    
                                    //console.log("NN");
                                    const first_beat = player.findBeat(current.startTime);
                                    const first_beat_idx = first_beat.index;
                                    
                                    let next_beat_idx = player.findBeat(current.next.startTime).index;
                                    let next = current.next.next;
                                    if(next_beat_idx-first_beat_idx<=first_beat.length){
                                        if(current.language == "en"){
                                            text = current.text+" "+current.next.text;
                                        }else{
                                            text = current.text + current?.next.text;
                                        }
                                        ignor_count = 1;
                                        let next2 = next;
                                        while(((next2.pos == "S" && back_list.some(back => next2.text.includes(back)))||except_pos.includes(next2.pos))&&next2.pos !== "N"){
                                            //console.log("next2");
                                            console.log(next2);
                                            if(except_pos.includes(next2.pos)){
                                                next_beat_idx = player.findBeat(next.startTime).index;
                                                if(next_beat_idx-first_beat_idx<=first_beat.length-1){
                                                    text += next2.text;
                                                    ignor_count += 1;
                                                    next2 = next2.next;
                                                }else{
                                                    break;
                                                }
                                            }else{
                                                text += next2.text;
                                                next2 = next2.next;
                                                ignor_count += 1;
                                            }
                                            //console.log("NNNS");
                                        }
                                        
                                    }else{
                                        text = current.text;
                                    }
                                    
                                    
                                    while(next.pos == "N" && current.parent == next.parent && current.language == next.language){
                                        next_beat_idx = player.findBeat(next.startTime).index;
                                        if(next_beat_idx-first_beat_idx<=Math.floor(first_beat.length/2)){
                                            if(current.language == "en"){
                                                text += " "+next.text;
                                            }else{
                                                text += next.text;
                                            }
                                            ignor_count += 1;
                                            next = next?.next;
                                            let next2 = next;
                                            while(((next2.pos == "S" && back_list.some(back => next2.text.includes(back)))||except_pos.includes(next2.pos))&&next2.pos !== "N"){
                                                //console.log("next2");
                                                console.log(next2);
                                                if(except_pos.includes(next2.pos)){
                                                    next_beat_idx = player.findBeat(next.startTime).index;
                                                    if(next_beat_idx-first_beat_idx<=Math.floor(first_beat.length/2)){
                                                        text += next2.text;
                                                        ignor_count += 1;
                                                        next2 = next2.next;
                                                    }else{
                                                        break;
                                                    }
                                                }else{
                                                    text += next2.text;
                                                    next2 = next2.next;
                                                    ignor_count += 1;
                                                }
                                                //console.log("NNNS");
                                            }
                                            if(next2 !== next){
                                                break;
                                            }
                                        }else{
                                            break;
                                        }
                                        
                                        
                                        //console.log("NNN");
                                        
                                    }
                                }
                            }
                            if(current.pos == "F" || (current.pos == "R" && current.language == "ja")){
                                const first_beat = player.findBeat(current.startTime);
                                const first_beat_idx = first_beat.index;
                                const next_beat_index = player.findBeat(current.next.startTime).index;
                                if(next_beat_index - first_beat_idx < Math.floor(first_beat.length/2)){
                                text = current.text + current.next.text;
                                let next = current.next;
                                ignor_count = 1;
                                if(next.next !== null && next !== null){
                                    while((except_pos.includes(next.next.pos) || (next.next.pos == "S" && back_list.some(back => next.text.includes(back)))) && next.parent == next.next.parent){
                                        text += next.next.text;
                                        next = next.next;
                                        ignor_count += 1;
                                        if(next.next !== null){
                                            break;
                                        }
                                    }
                                }
                            }
                            }
                        }
                        if(current.previous){
                            if(current.previous.pos == "S"){
                                if(current.previous.parent === current.parent && front_list.some(front => current.previous.text.includes(front))){
                                    //console.log("現在の歌詞:", current.text + current.previous.text);
                                    if(text == ""){
                                        text = current.previous.text + current.text;
                                    }else{
                                        text = current.previous.text + text;
                                    }
                                }
                            }
                        }
                        if(S_except.some(except => current.text.includes(except))){
                            //console.log("exception");
                            if(current?.next){
                                let next = current?.next;
                                let exceptcount = 0;
                                let tentative_text = "";
                                while(next.parent === current.parent && !S_except.some(except => next.text.includes(except))){
                                    //console.log("ネクスト：",next.text);
                                    exceptcount += 1;
                                    tentative_text += next.text;
                                    next = next?.next;
                                    if(next == null){
                                        break;
                                    }
                                }
                                if(S_except.some(except => next.text.includes(except))){
                                    ignor_count = exceptcount + 1;
                                    //console.log("double");
                                    text = current.text + tentative_text + next.text;
                                }
                            }
                        }
                        if(except_pos.includes(current.next.pos) && current.next){
                            //console.log("現在の歌詞:", current.text + current?.next.text);
                            if(text == ""){
                                text = current.text + current?.next.text;
                                let next = current?.next;
                                ignor_count += 1;
                                if(next !== null && next.next !== null){
                                if(next.next.pos == "S" && back_list.some(back => next?.next.text.includes(back))){
                                    text += next?.next.text;
                                    ignor_count += 1;
                                    //console.log("exception S");
                                }
                                while(except_pos.includes(next.next.pos)){
                                    text += next.next.text;
                                    next = next.next;
                                    ignor_count += 1;
                                    if(next.next.pos == "S" && back_list.some(back => next.next.text.includes(back))){
                                        text += next.next.text;
                                        ignor_count += 1;
                                        //console.log("exception*2 S");
                                        break;
                                    }
                                }
                            }
                            }
                            
                        }else if(!except_pos.includes(current.next.pos) && current){
                            //if(!(except_pos.includes(current.pos)) && (current.pos !== "S")){
                                //console.log("現在の歌詞:", current.text);
                                if(text == ""){
                                    //console.log("nomal");
                                    text = current.text;
                                    
                                }
                            //}
                            
                        }
                        
                    }
                    finished_loop = true;
                    //console.log("next ignor",ignor_count);
                    console.log("本来の歌詞:",current.text);
                    console.log("現在の歌詞:",text);
                    //rylic_ele.innerText += current.text;  // 現在の歌詞を即座に表示
                    if(text !== ""){
                        placeTextSprite(text,bv,bright,size*3/2);
                    }
                    //scene.add(text_obj);
                    //const dir = new THREE.Vector3();
                    //camera.getWorldDirection(dir);
                    //dir.multiplyScalar(40);
                    //const pos = get_lookat_pos();
                    //text_obj.position.copy(pos);
                    //placeTextSprite(current.text);
                }
            }
            prev = current;
            current = current.next;
        /* if(current.next){
            //console.log("existe next");
            prev = current;
            current = current?.next;
        }else{
            console.log("not existe next");
            current = undefined;
            prev = current;
        }
    } */
    }
}
}
)
function createTextSprite(text,RGB,bright,size) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d',{ alpha: true });
    
    // Canvas サイズ
    canvas.width = 512*text.length;
    canvas.height = 512;

    // 背景は透明
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //console.log(RGB);
    ctx.fillStyle = `rgb(${RGB.r*255},${RGB.g*255},${RGB.b*255})`;
    // スタイル設定
    ctx.font = '512px nikokaku';
    //ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // テキスト描画
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    // Canvas からテクスチャを作成
    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity:bright,
        alphaTest: 0.1,
    });
    const sprite = new THREE.Sprite(material);
    
    // スケール調整（大きさ）
    sprite.scale.set(size*text.length,size, 1); // 横:縦の比率をCanvasと合わせると綺麗

    return {sprite,radius:text.length*size};
}

function get_lookat_pos(dis = 40){
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    dir.multiplyScalar(dis);
    const pos = camera.position.clone().add(dir);
    return pos;
}

function sphericalToCartesian(radius, latitude, longitude) {
    // 緯度(latitude)・経度(longitude) はラジアンで
    const x = radius * Math.cos(latitude) * Math.cos(longitude);
    const y = radius * Math.sin(latitude);
    const z = radius * Math.cos(latitude) * Math.sin(longitude);
    return new THREE.Vector3(x, y, z);
}
const line_colors = [0x7dbbe6,0xd74443,0x4c59ab,0xe0e34c,0xe2e67d,0xeccbdc]
let existingSprites = [];
let starlines = [];
function placeTextSprite(text,bv,bright,size) {
    //console.log(bv);
    const color_rgb = bvToRgb(bv);
    const color = new THREE.Color();
    color.setRGB(color_rgb[0],color_rgb[1],color_rgb[2]);
    const {sprite ,radius} = createTextSprite(text,color,bright,size);
    
    let basePos = get_lookat_pos(40);
    const dir = new THREE.Vector3(0, 0, -1);
    dir.applyQuaternion(camera.quaternion);
    dir.normalize();

    const baseLat = Math.asin(dir.y)/Math.PI*180;
    const baseLng = Math.atan2(dir.z, dir.x)/Math.PI*180;
    let placed = false;
    
    let corrected_pos;
    //corrected_pos = basePos;
    for (let i = 0; i < 100; i++) {
        let safe = true;
        const angle = Math.random() * 2 * Math.PI;
        const r = 0.06 * i;
        const latOffset = Math.sin(angle) * r;
        const lngOffset = Math.cos(angle) * r;
            //const latOffset = Math.sign((Math.random()) - 0.5) * 0.06*i; // 調整可
            //const lngOffset = Math.sign((Math.random()) - 0.5) * 0.06*i;

            const lat = (baseLat + latOffset)*Math.PI/180;
            const lng = (baseLng + lngOffset)*Math.PI/180;
            
            corrected_pos = sphericalToCartesian(40,lat,lng);
            //corrected_pos = basePos.clone().add(offset);

        
        for (let other of existingSprites) {
            const minDist = radius + other.radius;
            //console.log(minDist);
            //console.log(corrected_pos.distanceTo(other.sprite.position));
            if (corrected_pos.distanceTo(other.sprite.position) < minDist/3) {
                console.log("近すぎ");
                safe = false;
                break;
            }
        }
        if (safe) {
            sprite.position.copy(corrected_pos);
            existingSprites.push({ sprite:sprite, radius:radius });
            scene.add(sprite);
            placed = true;
            console.log("succeed:",text)
            break;
        }
    }
    if (!placed) {
        sprite.position.copy(basePos);
        existingSprites.push({ sprite:sprite, radius:radius });
        scene.add(sprite);
        console.log("failed");
    }
    //短冊が近くにあったら処理
    const pos = sprite.position;
    triggerExplosion(pos);
    tanzaku_list.forEach(tanzaku=>{
        const dis = pos.distanceTo(tanzaku.mesh.position);
        //console.log(dis);
        if(radius>=dis){
            //scene.remove(tanzaku);
            if(!tanzaku.isAnimating){
                num_found_tanzaku++;
                get_tanzaku_animation(tanzaku.mesh,tanzaku.imgURL);
                tanzaku.isAnimating = true;
            }
        }
    })
    //ここで線を描画
    const len = existingSprites.length;
    if (len >= 2) {
        let linePositions = [];
        const pos1 = existingSprites[len - 2].sprite.position;
        const pos2 = existingSprites[len - 1].sprite.position;
        //console.log(pos1);
        //console.log(pos2);
        linePositions.push(pos1.x,pos1.y,pos1.z,pos2.x,pos2.y,pos2.z);
        const lineGeometry = new THREE.BufferGeometry();
        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        const line_color = line_colors[Math.floor(Math.random()*line_colors.length)]
        const lineMaterial = new THREE.LineBasicMaterial({
            color: line_color, 
            transparent: true, 
            depthWrite: false,  
            depthTest: true,   
            opacity:0.5,
        });
        lineMaterial.color.multiplyScalar(25);
        const lineMesh = new THREE.Line(lineGeometry, lineMaterial);
        scene.add(lineMesh);
        starlines.push(lineMesh);
    }
}
let particle_list = [];

const star_texture = textureLoader.load(back_star_img);
class ParticleExplosion  {
    constructor(position, scene, count = 10, lifetime = 2.0) {
        this.scene = scene;
        this.lifetime = lifetime;
        this.elapsed = 0;

        this.geometry = new THREE.BufferGeometry();
        this.positions = new Float32Array(count * 3);
        this.velocities = [];

        for (let i = 0; i < count; i++) {
            this.positions[i * 3] = position.x;
            this.positions[i * 3 + 1] = position.y;
            this.positions[i * 3 + 2] = position.z;
            
            const dir = new THREE.Vector3(
                (Math.random() - 0.5)*0.3,
                (Math.random() - 0.5)*0.3,
                (Math.random() - 0.5)*0.3
            );
            this.velocities.push(dir);
            }
        this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));

        this.material = new THREE.PointsMaterial({
            map:star_texture,
            size: 2,
            color: 0xffffaa,
            transparent: true,
            opacity: 10,
            depthWrite: false,
            alphaTest: 0.1
        });

        this.points = new THREE.Points(this.geometry, this.material);
        this.scene.add(this.points);
        particle_list.push(this.points);
    }
    update(delta) {
        this.elapsed += delta;
        for (let i = 0; i < this.velocities.length; i++) {
          this.positions[i * 3] += this.velocities[i].x;
          this.positions[i * 3 + 1] += this.velocities[i].y;
          this.positions[i * 3 + 2] += this.velocities[i].z;
        }
    
        this.material.opacity = Math.max(10 - this.elapsed / this.lifetime, 0);
        this.geometry.attributes.position.needsUpdate = true;
    }
    
    isDead() {
        return this.elapsed >= this.lifetime;
    }
    
    dispose() {
        this.scene.remove(this.points);
        this.geometry.dispose();
        this.material.dispose();
    }
}
const explosions = [];

function triggerExplosion(pos) {
    const explosion = new ParticleExplosion(pos, scene);
    explosions.push(explosion);
}
//triggerExplosion(new THREE.Vector3(0,0,0));

/* const text_obj = createTextSprite("a");
scene.add(text_obj);
text_obj.position.set(1,3,1); */
/* canvas.addEventListener("click",()=>{
    placeTextSprite("aaa")
}) */
import tanzaku_mi_img from "./imgs/tanzaku_mi.png";
import tanzaku_me_img from "./imgs/tanzaku_me.png";
import tanzaku_ri_img from "./imgs/tanzaku_ri.png";
import tanzaku_le_img from "./imgs/tanzaku_le.png";
import tanzaku_lu_img from "./imgs/tanzaku_lu.png";
import tanzaku_ka_img from "./imgs/tanzaku_ka.png";
const tanzaku_imgs = [
    tanzaku_mi_img,
    tanzaku_me_img,
    tanzaku_ri_img,
    tanzaku_le_img,
    tanzaku_lu_img,
    tanzaku_ka_img
];

function drawImageRotated(ctx, img, x, y, options = {}) {
    const {
        rotation = 0, 
        scale = 1.0,    
        opacity = 1.0, 
        width = img.width,
        height = img.height,
        filter = null 
    } = options;

    ctx.save(); // 現在の状態を保存
    ctx.globalAlpha = opacity; 
    if (filter) {
        ctx.filter = filter; 
    }

    ctx.translate(x, y);     
    ctx.rotate(rotation); 
    ctx.scale(scale, scale); 
    ctx.drawImage(img, -width/2, -height/2, width, height);

    ctx.restore(); // 状態を元に戻す
}
const tanzaku_back_ims = button_back_imgs.concat([milkyway_img]);
let tanzaku_list = [];
function make_tanzaku_and_place(dis=40,quantity_per_one = 5){
    tanzaku_list = [];
    tanzaku_imgs.forEach(tanzaku => {
        const img = new Image();
        img.src = tanzaku;
        img.onload = async  () => { // 読み込みが終わったらこの中が実行される
            for (let i = 0; i < quantity_per_one; i++) {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.height;
                canvas.height = img.width;
                ctx.save();
                ctx.translate(canvas.width/2,canvas.height/2);
                ctx.rotate(90* Math.PI / 180);
                ctx.drawImage(img, -img.width / 2, -img.height / 2);
                ctx.restore();
                const promises = [];

                for (let k = 0; k < 5; k++) { 
                    const img_src = tanzaku_back_ims[Math.floor(Math.random() * tanzaku_back_ims.length)];
                    
                    const p = new Promise((resolve) => {
                        const back_img = new Image();
                        back_img.src = img_src;
                        back_img.onload = () => {
                            resolve(back_img); // 読み込み完了したら渡す
                        };
                    });

                    promises.push(p);
                }

                const loaded_images = await Promise.all(promises); // 全部ロード完了を待つ

                    loaded_images.forEach((back_img) => {
                    
                        const x = Math.random() * ctx.canvas.width;
                        const y = Math.max(Math.random(),0.3) * ctx.canvas.height;
                        console.log(x,y);
                        drawImageRotated(ctx,back_img,
                            x,y,
                            {
                                rotation: Math.random() * Math.PI * 2,
                                scale: 0.5 + Math.random() * 1.0,
                                opacity: 0.4 + Math.random() * 0.5,
                                filter: 'blur(6px)'
                            }
                        );
                    
                })
                const dataUrl = canvas.toDataURL();
                const texture = new THREE.CanvasTexture(canvas);
                
                const material = new THREE.MeshBasicMaterial({
                    map: texture,
                    transparent: true,
                    opacity:0.4,
                    alphaTest: 0.1,
                    side: THREE.DoubleSide, 
                });
                const geometry = new THREE.PlaneGeometry(0.4, 2.0);
                const tanzaku_mesh = new THREE.Mesh(geometry, material);
                //tanzaku_mesh.position.set(Math.random()*10-5,2,Math.random()*10-5);
                const theta = Math.random()*Math.PI*2;//短冊の緯度
                const phi = Math.asin(2 * Math.random() - 1);//短冊の経度//直接高さの角度を決めると偏るのでasinで逆算
                const x = dis* Math.cos(phi) * Math.cos(theta);
                const y = dis* Math.sin(phi);
                const z = dis* Math.cos(phi) * Math.sin(theta);
                tanzaku_mesh.position.set(x,y,z);
                tanzaku_mesh.lookAt(0, 0, 0);
                scene.add(tanzaku_mesh);
                tanzaku_list.push({mesh:tanzaku_mesh,isAnimating:false,imgURL:dataUrl});
            }
        }
    });
}
const wishList = [
    "受験に合格しますように",
    "友達と仲良くなりたいです",
    "全国大会に出場できますように",
    "遠足の日に晴れてくれますように",
    "単位が全部取れますように",
    "免許が一発で取れますように",
    "バイト先が見つかりますように",
    "就活がうまくいきますように",
    "仕事がうまくいきますように",
    "健康で楽しい毎日を送れますように",//10
    "小さな幸せに気づけますように",
    "親と仲直りできますように",
    "後悔のない高校生活が送れますように",
    "夢をあきらめずに頑張れますように",
    "新しい挑戦に成功しますように",
    "一度でいいから空を飛んでみたい",
    "友達のことをもっと知れますように",
    "お金と時間に余裕が持てますように",
    "宝くじが当たりますように",
    "自分のペースを大切にできますように",//20
    "ストレスを上手に発散できますように",
    "好きな人に想いが届きますように",
    "好きなバンドのライブに行けますように",
    "できるだけ多く皆の願いが届きますように",
    "ずっと若々しくいられますように",
    "友達とずっと仲良くいられますように",
    "朝早く起きられる体になりますように",
    "一人暮らしをしてみたいなぁ",
    "無事に定時で帰れますように",
    "休日出勤がなくなりますように",//30
    "希望通りの研究室に行けますように",
    "プレゼンが成功しますように",
    "怪我無く一年を過ごせますように",
    "試験が神頼みになりませんように",
    "←この人の願いが叶いますように",
    "自分の気持ちに正直になれますように",
    "自分にもっと自信が持てますように",
    "突然IQが跳ね上がりますように",
    "先生が言ってることが理解できますように",
    "覚えた英単語をずっと覚えていられますように",//40
    "通勤が快適になりますように",
    "健康寿命がのびますように",
    "足腰が丈夫でいられますように",
    "何歳になっても好奇心を忘れませんように",
    "家族と仲良く暮らせますように",
    "バス停が家の目の前に移動してきますように",
    "いろんな人に好かれるようになりたい",
    "可愛くなりたい",
    "大金持ちになれますように",
    "カッコよくなれますように",//50
    "常に他人に優しくあれますように",
    "恥ずかしがらずに感謝を伝えられるようにれますように",
    "光軸がずれないレーザーカッターが欲しい",
    "ギターを弾けるようになれますように",
    "きれいな字を書けるようになれますように",
    "絵をうまく書けるようになれますように",
    "周りの人に心配されないようになれますように",
    "常に誇れるような人生でありますように",
    "好きな漫画の最新巻が早く読めますように",
    "尊敬されるような人になれますように",
    "自分の顔がお札に載りますように",
    "好きなことを通して世界中と繋がれますように"
]
const fonts = [
    "nikokaku",
    "Xim-Sans",
    "れいこ"
]
const found_tanzaku = document.getElementById("found_tanzaku");
function get_tanzaku_animation(tanzaku_mesh,imgURL){
    let tl = gsap.timeline();
    const twist_z = Math.random()*2*Math.PI;
    const twist_x = Math.random()*2*Math.PI;
    tl.to(tanzaku_mesh.position,{
        duration:0.5,
        y:"+=1"
    },0);
    tl.to(tanzaku_mesh.rotation,{
        duration:1,
        z: tanzaku_mesh.rotation.x + twist_x,
        y: tanzaku_mesh.rotation.y + Math.PI * 2,
        z: tanzaku_mesh.rotation.z + twist_z
    },0);
    tl.to(tanzaku_mesh.material,{
        duration:0.2,
        opacity:5,
    },0.8);
    tl.to(tanzaku_mesh.material,{
        duration:0.5,
        opacity:0,
        onComplete: () => {
            //scene.remove(tanzaku_mesh);
            const tanzaku_space = document.getElementById("tanzaku_space");
            const tanzaku_img_ele = document.createElement('img');
            tanzaku_img_ele.src = imgURL;
            
            const img_parent_ele = document.createElement('div');
            img_parent_ele.classList.add("slidedown");
            img_parent_ele.appendChild(tanzaku_img_ele);
            const tanzaku_txt = document.createElement('p');
            const wish_idx = Math.floor(Math.random()*current_wishList.length);
            const current_wish = current_wishList[wish_idx];
            current_wishList.splice(wish_idx,1);
            tanzaku_txt.innerText = current_wish;
            tanzaku_txt.style.fontFamily = fonts[Math.floor(Math.random()*fonts.length)];
            img_parent_ele.appendChild(tanzaku_txt);
            tanzaku_space.insertBefore(img_parent_ele,tanzaku_space.children[0]);
            found_tanzaku.innerText = num_found_tanzaku;
        }
    },1.0);
}
const back_telescope = document.getElementById("back_telescope");
const all_wrapper = document.getElementById("all_wrapper");
back_telescope.addEventListener("click",()=>{
    all_wrapper.style.display = "block";
    update_back_tanzaku();
})
const disagree_return_button = document.getElementById("disagree_return");
disagree_return_button.addEventListener("click",()=>{
    all_wrapper.style.display = "none";
})
const return_hide_ele = document.getElementById("return_hide");
const agree_return_button = document.getElementById("agree_return");
const take_picture_button = document.getElementById("take_picture");
const return_galaxy_button = document.getElementById("return_galaxy");
agree_return_button.addEventListener("click",()=>{
    back_telescope.style.display = "none";
    all_wrapper.style.display = "none";
    return_hide_ele.style.display = "block";
    return_hide_ele.classList.remove("opacity120");
    return_hide_ele.classList.add("opacity021");
    starDistance = 600;
    /* constellation_lines.forEach(element => {
        element.visible = true;
    }); */
    let tl = gsap.timeline();
    tl.to(camera,{
        duration:0.5,
        onComplete:()=>{
            telescope_filter_img.style.display = "none";
            tanzaku_space.style.display = "none";
            observe_gauge_ele.style.display = "none";
            start_observe_button.style.display = "none";
            camera.zoom = 1;
            camera.updateProjectionMatrix();
        }
    })
    tl.to(camera,{
        duration:0.5,
        onComplete:()=>{
            return_hide_ele.classList.remove("opacity021");
            return_hide_ele.classList.add("opacity120");
        }
    })
    tl.to(camera,{
        duration:0.5,
        onComplete:()=>{
            return_hide_ele.style.display = "none";
            at_main_content = false;
            inmusicGalaxy = true;
            take_picture_button.style.display = "block";
            return_galaxy_button.style.display = "block";
            update_back_tanzaku();
        }
    })
})

take_picture_button.addEventListener("click",()=>{
    save_record_ele.style.display = "block";
})
const save_record_ele = document.getElementById("save_record");
const save_return_button = document.getElementById("save_return");
save_return_button.addEventListener("click",()=>{
    save_record_ele.style.display = "none";
})
const run_save_button = document.getElementById("run_save");
const switch1_background = document.getElementById("switch1");
const switch2_tanzaku = document.getElementById("switch2");
run_save_button.addEventListener("click",()=>{
    if(!switch1_background.checked){
        star_points.visible = false;
    }
    if(!switch2_tanzaku.checked){
        tanzaku_list.forEach(tanzaku=>{
            tanzaku.mesh.visible = false;
        })
    }
    existingSprites.forEach(sprite=>{
        sprite.sprite.matrixAutoUpdate = false;
        sprite.sprite.updateMatrix();
    });
    get_6dir_img();
    existingSprites.forEach(sprite=>{
        sprite.sprite.matrixAutoUpdate = true;
        sprite.sprite.updateMatrix();
    });
    star_points.visible = true;
    tanzaku_list.forEach(tanzaku=>{
        tanzaku.mesh.visible = true;
    })
})
const realy_return_ele = document.getElementById("realy_return");
const agree_return_galaxy_button = document.getElementById("agree_return_galaxy");
const disagree_return_galaxy_button = document.getElementById("disagree_return_galaxy");
return_galaxy_button.addEventListener("click",()=>{
    realy_return_ele.style.display = "block";
    
})
agree_return_galaxy_button.addEventListener("click",()=>{
    realy_return_ele.style.display = "none";
    take_picture_button.style.display = "none";
    return_galaxy_button.style.display = "none";
    return_hide_ele.style.display = "block";
    return_hide_ele.classList.remove("opacity120");
    return_hide_ele.classList.add("opacity021");
    let tl = gsap.timeline();
    tl.to(camera,{
        duration:0.5,
        onComplete:()=>{
            camera.zoom = 1;
            camera.updateProjectionMatrix();
        }
    })
    tl.to(camera,{
        duration:0.5,
        onComplete:()=>{
            return_hide_ele.classList.remove("opacity021");
            return_hide_ele.classList.add("opacity120");
            camera.position.set(0, 3, 0);
            yaw = -Math.PI / 2;   // 左右
            pitch = 0; // 上下
            camera.rotation.y = yaw;
            camera.rotation.x = pitch;
            existingSprites.forEach(sprite=>{
                sprite.sprite.visible = false;
                scene.remove(sprite.sprite);
            });
            existingSprites = [];
            tanzaku_list.forEach(tanzaku=>{
                tanzaku.mesh.visible = false;
                scene.remove(tanzaku.mesh);
            })
            tanzaku_list = [];
            telescope.visible = true;
            constellation_lines.forEach(element => {
                element.visible = true;
            });
            lineMesh.forEach(starline =>{
                starline.visible = false;
                scene.remove(starline);
            })
        }
    })
    tl.to(camera,{
        duration:0.5,
        onComplete:()=>{
            return_hide_ele.style.display = "none";
            at_main_content = false;
            inmusicGalaxy = true;
            take_picture_button.style.display = "block";
            return_galaxy_button.style.display = "block";
            show_time_and_location_ele.style.display = "block";
            change_constellation_name_button.style.display = "block";
            change_location_button.style.display = "block";
            change_time_button.style.display = "block";
            name_galaxy.innerText = "観測中の銀河：天の川銀河";
            
            inmusicGalaxy = false;
            update_back_tanzaku();
            
            
        }
    })
    
    
    
});
disagree_return_galaxy_button.addEventListener("click",()=>{
    realy_return_ele.style.display = "none";
});