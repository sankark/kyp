angular.module('translit',[])

.factory('translit', ['$q', '$rootScope', '$window', 'IEM', function($q, $rootScope, $window, IEM) {
    return {

        input : function($scope) {
                if ($scope.key === 8) {
                    $scope.key = null;
                    $scope.words = "";
                    return;
                }

                $scope.data.pinyin ? $scope.data.pinyin += $scope.data.text.slice(-1) :
                    $scope.data.pinyin = $scope.data.text.slice(-1);
                $scope.data.text = $scope.data.text.substring(0, $scope.data.text.length - 1);

                var deferred = $q.defer();
                IEM.queryText($scope.data.pinyin).success(function(data) {
                    if (data[0] === "FAILED_TO_PARSE_REQUEST_BODY") {
                        console.log('trigger');
                        deferred.resolve("");
                    } else {
                        deferred.resolve(data[1][0][1]);
                    }
                })
                return deferred.promise;
            },

            select : function($scope, index, data) {
                $scope.data = data;
                if ($scope.words[index] == null) {
                    $scope.data.text += "\n";
                    return;
                }
                $scope.data.text += $scope.words[index];
                $scope.words = "";
                $scope.data.pinyin = "";
            }
    }

}])

.factory('IEM', function($http) {
    var url = "https://inputtools.google.com/request?text=n&itc=ta-t-i0-pinyin&num=11&cp=0&cs=0&ie=utf-8&oe=utf-8&app=demopage"
    return {
        queryText: function(txt) {
            return $http.post("https://inputtools.google.com/request?&itc=ta-t-i0-und&num=11&cp=0&cs=0&ie=utf-8&oe=utf-8&text=" + txt);
        }
    }
})

.directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if(scope.alpha!="A"){
            if (event.which === 8 && scope.data.text.length > 0) {
                scope.key = 8;
                if(scope.$parent){
                    scope.$parent.key = 8;
                }
            } else {
                scope.key = null;
                if(scope.$parent){
                    scope.$parent.key = null;
                }
            }
            if (event.which === 13) {
                scope.$apply(function() {
                    scope.$eval(attrs.ngEnter);

                });

                event.preventDefault();
            }
        }
        });
    };
});
