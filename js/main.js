window.requestAnimFrame = (function () {
  return window.requestAnimationFrame   ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame    ||
      window.oRequestAnimationFrame      ||
      window.msRequestAnimationFrame     ||
      function(/* function */ callback, /* DOMElement */ element){
        window.setTimeout(callback, 1000 / 60);
      };
})();

window.onload = function () {
    $.init();
};

$.init = function() {
    $.canvas = document.getElementById("canvas");
    $.ctx = $.canvas.getContext("2d");

    $.beeImage = new Image();
    $.beeImage.src = "res/bee.png";

    $.potImage = new Image();
    $.potImage.src = "res/pot.png";

    $.bgImage = new Image();
    $.bgImage.src = "res/bg.png";

    $.treeImage = new Image();
    $.treeImage.src = "res/tree.png";

    $.titleImage = new Image();
    $.titleImage.src = "res/title.png";

    $.smallFont = "10px sans-serif";
    $.normalFont = "16px sans-serif";
    $.plusFont = "bold 20px sans-serif";
    $.ctx.font = $.normalFont;

    // rules
    $.beeSpawnTime = 5000;
    $.maxAge = 10; // in seasons
    $.startHoney = 0;
    $.startMoney = 20;
    $.nextSeasonTime = 5000;
    $.seasons = ["Spring", "Summer", "Fall", "Winter"];

    // setting up the game
    $.reset();
    $.goToMenuState();
    $.lastTime = (new Date()).getTime();
    
    // let's go
    $.loop();
};

$.reset = function () {
    $.showFps = false;
    
    $.bees = [new $.Bee(200, 200)];
    $.bees.push(new $.Bee(300, 300));
    $.bees.push(new $.Bee(300, 300));
    $.bees.push(new $.Bee(300, 300));
    $.bees.push(new $.Bee(300, 300));

    $.pot = new $.Pot();

    $.beeSpawnTimer = $.beeSpawnTime;

    $.honey = $.startHoney;
    $.money = $.startMoney;

    $.season = 0;
    $.nextSeasonTimer = $.nextSeasonTime;

    $.events = [];
};

$.loop = function() {
    var t = (new Date()).getTime();
    var dt = t - $.lastTime;
    $.lastTime = t;
    $.update(dt);
    //$.handleInput();
    $.render(1000/dt);
    requestAnimFrame( $.loop );
};

$.update = function (dt) {
    if ($.gameState === "game") {
        if ($.bees.length == 0) {
            $.goToScoreState();
        }
        var curHappyChange = 0;
        var b;
        var checkDead = false;
        for (b = 0; b < $.bees.length; ++b) {
            $.bees[b].update(dt);
            if ($.bees[b].isDead()) {
                checkDead = true;
            }
            curHappyChange += $.bees[b].getHappiness();
        }
        if (checkDead === true) {
            var f = function (bee) {return !bee.isDead()};
            $.bees = $.bees.filter(f);
        }
        $.nextSeasonTimer -= dt;
        if ($.nextSeasonTimer <= 0) {
            $.nextSeason();
            for (b = 0; b < $.bees.length; ++b) {
                $.bees[b].age++;
            }
        }
    }
};

$.render = function(fps) {
    $.drawBackground();
    
    if($.gameState === 'menu') {
        $.ctx.drawImage($.titleImage, 0, 0, 400, 200, 280, 100, 400, 200);
    }
    
    if($.gameState === 'game') {
        var bgh = $.season == 3 ? 200 : 0;
        $.ctx.drawImage($.bgImage, 0, bgh, 960, 200, 0, $.canvas.height - 200, 960, 200);
        $.ctx.drawImage($.treeImage, 100 * $.season, 0, 100, 200, 500, 250, 100, 200);
        $.ctx.drawImage($.treeImage, 100 * $.season, 0, 100, 200, 450, 280, 100, 200);
        $.ctx.drawImage($.treeImage, 100 * $.season, 0, 100, 200, 560, 260, 100, 200);
        for (var b=0; b < $.bees.length; ++b) {
            $.bees[b].render();
        }
        $.pot.render();
        $.ctx.drawImage($.beeImage, 0, 0, 32, 32, 300, 4, 16, 16);
        $.drawText($.bees.length, 320, 20, '#333333', $.normalFont);
        $.drawText("Honey " + $.honey, 370, 20, '#333333', $.normalFont);
        $.drawText("$ " + $.money, 470, 20, '#333333', $.normalFont);
        document.getElementById("sellButton").value = "Sell x2 (+$" + $.getHoneyPrice() + ")";
        document.getElementById("sellButton").disabled = $.honey < 2;
        document.getElementById("sell2Button").value = "Sell x10 (+$" + ($.getHoneyPrice() * 10) + ")";
        document.getElementById("sell2Button").disabled = $.honey < 10;
        document.getElementById("buyBeeButton").value = "Buy Bee (-$" + $.getBeePrice() + ")";
        document.getElementById("buyBeeButton").disabled = $.money < $.getBeePrice();
    }
   
    if($.gameState === 'score') {
        $.drawText("Nice job, you collected $" + $.money, 350, 250, '#333333', $.normalFont);
    }
    
    if($.showFps) {
        $.drawText("FPS: " + fps.toFixed(1), 10, 20, '#333333');
    }
};

