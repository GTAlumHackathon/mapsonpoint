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
var marker;
var pickedLoc;
var route;
var por;
initMap();
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

function showEnterPlace() {
    $('#pick-a-spot').hide();
    $('#type-a-place').show();
}

function showRouteFromForm() {
    calcRoute($('#start').val(), $('#end').val(), function(response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            DR.setDirections(response); // From the .route()'s callback above
            DR.setMap(map);
        } else {
            console.log('Directions request failed due to ' + status);
        }
        var leg = response.routes[0].legs[0];

        var start = leg.start_location, end = leg.end_location;
        var start = new Location(start.lat(), start.lng());
        var end = new Location(end.lat(), end.lng());
        //console.log(start, end);

        route = new Route(start, end, leg.distance.value, leg.duration.value);
    });

}
function initMap() {
    MS = new google.maps.DistanceMatrixService();
    var p = new POR("McDonalds", new Location(55.930385, -3.118425), new Location(50.087692, 14.421150));
    $('#search-route').click(showRouteFromForm);
    $('#start-form').click(function(event) {
        showRouteFromForm();
        event.preventDefault();
    });
    map.addListener('click', function(e) {
        if (route){
            showEnterPlace();
            latLng = e.latLng;
            lat = latLng.lat();
            lng = latLng.lng();
            pickedLoc = new Location(lat, lng);
            if (marker) {
                marker.setMap(null);
            }
            marker = new google.maps.Marker({
                map: map,
                animation: google.maps.Animation.DROP,
                position: {lat: lat, lng: lng}
            });
        }
    });
    $('#search-place').click(function() {
        por = new POR($('#desired-place').val(), pickedLoc, route.dest);
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
  this.places = [];

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
            keyword: currentPOR.name,
            rankBy: google.maps.places.RankBy.DISTANCE
          }, foundPlaces);
    }
  }

    function foundPlaces(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                var location = results[i].geometry.location;
                var currentPlace = new Place(location, currentPOR.destination);

                goPlaces(p.location.toGoogleLatLng, currentPOR.toGoogleLatLng, placeLocationCallback);

                function placeLocationCallback(data) {
                    var trip = data.rows[0].elements[0];
                    if(trip.status == "OK") {
                        currentPlace.distanceFromPOR = trip.distance.value;
                        currentPlace.distanceFromPOR = trip.duration.value;
                    }
                    goPlaces(this.location.toGoogleLatLng(), this.destination.toGoogleLatLng(), setPlaceRemainders);

                  function setPlaceRemainders(data) {
                    var trip = data.rows[0].elements[0];
                    if(trip.status == "OK") {
                        currentPlace.distanceToDestination = trip.distance.value;
                        currentPlace.durationToDestination = trip.duration.value;
                    }
                  }
                }                
                places.push(currentPlace);
            }
            places.sort(function(a, b){
                return a.distanceToDestination + a.distanceFromPOR - b.distanceFromPOR - b.distanceToDestination;
            });
            places.reverse();
        }
    }
}

function Place(location, destination) {
  this.location = location;
  this.destination = destination;
  currentPlace = this;
}


function goPlaces(origin, destination, callback) {

  MS.getDistanceMatrix(
    {
      origins: [origin],
      destinations: [destination],
      travelMode: google.maps.TravelMode.DRIVING,
    }, callback);
}
