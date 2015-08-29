var map;
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

