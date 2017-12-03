$.Bee = function (x, y) {
    this.x = x;
    this.y = y;
    this.xval = 0;
    this.yval = 0;
    this.happiness = 1;
};

$.Bee.prototype.update = function () {
    this.xval += $.utils.rand(-5, 5);
    this.yval += $.utils.rand(-5, 5);
    this.xval = $.utils.clamp(this.xval, -10, 10);
    this.yval = $.utils.clamp(this.yval, -10, 10);
    this.x += this.xval;
    this.y += this.yval;
    
    this.x = $.utils.clamp(this.x, 0, $.canvas.width-32);
    this.y = $.utils.clamp(this.y, 0, $.canvas.height-32);
};

$.Bee.prototype.render = function () {
    $.ctx.drawImage($.beeImage, 0, 0, 32, 32, this.x, this.y, 32, 32);
}

$.Bee.prototype.getHappiness = function () {
    return this.happiness;
}