 var app = angular.module('Translit', ['ngRoute', 'ngResource', 'textAngular', 'ngTextcomplete','autocomplete']);
 function initTranslit($scope){
        $scope.input = function(d) {
        if ($scope.key === 8) {
            $scope.key = null;
            $scope.words = "";
            return;
        }

        $scope.data = d;
        $scope.data.pinyin ? $scope.data.pinyin += $scope.data.text.slice(-1) :
            $scope.data.pinyin = $scope.data.text.slice(-1);
        $scope.data.text = $scope.data.text.substring(0, $scope.data.text.length - 1);

        IEM.queryText($scope.data.pinyin).success(function(data) {
            if (data[0] === "FAILED_TO_PARSE_REQUEST_BODY") {
                console.log('trigger');
                $scope.words = "";
            } else {
                $scope.words = data[1][0][1];
            }
        })
    }

    $scope.select = function(index, data) {
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