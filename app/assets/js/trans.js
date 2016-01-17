
angular.module('trans',[])
    .controller('main',function($scope,IEM){

        $scope.input = function(){
            $scope.data.pinyin?
            $scope.data.pinyin += $scope.data.text.slice(-1):
                $scope.data.pinyin = $scope.data.text.slice(-1);
            //$scope.data.text = $scope.data.text.substring(0,$scope.data.text.length-1);
            IEM.queryText($scope.data.pinyin).success(function(data){
                if(data[0] === "FAILED_TO_PARSE_REQUEST_BODY"){
                    console.log('trigger');
                    $scope.words = "";
                }else{
                    $scope.words = data[1][0][1];
                }
            })
        }

        $scope.select = function(index){
            $scope.data.text += $scope.words[index];
            $scope.words = "";
            $scope.data.pinyin = "";
        }
    }).factory('IEM',function($http){
        var url = "https://inputtools.google.com/request?text=n&itc=zh-t-i0-pinyin&num=11&cp=0&cs=0&ie=utf-8&oe=utf-8&app=demopage"
        return{
            queryText:function(txt){
                return $http.post("https://inputtools.google.com/request?&itc=zh-t-i0-pinyin&num=11&cp=0&cs=0&ie=utf-8&oe=utf-8&text="+txt);
            }
        }
    });