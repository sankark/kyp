var app = angular.module('Kyp', ['ngRoute', 'ngResource', 'angularjs-gravatardirective', 'autocomplete','geolocation','profile','ngSanitize']);
app.config(function($interpolateProvider){
    $interpolateProvider.startSymbol('{%').endSymbol('%}');
});

function MainController($rootScope, $scope, $location,ConstiService,geolocation) {

    $scope.consti = ["Alandur", "Alangudi", "Alangulam", "Ambasamudram", "Ambattur", "Ambur", "Anaikattu", "Andipatti", "Anna Nagar", "Anthiyur", "Arakkonam", "Arani", "Aranthangi", "Aravakurichi", "Arcot", "Ariyalur", "Aruppukkottai", "Athoor", "Attur", "Avadi", "Avanashi (SC)", "Bargur", "Bhavani", "Bhavanisagar", "Bhuvanagiri", "Bodinayakanur", "Chengalpattu", "Chengam", "Chepauk-Thiruvallikeni", "Cheyyar", "Cheyyur", "Chidambaram", "Coimbatore (North)", "Coimbatore (South)", "Colachel", "Coonoor", "Cuddalore", "Cumbum", "Dharapuram (SC)", "Dharmapuri", "Dindigul", "Dr.Radhakrishnan Nagar", "Edappadi", "Egmore", "Erode (East)", "Erode (West)", "Gandharvakottai", "Gangavalli", "Gingee", "Gobichettipalayam", "Gudalur", "Gudiyattam", "Gummidipoondi", "Harbour", "Harur", "Hosur", "Jayankondam", "Jolarpet", "Kadayanallur", "Kalasapakkam", "Kallakurichi", "Kancheepuram", "Kangayam", "Kanniyakumari", "Karaikudi", "Karur", "Katpadi", "Kattumannarkoil(SC)", "Kavundampalayam", "Killiyoor", "Kilpennathur", "Kilvaithinankuppam", "Kilvelur", "Kinathukadavu", "Kolathur", "Kovilpatti", "Krishnagiri", "Krishnarayapuram", "Kulithalai", "Kumarapalayam", "Kumbakonam", "Kunnam", "Kurinjipadi", "Lalgudi", "Madathukulam", "Madavaram", "Madurai Central", "Madurai East", "Madurai North", "Madurai South", "Madurai West", "Madurantakam", "Maduravoyal", "Mailam", "Manachanallur", "Manamadurai", "Manapparai", "Mannargudi", "Mayiladuthurai", "Melur", "Mettuppalayam", "Mettur", "Modakkurichi", "Mudhukulathur", "Musiri", "Mylapore", "Nagapattinam", "Nagercoil", "Namakkal", "Nanguneri", "Nannilam", "Natham", "Neyveli", "Nilakkottai", "Oddanchatram", "Omalur", "Orathanadu", "Ottapidaram", "Padmanabhapuram", "Palacode", "Palani", "Palayamkottai", "Palladam", "Pallavaram", "Panruti", "Papanasam", "Pappireddippatti", "Paramakudi", "Paramathi-Velur", "Pattukkottai", "Pennagaram", "Perambalur", "Perambur", "Peravurani", "Periyakulam", "Perundurai", "Pollachi", "Polur", "Ponneri", "Poompuhar", "Poonamallee", "Pudukkottai", "Radhapuram", "Rajapalayam", "Ramanathapuram", "Ranipet", "Rasipuram", "Rishivandiyam", "Royapuram", "Saidapet", "Salem (North)", "Salem (South)", "Salem (West)", "Sankarankovil", "Sankarapuram", "Sankari", "Sattur", "Senthamangalam", "Sholavandan", "Sholingur", "Shozhinganallur", "Singanallur", "Sirkazhi", "Sivaganga", "Sivakasi", "Sriperumbudur", "Srirangam", "Srivaikuntam", "Srivilliputhur", "Sulur", "Tambaram", "Tenkasi", "Thalli", "Thanjavur", "Thiru-Vi-Ka-Nagar", "Thirumangalam", "Thirumayam", "Thiruparankundram", "Thiruporur", "Thiruthuraipoondi", "Thiruvaiyaru", "Thiruvallur", "Thiruvarur", "Thiruverumbur", "Thiruvidaimarudur", "Thiruvottiyur", "Thiyagarayanagar", "Thondamuthur", "Thoothukkudi", "Thousand Lights", "Thuraiyur", "Tindivanam", "Tiruchendur", "Tiruchengodu", "Tiruchirappalli (East)", "Tiruchirappalli (West)", "Tiruchuli", "Tirukkoyilur", "Tirunelveli", "Tirupattur", "Tiruppattur", "Tiruppur (North)", "Tiruppur (South)", "Tiruttani", "Tiruvadanai", "Tiruvannamalai", "Tittakudi (SC)", "Udhagamandalam", "Udumalaipettai", "Ulundurpettai", "Usilampatti", "Uthangarai", "Uthiramerur", "Valparai", "Vandavasi", "Vaniyambadi", "Vanur", "Vasudevanallur", "Vedaranyam", "Vedasandur", "Veerapandi", "Velachery", "Vellore", "Veppanahalli", "Vikravandi", "Vilathikulam", "Vilavancode", "Villivakkam", "Villupuram", "Viralimalai", "Virudhunagar", "Virugampakkam", "Vridhachalam", "Yercaud"];

    $scope.listConsti = function(consti){
        $location.path('/consti/'+consti);
    }

    $scope.addLike = function(consti){
        
    }

    $scope.getProfile = function(consti) {
        $rootScope.sel_consti = consti;
        $scope.listConsti(consti);
    }

    $scope.getConst = function() {
        
        ConstiService.getConst($scope.point).then(function(r) {
            $scope.myconsti = r.Data.Assemb_Const;
            $rootScope.active_cls = '';
            $rootScope.progress = 'none';
            $scope.ena_suggest = 'none';
            endProgress($scope);
        })
    }
    geolocation.getLocation().then(function(data) {

        startProgress($scope);
        $scope.point = {
            Lat: 13.0336,
            Lng: 80.2687
        }
        $scope.getConst();
    })

}

