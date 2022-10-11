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
    num_lab: cc.Label;
    //val: number;
    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        //this.val = 2;        
     }

     init(num,type) {
        //this.val = num;
        this.num_lab.string = String(num);
        this.setColor(num);
        this.setFontsize(type);

     }
     setFontsize(type) {
        switch(type){
            case 3:
                this.num_lab.fontSize = 70;
                break;
            case 4:
                this.num_lab.fontSize = 70;
                break;
            case 5:
                this.num_lab.fontSize = 70;
                break;
            case 6:
                this.num_lab.fontSize = 70;
                break;
            default:
                break;

        }

     }
     setColor(num) {
        switch(num) {
            case Math.pow(2,1):
                this.node.color = new cc.Color(238, 228, 218);
                break;
            case Math.pow(2,2):
                this.node.color = new cc.Color(237, 224, 200);
                break;
            case Math.pow(2,3):
                this.node.color = new cc.Color(242, 177, 121);
                break;
            case Math.pow(2,4):
                this.node.color = new cc.Color(245, 149, 99);
                break;
            case Math.pow(2,5):
                this.node.color = new cc.Color(246, 124, 95);
                break;
            case Math.pow(2,6):
                this.node.color = new cc.Color(246, 94, 59);
                break;
            case Math.pow(2,7):
                this.node.color = new cc.Color(237, 206, 115);
                break;
            case Math.pow(2,8):
                this.node.color = new cc.Color(236,201,97);
                break;
            case Math.pow(2,9):
                this.node.color = new cc.Color(236, 199, 80);
                break;
            case Math.pow(2,10):
                this.node.color = new cc.Color(239, 196, 65);
                break;
            case Math.pow(2,11):
                this.node.color = new cc.Color(255, 60, 46);
                break;
            case Math.pow(2,12):
                this.node.color = new cc.Color(255, 60, 61);
                break;
            case Math.pow(2,13):
                this.node.color = new cc.Color(255, 30, 32);
                break;
            default:
                this.node.color = new cc.Color();
                break;
        }
     }
    // start () {

    // }

    // update (dt) {}
}
