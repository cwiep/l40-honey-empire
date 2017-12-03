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

    $.normalFont = "bold 16px sans-serif";
    $.plusFont = "bold 20px sans-serif";
    $.ctx.font = $.normalFont;
    
    // rules
    $.beeSpawnTime = 5000;
    
    // setting up the game
    $.reset();
    $.goToMenuState();
    $.lastTime = (new Date()).getTime();
    
    // let's go
    $.loop();
};

$.reset = function () {
    $.showFps = true;
    
    $.bees = [new $.Bee(200, 200)];
    $.bees.push(new $.Bee(300, 300));
    $.bees.push(new $.Bee(300, 300));
    $.bees.push(new $.Bee(300, 300));
    $.bees.push(new $.Bee(300, 300));
    $.bees.push(new $.Bee(300, 300));
    
    $.beeSpawnTimer = $.beeSpawnTime;
    $.beeHappiness = 10000;
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
        $.beeSpawnTimer -= dt;
        if ($.beeSpawnTimer <= 0) {
            $.beeSpawnTimer = $.beeSpawnTime;
            $.bees.push(new $.Bee($.utils.rand(0, $.canvas.width), $.utils.rand(0, $.canvas.height)));
        }
        var curHappyChange = 0;
        for (var b = 0; b < $.bees.length; ++b) {
            $.bees[b].update();
            curHappyChange += $.bees[b].getHappiness();
        }
        // TODO:
        $.beeHappiness -= dt;
        if ($.beeHappiness <= 0) {
            $.goToScoreState();
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
        $.drawText("Bees " + $.bees.length, 100, 20, '#ffffff', $.normalFont);
        $.drawText(":D " + $.beeHappiness, 200, 20, '#ffffff', $.normalFont);
    } 
   
    if($.gameState === 'score') {
        $.drawText("Game Över, da wirtsch de Pabbi abba freun!", 100, 200, '#ffffff', $.normalFont);
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