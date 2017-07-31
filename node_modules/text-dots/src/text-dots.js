/*
 *@summary JavaScript loading dots utility for the browser
 *@license {@link https://github.com/jpehman/text-dots/blob/master/LICENSE}
 *@author Jonathan Ehman
 *@typedef object
 *@example
 * const textDots = require("text-dots");
 * 
 * const dots = textDots(5);
 * @param {number} numberOfDots - optional - three dots is the default, 0 is pointless and will result in 3 dots
 * @param {object} configObj - optional - allows the dots to start without having to call the start method
 * {
 *   "element": {DOMElement} - required to run textDots without calling start
 *   "text": {string} - optional - defaults to an empty string
 *   "interval": {number} - optional - defaults to 500ms
 * }
 * dots.start(context, "Loading Text", interval);
 * @param {DOMElement} context - required on first run - Passing something other than an HTMLElement will throw a TypeError
 * @param {string} text - optional - dots will be displayed even without a proper string
 * @param {number} interval - optional - defaults to 500ms
 *
 * dots.stop();
 *
 */
var textDots = function (numberOfDots, configObj) {
    "use strict";

    if (typeof numberOfDots !== "undefined" && isNaN(numberOfDots)) {
        throw new TypeError("The numberOfDots must be a number");
    }

    numberOfDots = (typeof numberOfDots === "string" ? parseInt(numberOfDots, 10) : numberOfDots) || 3;

    var dotsInterval = null,
        element = typeof configObj === "object" ? configObj.element : null,
        dot = ".",
        nbsp = "&nbsp;",

    stop = function () {
        clearInterval(dotsInterval);
        dotsInterval = null;
    },

    set = function (text) {
        element.innerHTML = text;
    },

    start = function (context, text, interval) {
        if (typeof text !== "string" && typeof text !== "number") {
            text = "";
        }

        if (interval === null || isNaN(interval)) {
            interval = 500;
        } 

        if (context) {
            element = context;
        }

        if (!(element instanceof HTMLElement)) {
            throw new TypeError("The context passed in must be an HTMLElement");
        }

        stop();

        var mainText = text,
            counter = 0, 
            numDots = numberOfDots;
        
        while (numDots--) {
            mainText += nbsp;
        }

        dotsInterval = setInterval(function () {
            counter++;
            if (counter > numberOfDots) {
                counter = 0;
            }

            var newText = mainText;
            var i = counter;
            while (i--) {
                newText = newText.replace(nbsp, dot);
            }
            set(newText);
        }, interval);

        set(mainText);
    };

    if (element !== null) {
        start(element, configObj.text, configObj.interval || null);
    }

    return {
        "start": start,
        "stop": stop
    };
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = textDots;
}