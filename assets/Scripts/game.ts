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

    @property(cc.Node)
    gameReady: cc.Node;

    @property(cc.Node)
    gamePlay: cc.Node;

    @property(cc.Prefab)
    pre_itembg: cc.Prefab;

    @property(cc.Node)
    itemParent: cc.Node;

    @property(cc.Prefab)
    pre_item: cc.Prefab;

    @property(cc.Node)
    gameOver: cc.Node;
    @property(cc.Label)
    lab_type: cc.Label;

    @property(cc.Label)
    lab_score: cc.Label;

    @property(cc.Label)
    lab_bestScore:cc.Label;
    @property(cc.Label)
    lab_endScore: cc.Label;
    @property(cc.Label)
    lab_back: cc.Label;
    @property(cc.AudioClip)
    sound_move: cc.AudioClip;
    @property(cc.AudioClip)
    sound_getScore: cc.AudioClip;

    numItem: number; //行列块的个数
    interval: number; //行块间隔
    itemWH: number;   //行块大小
    itemParentWh: number;//背景的宽高
    array:any;
    gameType: number; //0：gameReady 1: gamePlay 2: gameEnd
    pos_start: cc.Vec2; 
    pos_end: cc.Vec2;
    itemPool: any;
    scoreNumber: number;
    userData: any;
    arrayGameType: any;
    // LIFE-CYCLE CALLBACKS:

    logArray() {
        for (let i = this.array.length - 1; i >= 0; i--) {
            console.debug(this.array[i]);
        }
    }
    onLoad () {
        this.gamePlay.active = false;
        this.gameReady.active = true;
        this.gameOver.active = false;
        this.numItem = 3;
        this.gameType = 0;
        this.itemPool = new cc.NodePool();
        this.setTouch();
    }

    init() {
        //cc.sys.localStorage.removeItem('userData');
        this.getUserInfo();
        this.arrayGameType = new Array();
        this.arrayGameType.push(this.userData.game_3);
        this.arrayGameType.push(this.userData.game_4);
        this.arrayGameType.push(this.userData.game_5);
        this.arrayGameType.push(this.userData.game_6);

        this.interval = 4;
        this.itemWH = Math.round(1000/this.numItem);
        this.itemParentWh = this.itemWH * this.numItem + this.interval * (this.numItem + 1);
        this.itemParent.height = this.itemParentWh;
        this.itemParent.width = this.itemParentWh;
        // this.scoreNumber = 0;
        // this.setScore(this.scoreNumber);
            // console.debug(this.arrayGameType[this.numItem - 3].score);
        this.lab_score.string = String(this.arrayGameType[this.numItem - 3].score);
        this.lab_bestScore.string = String(this.arrayGameType[this.numItem - 3].bestScore);
        this.lab_type.string = this.arrayGameType[this.numItem - 3].title;
        let len = this.arrayGameType[this.numItem - 3].arrayHistory.length - 1;
        if (len <= 0) {
            len = 0;
        }
        if (len > this.arrayGameType[this.numItem - 3].backNum) {
            len = this.arrayGameType[this.numItem - 3].backNum;
        }
        this.lab_back.string = "撤销 " + len;
        this.addItemBg();
        if (this.arrayGameType[this.numItem - 3].array.length== 0) {
            this.initArray();
            this.addRandomArray();
        } else {
            this.array = this.arrayGameType[this.numItem - 3].array;
            for (let i = 0; i < this.array.length; i++) {
                for (let j = 0; j < this.array[i].length; j++) {
                    if (this.array[i][j] > 0) {
                        this.createItme(cc.v2(i,j),this.array[i][j], false);
                    }
                }
            }
        }
    }

    initArray() {
        this.array = new Array();
        for (let i = 0; i < this.numItem; i++) {
            this.array[i] = new Array();
        }
        for (let i = 0; i < this.numItem; i++) {
            for (let j = 0; j < this.numItem; j++) {
                this.array[i][j] = 0;
            }
        }      
    }
    getUserInfo() {
        let val = decodeURIComponent(cc.sys.localStorage.getItem('userData'));
        
        if (val){
         this.userData = JSON.parse(val);
        } else {
            console.debug("null");
            this.userData = {
                game_3: {
                    title: '3x3',
                    score: 0,
                    bestScore:0,
                    array: [],
                    arrayHistory: [],
                    backNum: 3
                },
                game_4: {
                    title: '4x4',
                    score: 0,
                    bestScore: 0,
                    array: [],
                    arrayHistory: [],
                    backNum: 3
                },
                game_5: {
                    title: '5x5',
                    score: 0,
                    bestScore: 0,
                    array: [],
                    arrayHistory: [],
                    backNum: 3
                },
                game_6: {
                    title: '6x6',
                    score: 0,
                    bestScore: 0,
                    array: [],
                    arrayHistory: [],
                    backNum: 3
                }
            }
        }
        
    }

    saveUserInfo() {
        cc.sys.localStorage.setItem('userData',encodeURIComponent(JSON.stringify(this.userData)));
    }
    setScore(num) {
        this.arrayGameType[this.numItem - 3].score = this.arrayGameType[this.numItem - 3].score + num;
        this.lab_score.string = String(this.arrayGameType[this.numItem - 3].score);
        
        if (this.arrayGameType[this.numItem - 3].bestScore < this.arrayGameType[this.numItem - 3].score) {
            this.arrayGameType[this.numItem - 3].bestScore = this.arrayGameType[this.numItem - 3].score;
            this.lab_bestScore.string = String(this.arrayGameType[this.numItem - 3].bestScore);
        }
        this.saveUserInfo();
    }
    clickBtn(sender, str) {
        if (str == "home_play") {
            if (this.gameType == 2) return;
            this.gameType = 0;
            this.cleanAllItem();
            this.cleanAllItemBg();
            this.gamePlay.active = false;
            this.gameReady.active = true;
            this.gameOver.active = false;
        } else if (str == "home_over") {
            this.gameType = 0;
            this.cleanAllItem();
            this.cleanAllItemBg();
            this.gamePlay.active = false;
            this.gameReady.active = true;
            this.gameOver.active = false;
        } else if(str == "3" || str == "4" || str == "5" || str == "6"){
            this.gameType = 1;
            this.numItem = parseInt(str);
            this.gamePlay.active = true;
            this.gameReady.active = false;
            // this.lab_type.string = str + 'x' + str;
            this.init();
        } else if (str == "replay_play") {
            if (this.gameType == 2) return;
            this.arrayGameType[this.numItem - 3].score = 0;
            this.arrayGameType[this.numItem - 3].arrayHistory = [];
            this.lab_back.string = "撤销 0";
            this.arrayGameType[this.numItem - 3].backNum = 3;
            this.setScore(0);
            this.cleanAllItem();
            this.initArray();
            this.addRandomArray();
        } else if (str == "replay_over") {
            this.gameType = 1;
            this.arrayGameType[this.numItem - 3].score = 0;
            this.arrayGameType[this.numItem - 3].arrayHistory = [];
            this.lab_back.string = "撤销 0";
            this.arrayGameType[this.numItem - 3].backNum = 3;
            this.setScore(0);
            this.gameOver.active = false;
            this.cleanAllItem();
            this.initArray();
            this.addRandomArray();
        } else if (str == "back") {
            let len = 0;
            len = this.arrayGameType[this.numItem - 3].arrayHistory.length;
            if (len >= 2 && this.arrayGameType[this.numItem - 3].backNum > 0) {
                this.arrayGameType[this.numItem - 3].arrayHistory.pop();
                let str = this.arrayGameType[this.numItem - 3].arrayHistory[len - 2];
                let arr = str.split(',');
                let k = -1;
                this.cleanAllItem();
                for (let i = 0; i < this.array.length; i++) {
                    for (let j = 0; j < this.array[i].length; j++) {
                        k++;
                        this.array[i][j] = parseInt(arr[k]);
                        if (this.array[i][j] > 0) {
                            this.createItme(cc.v2(i,j),this.array[i][j],false);
                        }
                        
                    }
                }
                let arrLen = this.arrayGameType[this.numItem - 3].arrayHistory.length - 1;
                this.arrayGameType[this.numItem - 3].backNum--;
                  if (arrLen <= 0) {
                        arrLen = 0;
                    } 
                if (arrLen > this.arrayGameType[this.numItem - 3].backNum) {
                    arrLen = this.arrayGameType[this.numItem - 3].backNum;
                }
              
                this.lab_back.string = "撤销 " + arrLen;
                this.saveUserInfo();

            }
            

        }
        
        console.debug("点击了" + str);
    }

    setTouch() {
            this.node.on(cc.Node.EventType.TOUCH_START, (event)=>{
                if (this.gameType != 1) return;
                this.pos_start = event.getLocation();
            })

            this.node.on(cc.Node.EventType.TOUCH_END, (event)=>{
                if (this.gameType != 1) return;
                this.pos_end = event.getLocation();
                let xx = this.pos_end.x - this.pos_start.x;
                let yy = this.pos_end.y - this.pos_start.y;
                if (Math.abs(xx) < 50 && Math.abs(yy) < 50) return;

                if (Math.abs(xx) > Math.abs(yy)) {
                    if (xx > 0) {
                        this.moveItem('move_right')
                        console.debug("右移动");
                    } else {
                        this.moveItem('move_left')
                        console.debug("左移动");
                    }
                } else {
                    if (yy > 0) {
                        console.debug("上移动");
                        this.moveItem('move_up');
                        
                    } else {
                        this.moveItem('move_down');
                        console.debug("下移动");
                    }
                }

                //this.addRandomArray();
            })
    }

    moveItem(str: string) {
        let canMove: boolean = false;
        let isGetScore: boolean = false;
        switch(str){
            case 'move_up':
                {
                    for(let i = this.array.length - 2; i >=0; i--) {
                        for (let j = 0; j < this.array[i].length; j++) {
                            for (let k = 0; k < this.array.length - 1; k++) {
                                if (i+1+k < this.array.length && this.array[i+1+k][j] == 0 && this.array[i+k][j] > 0) {
                                    this.array[i+1+k][j] = this.array[i+k][j];
                                    this.array[i+k][j] = 0;
                                    canMove = true;
                                } else if (i+1+k < this.array.length && this.array[i+1+k][j] == this.array[i+k][j] && this.array[i+k][j] > 0) {
                                    this.array[i+1+k][j] = this.array[i+1+k][j] * -2;
                                    this.array[i+k][j] = 0;
                                    this.setScore(Math.abs(this.array[i+1+k][j]));
                                    isGetScore = true;
                                    canMove = true;
                                }
                            }

                            // if (i == 2) {
                            //     if (this.array[i+1][j] == 0) {
                            //         this.array[i+1][j] = this.array[i][j];
                            //         this.array[i][j] = 0;
                            //     } else if (this.array[i+1][j] == this.array[i][j] && this.array[i][j] > 0) {
                            //         this.array[i+1][j] = this.array[i][j] * -2;
                            //         this.array[i][j] = 0;
                            //     }
                            // }

                            // if (i == 1) {
                            //     if (this.array[i+1][j] == 0) {
                            //         this.array[i+1][j] = this.array[i][j];
                            //         this.array[i][j] = 0;
                            //     } else if (this.array[i+1][j] == this.array[i][j] && this.array[i][j] > 0) {
                            //         this.array[i+1][j] = this.array[i][j]* -2;
                            //         this.array[i][j] = 0;
                            //     } 
                                
                            //     if (this.array[i+2][j] == 0) {
                            //         this.array[i+2][j] = this.array[i+1][j];
                            //         this.array[i+1][j] = 0;
                            //     } else if (this.array[i+2][j] == this.array[i+1][j] && this.array[i+1][j] > 0){
                            //         this.array[i+2][j] = this.array[i+1][j]* -2;
                            //         this.array[i+1][j] = 0;
                            //     }
                            // }

                            // if (i == 0) {
                            //     if (this.array[i+1][j] == 0) {
                            //         this.array[i+1][j] = this.array[i][j];
                            //         this.array[i][j] = 0;
                            //     } else if (this.array[i+1][j] == this.array[i][j] && this.array[i][j] > 0) {
                            //         this.array[i+1][j] = this.array[i][j] * -2;
                            //         this.array[i][j] = 0;
                            //     }

                            //     if (this.array[i+2][j] == 0) {
                            //         this.array[i+2][j] = this.array[i+1][j];
                            //         this.array[i+1][j] = 0;
                            //     } else if (this.array[i+2][j] == this.array[i+1][j] && this.array[i+1][j] > 0) {
                            //         this.array[i+2][j] = this.array[i+1][j] * -2;
                            //         this.array[i+1][j] = 0;
                            //     }

                            //     if (this.array[i+3][j] == 0) {
                            //         this.array[i+3][j] = this.array[i+2][j];
                            //         this.array[i+2][j] = 0;
                            //     } else if (this.array[i+3][j] == this.array[i+2][j] && this.array[i+2][j] > 0) {
                            //         this.array[i+3][j] = this.array[i+2][j] * -2;
                            //         this.array[i+2][j] = 0;
                            //     }
                            // }
                        }
                    }
                }
                break;
            case 'move_down':
                {
                    for (let i = 1; i < this.array.length; i++) {
                        for (let j = 0; j < this.array[i].length; j++) {
                            for (let k = 0; k < this.array.length; k++) {
                                if (i-1-k >=0 && this.array[i-1-k][j] == 0 && this.array[i-k][j] > 0) {
                                    this.array[i-1-k][j] = this.array[i-k][j];
                                    this.array[i-k][j] = 0;
                                    canMove = true;
                                } else if (i-1-k >=0 && this.array[i-1-k][j] == this.array[i-k][j] && this.array[i-k][j] > 0) {
                                    this.array[i-1-k][j] = this.array[i-1-k][j] * -2;
                                    this.array[i-k][j] = 0;
                                    this.setScore(Math.abs(this.array[i-1-k][j]));
                                    canMove = true;
                                    isGetScore = true;
                                }
                            }
                        }
                    }
                }
                break;
            case 'move_left':
                {
                    for (let j = 1; j < this.array.length; j++) {
                        for (let i = 0; i < this.array[j].length; i++) {
                            for (let k = 0; k < this.array.length; k++) {
                                if (j-1-k >=0 && this.array[i][j-1-k] == 0 && this.array[i][j-k] > 0) {
                                    this.array[i][j-1-k] = this.array[i][j-k];
                                    this.array[i][j-k] = 0;
                                    canMove = true;
                                } else if (j-1-k >=0 && this.array[i][j-1-k] == this.array[i][j-k] && this.array[i][j-k] > 0) {
                                    this.array[i][j-1-k] = this.array[i][j-1-k] * -2;
                                    this.array[i][j-k] = 0;
                                    this.setScore(Math.abs(this.array[i][j-1-k]));
                                    canMove = true;
                                    isGetScore = true;
                                }
                            }
                        }
                    }
                }
                break;
            case 'move_right':
                {
                    for (let j = this.array.length - 2; j >=0; j--) {
                        for (let i = 0; i < this.array[j].length; i++) {
                            for (let k = 0; k < this.array.length; k++) {
                                if (j+1+k < this.array.length && this.array[i][j+1+k] == 0 && this.array[i][j+k] > 0) {
                                    this.array[i][j+1+k] = this.array[i][j+k];
                                    this.array[i][j+k] = 0;
                                    canMove = true;
                                }else if(j+1+k < this.array.length && this.array[i][j+1+k] == this.array[i][j+k] && this.array[i][j+k] > 0) {
                                    this.array[i][j+1+k] = this.array[i][j+1+k] * -2;
                                    this.array[i][j+k] = 0;
                                    this.setScore(Math.abs(this.array[i][j+1+k]));
                                    canMove = true;
                                    isGetScore = true;
                                }
                            }
                        }
                    }
                }
                break;
            default:
                break;
        }
        if (canMove){
            if (isGetScore) {
                cc.audioEngine.play(this.sound_getScore, false, 1);
            } else {
                cc.audioEngine.play(this.sound_move, false, 1);
            }
            for (let i = 0; i < this.array.length; i++) {
                for (let j = 0; j < this.array[i].length; j++) {
                    if (this.array[i][j] < 0) {
                        this.array[i][j] = Math.abs(this.array[i][j]);
                    }
                }
            }
            this.cleanAllItem();
            for (let i = 0; i < this.array.length; i++) {
                for (let j = 0; j < this.array[i].length; j++) {
                    if (this.array[i][j] > 0) {
                        this.createItme(cc.v2(i,j),this.array[i][j],false);
                    }
                }
            }
                this.addRandomArray();
        }
    }
    addRandomArray() {
        let  arr = [];
        for (let i = 0; i < this.array.length; i++) {
            for (let j = 0; j < this.array[i].length; j++) {
                if (this.array[i][j] == 0) {
                    arr.push(cc.v2(i, j));
                }
            }
        }
        if (arr.length != 0) {
            let random_index = Math.floor(Math.random() * arr.length);
            let ii = arr[random_index].x;
            let jj = arr[random_index].y;
            var randomVal = Math.random() * 10;
            if (randomVal < 2) {
                this.array[ii][jj] = 4;
            } else {
                this.array[ii][jj] = 2;
            }
            //this.addItem();:w
        
            this.createItme(cc.v2(ii,jj),this.array[ii][jj], true);
            this.isGameOver();
        }
        this.logArray();
    }

    isGameOver() {
        var isOver = true;
        for (let i = 0; i < this.array.length; i++) {
            for (let j = 0; j < this.array[i].length; j++) {
                if (this.array[i][j] == 0) {
                    isOver = false;
                }
            }
        }

        for (let i = 0; i < this.array.length; i++) {
            for (let j = 0; j < this.array[i].length; j++) {
                if (j+1 < this.array.length && this.array[i][j] == this.array[i][j+1]) {
                    isOver = false;
                } else if (i + 1 < this.array.length && this.array[i][j] == this.array[i+1][j]) {
                    isOver = false;
                }
            }
        }

        if (isOver) {
            this.gameType = 2;
            this.scoreNumber = this.arrayGameType[this.numItem - 3].score;
            this.scheduleOnce(()=>{
                this.lab_endScore.string = "您得到了" + String(this.scoreNumber) + '分';
                this.gameOver.active = true;
            },2)
            this.arrayGameType[this.numItem - 3].score = 0;
            this.arrayGameType[this.numItem - 3].array = [];
            this.arrayGameType[this.numItem - 3].arrayHistory = [];
            this.saveUserInfo();
            console.debug ("游戏结束");
        } else {
            this.arrayGameType[this.numItem - 3].arrayHistory.push(this.array.join());
            this.arrayGameType[this.numItem - 3].array = this.array;
            let len = this.arrayGameType[this.numItem - 3].arrayHistory.length - 1;
            if (len > 10) {
                this.arrayGameType[this.numItem - 3].arrayHistory.shift();
            }
            if (len > this.arrayGameType[this.numItem - 3].backNum) {
                len = this.arrayGameType[this.numItem - 3].backNum;
            }

            this.lab_back.string = "撤销 " + len;
            this.saveUserInfo();
        }


    }
    addItemBg() {
        let posStart = cc.v2(-this.itemParent.width/2+this.itemWH/2+this.interval,-this.itemParent.height/2+this.itemWH/2+this.interval);
        for (let i = 0; i < this.numItem; i++) {
            for (let j = 0; j < this.numItem; j++)
            {
                let node = cc.instantiate(this.pre_itembg);
                node.parent = this.itemParent;
                node.height = this.itemWH;
                node.width = this.itemWH;
                node.x = posStart.x + (node.width + this.interval) * j;
                node.y = posStart.y + (node.height + this.interval) * i;
            }
        }
    }

    addItem() {
        this.cleanAllItem();
        let posStart = cc.v2(-this.itemParent.width/2 + this.itemWH/2 + this.interval, -this.itemParent.height/2+this.itemWH/2+this.interval);
        for (let i = 0; i < this.array.length; i++) {
            for (let j = 0; j < this.array[i].length; j++) {
                if (this.array[i][j] != 0) {
                    let node = this.createItme();
                    if (node.getComponent('item')) {
                        node.getComponent('item').setNum(this.array[i][j]);
                    }
                    node.parent = this.itemParent;
                    node.height = this.itemWH;
                    node.width = this.itemWH;
                    node.x = posStart.x + (node.width + this.interval) * j;
                    node.y = posStart.y + (node.height + this.interval) * i;

                }
            }
        }
        console.debug("add itemParent 的子节点：" + this.itemParent.children.length);
    }

    createItme(pos, num, is_Random) {
        let posStart = cc.v2(-this.itemParent.width/2 + this.itemWH/2 + this.interval, -this.itemParent.height/2 + this.itemWH/2 + this.interval);
        let item = null;
        if (this.itemPool.size() > 0) {
            item = this.itemPool.get();
        } else {
            item = cc.instantiate(this.pre_item);
        } 
        if (item.getComponent('item')) {
            item.getComponent('item').init(num,this.numItem);
        }
        item.parent = this.itemParent;
        item.height = this.itemWH;
        item.width = this.itemWH;
        item.x = posStart.x + (item.width + this.interval) * pos.y;
        item.y = posStart.y + (item.width + this.interval) * pos.x;
        if (is_Random) {
            item.scale = 0;
            let act_1 = cc.scaleTo(0.15, 1);
            item.runAction(act_1);
        }

        console.debug("add itemParent 的子节点：" + this.itemParent.children.length);
    }

    onItemKilled(item) {
        this.itemPool.put(item);
    }
    cleanAllItem() {
        //this.itemParent.removeAllChildren(); 
        let children = this.itemParent.children;
        for (let i = children.length - 1; i >=0; i--) {
            let ts = children[i].getComponent('item');
            if (ts) {
                // console.debug("removechild");
                this.onItemKilled(children[i]);
            }
        }
        // console.debug("clean itemParent 的子节点：" + this.itemParent.children.length);
    }
    cleanAllItemBg() {
        let children = this.itemParent.children;
        for (let i = children.length - 1; i >= 0; i--) {
            let ts = children[i].getComponent('item');
            if (!ts) {
                this.itemParent.removeChild(children[i]);
            }
        }
        // console.debug("BgitemParent 的子节点：" + this.itemParent.children.length);
    }
}
