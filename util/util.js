/** HELPER FUNCTIONS */

function getFacing(velocity) {
    if (velocity.x === 0 && velocity.y === 0) return 4;
    let angle = Math.atan2(velocity.y, velocity.x) / Math.PI;

    if (-0.625 < angle && angle < -0.375) return 0;
    if (-0.375 < angle && angle < -0.125) return 1;
    if (-0.125 < angle && angle < 0.125) return 2;
    if (0.125 < angle && angle < 0.375) return 3;
    if (0.375 < angle && angle < 0.625) return 4;
    if (0.625 < angle && angle < 0.875) return 5;
    if (-0.875 > angle || angle > 0.875) return 6;
    if (-0.875 < angle && angle < -0.625) return 7;
};

//distance formula between two points (x, y)
function distance(A, B) {
    return Math.sqrt((B.x - A.x) * (B.x - A.x) + (B.y - A.y) * (B.y - A.y));
};

/** Easy access to math functions */
const {
    pow, ceil, floor, round, log, log2: lg, max, min, random, sqrt, abs,
    PI, E, sin, cos, tan, asin, acos, atan, atan2,
} = Math

/**
 * @param {Number} n
 * @returns Random Integer Between 0 and n-1
 */
const randomInt = n => Math.floor(random() * n);

/**
 * @param {Number} r Red Value
 * @param {Number} g Green Value
 * @param {Number} b Blue Value
 * @param {Number} a Alpha Value
 * @returns String that can be used as a rgba web color
 */
const rgba = (r, g, b, a) => `rgba(${r}, ${g}, ${b}, ${a})`;

/**
 * @param {Number} h Hue
 * @param {Number} s Saturation
 * @param {Number} l Lightness
 * @returns String that can be used as a hsl web color
 */
const hsl = (h, s, l) => `hsl(${h}, ${s}, ${l})`;

/** Creates an alias for requestAnimationFrame for backwards compatibility */
window.requestAnimFrame = (() => {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        /**
         * Compatibility for requesting animation frames in older browsers
         * @param {Function} callback Function
         * @param {DOM} element DOM ELEMENT
         */
        ((callback, element) => {
            window.setTimeout(callback, 1000 / 60);
        });
})();

/**
 * Returns distance from two points
 * @param {Number} p1, p2 Two objects with x and y coordinates
 * @returns Distance between the two points
 */
const getDistance = (p1, p2) => {
    return sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};


//source: https://stackoverflow.com/questions/45187291/how-to-change-the-color-of-an-image-in-a-html5-canvas-without-changing-its-patte

function imageToCanvas(image){
    const c = document.createElement("canvas");
    c.width = image.width;
    c.height = image.height;
    c.ctx = c.getContext("2d"); // attach context to the canvas for eaasy reference
    c.ctx.drawImage(image,0,0);
    return c;
}

function colorImage(image,color){ // image is a canvas image
    image.ctx.fillStyle = color;
    image.ctx.globalCompositeOperation = "color";
    image.ctx.fillRect(0,0,image.width,image.height);
    image.ctx.globalCompositeOperation = "source-over";
    return image;
}

function maskImage(dest,source){
    dest.ctx.globalCompositeOperation = "destination-in";
    dest.ctx.drawImage(source,0,0);
    dest.ctx.globalCompositeOperation = "source-over";
    return dest;
}

function isString(e) {
    var isString = e.constructor == String;
    return isString;
}

function getMaxStrLength(theText) {
    let maxLen = 0
    let totalLines = theText.length;
    if (theText instanceof Array) {
        for (let i = 0; i < totalLines; i++) {
            let line = new String(theText[i]);
            if (line.length > maxLen) maxLen = line.length;
        }
    } else if (isString(theText)) {
        maxLen = theText.length;
    }

    return maxLen;
}

function rand_10(min, max){
    return Math.round((Math.random()*(max-min)+min)/10)*10;
}

function rand_5(min, max){
    return Math.round((Math.random()*(max-min)+min)/10)*5;
}

/**
 * if drawing text on the right this will give the proper offset
 * so all the text is shown and not cut off by the canvas
*/
function getRightTextOffset(theText, fontSize) {
    return (theText.length) * (fontSize) + 10;
}

//function that converts a string of time into a formatted HH:MM:SS
String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
}

function buildButton(ctx, text, box, isSelected) {
    //border
    isSelected ? ctx.fillStyle = "DarkOrange" : ctx.fillStyle = "GhostWhite";
    ctx.fillRect(box.x + 2, box.y + 2, box.width, box.height);
    //box
    isSelected ? ctx.fillStyle = "DarkSlateBlue" : ctx.fillStyle = "BlueViolet";
    ctx.fillRect(box.x, box.y, box.width, box.height);

    //text
    ctx.fillStyle = "GhostWhite";
    ctx.font = '40px "Press Start 2P"';
    ctx.fillText(text, box.x, box.y);
}

function buildTextButton(ctx, text, box, isSelected, highlightColor) {
    //text

    ctx.font = '40px "Press Start 2P"';
    isSelected ? ctx.fillStyle = "GhostWhite" : ctx.fillStyle = "BlueViolet";
    ctx.fillText(text, box.x + 5, box.y + 5);
    isSelected ? ctx.fillStyle = highlightColor : ctx.fillStyle = "GhostWhite";
    ctx.fillText(text, box.x, box.y);
}

function isInt(value) {
    var x;
    return isNaN(value) ? !1 : (x = parseFloat(value), (0 | x) === x);
  }

  /**
   * Takes a json pair array and gets the key from value
   * @param {*} jsonObj 
   * @param {*} value 
   * @returns 
   */
function getJsonKeyFromValue(jsonObj, value) {
    let decodedKey = "undefined";
    for(var key in jsonObj) {
        if(jsonObj[key] == value) {
            decodedKey = key;
            break;
        }
    }
    return decodedKey;
}
