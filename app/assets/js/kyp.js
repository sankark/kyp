var app = angular.module('Kyp', ['ngRoute', 'ngResource', 'angularjs-gravatardirective', 'autocomplete','geolocation']);
app.config(function($interpolateProvider){
    $interpolateProvider.startSymbol('{%').endSymbol('%}');
});

function MainController($rootScope, $scope, $location,ConstiService,geolocation) {

    $scope.consti = ["Alandur", "Alangudi", "Alangulam", "Ambasamudram", "Ambattur", "Ambur", "Anaikattu", "Andipatti", "Anna Nagar", "Anthiyur", "Arakkonam", "Arani", "Aranthangi", "Aravakurichi", "Arcot", "Ariyalur", "Aruppukkottai", "Athoor", "Attur", "Avadi", "Avanashi (SC)", "Bargur", "Bhavani", "Bhavanisagar", "Bhuvanagiri", "Bodinayakanur", "Chengalpattu", "Chengam", "Chepauk-Thiruvallikeni", "Cheyyar", "Cheyyur", "Chidambaram", "Coimbatore (North)", "Coimbatore (South)", "Colachel", "Coonoor", "Cuddalore", "Cumbum", "Dharapuram (SC)", "Dharmapuri", "Dindigul", "Dr.Radhakrishnan Nagar", "Edappadi", "Egmore", "Erode (East)", "Erode (West)", "Gandharvakottai", "Gangavalli", "Gingee", "Gobichettipalayam", "Gudalur", "Gudiyattam", "Gummidipoondi", "Harbour", "Harur", "Hosur", "Jayankondam", "Jolarpet", "Kadayanallur", "Kalasapakkam", "Kallakurichi", "Kancheepuram", "Kangayam", "Kanniyakumari", "Karaikudi", "Karur", "Katpadi", "Kattumannarkoil(SC)", "Kavundampalayam", "Killiyoor", "Kilpennathur", "Kilvaithinankuppam", "Kilvelur", "Kinathukadavu", "Kolathur", "Kovilpatti", "Krishnagiri", "Krishnarayapuram", "Kulithalai", "Kumarapalayam", "Kumbakonam", "Kunnam", "Kurinjipadi", "Lalgudi", "Madathukulam", "Madavaram", "Madurai Central", "Madurai East", "Madurai North", "Madurai South", "Madurai West", "Madurantakam", "Maduravoyal", "Mailam", "Manachanallur", "Manamadurai", "Manapparai", "Mannargudi", "Mayiladuthurai", "Melur", "Mettuppalayam", "Mettur", "Modakkurichi", "Mudhukulathur", "Musiri", "Mylapore", "Nagapattinam", "Nagercoil", "Namakkal", "Nanguneri", "Nannilam", "Natham", "Neyveli", "Nilakkottai", "Oddanchatram", "Omalur", "Orathanadu", "Ottapidaram", "Padmanabhapuram", "Palacode", "Palani", "Palayamkottai", "Palladam", "Pallavaram", "Panruti", "Papanasam", "Pappireddippatti", "Paramakudi", "Paramathi-Velur", "Pattukkottai", "Pennagaram", "Perambalur", "Perambur", "Peravurani", "Periyakulam", "Perundurai", "Pollachi", "Polur", "Ponneri", "Poompuhar", "Poonamallee", "Pudukkottai", "Radhapuram", "Rajapalayam", "Ramanathapuram", "Ranipet", "Rasipuram", "Rishivandiyam", "Royapuram", "Saidapet", "Salem (North)", "Salem (South)", "Salem (West)", "Sankarankovil", "Sankarapuram", "Sankari", "Sattur", "Senthamangalam", "Sholavandan", "Sholingur", "Shozhinganallur", "Singanallur", "Sirkazhi", "Sivaganga", "Sivakasi", "Sriperumbudur", "Srirangam", "Srivaikuntam", "Srivilliputhur", "Sulur", "Tambaram", "Tenkasi", "Thalli", "Thanjavur", "Thiru-Vi-Ka-Nagar", "Thirumangalam", "Thirumayam", "Thiruparankundram", "Thiruporur", "Thiruthuraipoondi", "Thiruvaiyaru", "Thiruvallur", "Thiruvarur", "Thiruverumbur", "Thiruvidaimarudur", "Thiruvottiyur", "Thiyagarayanagar", "Thondamuthur", "Thoothukkudi", "Thousand Lights", "Thuraiyur", "Tindivanam", "Tiruchendur", "Tiruchengodu", "Tiruchirappalli (East)", "Tiruchirappalli (West)", "Tiruchuli", "Tirukkoyilur", "Tirunelveli", "Tirupattur", "Tiruppattur", "Tiruppur (North)", "Tiruppur (South)", "Tiruttani", "Tiruvadanai", "Tiruvannamalai", "Tittakudi (SC)", "Udhagamandalam", "Udumalaipettai", "Ulundurpettai", "Usilampatti", "Uthangarai", "Uthiramerur", "Valparai", "Vandavasi", "Vaniyambadi", "Vanur", "Vasudevanallur", "Vedaranyam", "Vedasandur", "Veerapandi", "Velachery", "Vellore", "Veppanahalli", "Vikravandi", "Vilathikulam", "Vilavancode", "Villivakkam", "Villupuram", "Viralimalai", "Virudhunagar", "Virugampakkam", "Vridhachalam", "Yercaud"];
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

    $scope.listProfile = function(consti){

    }

    $scope.addLike = function(consti){
        
    }

    $scope.getProfile = function(typed) {
        $rootScope.sel_consti = typed;
        $scope.loadProfile();
        console.log(typed);
    }

    $scope.getConst = function() {
        
        ConstiService.getConst($scope.point).then(function(r) {
            $scope.myconsti = r.Data.Assemb_Const;
             $scope.active_cls = '';
             $scope.progress = "none";
             $scope.ena_suggest = 'none';
        })
    }
    geolocation.getLocation().then(function(data) {
        $scope.active_cls = 'is-active';
        $scope.progress = 'block';
        $scope.point = {
            Lat: 13.0336,
            Lng: 80.2687
        }
        $scope.getConst();
    })

}

function ProfileController($rootScope, $scope, $location) {
    console.log($scope.sel_consti);
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

    $scope.recaptchaResp = function(resp){
        $scope.recaptchaDone=true;
/*        yNode.firstChild) {
          myNodgrecaptcha.reset();
        var myNode = document.getElementById($scope.recaptchaId);
        while (me.removeChild(myNode.firstChild);
        }
        $scope.recaptchaId=null;*/
       //grecaptcha.reset($scope.recap_widget);
    }

    $scope.recaptcha = function(id, action) {
        if($scope.recaptchaDone == null){
        $scope.recap_widget = grecaptcha.render(id, {
            'sitekey': '6LewKhQTAAAAAKwG3N1PE6rg5XRghJkHAl05GJXN',
            'callback' : $scope.recaptchaResp
        });
    }
    }

}


app.config(function($routeProvider, $locationProvider) {
    $routeProvider.
    when('/', {
        templateUrl: '/assets/html/myconst.html',
        controller: MainController
    }).
    when('/const', {
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

    app.directive('mdlUpgrade', function($timeout){

        return {
            restrict: 'A',
            compile: function(){
                return {
                    post: function postLink(scope, element){
                        $timeout(function(){
                            componentHandler.upgradeElements(element[0]);
                        }, 1500);
                    }
                }
            },
        };

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
