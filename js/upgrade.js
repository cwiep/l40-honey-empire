$.upgrade = {};

$.upgrade.init = function () {
    $.upgrade.hats = false;
    $.upgrade.hive = false;
    $.upgrade.moreHoney = false;
    $.upgrade.beePower = false;
    $.upgrade.coolBees = false;
    document.getElementById("hatsText").innerHTML = "$20";
    document.getElementById("hiveText").innerHTML = "$50";
    document.getElementById("beePowerText").innerHTML = "$100";
    document.getElementById("moreHoneyText").innerHTML = "$200";
    document.getElementById("coolBeesText").innerHTML = "$400";
};

$.upgrade.onPressHats = function () {
    $.money -= 20;
    $.upgrade.hats = true;
};

$.upgrade.onPressHive = function () {
    $.money -= 50;
    $.upgrade.hive = true;
};

$.upgrade.onPressBeePower = function () {
    $.money -= 100;
    $.upgrade.beePower = true;
};

$.upgrade.onPressMoreHoney = function () {
    $.money -= 200;
    $.upgrade.moreHoney = true;
};

$.upgrade.onPressCoolBees = function () {
    $.money -= 400;
    $.upgrade.coolBees = true;
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
        document.getElementById("hiveButton").disabled = money < 50;
    }
    if ($.upgrade.beePower) {
        document.getElementById("beePowerButton").disabled = true;
        document.getElementById("beePowerText").innerHTML = "bought";
    } else {
        document.getElementById("beePowerButton").disabled = money < 100;
    }
    if ($.upgrade.moreHoney) {
        document.getElementById("moreHoneyButton").disabled = true;
        document.getElementById("moreHoneyText").innerHTML = "bought";
    } else {
        document.getElementById("moreHoneyButton").disabled = money < 200;
    }
    if ($.upgrade.coolBees) {
        document.getElementById("coolBeesButton").disabled = true;
        document.getElementById("coolBeesText").innerHTML = "bought";
    } else {
        document.getElementById("coolBeesButton").disabled = money < 400;
    }
};

$.upgrade.setVisibility = function (display) {
    document.getElementById("hatsButton").style.display = display;
    document.getElementById("hiveButton").style.display = display;
    document.getElementById("beePowerButton").style.display = display;
    document.getElementById("moreHoneyButton").style.display = display;
    document.getElementById("coolBeesButton").style.display = display;
};