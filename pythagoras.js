class Pythagoras {

    constructor(ctx,
    			sideLength,
    			trunkAngle,
    			leftStemAngle,
    			rightStemAngle) {

    	this.ctx = ctx;
    	this.maxgenerations = 11;
    	this.sideLength = sideLength;
		this.trunkAngle = trunkAngle;
		this.leftStemAngle = leftStemAngle;
		this.rightStemAngle = rightStemAngle;
		this.trunkBottomLeft = new Point(-sideLength/2.0, 0.0);
		this.trunkBottomRight = new Point(sideLength/2.0, 0.0);
		this.palette = [];
    	this.paletteIndex = 0;
    	// set the color indices of the tree in advance, so it will retain the colors when animated
    	this.configColorIndices();
	}

	static selectColor(index) {
		switch (index) {
		case 0: return '#0099CC';   // sky blue
		case 1: return '#9966CC';   // purple
		case 2: return '#00FFFF';   // cyan
		case 3: return '#9966FF';   // violet
		case 4: return '#0066FF';   // blue
		}
	}

	static randomInt(min, max) {
	    min = Math.ceil(min);
	    max = Math.floor(max);
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	configColorIndices() {
	  for (let i = 0; i < 2056; ++i) {
	  	this.palette[i] = Pythagoras.randomInt(0, 4);
	  }
	}

	nextPaletteIndex() {
		if (this.paletteIndex >= 2056) {
			this.paletteIndex = 0;
		}
		return this.palette[this.paletteIndex++];
	}

	// c +-----+ d
	//   |     |
	//   |     |
	// a +-----+ b
	drawSquare(a, b, c, d, color) {
	  this.ctx.fillStyle = color;
	  this.ctx.beginPath();
	  this.ctx.moveTo(a.x, a.y);
	  this.ctx.lineTo(c.x, c.y);
	  this.ctx.lineTo(d.x, d.y);
	  this.ctx.lineTo(b.x, b.y);
	  this.ctx.lineTo(a.x, a.y);
	  this.ctx.fill();
	}

	//      c+  
	//     /  \
	//    /    \
	// a +------+ b
	drawTriangle(a, b, c, color) {
	  this.ctx.fillStyle = color;
	  this.ctx.beginPath();
	  this.ctx.moveTo(a.x, a.y);
	  this.ctx.lineTo(c.x, c.y);
	  this.ctx.lineTo(b.x, b.y);
	  this.ctx.lineTo(a.x, a.y);
	  this.ctx.fill();
	}

	grow(bl, br, sLength, lAngle, stemAngle, steps) {

		if (steps >= this.maxgenerations) {
			return;
		}

		const cosine = Math.cos(-stemAngle.toRadians());
		const sine = Math.sin(-stemAngle.toRadians());
		let tl = new Point(cosine*sLength, sine*sLength);
		let tr = new Point(cosine*sLength, sine*sLength);
		tl.add(bl);
		tr.add(br);

		const rectIndex = this.nextPaletteIndex();
		this.drawSquare(bl, br, tl, tr, Pythagoras.selectColor(rectIndex));

		// find the length of the triangle's side
		const length = Point.distance(bl, br);
		// now find the base (remember, the right triangle is inverted!)
		const sideA = Math.cos(this.leftStemAngle.toRadians())*length;
		// find the opposite side (for use with right branches)
		const sideB = Math.sin(this.leftStemAngle.toRadians())*length;
		// find the third vertex of the triangle
		const top = new Point(Math.cos(-lAngle.toRadians())*sideA,
							  Math.sin(-lAngle.toRadians())*sideA);
		top.add(tl);

		// draw the triangle on top, unless this is the smallest stem
		if (steps < this.maxgenerations-1) {
			const triIndex = this.nextPaletteIndex();
			this.drawTriangle(tl, tr, top, Pythagoras.selectColor(triIndex));
		}

		//draw left branches
		this.grow(tl, top, sideA, lAngle+this.leftStemAngle, stemAngle+this.leftStemAngle, steps+1);
		// draw right branches
		this.grow(top, tr, sideB, lAngle-this.rightStemAngle, stemAngle-this.rightStemAngle, steps+1);
	}

	draw(maxgens) {
		this.paletteIndex = 0;
		this.maxgenerations = maxgens;
		this.grow(this.trunkBottomLeft,
			 	  this.trunkBottomRight, 
			 	  this.sideLength,
			 	  this.leftStemAngle,
			 	  this.trunkAngle, 
			 	  0);
	}
}

Number.prototype.toRadians = function() {
	return this * Math.PI/180.0;
}