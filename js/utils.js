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