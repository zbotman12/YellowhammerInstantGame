// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        pathLayer: {
            default: null,
            type: cc.TiledLayer,
        },

        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        var pointsArray = new Array();
        var count = 0;
        for(var j = 0; j < 12; j++)
        {
            for(var i = 0; i < 12; i++)
            {
                if(this.pathLayer.getTileGIDAt(i,j) != 0)
                {
                    cc.log("Tile at " + i + ", " + j);
                    pointsArray[count] = this.pathLayer.getPositionAt(i,j);
                    count += 1;
                }
            }
        }
        cc.log("pointsArray.length: " + pointsArray.length);
    },

    // update (dt) {},
});
