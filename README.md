## Canvas timer

Time's up using canvas, support pie-timer and bar-timer

## Example
	var timer = new CanvasPieTimer(1000, 30000, 26, 26,  function() {
		console.log('Time to party');
	}, function(timeElapsed) {
		console.log(timeElapsed);
	});
	
	var timer = new CanvasBarTimer(1000, 20000, 100, 26,  function() {
		console.log('Time to party');
	}, function(timeElapsed) {
		console.log(timeElapsed);
	});
	
###