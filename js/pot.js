$.Pot = function () {
    this.x = 0;
    this.y = 100;
};

$.Pot.prototype.render = function () {
    if ($.upgrade.hive === true) {
        $.ctx.drawImage($.potImage, 100, 0, 100, 100, this.x, this.y, 100, 100);
    } else {
        $.ctx.drawImage($.potImage, 0, 0, 100, 100, this.x, this.y, 100, 100);
    }
};