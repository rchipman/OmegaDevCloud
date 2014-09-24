var Site = angular.module('Site', ['ngResource', 'google-maps']);

Site.factory('LbsApi', ['$resource', function($resource) {
  return $resource("https://dc-api.racowireless.com/api/Receive", {}, {
    'get': { isArray: false }
  });
}])

Site.controller('MapsCtrl',
['$scope', '$http', 'LbsApi',
function($scope, $http, LbsApi) {
  $scope.credentials = {};
  $scope.$loading = true;
  $scope.enableStop = false;
  var LAS_VEGAS_LAT = 36.1079;
  var LAS_VEGAS_LONG = -115.1769;

  $scope.map = {
    center: {
      latitude: LAS_VEGAS_LAT,
      longitude: LAS_VEGAS_LONG
    },
    zoom: 5,
    events: {
      tilesloaded: function (map) {
        $scope.$apply(function() {
          $scope.$loading = false;
          $scope.mapInstance = map;
        });
      }
    }
  };

  var addMarker = function(lat, long) {
    console.log('adding marker: ', + lat + ", " + long)
    latLng = new google.maps.LatLng(lat, long);
    marker = new google.maps.Marker({
      position: latLng,
      map: $scope.mapInstance
    });
    $scope.mapInstance.panTo(latLng);
    $scope.mapInstance.setZoom(15);
  }

  var getMessage = function(credentials) {
    if($scope.enableStop === true) {
      basicAuth = Base64.encode(credentials.customerId + ":" + credentials.webServiceKey)
      $http.defaults.headers.common['Authorization'] = "Basic " + basicAuth
      LbsApi.get(function(response) {
        console.log(response);
        if (response[0] !== null && response[0] !== 'n') {
          $scope.loading = false;
          message = response.output;
          if (message.latitude != null && message.longitude != null) {
              addMarker(message.latitude, message.longitude);
          }
          getMessage(credentials);
        } else {
          console.log('trying again');
          getMessage(credentials);
        }
      });
    }
  }

  $scope.connect = function (credentials) {
    $scope.$loading = true;
    if (credentials.customerId != null && credentials.webServiceKey != null) {
      $scope.enableStop = true;
      getMessage(credentials);
    } else {
      $scope.enableStop = false;
      $scope.$loading = false;
    }
  };

  $scope.stopConnection = function() {
    $scope.enableStop = false;
    $scope.$loading = false;
  };
}])
