var app = angular.module('kyp',['geolocation','ngRoute','ngResource']);

app.config(function($interpolateProvider){
    $interpolateProvider.startSymbol('{%').endSymbol('%}');
});

app.controller('MainController', function($rootScope, $scope,geolocation){
	$rootScope.coords = geolocation.getLocation().then(function(data){
		return {lat:data.coords.latitude, lon:data.coords.longitude};
	});


})


app.controller('SearchConsti', function($rootScope, $scope, ConstiService){
	
$scope.getConst = function(){
ConstiService.getConst($rootScope.coords).then(function (r) {
	$scope.consti = r.Data;
})
}

$scope.getConst();

})

app.factory('ConstiService', function($rootScope, $resource, $q) {
	var ConstiResource = $resource('/point/:lat', {lat:'@lat',lon:'@lon'});
	return {
		getConst:function(point){
			var deferred = $q.defer();
			ConstiResource.get({lat:point.lat,lon:point.lon}).$promise.then(function(r) {
				deferred.resolve(r);
			});
			return deferred.promise;
		}
	}
})