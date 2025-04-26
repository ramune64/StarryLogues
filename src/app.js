import { Player } from "textalive-app-api";
const player = new Player({
    app: { 
        token: "DfQ7Ozb9tNOqKrHJ" 
        },
    valenceArousalEnabled :true,
    vocalAmplitudeEnabled :true
    });

let rylic;
let prev;
let rylic_ele = document.getElementById("rylic");
let updateCount = 0;
player.addListener({
    onAppReady: (app) => {
        if (!app.managed) {
          // ストリートライト / 加賀(ネギシャワーP)
        player.createFromSongUrl("https://piapro.jp/t/ULcJ/20250205120202", {
            video: {
              // 音楽地図訂正履歴
            beatId: 4694275,
            chordId: 2830730,
            repetitiveSegmentId: 2946478,
              // 歌詞URL: https://piapro.jp/t/DPXV
              // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FULcJ%2F20250205120202
            lyricId: 67810,
            lyricDiffId: 20654
            },
        });
    }
},
    onVideoReady:(video)=>{
        console.log("動画情報:", video);
        rylic = null;
        prev = null;
    },
    onTimerReady:()=>{
        console.log(player);
        console.log(player.data.songMap);
        player.requestPlay();
    },
    onTimeUpdate: (pos) =>{
        
        //console.log(beat);
        let current = rylic || player.video.firstChar.parent;
        
        
        // current が前回の歌詞と異なる場合に処理を行う
            
        
        //console.log(current.startTime);
        while (current && current.startTime < pos + 100 && updateCount > 5) {
        // 新しい文字が発声されようとしている
        //console.log(current.text);
        //console.log(current.startTime);
            if (rylic !== current) {
                if (rylic && rylic.text) {
                    //console.log(rylic)
                    //console.log("前の歌詞:", rylic.text);
                    //rylic_ele.innerText += rylic.text;
                    
                }
                rylic = current;
            }
            if(prev !== current){
                if (current && current.text) {
                    console.log("現在の歌詞:", current.text);
                    rylic_ele.innerText += current.text;  // 現在の歌詞を即座に表示
                    /* const text_obj = createTextSprite(current.text);
                    scene.add(text_obj); */
                    /* const dir = new THREE.Vector3();
                    camera.getWorldDirection(dir);
                    dir.multiplyScalar(40); */
                    /* const pos = get_lookat_pos();
                    text_obj.position.copy(pos); */

                }
            }
        prev = current;
        current = current.next;
    }
    }
}
)


