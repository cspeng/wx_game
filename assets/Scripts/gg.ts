// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';
    @property(cc.Label)
    numLabel: cc.Label;
    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        let timer = 5;
        this.numLabel.string = String(timer);
        this.schedule(()=>{
            timer--;
            this.numLabel.string = String(timer);
            if (timer == 0) {
                cc.director.loadScene("game");
            }
        },1)
     }

     clickBtn() {
        cc.director.loadScene("game");
     }
 

    // update (dt) {}
}
