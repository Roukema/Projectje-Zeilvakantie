var map;
function initMap() {
  // const lefkas = { lat: 38.83009, lng: 20.711975 };

  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 38.599264, lng: 20.78996 },
    zoom: 10
  });
  const convertLatitude = place => {
    const lat = place.placeVisit.location.latitudeE7 / 10000000;
    const lng = place.placeVisit.location.longitudeE7 / 10000000;
    console.log(place.placeVisit.location.latitudeE7);
    console.log("lat=", lat, "lng is", lng);
    makeMarker({ lat: lat, lng: lng });
  };

  const makeMarker = place => {
    const Marker = new google.maps.Marker({
      position: place,
      map: map
    });
    return Marker, (Marker.id = "marker");
  };

  //voor het filter de lat aanpassen lukt me nu even niet, geen idee hoe(recursion, recursive call)
  const filterKey = object => {
    if (object.hasOwnProperty("placeVisit") == true) {
      convertLatitude(object);
    } else if (object.hasOwnProperty("activitySegment") == true) {
      getflightPlanCoordinates(object);
      console.log("activity");
    } else {
      console.log("werkt niet?");
    }
  };

  const getflightPlanCoordinates = activity => {
    const flightPlanstartCoordinates = [
      {
        lat: activity.activitySegment.startLocation.latitudeE7 / 10000000,
        lng: activity.activitySegment.startLocation.longitudeE7 / 10000000
      }
    ];
    const flightPlanEndCoordinates = [
      {
        lat: activity.activitySegment.endLocation.latitudeE7 / 10000000,
        lng: activity.activitySegment.endLocation.longitudeE7 / 10000000
      }
    ];
    // const flightPlanBybasCoordinates =
    // getWaypoints(activity)
    let flightPlanCoordinates = [];
    let waypoint = [];
    let waypointConv = [];
    let getWaypoints = activity => {
      // console.log(activity.activitySegment.waypointPath.waypoints);
      if (activity.activitySegment.hasOwnProperty("waypointPath") === true) {
        waypoint = activity.activitySegment.waypointPath.waypoints;
        // for (var i = 0, length = waypoint.length; i < length; i++) {
        console.log(waypoint);

        let convertLatitudeWayp = wayp => {
          return {
            lat: wayp.latE7 / 10000000,
            lng: wayp.lngE7 / 10000000
          };
        };

        waypointConv = waypoint.map(wayp => convertLatitudeWayp(wayp));
        console.log(waypointConv);
      } else {
      }
    };

    assembleFlightpath = activity => {
      if (waypoint.length > 0) {
        return (
          (flightPlanCoordinates = flightPlanstartCoordinates
            .concat(waypointConv)
            .concat(flightPlanEndCoordinates)),
          console.log("kom ik hier nou? "),
          console.log(waypointConv)
        );
      } else {
        return (flightPlanCoordinates = flightPlanstartCoordinates.concat(
          flightPlanEndCoordinates
        ));
      }
    };
    getWaypoints(activity);
    assembleFlightpath(activity);

    console.log(flightPlanCoordinates);

    var flightPath = new google.maps.Polyline({
      path: flightPlanCoordinates,
      geodesic: true,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 2
    });

    flightPath.setMap(map);
  };

  const places = timelineObjects.filter(filterKey);

  console.log(places);
  console.log(timelineObjects);
  places.forEach(place => convertLatitude(place));
}

document.addEventListener("DOMContentLoaded", event => {
  console.log("DOM fully loaded and parsed");
  // doSomethingWithData();
});
