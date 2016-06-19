/**
 * Created by Henry on 16/6/15.
 */
// 保存方块长度方块
var tile = {
    width: 0,
    height: 0
};
var Tiled = cc.Node.extend({
    num: 0,
    col: 0,
    row: 0,
    ctor: function (num) {
        this._super();
        this.num = num;
        var count = 0;
        while (true) {
            count++;
            this.row = Math.floor(Math.random() * 4);
            this.col = Math.floor(Math.random() * 4);
            if (tiles[this.row][this.col] == null) {
                tiles[this.row][this.col] = this;
                break;
            }
            if (count >= 16) {// 格子满了
                return true;
            }
        }
        // 绘制背景
        var bg = new cc.DrawNode();
        bg.drawRect(cc.p(5, 5), cc.p(tile.width - 5, tile.height - 5), cc.color(255, 209, 145, 255), 1, cc.color(255, 209, 145, 255));
        this.addChild(bg);
        bg.setTag(2);
        // 绘制数字
        var labelNum = new cc.LabelTTF();
        labelNum.setString("" + this.num);
        labelNum.setFontSize(60);
        // 字体描边效果
        // labelNum.enableStroke(cc.color.BLACK, 0);
        this.addChild(labelNum);
        labelNum.setTag(1);
        // 设定字体和坐标
        labelNum.setPosition(tile.width / 2, tile.height / 2);
        // 移动块
        this.newTile(this.row, this.col);
        return true;
    },
    updateNum: function () {
        this.getChildByTag(1).setString("" + this.num);
        var bg = this.getChildByTag(2);
        switch (this.num) {
            case 2:
                bg.drawRect(cc.p(5, 5), cc.p(tile.width - 5, tile.height - 5), cc.color(235, 245, 223, 255), 1, cc.color(235, 245, 223, 255));
                break;
            case 4:
                bg.drawRect(cc.p(5, 5), cc.p(tile.width - 5, tile.height - 5), cc.color(186, 212, 170, 255), 1, cc.color(186, 212, 170, 255));
                break;
            case 8:
                bg.drawRect(cc.p(5, 5), cc.p(tile.width - 5, tile.height - 5), cc.color(212, 212, 170, 255), 1, cc.color(212, 212, 170, 255));
                break;
            case 16:
                bg.drawRect(cc.p(5, 5), cc.p(tile.width - 5, tile.height - 5), cc.color(193, 160, 117, 255), 1, cc.color(193, 160, 117, 255));
                break;
            case 32:
                bg.drawRect(cc.p(5, 5), cc.p(tile.width - 5, tile.height - 5), cc.color(124, 99, 84, 255), 1, cc.color(124, 99, 84, 255));
                break;
            case 64:
                bg.drawRect(cc.p(5, 5), cc.p(tile.width - 5, tile.height - 5), cc.color(218, 227, 224, 255), 1, cc.color(218, 227, 224, 255));
                break;
            case 128:
                bg.drawRect(cc.p(5, 5), cc.p(tile.width - 5, tile.height - 5), cc.color(64, 125, 148, 255), 1, cc.color(64, 125, 148, 255));
                break;
            case 256:
                bg.drawRect(cc.p(5, 5), cc.p(tile.width - 5, tile.height - 5), cc.color(123, 118, 135, 255), 1, cc.color(123, 118, 135, 255));
                break;
            case 512:
                bg.drawRect(cc.p(5, 5), cc.p(tile.width - 5, tile.height - 5), cc.color(172, 173, 172, 255), 1, cc.color(172, 173, 172, 255));
                break;
            case 1024:
                bg.drawRect(cc.p(5, 5), cc.p(tile.width - 5, tile.height - 5), cc.color(204, 196, 194, 255), 1, cc.color(204, 196, 194, 255));
                break;
            case 2048:
                bg.drawRect(cc.p(5, 5), cc.p(tile.width - 5, tile.height - 5), cc.color(199, 225, 240, 255), 1, cc.color(199, 225, 240, 255));
                break;
            case 4096:
                bg.drawRect(cc.p(5, 5), cc.p(tile.width - 5, tile.height - 5), cc.color(150, 196, 230, 255), 1, cc.color(150, 196, 230, 255));
                break;
            case 8192:
                bg.drawRect(cc.p(5, 5), cc.p(tile.width - 5, tile.height - 5), cc.color(25, 77, 91, 255), 1, cc.color(25, 77, 91, 255));
                break;
            case 16384:
                bg.drawRect(cc.p(5, 5), cc.p(tile.width - 5, tile.height - 5), cc.color(229, 96, 205, 255), 1, cc.color(229, 96, 205, 255));
                break;
            case 32768:
                bg.drawRect(cc.p(5, 5), cc.p(tile.width - 5, tile.height - 5), cc.color(250, 174, 78, 255), 1, cc.color(250, 174, 78, 255));
                break;
            case 65536:
                bg.drawRect(cc.p(5, 5), cc.p(tile.width - 5, tile.height - 5), cc.color(255, 241, 222, 255), 1, cc.color(255, 241, 222, 255));
                break;
            default:
                bg.drawRect(cc.p(5, 5), cc.p(tile.width - 5, tile.height - 5), cc.color(255, 209, 145, 255), 1, cc.color(255, 209, 145, 255));
                break;
        }
    },
    moveTo: function (row, col) {
        this.row = row;
        this.col = col;
        this.setPositionX((cc.winSize.width - tile.width * 4) / 2 + tile.width * this.col);
        this.setPositionY((cc.winSize.height - tile.height * 4) / 2 + tile.height * this.row);
    },
    newTile: function (row, col) {
        this.row = row;
        this.col = col;
        this.setPositionX((cc.winSize.width - tile.width * 4) / 2 + tile.width * this.col);
        this.setPositionY((cc.winSize.height - tile.height * 4) / 2 + tile.height * this.row);
    }
});