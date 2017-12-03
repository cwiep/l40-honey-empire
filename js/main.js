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

    $.smallFont = "10px sans-serif";
    $.normalFont = "bold 16px sans-serif";
    $.plusFont = "bold 20px sans-serif";
    $.ctx.font = $.normalFont;

    // rules
    $.beeSpawnTime = 5000;
    $.maxAge = 20; // in seasons
    $.startHoney = 0;
    $.startMoney = 20;
    $.nextSeasonTime = 5000;
    $.seasons = ["Spring", "Summer", "Fall", "Winter"];

    // setting up the game
    $.reset();
    $.goToGameState();
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
            $.gameState = "score";
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
        $.drawText("This is a menu", 200, 150, '#ffffff', $.normalFont);
    }
    
    if($.gameState === 'game') {
        for (var b=0; b < $.bees.length; ++b) {
            $.bees[b].render();
        }
        $.pot.render();
        $.drawText("Bees " + $.bees.length, 200, 20, '#ffffff', $.normalFont);
        $.drawText("Honey " + $.honey, 300, 20, '#ffffff', $.normalFont);
        $.drawText("$ " + $.money, 400, 20, '#ffffff', $.normalFont);
        $.drawText($.seasons[$.season], 500, 20, '#ffffff', $.normalFont);
        document.getElementById("sellButton").value = "Sell Honey (+$" + $.getHoneyPrice() + ")";
        document.getElementById("sellButton").disabled = $.honey < 2;
        document.getElementById("buyBeeButton").value = "Buy Bee (-$" + $.getBeePrice() + ")";
        document.getElementById("buyBeeButton").disabled = $.money < $.getBeePrice();
    }
   
    if($.gameState === 'score') {
        $.drawText("Game Over, da wirtsch de Pabbi abba freun!", 100, 200, '#ffffff', $.normalFont);
    }
    
    if($.showFps) {
        $.drawText("FPS: " + fps.toFixed(1), 10, 20, '#ffffff');
    }
};

$.drawBackground = function () {
    $.ctx.fillStyle = "#1166FF";
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

$.onPressSellHoney = function () {
    $.honey -= 2;
    $.money += $.getHoneyPrice();
    for (var b=0; b < $.bees.length; ++b) {
        $.bees[b].happiness = $.utils.clamp($.bees[b].happiness - 1, 0, 10);
    }
};

$.onPressBuyBee = function () {
    $.money -= $.getBeePrice();
    $.bees.push(new $.Bee($.utils.rand(0, $.canvas.width), $.utils.rand(0, $.canvas.height)));
};

$.getHoneyPrice = function () {
    if ($.season == 0 || $.season == 2) {
        // spring, fall
        return 5;
    } else if ($.season == 3) {
        // winter
        return 10;
    }
    // summer
    return 2;
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
};

$.goToMenuState = function () {
    $.gameState = "menu";
    document.getElementById("playButton").style.display = "block";
};

$.goToGameState = function () {
    $.gameState = "game";
    document.getElementById("playButton").style.display = "none";
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
    var r = Math.floor(Math.random()*5);
    var t = "";
    if (r == 0) {
        if ($.bees.length <= 1) {
            return;
        }
        // accident
        var i = Math.floor(Math.random() * $.bees.length);
        $.bees[i].state = "dying";
        t = $.seasons[$.season] + ": " + $.bees[i].name + " died due to an unfortunate accident";
    } else if (r == 1) {
        if ($.honey <= 5) {
            return;
        }
        t = $.seasons[$.season] + ": Some of your honey went bad.";
        $.honey = Math.max(0, $.honey - 2);
    } else if (r == 2) {
        if ($.bees.length < 2) {
            return;
        }
        var b = new $.Bee(400, 300);
        $.bees.push(b);
        t = $.seasons[$.season] + ": " + b.name + " was born.";
    } else {
        return;
    }
    $.events.push(t);
    if ($.events.length > 5) {
        $.events.pop();
    }

    document.getElementById("events").innerHTML = "";
    for (var e = 0; e < $.events.length; ++e) {
        document.getElementById("events").innerHTML += $.events[e] + "\<br\>";
    }
};

$.onPressCloseEvent = function () {
    document.getElementById("events").style.display = "none";
};