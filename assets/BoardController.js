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

    RotateLeft () {
        var actionRot = cc.rotateBy(0.4, -90).easing(cc.easeBackInOut());
        var action = cc.sequence(actionRot,
        cc.scaleTo(0.05, 0.85),
        cc.scaleTo(0.08, 0.7),
        cc.scaleTo(0.12, 0.82),
        cc.scaleTo(0.09, 0.78),
        cc.scaleTo(0.1, 0.8));
        // execute the action
        this.node.runAction(action).repeat(1);
        //this.node.runAction(revertAction).repeat(1);

    },

    RotateRight () {
        var actionRot = cc.rotateBy(0.4, 90).easing(cc.easeBackInOut());
        var action = cc.sequence(actionRot,
            cc.scaleTo(0.05, 0.85),
            cc.scaleTo(0.08, 0.7),
            cc.scaleTo(0.12, 0.82),
            cc.scaleTo(0.09, 0.78),
            cc.scaleTo(0.1, 0.8));
        // execute the action
        this.node.runAction(action).repeat(1);
        //this.node.runAction(revertAction).repeat(1);

    },
});
