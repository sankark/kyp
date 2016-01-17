var app = angular.module('KypAdmin', ['ngRoute', 'ngResource', 'textAngular', 'ngTextcomplete']);

function MainController($rootScope, $scope, $location, IEM) {



    $scope.disabled = false;

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
    $scope.comments = [comment2]
    $scope.profiles = [{
        id: '1',
        img: 'images/road.jpg',
        name: 'Test',
        info: 'Test',
        like: '',
        comments: $scope.comments
    }]

    $scope.loadProfile = function(p, hash) {
        if (hash != null)
            $location.hash(hash);
        $location.path('/profile');
    }

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
        templateUrl: '/assets/html/list.html',
        controller: MainController
    }).
    when('/edit', {
        templateUrl: '/assets/html/edit.html',
        controller: ProfileController
    }).
    otherwise({
        redirectTo: '/'
    });
});

app.factory('IEM', function($http) {
    var url = "https://inputtools.google.com/request?text=n&itc=ta-t-i0-pinyin&num=11&cp=0&cs=0&ie=utf-8&oe=utf-8&app=demopage"
    return {
        queryText: function(txt) {
            return $http.post("https://inputtools.google.com/request?&itc=ta-t-i0-und&num=11&cp=0&cs=0&ie=utf-8&oe=utf-8&text=" + txt);
        }
    }
});

app.directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if (event.which === 8 && scope.data.text.length > 0) {
                scope.key = 8;
            } else {
                scope.key = null;
            }
            if (event.which === 13) {
                scope.$apply(function() {
                    scope.$eval(attrs.ngEnter);

                });

                event.preventDefault();
            }
        });
    };
});
