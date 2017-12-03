$.utils = {};

$.utils.rand = function( min, max ) {
        return Math.random() * ( max - min ) + min;
};

$.utils.rectInRect = function( r1x, r1y, r1w, r1h, r2x, r2y, r2w, r2h ) {
        return !( r2x > r1x + r1w || 
        r2x + r2w < r1x || 
        r2y > r1y + r1h ||
        r2y + r2h < r1y );
};

$.utils.pointInRect = function( rx, ry, rw, rh, px, py ) {
        return (px > rx && px < rx+rw && py > ry && py < ry+rh);
};

$.utils.distance = function( p1x, p1y, p2x, p2y ) {
    return Math.sqrt(Math.pow(p1x - p2x, 2) + Math.pow(p1y - p2y, 2));
};

$.utils.renderFavicon = function() {
        var favicon = document.getElementById( 'favicon' ),
                favc = document.createElement( 'canvas' ),
                favctx = favc.getContext( '2d' ),
                faviconGrid = [
                        [  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,   ],
                        [  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,   ],
                        [  ,  ,  ,  ,  ,  ,  , 1, 1,  ,  ,  ,  ,  ,  ,   ],
                        [  ,  ,  ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ,   ],
                        [  ,  ,  ,  ,  , 1, 1, 1, 1, 1, 1,  ,  ,  ,  ,   ],
                        [  ,  ,  ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ,   ],
                        [  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1,  ,  ,  ,   ],
                        [  ,  ,  ,  ,  , 1, 1, 1, 1, 1, 1,  ,  ,  ,  ,   ],
                        [  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  ,  ,   ],
                        [  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1,  ,  ,  ,   ],
                        [  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  ,   ],
                        [  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  ,  ,   ],
                        [  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,   ],
                        [  ,  ,  ,  ,  ,  ,  , 1, 1,  ,  ,  ,  ,  ,  ,   ],
                        [  ,  ,  ,  ,  ,  ,  , 1, 1,  ,  ,  ,  ,  ,  ,   ],
                        [  ,  ,  ,  ,  ,  ,  , 1, 1,  ,  ,  ,  ,  ,  ,   ]
                ];
        favc.width = favc.height = 16;
        favctx.fillStyle = "white";
        favctx.fillRect(0,0,16,16);
        favctx.fillStyle = "green";
        favctx.beginPath();
        for( var y = 0; y < 16; y++ ) {
                for( var x = 0; x < 16; x++ ) {
                        if( faviconGrid[ y ][ x ] === 1 ) {
                                favctx.rect( x, y, 1, 1 );
                        }
                }
        }
        favctx.fill();
        favicon.href = favc.toDataURL();
};

$.utils.clamp = function(val, min, max) {
  return Math.min(Math.max(val, min), max);
};

$.utils.names = ["Herbert", "Marshall", "Fritz", "Jake", "Hugo", "Sam", "Dave", "Andy", "Chris", "Sophie", "Kristen",
    "Hannah", "Maggie", "Ann", "Dora", "Fabienne", "Gertrude", "Emilia"];

$.utils.createName = function () {
    return $.utils.names[$.utils.rand(0, $.utils.names.length)];
};