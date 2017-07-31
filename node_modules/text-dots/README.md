# text-dots, A Dependency Free Loading Dots Utility
[ [text-dots on npm](https://www.npmjs.com/package/text-dots "npm") ] [ [text-dots on github](https://github.com/jpehman/text-dots) ]

The "text-dots" utility allows you to add loading dots (...) that appear at an set interval to any DOM element.

## Install

	npm install text-dots --save

## Usage

### HTML
	  <div class="blinder">
		<div class="loading-parent">
		  <span id="loadingText"></span>  
		</div>
	  </div>

### JavaScript
	  const textDots = require("text-dots");
	  // the number of dots is optional - the default is three (...)
	  const dots = textDots(5);

	  // call start when you want the ..... to begin appearing
	  // the third parameter is an optional interval in milliseconds, default is 500ms 
	  dots.start(document.getElementById("loadingText", "Loading", 800));  

	  // call stop when you want the ..... to stop
	  dots.stop();

### Config Object
Starting in 1.1.0, you can also use a configuration object as the second parameter on the initial call to `textDots()`, so that you won't need to explicitly call `start()`

	  // start method is called inside of the textDots function
	  const dots = textDots(7, {
		"element": document.getElementById("loadingText"),  
		"text": "Sleeping",
		"interval": 300
	  });

	  // call stop as usual
	  dots.stop();
	  

### CodePen Example

[https://codepen.io/anon/pen/WpyRvB](https://codepen.io/anon/pen/WpyRvB "https://codepen.io/anon/pen/WpyRvB")

# License

Published under the [MIT license](https://github.com/jpehman/text-dots/blob/master/LICENSE "MIT License").