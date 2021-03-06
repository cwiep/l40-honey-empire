$.Bee = function (x, y, age) {
    this.x = x;
    this.y = y;
    this.xval = 0;
    this.yval = 0;
    this.happiness = 5;
    this.state = "working"; // toPot, inPot, striking, dying, dead
    this.workingTime = 7000;
    this.stateTimer = this.workingTime;
    this.maxAge = age
    this.age = 1;
    this.name = $.utils.createName();
};

$.Bee.prototype.update = function (dt) {
    if ($.upgrade.moreHoney === true) {
        this.workingTime = 5000;
    }
    if (this.state === "working") {
        this.working(dt);
    } else if (this.state === "toPot") {
        this.toPot();
    } else if (this.state === "inPot") {
        this.inPot(dt);
    } else if (this.state === "striking") {
        this.striking();
    } else if (this.state === "dying") {
        this.dying();
    }
};

$.Bee.prototype.working = function (dt) {
    this.xval += $.utils.rand(-1, 1);
    this.yval += $.utils.rand(-1, 1);
    this.xval = $.utils.clamp(this.xval, -3, 3);
    this.yval = $.utils.clamp(this.yval, -3, 3);
    this.x += this.xval;
    this.y += this.yval;

    this.x = $.utils.clamp(this.x, 100, $.canvas.width - 150);
    this.y = $.utils.clamp(this.y, 32, $.canvas.height - 150);

    this.stateTimer -= dt;
    if (this.stateTimer <= 0) {
        if (this.age > this.maxAge) {
            if (this.age > 3 * this.maxAge || $.utils.rand(1, 100) > 70) {
                $.addEvent(this.name + " died of old age.");
                this.state = "dying";
                return;
            }
        }
        this.state = "toPot";
    }

    if (this.happiness <= 0) {
        this.state = "striking";
        this.y = $.canvas.height - 132;
    }
};

$.Bee.prototype.toPot = function () {
    var dist = $.utils.distance(this.x, this.y, $.pot.x + 40, $.pot.y + 40);
    if (dist < 5) {
        this.stateTimer = 3000;
        this.state = "inPot";
        this.happiness = $.utils.clamp(this.happiness + 1, 0, 10);
        return;
    }
    if (Math.abs($.pot.x + 40 - this.x) < 5) {
        this.x = $.pot.x + 40;
    } else if ($.pot.x + 40 < this.x) {
        this.xval = -5;
        this.x += this.xval;
    } else {
        this.xval = 5;
        this.x += this.xval;
    }
    if (Math.abs($.pot.y + 40 - this.y) < 5) {
        this.y = $.pot.y + 40;
    } else if ($.pot.y + 40 < this.y) {
        this.yval = -5;
        this.y += this.yval;
    } else {
        this.yval = 5;
        this.y += this.yval;
    }
};

$.Bee.prototype.inPot = function (dt) {
    this.stateTimer -= dt;
    if (this.stateTimer <= 0) {
        $.honey += this.getHoneyProduction();
        this.stateTimer = this.workingTime;
        this.state = "working";
    }
};

$.Bee.prototype.striking = function () {
    if (this.happiness > 0) {
        this.state = "working";
    }
};

$.Bee.prototype.dying = function () {
    this.y += 10;
    if (this.y > $.canvas.height) {
        this.state = "dead";
    }
};

$.Bee.prototype.isDead = function () {
    return this.state === "dead";
};

$.Bee.prototype.render = function () {
    if (this.state === "striking") {
        $.ctx.drawImage($.beeImage, 32, 0, 32, 32, this.x, this.y, 32, 32);
    } else {
        if ($.upgrade.hats === true && $.season == 3) {
            $.ctx.drawImage($.beeImage, 64, 0, 32, 32, this.x, this.y, 32, 32);
        } else if ($.upgrade.coolBees === true) {
            $.ctx.drawImage($.beeImage, 96, 0, 32, 32, this.x, this.y, 32, 32);
        } else {
            $.ctx.drawImage($.beeImage, 0, 0, 32, 32, this.x, this.y, 32, 32);
        }
    }
    $.drawText(this.name, this.x, this.y + 42, "#000000", $.smallFont);
    //$.drawText(this.state, this.x, this.y + 42, "#ffffff", $.smallFont);
    $.drawText("H:" + this.happiness, this.x+10, this.y + 54, "#000000", $.smallFont);
    // $.drawText(this.age, this.x + 16, this.y + 54, "#ffffff", $.smallFont);
    //$.drawText(this.stateTimer, this.x, this.y + 48, "#ffffff", $.smallFont);
};

$.Bee.prototype.getHappiness = function () {
    return this.happiness;
};

$.Bee.prototype.getHoneyProduction = function () {
    var h = 1;
    if (this.happiness > 1) {
        ++h;
    }
    if ($.upgrade.moreHoney === true) {
        ++h;
    }
    if (this.age > this.maxAge / 2) {
        ++h;
    }
    if (this.happiness == 10) {
        h += 2;
    }
    return h;
};