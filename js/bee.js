$.Bee = function (x, y) {
    this.x = x;
    this.y = y;
    this.xval = 0;
    this.yval = 0;
    this.happiness = 1;
    this.state = "working"; // toPot, inPot, striking
    this.stateTimer = 10000;
};

$.Bee.prototype.update = function (dt) {
    if (this.state === "working") {
        this.working(dt);
    } else if (this.state === "toPot") {
        this.toPot();
    } else if (this.state === "inPot") {
        this.inPot(dt);
    } else if (this.state === "striking") {
        this.striking();
    }
};

$.Bee.prototype.working = function (dt) {
    this.xval += $.utils.rand(-2, 2);
    this.yval += $.utils.rand(-2, 2);
    this.xval = $.utils.clamp(this.xval, -5, 5);
    this.yval = $.utils.clamp(this.yval, -5, 5);
    this.x += this.xval;
    this.y += this.yval;

    this.x = $.utils.clamp(this.x, 100, $.canvas.width - 32);
    this.y = $.utils.clamp(this.y, 0, $.canvas.height - 32);

    this.stateTimer -= dt;
    if (this.stateTimer <= 0) {
        this.state = "toPot";
    }

    if (this.happiness < 0) {
        this.state = "striking";
        this.y = $.canvas.height - 64;
    }
};

$.Bee.prototype.toPot = function () {
    var dist = $.utils.distance(this.x, this.y, $.pot.x+50, $.pot.y+50);
    if (dist > 5) {
        if ($.pot.x+50 < this.x) {
            this.xval = -5;
        } else {
            this.xval = 5;
        }
        if ($.pot.y+50 < this.y) {
            this.yval = -5;
        } else {
            this.yval = 5;
        }
        this.x += this.xval;
        this.y += this.yval;
    } else {
        this.stateTimer = 3000;
        this.state = "inPot";
    }
};

$.Bee.prototype.inPot = function (dt) {
    this.stateTimer -= dt;
    if (this.stateTimer <= 0) {
        $.honey += 1;
        this.stateTimer = 10000;
        this.state = "working";
    }
};

$.Bee.prototype.striking = function () {
    if (this.happiness > 0) {
        this.state = "working";
    }
};

$.Bee.prototype.render = function () {
    if (this.state === "striking") {
        $.ctx.drawImage($.beeImage, 32, 0, 32, 32, this.x, this.y, 32, 32);
    } else {
        $.ctx.drawImage($.beeImage, 0, 0, 32, 32, this.x, this.y, 32, 32);
    }
    $.drawText(this.state, this.x, this.y + 42, "#ffffff", $.smallFont);
    $.drawText(this.happiness, this.x, this.y + 54, "#ffffff", $.smallFont);
    // $.drawText(this.stateTimer, this.x, this.y + 48, "#ffffff", $.smallFont);
};

$.Bee.prototype.getHappiness = function () {
    return this.happiness;
};