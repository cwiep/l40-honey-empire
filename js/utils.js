$.utils = {};

$.utils.rand = function( min, max ) {
        return Math.random() * ( max - min ) + min;
};

$.utils.distance = function( p1x, p1y, p2x, p2y ) {
    return Math.sqrt(Math.pow(p1x - p2x, 2) + Math.pow(p1y - p2y, 2));
};

$.utils.clamp = function(val, min, max) {
  return Math.min(Math.max(val, min), max);
};

$.utils.names = ["Herbert", "Marshall", "Fritz", "Jake", "Hugo", "Sam", "Dave", "Andy", "Chris", "Sophie", "Kristen",
    "Hannah", "Maggie", "Ann", "Dora", "Fabienne", "Gertrude", "Emilia"];

$.utils.createName = function () {
    return $.utils.names[Math.floor(Math.random()*$.utils.names.length)];
};