$.drawBackground = function () {
    $.ctx.fillStyle = "#bfe5ff";
    $.ctx.fillRect(0, 0, $.canvas.width, $.canvas.height);
};

$.drawText = function(text, x, y, col, font) {
    $.ctx.font = $.normalFont;
    if(font) {
        $.ctx.font = font;
    }
    $.ctx.fillStyle = col;
    $.ctx.fillText(text, x, y);
};

$.onPressPlay = function () {
    $.reset();
    $.goToGameState();
};

$.onPressSellHoney = function (amount) {
    $.honey -= amount;
    $.money += $.getHoneyPrice() * amount;
    for (var b=0; b < $.bees.length; ++b) {
        $.bees[b].happiness = $.utils.clamp($.bees[b].happiness - (amount / 2), 0, 10);
    }
};

$.onPressBuyBee = function () {
    $.money -= $.getBeePrice();
    $.bees.push(new $.Bee($.utils.rand(0, $.canvas.width), $.utils.rand(0, $.canvas.height)));
};

$.getHoneyPrice = function () {
    if ($.season == 0 || $.season == 2) {
        // spring, fall
        return 2;
    } else if ($.season == 3) {
        // winter
        return 5;
    }
    // summer
    return 1;
};

$.getBeePrice = function () {
    if ($.season == 0 || $.season == 2) {
        // spring, fall
        return 60;
    } else if ($.season == 3) {
        // winter
        return 100;
    }
    // summer
    return 40;
};

$.goToScoreState = function () {
    $.gameState = "score";
    document.getElementById("playButton").style.display = "block";
    $.setInterfaceVisible("none");
};

$.goToMenuState = function () {
    $.gameState = "menu";
    document.getElementById("playButton").style.display = "block";
    $.setInterfaceVisible("none");
};

$.goToGameState = function () {
    $.gameState = "game";
    document.getElementById("playButton").style.display = "none";
    $.setInterfaceVisible("block");
};

$.setInterfaceVisible = function (display) {
    document.getElementById("sellButton").style.display = display;
    document.getElementById("sell2Button").style.display = display;
    document.getElementById("buyBeeButton").style.display = display;
    document.getElementById("events").style.display = display;
};

$.nextSeason = function () {
    $.createEvent();
    $.nextSeasonTimer = $.nextSeasonTime;
    $.season = ($.season + 1) % 4;

    for (var b=0; b < $.bees.length; ++b) {
        if ($.season == 3) {
            // winter // TODO: only without bed
            $.bees[b].happiness = $.utils.clamp($.bees[b].happiness - 3, 0, 10);
        } else if ($.season == 1) {
            // summer
            $.bees[b].happiness = $.utils.clamp($.bees[b].happiness + 3, 0, 10);
        } else if ($.season == 0) {
            // spring
            $.bees[b].happiness = $.utils.clamp($.bees[b].happiness + 1, 0, 10);
        }
    }
};

$.createEvent = function () {
    var r = Math.floor(Math.random() * 8);
    var t = "";
    if (r == 0) {
        if ($.bees.length <= 1) {
            return;
        }
        // accident
        var i = Math.floor(Math.random() * $.bees.length);
        $.bees[i].state = "dying";
        t = $.seasons[$.season] + ": " + $.bees[i].name + " died due to an unfortunate accident.";
    } else if (r == 1) {
        // honey goes bad
        if ($.honey <= 5) {
            return;
        }
        t = $.seasons[$.season] + ": Some of your honey went bad.";
        $.honey = Math.max(0, $.honey - 2);
    } else if (r == 2) {
        // new bee born
        if ($.bees.length < 2) {
            return;
        }
        var b = new $.Bee(400, 300);
        $.bees.push(b);
        t = $.seasons[$.season] + ": " + b.name + " was born.";
    } else if (r == 3) {
        // happy times
        for (var b=0; b < $.bees.length; ++b) {
            $.bees[b].happiness = $.utils.clamp($.bees[b].happiness + 1, 0, 10);
        }
        t = $.seasons[$.season] + ": The bees are happy.";
    } else if (r == 4) {
        // bad day
        var b = Math.floor(Math.random() * $.bees.length);
        $.bees[b].happiness = $.utils.clamp($.bees[b].happiness - 3, 0, 10);
        t = $.seasons[$.season] + ": " + $.bees[b].name + " has a bad day.";
    } else if (r == 5) {
        // bad taxes
        var taxes = Math.floor(0.1 * $.money);
        $.money -= taxes;
        t = $.seasons[$.season] + ": The IRS collects 10% taxes ($" + taxes + ").";
    } else {
        return;
    }

    $.addEvent(t);

};

$.addEvent = function (event) {
    $.events.push(event);
    var toDelete = $.events.length - 5;
    for (var e = 0; e < toDelete; ++e) {
        $.events.shift();
    }

    document.getElementById("events").innerHTML = "";
    for (var e = 0; e < $.events.length; ++e) {
        document.getElementById("events").innerHTML += $.events[e] + "\<br\>";
    }
};

$.onPressCloseEvent = function () {
    document.getElementById("events").style.display = "none";
};