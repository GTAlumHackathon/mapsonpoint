var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
  });
  var DS = new google.maps.DirectionsService;
  var DR = new google.maps.DirectionsRenderer;
  var LatLng = google.maps.LatLng;

  $('#search-route').click(function () {
    var DirectionRequest = {
        origin: $('#start').val(),
        destination: $('#end').val(),
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
});
}

