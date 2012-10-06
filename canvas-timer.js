(function() {
	"use strict";
	var inherits = function(subc, superc) {
		if(!superc || !subc) {
			throw new Error("extend failed, please check that all dependencies are included.");
		}
		var F = function() {
		};
		F.prototype = superc.prototype;
		subc.prototype = new F();
		subc.prototype.constructor = subc;
		subc.superclass = superc.prototype;
		if(superc.prototype.constructor == Object.prototype.constructor) {
			superc.prototype.constructor = superc;
		}
	};
	var CanvasTimer = function(updateInterval, limitTime, width, height, timesUp, bgcolor, color, borderColor, borderWidth) {
		this.updateInterval = updateInterval;
		this.timesUp = timesUp || function(){};
		this.limitTime = limitTime;
		this.timeElapsed = 0;
		this.borderColor = borderColor || '3B5998'
		this.borderWidth = borderWidth || 4;
		this.bgcolor = bgcolor || 'FFFFFF';
		this.color = color || 'CCCCCC';
		this.width = width;
		this.height = height;
		/* canvas reference */
		this.canvas = null;
		/* reference to setInterval */
		this.timer = null;
		/* the change for each update; dAlpha or dx */
		this.dt = 0;
		
		/* center of circle or left corner */
		this.x = 0;
		this.y = 0;
	};

	CanvasTimer.prototype = {
		init : function() {
			this.canvas = this.createCanvas(this.width, this.height);
			this.dt = this.changePerInterval();
			this.reset();
		},
		changePerInterval : function() {
			throw new Error('Implement');
		},
		start : function() {
			var self = this;
			this.reset();
			this.timer = setInterval(function() {
				if(!self.checkTimeIsUp()) {
					self.update();
				}
			}, this.updateInterval);
		},
		reset : function() {
			throw new Error('Implement');
		},
		createCanvas : function(width, height) {
			var canvas = document.createElement('canvas');
			canvas.width = width;
			canvas.height = height;
			return canvas;
		},
		checkTimeIsUp : function() {
			if(this.timeElapsed >= this.limitTime) {
				clearInterval(this.timer);
				this.timesUp();
				return true;
			}
			this.timeElapsed += this.updateInterval;
			return false;
		},
		update : function() {
			throw new Error('Implement');
		}
	};

	var CanvasPieTimer = function(updateInterval, limitTime, width, height, timesUp, bgcolor, color, borderColor, borderWidth) {
		CanvasTimer.call(this, updateInterval, limitTime, width, height, timesUp, bgcolor, color, borderColor, borderWidth);
		/* Vertical line as start */
		this.startAngle = 1.5 * Math.PI;
		this.endAngle = 1.5 * Math.PI;
		this.radius = 0;
	};
	inherits(CanvasPieTimer, CanvasTimer);

	CanvasPieTimer.prototype.changePerInterval = function() {
		return (this.updateInterval / this.limitTime) * Math.PI * 2;
	};

	CanvasPieTimer.prototype.reset = function() {
		var canvas = this.canvas, context;
		clearInterval(this.timer);
		this.timeElapsed = 0;
		this.startAngle = 1.5 * Math.PI;
		context = canvas.getContext('2d');
		this.x = this.y = this.radius = this.width / 2;
		context.globalAlpha = 1;
		context.beginPath();
		
		context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
		
		context.fillStyle = this.borderColor;
		context.fill();
		context.closePath();
		context.beginPath();
		context.arc(this.x, this.y, this.radius - this.borderWidth, 0, Math.PI * 2, true);
		
		context.fillStyle = this.bgcolor;
		context.fill();
		context.closePath();
	};

	CanvasPieTimer.prototype.update = function() {
		console.log('sdfds')
		var context;
		this.endAngle += this.dt;
		context = this.canvas.getContext('2d');

		context.beginPath();
		context.moveTo(this.x, this.y);
		/* draw entire sector; can add some shift to draw less area, dt+shift; this is due to rounding and drawing error */
		context.arc(this.x, this.y, this.radius - this.borderWidth, this.startAngle, this.endAngle, false);
		context.fillStyle = this.color;
		context.fill();
		context.closePath();
	};
	
	var CanvasBarTimer = function(updateInterval, limitTime, width, height, timesUp, bgcolor, color, borderColor, borderWidth) {
		CanvasTimer.call(this, updateInterval, limitTime, width, height, timesUp, bgcolor, color, borderColor, borderWidth);
	};
	
	inherits(CanvasBarTimer, CanvasTimer);

	CanvasBarTimer.prototype.changePerInterval = function() {
		return (this.updateInterval / this.limitTime) * (this.width - 2 * this.borderWidth);
	};

	CanvasBarTimer.prototype.reset = function() {
		var canvas = this.canvas, context;
		clearInterval(this.timer);
		this.timeElapsed = 0;
		context = canvas.getContext('2d');
		this.x = this.y = this.borderWidth;
		context.globalAlpha = 1;
		context.beginPath();
		context.fillStyle = this.borderColor;
		context.fillRect(0, 0, this.width, this.height);
		context.closePath();
		
		context.beginPath();
		context.fillStyle = this.bgcolor;
		context.fillRect(this.borderWidth, this.y, this.width - 2 * this.borderWidth, this.height - 2 * this.borderWidth);
		context.closePath();
	};

	CanvasBarTimer.prototype.update = function() {
		var context;
		this.x += this.dt;
		context = this.canvas.getContext('2d');
		context.beginPath();
		context.fillStyle = this.color;
		context.fillRect(this.borderWidth, this.y, this.x, this.height - 2 * this.borderWidth);
		context.closePath();
	};
	
	window.CanvasPieTimer = CanvasPieTimer;
	window.CanvasBarTimer = CanvasBarTimer;
})();
