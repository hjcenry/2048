/**
 * Created by Henry on 16/6/7.
 */
var GameScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        this.addChild(new GameLayer());
        return true;
    }
});
var tiles = null;
var GameLayer = cc.Layer.extend({
    isMove: false,
    startX: 0,
    startY: 0,
    scoreDisplay: null,
    score: 0,
    ctor: function () {
        this._super();
        this.isMove = false;
        this.startX = 0;
        this.startY = 0;
        this.scoreDisplay = null;
        this.score = 0;
        //设置块的宽高
        if (cc.winSize.width < cc.winSize.height) {
            // 竖屏
            tile.width = cc.winSize.width / 5 - 20;
            tile.height = cc.winSize.width / 5 - 20;
        } else {
            // 横屏
            tile.width = cc.winSize.height / 5 - 20;
            tile.height = cc.winSize.height / 5 - 20;
        }
        // 初始化数组
        tiles = [
            [null, null, null, null],
            [null, null, null, null],
            [null, null, null, null],
            [null, null, null, null]
        ];
        return true;
    },
    onEnter: function () {
        this._super();
        // 绘制背景
        this.drawBg();
        // 绘制分数
        this.drawScore();
        // 绘制块
        var tile1 = new Tiled(2);
        var tile2 = new Tiled(2);
        this.addChild(tile1);
        this.addChild(tile2);
        //处理事件
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.touchbegan,
            onTouchMoved: this.touchmoved
        }, this);
        return true;
    },
    touchbegan: function (touch, event) {
        this.isMove = true;
        this.startX = touch.getLocationX();
        this.startY = touch.getLocationY();
        return true;
    },
    touchmoved: function (touch, event) {
        if (!this.isMove) {
            return;
        }
        var endX = touch.getLocation().x;
        var endY = touch.getLocation().y;
        if (Math.abs(endX - this.startX) > 20 ||
            Math.abs(endY - this.startY) > 20) {
            var dir = "";
            if (Math.abs(endX - this.startX) > Math.abs(endY - this.startY)) {//左右
                if (endX > this.startX) {
                    dir = "right";
                } else {
                    dir = "left";
                }
            } else {
                //上下
                if (endY > this.startY) {
                    dir = "up";
                } else {
                    dir = "down";
                }
            }
            this.isMove = false;
            event.getCurrentTarget().moveAllTiled(dir, event.getCurrentTarget());
        }
        return true;
    },
    moveAllTiled: function (dir, self) {
        var isMoved = false;
        switch (dir) {
            case "up":
                isMoved = this.moveUp(self);
                break;
            case "down":
                isMoved = this.moveDown(self);
                break;
            case "left":
                isMoved = this.moveLeft(self);
                break;
            case "right":
                isMoved = this.moveRight(self);
                break;
        }
        if (isMoved) {
            //每次移动产生一个新块
            this.newTiled();
            cc.audioEngine.playEffect("res/move.mp3");
        }
    },
    moveUp: function (self) {
        var isMoved = false;
        for (var col = 0; col < 4; col++) {
            for (var row = 3; row >= 0; row--) {
                if (tiles[row][col] != null) {// 有方块
                    // var endRow = row;
                    // var endCol = col;
                    for (var row1 = row; row1 < 3; row1++) {
                        if (tiles[row1 + 1][col] == null)//如果没有向上移动
                        {
                            tiles[row1 + 1][col] = tiles[row1][col];
                            tiles[row1][col] = null;
                            tiles[row1 + 1][col].moveTo(row1 + 1, col);
                            // endRow = row1 + 1;
                            // endCol = col;
                            isMoved = true;
                        } else if (tiles[row1 + 1][col].num == tiles[row1][col].num) {// 合并
                            tiles[row1 + 1][col].num = parseInt(tiles[row1][col].num) * 2;
                            self.addScore(tiles[row1 + 1][col].num * 10);
                            tiles[row1 + 1][col].updateNum();
                            tiles[row1][col].removeFromParent();
                            tiles[row1][col] = null;
                            isMoved = true;
                            break;
                        }
                    }
                    // if (isMoved) {
                    //     tiles[endRow][endCol].moveTo(endRow, endCol);
                    // }
                }
            }
        }
        return isMoved;
    },
    moveDown: function (self) {
        var isMoved = false;
        for (var col = 0; col < 4; col++) {
            for (var row = 0; row < 4; row++) {
                if (tiles[row][col] != null) {// 有方块
                    // var endRow = row;
                    // var endCol = col;
                    for (var row1 = row; row1 > 0; row1--) {
                        if (tiles[row1 - 1][col] == null)//如果没有向下移动
                        {
                            tiles[row1 - 1][col] = tiles[row1][col];
                            tiles[row1][col] = null;
                            // endRow = row1 - 1;
                            // endCol = col;
                            tiles[row1 - 1][col].moveTo(row1 - 1, col);
                            isMoved = true;
                        } else if (tiles[row1 - 1][col].num == tiles[row1][col].num) {// 合并
                            tiles[row1 - 1][col].num = parseInt(tiles[row1][col].num) * 2;
                            self.addScore(tiles[row1 - 1][col].num * 10);
                            tiles[row1 - 1][col].updateNum();
                            tiles[row1][col].removeFromParent();
                            tiles[row1][col] = null;
                            isMoved = true;
                            break;
                        }
                    }
                    // if (isMoved) {
                    //     tiles[endRow][endCol].moveTo(endRow, endCol);
                    // }
                }
            }
        }
        return isMoved;
    },
    moveLeft: function (self) {
        var isMoved = false;
        for (var row = 0; row < 4; row++) {
            for (var col = 0; col < 4; col++) {
                if (tiles[row][col] != null) {
                    // var endRow = row;
                    // var endCol = col;
                    for (var col1 = col; col1 > 0; col1--) {
                        if (tiles[row][col1 - 1] == null) {
                            tiles[row][col1 - 1] = tiles[row][col1];
                            tiles[row][col1] = null;
                            // endRow = row;
                            // endCol = col1 - 1;
                            tiles[row][col1 - 1].moveTo(row, col1 - 1);
                            isMoved = true;
                        } else if (tiles[row][col1 - 1].num == tiles[row][col1].num) {// 合并
                            tiles[row][col1 - 1].num = parseInt(tiles[row][col1].num) * 2;
                            self.addScore(tiles[row][col1 - 1].num * 10);
                            tiles[row][col1 - 1].updateNum();
                            tiles[row][col1].removeFromParent();
                            tiles[row][col1] = null;
                            isMoved = true;
                            break;
                        }
                    }
                    // if (isMoved) {
                    //     tiles[endRow][endCol].moveTo(endRow, endCol);
                    // }
                }
            }
        }
        return isMoved;
    },
    moveRight: function (self) {
        var isMoved = false;
        for (var row = 0; row < 4; row++) {
            for (var col = 3; col >= 0; col--) {
                if (tiles[row][col] != null) {
                    // var endRow = row;
                    // var endCol = col;
                    for (var col1 = col; col1 < 3; col1++) {
                        if (tiles[row][col1 + 1] == null) {
                            tiles[row][col1 + 1] = tiles[row][col1];
                            tiles[row][col1] = null;
                            // endRow = row;
                            // endCol = col1 + 1;
                            tiles[row][col1 + 1].moveTo(row, col1 + 1);
                            isMoved = true;
                        } else if (tiles[row][col1 + 1].num == tiles[row][col1].num) {// 合并
                            tiles[row][col1 + 1].num = parseInt(tiles[row][col1].num) * 2;
                            self.addScore(tiles[row][col1 + 1].num * 10);
                            tiles[row][col1 + 1].updateNum();
                            tiles[row][col1].removeFromParent();
                            tiles[row][col1] = null;
                            isMoved = true;
                            break;
                        }
                    }
                    // if (isMoved) {
                    //     tiles[endRow][endCol].moveTo(endRow, endCol);
                    // }
                }
            }
        }
        return isMoved;
    },
    newTiled: function () {
        this.setAnchorPoint(0.5,0.5);
        var tile = new Tiled(2);
        this.addChild(tile);
        // 判断游戏是否结束
        var isOver = true;
        // 判断是否有空余位置
        for (var row = 0; row < 4; row++) {
            for (var col = 0; col < 4; col++) {
                if (tiles[row][col] == null) {
                    isOver = false;
                }
            }
        }
        if (isOver) {
            // 判断四周是否有数字相同方块
            for (var row = 0; row < 4; row++) {
                for (var col = 0; col < 4; col++) {
                    if (row < 3 && tiles[row + 1][col].num == tiles[row][col].num) {
                        isOver = false;
                    }
                    if (row > 0 && tiles[row - 1][col].num == tiles[row][col].num) {
                        isOver = false;
                    }
                    if (col < 3 && tiles[row][col + 1].num == tiles[row][col].num) {
                        isOver = false;
                    }
                    if (col > 0 && tiles[row][col - 1].num == tiles[row][col].num) {
                        isOver = false;
                    }
                }
            }
        }
        if (isOver) {
            cc.director.runScene(new cc.TransitionFade(1, new OverScene()));
        }
    },
    drawBg: function () {
        //绘制背景
        var bgRect = new cc.DrawNode();
        bgRect.drawRect(cc.p(0, 0), cc.p(cc.winSize.width, cc.winSize.height), cc.color(173, 140, 61, 255), 1, cc.color(173, 140, 61, 255));
        this.addChild(bgRect);
        var bg = new cc.DrawNode();
        for (var n = 0; n < 5; n++) {
            bg.drawSegment(cc.p((cc.winSize.width - tile.width * 4) / 2, (cc.winSize.height - tile.height * 4) / 2 + n * tile.width), cc.p(cc.winSize.width / 2 + tile.width * 2, (cc.winSize.height - tile.height * 4) / 2 + n * tile.width), 5,
                cc.color(55, 62, 64, 255));
            bg.drawSegment(cc.p((cc.winSize.width - tile.width * 4) / 2 + n * tile.width, (cc.winSize.height - tile.height * 4) / 2), cc.p((cc.winSize.width - tile.width * 4) / 2 + n * tile.width, (cc.winSize.height - tile.height * 4) / 2 + tile.width * 4), 5,
                cc.color(55, 62, 64, 255));
        }
        this.addChild(bg);
    },
    addScore: function (score) {
        this.score += score;
        this.scoreDisplay.setString("SCORE:" + this.score);
        this.scoreDisplay.stopAllActions();
        this.scoreDisplay.runAction(cc.sequence(cc.scaleTo(0.05, 1.1), cc.scaleTo(0.05, 0.9), cc.scaleTo(0.05, 1)));
    },
    drawScore: function () {
        var minY = (cc.winSize.height - tile.height * 4) / 2 + tile.width * 4;
        var scoreRect = new cc.DrawNode();
        scoreRect.drawRect(cc.p((cc.winSize.width - tile.width * 4) / 2 + 4 * tile.width - 250, minY + 20), cc.p((cc.winSize.width - tile.width * 4) / 2 + 4 * tile.width, minY + 10 + 60), cc.color(193, 160, 117, 255), 5, cc.color(55, 62, 64, 255));
        this.addChild(scoreRect);
        this.scoreDisplay = new cc.LabelTTF("SCORE:" + this.score, "", 30);
        this.scoreDisplay.setAnchorPoint(0, 0.5);
        this.scoreDisplay.setPosition((cc.winSize.width - tile.width * 4) / 2 + 4 * tile.width - 250 + 10, minY + 25 + this.scoreDisplay.height / 2);
        this.scoreDisplay.setFontFillColor(cc.color.BLACK);
        this.addChild(this.scoreDisplay);
    }
});