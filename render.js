(function() {
"use strict";
let width = 800,
    height = 600,
    lastX = width/2.0,
    canvas = document.querySelector('canvas'),
    container = document.querySelector('section'),
    context = canvas.getContext('2d'),
    form = document.createElement('form');

    form.innerHTML = ''+
      '<label for="generations">Branch Depth (1-11)</label>'+
      '<input id="generations" type="range" min="1" max="11" value="8" class="slider" required>';
       
container.appendChild(canvas);
container.appendChild(form);

const generations = document.querySelector('#generations');
generations.addEventListener('change', initialize, false);
canvas.addEventListener('mousemove', handleMovement, false);
canvas.addEventListener('touchmove', handleMovement, false);

const tree = new Pythagoras(context,	// the canvas drawing context
							112,		// length of starting side
						  	90.0,		// starting angle of trunk
						    45.0,		// left stem angle
						    45.0);		// right stem angle

initialize();

function initialize() {
	canvas.width = width;
	canvas.height = height;
	context.clearRect(0.0, 0.0, width, height);
	context.translate(width/2.0, height);
	tree.draw(generations.value);
}

function handleMovement(event) {
	event = event || window.event;
	const pointX = event.offsetX;
	const dampening = 0.075;
	const delta = lastX - pointX;
	lastX = pointX;

	const angularVelocity = delta*dampening;
	if (tree.leftStemAngle < 90.0 - angularVelocity && tree.leftStemAngle > -angularVelocity) {
	  tree.leftStemAngle += angularVelocity;
	  tree.rightStemAngle -= angularVelocity;
	}

	initialize();
	event.preventDefault();
}

})();

