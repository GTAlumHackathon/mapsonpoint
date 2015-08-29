function Location (lat, lng) {
	this.lat = lat;
	this.lng = lng;
}

// Route Class
function Route(start, dest, duration) {
  this.start = start;
  this.dest = dest;
  this.duration = duration;
}

function POR(name, location, route) {
	this.name = name;
	this.location = location;

	this.durationLeft = function(destination) {
		//use route.destination
	};

	this.distanceLeft = function(destination) {
		//use route.destination
	};

	this.places = function(places) {
		//take google places, create place objects and sort
	}
}

function Place(location, distanceFromPOR, durationFromPOR, destination) {
	this.location = location;
	this.distanceFromPOR = distanceFromPOR;
	this.durationFromPOR = distanceFromPOR;

	this.distanceToDestination = function() {

	};

	this.durationToDestination = function() {

	};

}