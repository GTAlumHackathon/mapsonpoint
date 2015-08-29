var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
    });
var MS;
var places = [];
var service = new google.maps.places.PlacesService(map);
var DS = new google.maps.DirectionsService;
var DR = new google.maps.DirectionsRenderer;
var LatLng = google.maps.LatLng;
initMap();
function showRoute(origin, destination) {
    var DirectionRequest = {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING
    };
    DS.route(
        DirectionRequest,
        function(response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                DR.setDirections(response); // From the .route()'s callback above
                DR.setMap(map);
            } else {
                console.log('Directions request failed due to ' + status);
            }
        }
    );
}


function showRouteFromForm() {
    showRoute($('#start').val(), $('#end').val());
}
function initMap() {
    MS = new google.maps.DistanceMatrixService();
    var p = new POR(1, new Location(-34.397, 150.644), new Location(-34.399, 150.655));

    
        
    $('#search-route').click(showRouteFromForm);
    $('#start-form').click(function(event) {
        showRouteFromForm();
        event.preventDefault();
    });
}

function Location (lat, lng) {
  this.lat = lat;
  this.lng = lng;

  this.toGoogleLatLng = function() {
    return new google.maps.LatLng(lat, lng);
  }
}

// Route Class
function Route(start, dest, distance, duration) {
  this.start = start;
  this.dest = dest;
  this.distance = distance;
  this.duration = duration;
}

function POR(name, location, destination) {
  this.name = name;
  this.location = location;
  this.destination = destination; 

  goPlaces(this.location.toGoogleLatLng(), this.destination.toGoogleLatLng(), setRemainders);

  function setRemainders(data) {
    console.log(data);
  }

  this.durationLeft = function(destination) {
    
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
  this.destination = destination;
  
  this.distanceToDestination = function() {

  };

  this.durationToDestination = function() {

  };

}


function goPlaces(origin, destination, callback) {

  MS.getDistanceMatrix(
    {
      origins: [origin],
      destinations: [destination],
      travelMode: google.maps.TravelMode.DRIVING,
    }, callback);
}
var service = new google.maps.places.PlacesService(map);

function PORSearch(){ 
  service.nearbySearch({
    location: POR.location,
    radius: 500,
    types: [POR.name]
  }, callback);
}

function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    var places ;
    initPlacesArr(results);
  }
}

function initPlaces(results) {
  for (var i = 0; i < results.length; i++) {
    var location = results[i].geometry.location;
    var newRoute = Route(here, there);
    var distanceFromPOR = newRoute.distance;
    var durationFromPOR = newRoute.duration();
    var destination = Route.dest;
    var newPlace = Place(location, distanceFromPOR, durationFromPOR, destination);
    places.push(newPlace);
  }
}
