var marker;
var map;
    

    function initialize() {
      
    var styles = [{"stylers":[{"saturation":-100},{"gamma":1}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi.place_of_worship","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"poi.place_of_worship","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"geometry","stylers":[{"visibility":"simplified"}]},{"featureType":"water","stylers":[{"visibility":"on"},{"saturation":50},{"gamma":0},{"hue":"#50a5d1"}]},{"featureType":"administrative.neighborhood","elementType":"labels.text.fill","stylers":[{"color":"#333333"}]},{"featureType":"road.local","elementType":"labels.text","stylers":[{"weight":0.5},{"color":"#333333"}]},{"featureType":"transit.station","elementType":"labels.icon","stylers":[{"gamma":1},{"saturation":50}]}];

    // Create a new StyledMapType object, passing it the array of styles,
    // as well as the name to be displayed on the map type control.
    var styledMap = new google.maps.StyledMapType(styles,
      {name: "Styled Map"});




      var myLatlng = new google.maps.LatLng(51.507351, -0.127758);
      var mapOptions = {
        center: new google.maps.LatLng(51.507351, -0.127758),
        zoom: 11,
           mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
    }
      };
      map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
      map.setTilt(45);
      map.setHeading(90);

        //Associate the styled map with the MapTypeId and set it to display.
  map.mapTypes.set('map_style', styledMap);
  map.setMapTypeId('map_style');

      marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        draggable: true
      });

      


    }

function moveMarker() {
    var lat = 51.4;
    var lng = -0.12;
    var newLatLng = new google.maps.LatLng(lat, lng);
    marker.setPosition(newLatLng)
}
google.maps.event.addDomListener(window, 'load', initialize);






function addRoute(rundata){
  

    var flightPlanCoordinates = [];
    for (var i in rundata){
        flightPlanCoordinates.push(new google.maps.LatLng(rundata[i].latitude,rundata[i].longitude));
    }


  var flightPath = new google.maps.Polyline({
    path: flightPlanCoordinates,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });

  flightPath.setMap(map);
}




