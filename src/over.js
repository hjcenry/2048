/**
 * Created by Henry on 16/6/19.
 */
var OverLayer = cc.Layer.extend({
    ctor: function () {
        this._super();
        var overText = new cc.LabelTTF("Game Over", "", 50);
        overText.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        var back = new cc.MenuItemFont("再来一次", function () {
            cc.director.runScene(new cc.TransitionFade(1, new HelloWorldScene()));
        }, this);
        var menu = new cc.Menu(back);
        this.addChild(menu);
        return true;
    }
});

var OverScene = cc.Scene.extend({
    ctor: function () {
        this._super();
        var layer = new OverLayer();
        this.addChild(layer);
        return true;
    }
});