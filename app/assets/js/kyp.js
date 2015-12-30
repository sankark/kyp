var app = angular.module('kyp',['geolocation','ngRoute','ngResource']);

app.config(function($interpolateProvider){
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
