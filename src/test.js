import * as THREE from "three";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
const width = window.innerWidth;
const height = window.innerHeight;

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#myCanvas'),
    antialias: true
});
renderer.setSize(width, height);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.autoClear = false;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 1000);
camera.position.z = 5;

// 光らせるオブジェクト
const geometry = new THREE.SphereGeometry(1, 32, 32);
const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// ライト（ブルームには関係しないが雰囲気的に追加）
const light = new THREE.PointLight(0xffffff, 1);
light.position.set(10, 10, 10);
scene.add(light);

// composerのセットアップ
const composer = new EffectComposer(renderer);
composer.renderToScreen = true;

const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 1.5, 0.4, 0.85);
composer.addPass(bloomPass);

// アニメーションループ
function animate() {
    requestAnimationFrame(animate);
    mesh.rotation.y += 0.01;
    composer.render();
}
animate();

window.downloadComposerOutput = function downloadComposerOutput() {
// WebGLRenderingContextを取得
const gl = renderer.getContext();

// 画像サイズを取得
const width = renderer.domElement.width;
const height = renderer.domElement.height;

// ピクセルデータを格納するための配列
const pixels = new Uint8Array(width * height * 4);  // RGBA

// レンダーターゲットを指定
const framebuffer = gl.createFramebuffer();
gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

// ピクセルデータを読み取る
composer.render();
gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

// 画像を描画するためのcanvas作成
const canvas = document.createElement('canvas');
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext('2d');

// imageData を作成して読み取ったピクセルデータを設定
const imageData = ctx.createImageData(width, height);
for (let i = 0; i < pixels.length; i++) {
    imageData.data[i] = pixels[i];
}
ctx.putImageData(imageData, 0, 0);

// 結果を画面に表示
document.body.appendChild(canvas);
};
