var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
    });
var MS;
var places = [];
var PS = new google.maps.places.PlacesService(map);
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
    var p = new POR("McDonalds", new Location(55.930385, -3.118425), new Location(50.087692, 14.421150));

    
        
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
  currentPOR = this;
  goPlaces(this.location.toGoogleLatLng(), this.destination.toGoogleLatLng(), setRemainders);

  function setRemainders(data) {
    var trip = data.rows[0].elements[0];
    if(trip.status == "OK") {
        currentPOR.distanceToDestination = trip.distance.value;
        currentPOR.durationToDestination = trip.duration.value;

          PS.nearbySearch({
            location: currentPOR.location,
            radius: 5000,
            types: [currentPOR.name],
            keyword: currentPOR.name
          }, foundPlaces);
    }
  }

    function foundPlaces(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            console.log(results);
        }
    }
}

function Place(location, distanceFromPOR, durationFromPOR, destination) {
  this.location = location;
  this.distanceFromPOR = distanceFromPOR;
  this.durationFromPOR = distanceFromPOR;
  this.destination = destination;
  currentPlace = this;

  goPlaces(this.location.toGoogleLatLng(), this.destination.toGoogleLatLng(), setPlaceRemainders);

  function setPlaceRemainders(data) {
    var trip = data.rows[0].elements[0];
    if(trip.status == "OK") {
        currentPlace.distanceToDestination = trip.distance.value;
        currentPlace.durationToDestination = trip.duration.value;
    }
  }

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

function PORSearch(por){ 
  service.nearbySearch({
    location: por.location,
    radius: 500,
    types: [por.name]
  }, callback);
}

function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    getPOR().places(results);
  }
}

function initPlaces(results) {
  for (var i = 0; i < results.length; i++) {
    var location = results[i].geometry.location;
    //needs rework
    //var newRoute = Route(here, there);
    //var distanceFromPOR = newRoute.distance;
    //var durationFromPOR = newRoute.duration();
    //var destination = Route.dest;
    //var newPlace = Place(location, distanceFromPOR, durationFromPOR, destination);
    //places.push(newPlace);
  }
}
