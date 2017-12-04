$.upgrade = {};

$.upgrade.init = function () {
    $.upgrade.hats = false;
};

$.upgrade.onPressHats = function () {
    $.money -= 20;
    $.upgrade.hats = true;
};

$.upgrade.onPressHive = function () {

};

$.upgrade.updateButtons = function (money) {
    if ($.upgrade.hats) {
        document.getElementById("hatsButton").disabled = true;
        document.getElementById("hatsText").innerHTML = "bought";
    } else {
        document.getElementById("hatsButton").disabled = money < 20;
    }
};

$.upgrade.setVisibility = function (display) {
    document.getElementById("hatsButton").style.display = display;
    // document.getElementById("hiveButton").style.display = display;
};