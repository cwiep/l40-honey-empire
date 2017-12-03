$.Pot = function () {
    this.x = 0;
    this.y = 100;
};

$.Pot.prototype.render = function () {
    $.ctx.drawImage($.potImage, 0, 0, 100, 100, this.x, this.y, 100, 100);
};