function ConstiController($rootScope, $scope, $location,profile, $routeParams) {
    console.log($scope.sel_consti);

    $scope.loadProfile = function(p, hash) {
        if (hash != null)
            $location.hash(hash);
        $location.path('/profile/'+p.id+"/"+p.details.id);
    }

    $scope.listConsti = function(){
        startProgress($scope);
        $scope.consti = $routeParams.consti;
        profile.listConsti($scope).then(function(resp){
            $scope.profiles = resp;
            endProgress($scope)
        });
    }

    $scope.previous = function(){
        $location.path('/');
    }

    $scope.listConsti();

}


function ProfileController($rootScope, $scope, $location,profile, $routeParams) {
    console.log($scope.sel_consti);

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

    //recaptcha('recap_new_comment')

    $scope.recaptcha = function(id, action) {
        if($scope.recaptchaDone == null){
        $scope.recap_widget = grecaptcha.render(id, {
            'sitekey': '6LewKhQTAAAAAKwG3N1PE6rg5XRghJkHAl05GJXN',
            'callback' : $scope.recaptchaResp
        });
    }
    }


    $scope.getProfile = function(){
        startProgress($scope);
        $scope.prof_id = $routeParams.prof_id;
        $scope.det_id = $routeParams.det_id;
        profile.getProfile($scope).then(function(resp){
            $scope.p = resp;
            endProgress($scope)
        });
    }

    $scope.addComment = function(){
        startProgress($scope);
        $scope.prof_id = $routeParams.prof_id;
        $scope.det_id = $routeParams.det_id;
        profile.addComment($scope).then(function(resp){
            $scope.p.comments = resp;
            endProgress($scope)
        });
    }

    $scope.previous = function(){
        $location.path('/consti/'+$scope.p.consti);
    }

    $scope.getProfile();

}


app.config(function($routeProvider, $locationProvider) {
    $routeProvider.
    when('/', {
        templateUrl: '/assets/html/myconst.html',
        controller: MainController
    }).
    when('/consti/:consti', { 
        templateUrl: '/assets/html/const.html',
        controller: ConstiController
    }).
    when('/profile/:prof_id/:det_id', {
        templateUrl: '/assets/html/profiles/view.html',
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


function endProgress(scope){
        scope.active_cls = '';
        scope.progress = 'none';
}


function startProgress(scope){
        scope.active_cls = 'is-active';
        scope.progress = 'block';
}


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
