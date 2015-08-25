var width = window.innerWidth;
var height = window.innerHeight;

function main() {

	document.querySelector('body').onclick = function(e) {
		e.preventDefault()
		window.location.pathname = 'resume.html'
	}

	var two = new Two({
		width: width,
		height: height,
		fullscreen: true,
		autostart: true
	}).appendTo(document.body)

	// Setup scene
	// add circle
	var scene = two.makeGroup()
	var circle = two.makeCircle(width/2, height/2 + 110, 180)
	circle.fill = '#151782'
	circle.stroke = 'black'
	circle.linewidth = 0
	scene.add(circle)

	// Create points
	// add wave polygon
	var points = makeAnchorPoints(20)
	var wave = new Two.Polygon(points, true, true)
	wave.fill = "black"
	scene.add(wave)

	// Mouse move event
	addMouseEvent()

	// Apply our own bindings for two.js resize and update
	two.bind('resize', resize)

	two.bind('update', function() {
		var attack = 0.05
		//Calculate velocity for each point based on last frame
		for(var i = 2; i <= points.length - 2; i++) {
			var delta = points[i-1].y + points[i+1].y - 2*points[i].y
			points[i].velocity = (points[i].velocity + delta*attack) * 0.96
		}
		//Apply velocity in y dimension
		for (var i = 2; i < points.length - 2; i++) {
			points[i].y = points[i].y + points[i].velocity
		}
	}).play()
	//Rendering started

	function resize() {
		scene.translation.set(two.width / 4, two.height / 4)
	}


	function makeAnchorPoints(n) {
		var b = []
		var p = []

		b[0] = new Two.Anchor(0, height)
		b[0].velocity = 0

		// Add 5 left-buffer points
		for (var i = 1; i <= 4; i++) {
			b[i] = new Two.Anchor(-250 + i*50, height/2)
			b[i].velocity = 0
		};
		for (var i = 0; i < n; i++) {
			p[i] = new Two.Anchor( width/n * i, height/2)
			p[i].velocity = 0
		};

		//add 5 right-buffer points
		var l = p.length
		for (var i = 0; i <= 4; i++) {
			var newPoint = new Two.Anchor(width + i*50, height/2)
			newPoint.velocity = 0
			p[l + i] = newPoint
		};
		
		p.push( new Two.Anchor(width, height))

		return b.concat(p)
	}


	function addMouseEvent(argument) {
		var lastMouse = new Two.Vector(0, 0)
		var currMouse = new Two.Vector(0, 0)
		var mouseVel = new Two.Vector(0, 0)
		var svg = document.querySelector('svg')

		svg.addEventListener('mousemove', function(e) {
			currMouse.set(e.offsetX, e.offsetY)
			mouseVel.sub(currMouse, lastMouse)
			if (currMouse.y >= height/2) {
				var v = clamp(mouseVel.length(), 40)
				var closest = findClosestAnchors(3, currMouse)
				closest[0].velocity += 0.06 * v
				closest[1].velocity += 0.03 * v
				closest[2].velocity += 0.03 * v
			}
			lastMouse.copy(currMouse)
		})
	}

	function findClosestAnchors(n, pos) {
		var sortedPoints = points.slice(0, points.length - 4)
		sortedPoints.sort(function(p1, p2) {
			var d1 = Math.sqrt( Math.pow(p1.x - pos.x, 2) + Math.pow(p1.y - pos.y, 2) )
			var d2 = Math.sqrt( Math.pow(p2.x - pos.x, 2) + Math.pow(p2.y - pos.y, 2) )
			//Possible clean up:
			// var d1 = pos.distanceTo(p1)
			// var d2 = pos.distanceTo(p2)
			if (d1 > d2) {
				return 1;
			}
			if (d1 < d2) {
				return -1;
			}
			return 0;
		})
		return sortedPoints.slice(0, n)
	}
} // End main

function clamp(num, max) {
  return Math.min(num, max);
}


window.onload = main