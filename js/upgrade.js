$.upgrade = {};

$.upgrade.init = function () {
    $.upgrade.hats = false;
    $.upgrade.hive = false;
    document.getElementById("hatsText").innerHTML = "$20";
    document.getElementById("hiveText").innerHTML = "$30";
};

$.upgrade.onPressHats = function () {
    $.money -= 20;
    $.upgrade.hats = true;
};

$.upgrade.onPressHive = function () {
    $.money -= 30;
    $.upgrade.hive = true;
};

$.upgrade.updateButtons = function (money) {
    if ($.upgrade.hats) {
        document.getElementById("hatsButton").disabled = true;
        document.getElementById("hatsText").innerHTML = "bought";
    } else {
        document.getElementById("hatsButton").disabled = money < 20;
    }
    if ($.upgrade.hive) {
        document.getElementById("hiveButton").disabled = true;
        document.getElementById("hiveText").innerHTML = "bought";
    } else {
        document.getElementById("hiveButton").disabled = money < 30;
    }
};

$.upgrade.setVisibility = function (display) {
    document.getElementById("hatsButton").style.display = display;
    document.getElementById("hiveButton").style.display = display;
};