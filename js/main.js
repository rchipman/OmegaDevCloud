var Site = angular.module('Site', ['ngResource']);// , 'google-maps']);

Site.factory('LbsApi', ['$resource', function($resource) {
  return $resource("https://dc-api.racowireless.com/api/Receive", {}, {
    'get': { isArray: false }
  });
}])

fakeMessages = [
    { latitizzle: -39.123, longitizzle: 44.223, nizzle: 'Cool', descrizzle: 'This is some dope yo.' },
    { latitizzle: -37.123, longitizzle: 48.223, nizzle: 'The Best', descrizzle: 'This is some lizzle yo.' },
    { latitizzle: -39.123, longitizzle: 52.223, nizzle: 'Winner', descrizzle: 'This is some for rizzle yo.' },
    { latitizzle: -42.123, longitizzle: 65.223, nizzle: 'Awesome', descrizzle: 'This is some yum yummmm yo.' },
    { latitizzle: -47.123, longitizzle: 40.223, nizzle: 'Bonus', descrizzle: 'This is some aight yo.' },
    { latitizzle: -32.123, longitizzle: 43.223, nizzle: 'BossHog', descrizzle: 'This is some yessir yo.' }
]

Site.controller('MapsCtrl',
['$scope', '$http', 'LbsApi',
function($scope, $http, LbsApi) {
  $scope.credentials = {};
  $scope.messages = [];
  $scope.messageMapping = {};
  availableLocations = [
    { name: 'Latitude', id: 1, show: true },
    { name: 'Longitude', id: 2, show: true },
    { name: 'Title', id: 3, show: true },
    { name: 'Description', id: 4, show: true }
  ];
  $scope.availableLocations = availableLocations;
  $scope.$loading = true;
  $scope.enableStop = false;
  $scope.connectionReady = false;
  $scope.modelReady = false;
  $scope.showMap = false;

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
    // latLng = new google.maps.LatLng(lat, long);
    // marker = new google.maps.Marker({
    //   position: latLng,
    //   map: $scope.mapInstance
    // });
    // $scope.mapInstance.panTo(latLng);
    // $scope.mapInstance.setZoom(15);
  }

  var getMessage = function(credentials) {
    if($scope.enableStop === true) {
      basicAuth = Base64.encode(credentials.customerId + ":" + credentials.webServiceKey)
      $http.defaults.headers.common['Authorization'] = "Basic " + basicAuth
      LbsApi.get(function(response) {
        console.log(response);
        if (response[0] !== null && response[0] !== 'n') {
          $scope.loading = false;
          message = response.details;
          addMarker(message.latitude, message.longitude);
          getMessage(credentials);
        } else {
          console.log('trying again');
          getMessage(credentials);
        }
      });
    }
  }

  checkCredentials = function(c) {
      return c != null && c.customerId != null && c.customerId != '' && c.webServiceKey != null && c.webServiceKey != ''
  }

  $scope.clearForm = function() {
      $scope.credentials = {};
      $scope.formAlert = false;
  }

  $scope.setMessageTemplate = function(message) {
      console.log(message);
      for (var i = 0; i < $scope.messages.length; i++) {
          $scope.messages[i].selected = false;
      }
      message.selected = true;
      $scope.messageTemplate = message.data;
  }

  messageMapped = function(m) {
      return m[1] != null && m[2] != null && m[3] != null && m[4] != null && !isNaN(m[1] + m[2])
  }

  $scope.setLocation = function(key, id) {
      $scope.messageMapping[id] = key
      $scope.availableLocations.slice() = false
      if (messageMapped($scope.messageMapping)) {
          $scope.locationReady = true
      }
  }

  $scope.connect = function (credentials) {
    console.log(checkCredentials(credentials));
    if (checkCredentials(credentials)) {
      $scope.connectionReady = true;
      $scope.enableStop = true;

      for (var i = 0; i < fakeMessages.length; i++) {
          $scope.messages.push({ selected: false, data: fakeMessages[i]});
      }

      //getMessage(credentials);
    } else {
      $scope.formAlert = true
      $scope.enableStop = false;
      $scope.$loading = false;
    }
  };

  $scope.stopConnection = function() {
    $scope.enableStop = false;
    $scope.$loading = false;
  };
}])
