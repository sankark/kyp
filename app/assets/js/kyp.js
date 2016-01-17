var app = angular.module('Kyp', ['ngRoute', 'ngResource']);

function MainController($rootScope, $scope, $location) {


    var header = {
        name: "test",
        date: "20151231"
    }
    var txt = "hello"
    var comment = {
        header: header,
        text: "hello3",
        comment: []
    }
    var comment3 = {
        header: header,
        text: "hello2",
        comment: [comment]
    }
    var comment2 = {
        header: header,
        text: "hello",
        comment: [comment3]
    }
    $scope.comments = [comment2, comment3]
    $scope.profiles = [{
        id: '1',
        img: '/assets/images/road.jpg',
        name: 'சகாயம்',
        info: 'Test',
        like: '',
        comments: $scope.comments
    }]

    $scope.loadProfile = function(p, hash) {
        if (hash != null)
            $location.hash(hash);
        $location.path('/profile');
    }
}

function ProfileController($rootScope, $scope, $location) {
    var header = {
        name: "test",
        date: "20151231"
    }
    var txt = "hello"
    var comment = {
        header: header,
        text: "hello3",
        comment: []
    }
    var comment3 = {
        header: header,
        text: "hello2",
        comment: [comment]
    }
    var comment2 = {
        header: header,
        text: "hello",
        comment: [comment3]
    }
    $scope.comments = [comment2, comment3]

    $scope.recaptcha = function() {
        grecaptcha.render('html_element', {
            'sitekey': '6LewKhQTAAAAAKwG3N1PE6rg5XRghJkHAl05GJXN'
        });
    }

}


app.config(function($routeProvider, $locationProvider) {
    $routeProvider.
    when('/', {
        templateUrl: '/assets/html/const.html',
        controller: MainController
    }).
    when('/profile', {
        templateUrl: '/assets/html/entry.html',
        controller: ProfileController
    }).
    otherwise({
        redirectTo: '/'
    });
});

/*app.config(function($interpolateProvider){
    $interpolateProvider.startSymbol('{%').endSymbol('%}');
});

app.controller('MainController', function($rootScope, $scope,geolocation){
        geolocation.getLocation().then(function(data){
    $rootScope.coords= {Lat:data.coords.latitude, Lng:data.coords.longitude};
  });


})


app.controller('SearchConsti', function($rootScope, $scope, ConstiService, geolocation){

$scope.getConst = function(){
ConstiService.getConst($scope.point).then(function (r) {
  $scope.consti = r.Data;
})
}
geolocation.getLocation().then(function(data){
$scope.point = {Lat:data.coords.latitude,  Lng:data.coords.longitude}
$scope.getConst();
})

})

app.factory('ConstiService', function($rootScope, $resource, $q) {
  var ConstiResource = $resource('/point', {});
  return {
    getConst:function(point){
      var deferred = $q.defer();
      ConstiResource.save(point).$promise.then(function(r) {
        deferred.resolve(r);
      });
      return deferred.promise;
    }
  }
})
*/
