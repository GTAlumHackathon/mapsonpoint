var map;
var places = [];
initMap();
var DS = new google.maps.DirectionsService;
var DR = new google.maps.DirectionsRenderer;
var LatLng = google.maps.LatLng;
function calcRoute(origin, destination, callback) {
    var DirectionRequest = {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING
    };
    DS.route(
        DirectionRequest,
        callback
    );
}


function showRouteFromForm() {
    calcRoute($('#start').val(), $('#end').val(), function(response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            DR.setDirections(response); // From the .route()'s callback above
            DR.setMap(map);
        } else {
            console.log('Directions request failed due to ' + status);
        }
    });
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
    });
    
        
    $('#search-route').click(showRouteFromForm);
    $('#start-form').click(function(event) {
        showRouteFromForm();
        event.preventDefault();
    });
}



  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch({
    location: POR.location,
    radius: 500,
    types: [POR.name]
  }, callback);


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
