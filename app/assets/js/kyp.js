var app = angular.module('Kyp', ['720kb.socialshare','ngRoute', 'ngResource', 'angularjs-gravatardirective', 'autocomplete','geolocation','profile','ngSanitize','LocalStorageModule','translit']);
var LocalStorage = false;
var CONSTI = ["Alandur", "Alangudi", "Alangulam", "Ambasamudram", "Ambattur", "Ambur", "Anaikattu", "Andipatti", "Anna Nagar", "Anthiyur", "Arakkonam", "Arani", "Aranthangi", "Aravakurichi", "Arcot", "Ariyalur", "Aruppukkottai", "Athoor", "Attur", "Avadi", "Avanashi (SC)", "Bargur", "Bhavani", "Bhavanisagar", "Bhuvanagiri", "Bodinayakanur", "Chengalpattu", "Chengam", "Chepauk-Thiruvallikeni", "Cheyyar", "Cheyyur", "Chidambaram", "Coimbatore (North)", "Coimbatore (South)", "Colachel", "Coonoor", "Cuddalore", "Cumbum", "Dharapuram (SC)", "Dharmapuri", "Dindigul", "Dr.Radhakrishnan Nagar", "Edappadi", "Egmore", "Erode (East)", "Erode (West)", "Gandharvakottai", "Gangavalli", "Gingee", "Gobichettipalayam", "Gudalur", "Gudiyattam", "Gummidipoondi", "Harbour", "Harur", "Hosur", "Jayankondam", "Jolarpet", "Kadayanallur", "Kalasapakkam", "Kallakurichi", "Kancheepuram", "Kangayam", "Kanniyakumari", "Karaikudi", "Karur", "Katpadi", "Kattumannarkoil(SC)", "Kavundampalayam", "Killiyoor", "Kilpennathur", "Kilvaithinankuppam", "Kilvelur", "Kinathukadavu", "Kolathur", "Kovilpatti", "Krishnagiri", "Krishnarayapuram", "Kulithalai", "Kumarapalayam", "Kumbakonam", "Kunnam", "Kurinjipadi", "Lalgudi", "Madathukulam", "Madavaram", "Madurai Central", "Madurai East", "Madurai North", "Madurai South", "Madurai West", "Madurantakam", "Maduravoyal", "Mailam", "Manachanallur", "Manamadurai", "Manapparai", "Mannargudi", "Mayiladuthurai", "Melur", "Mettuppalayam", "Mettur", "Modakkurichi", "Mudhukulathur", "Musiri", "Mylapore", "Nagapattinam", "Nagercoil", "Namakkal", "Nanguneri", "Nannilam", "Natham", "Neyveli", "Nilakkottai", "Oddanchatram", "Omalur", "Orathanadu", "Ottapidaram", "Padmanabhapuram", "Palacode", "Palani", "Palayamkottai", "Palladam", "Pallavaram", "Panruti", "Papanasam", "Pappireddippatti", "Paramakudi", "Paramathi-Velur", "Pattukkottai", "Pennagaram", "Perambalur", "Perambur", "Peravurani", "Periyakulam", "Perundurai", "Pollachi", "Polur", "Ponneri", "Poompuhar", "Poonamallee", "Pudukkottai", "Radhapuram", "Rajapalayam", "Ramanathapuram", "Ranipet", "Rasipuram", "Rishivandiyam", "Royapuram", "Saidapet", "Salem (North)", "Salem (South)", "Salem (West)", "Sankarankovil", "Sankarapuram", "Sankari", "Sattur", "Senthamangalam", "Sholavandan", "Sholingur", "Shozhinganallur", "Singanallur", "Sirkazhi", "Sivaganga", "Sivakasi", "Sriperumbudur", "Srirangam", "Srivaikuntam", "Srivilliputhur", "Sulur", "Tambaram", "Tenkasi", "Thalli", "Thanjavur", "Thiru-Vi-Ka-Nagar", "Thirumangalam", "Thirumayam", "Thiruparankundram", "Thiruporur", "Thiruthuraipoondi", "Thiruvaiyaru", "Thiruvallur", "Thiruvarur", "Thiruverumbur", "Thiruvidaimarudur", "Thiruvottiyur", "Thiyagarayanagar", "Thondamuthur", "Thoothukkudi", "Thousand Lights", "Thuraiyur", "Tindivanam", "Tiruchendur", "Tiruchengodu", "Tiruchirappalli (East)", "Tiruchirappalli (West)", "Tiruchuli", "Tirukkoyilur", "Tirunelveli", "Tirupattur", "Tiruppattur", "Tiruppur (North)", "Tiruppur (South)", "Tiruttani", "Tiruvadanai", "Tiruvannamalai", "Tittakudi (SC)", "Udhagamandalam", "Udumalaipettai", "Ulundurpettai", "Usilampatti", "Uthangarai", "Uthiramerur", "Valparai", "Vandavasi", "Vaniyambadi", "Vanur", "Vasudevanallur", "Vedaranyam", "Vedasandur", "Veerapandi", "Velachery", "Vellore", "Veppanahalli", "Vikravandi", "Vilathikulam", "Vilavancode", "Villivakkam", "Villupuram", "Viralimalai", "Virudhunagar", "Virugampakkam", "Vridhachalam", "Yercaud"];
app.config(function($interpolateProvider){
    $interpolateProvider.startSymbol('{%').endSymbol('%}');
});

function MainController($rootScope, $scope, $location,ConstiService,geolocation,localStorageService) {

    $scope.consti = CONSTI;

      if(localStorageService.isSupported) {
        LocalStorage = true;
        }

    $scope.recall= function(){
        var lop = localStorageService.get("lastOper");
            if(lop!= null && lop.path != null){
                 $location.path(lop.path);
            }else{
                $scope.init();
            }
    }

    $scope.clearLocalStore = function(){
        localStorageService.set("user", null);
        localStorageService.set("lastOper", null);
    }

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
            if(r.Data == null){
                $scope.consti_not_found = "No constituency found. Search your constituency in the above textbox";
            }else{
            $scope.myconsti = r.Data.Assemb_Const;
            }
            $rootScope.active_cls = '';
            $rootScope.progress = 'none';
            $scope.ena_suggest = 'none';
            endProgress($scope);
        })
    }
    $scope.init= function(){
        geolocation.getLocation().then(function(data) {
        startProgress($scope);
        $scope.point = {
            Lat: data.coords.latitude,
            Lng: data.coords.longitude
        }
        $scope.getConst();
        },function(error){
            endProgress($scope);
            $scope.consti_not_found = "Enable location service / Manually select your constituency";
        })
    }
    $scope.recall();
}

function ConstiController($rootScope, $scope, $location,profile, $routeParams, localStorageService, $window) {
    console.log($scope.sel_consti);

    $scope.current_url = $location.absUrl();
    $scope.candidate_name = "";

    if(localStorageService.isSupported) {
        LocalStorage = true;
    }

    $scope.toggleDrawer = function(){
        if($scope.drawer == null){
            $scope.drawer = 'is-visible';
            $scope.obfus = 'is-visible';
        }else{
            $scope.drawer = null;
            $scope.obfus = null;
        }
    }
    $scope.loadProfile = function(p, hash) {
        if (hash != null)
            $location.hash(hash);
        $location.path('/profile/'+p.id+"/"+p.details.id);
    }

    $scope.updateUserLikes = function(user,obj){
        if(user != null){
            var id = String(obj.id);
             obj.like_cls = "";
             obj.unlike_cls ="";
            if(user.like_ids != null && contains(user.like_ids,id)){
                obj.like_cls = "liked";
            }
            if(user.unlike_ids != null && contains(user.unlike_ids,id)){
                obj.unlike_cls = "liked";
            }
        }
    }

    $scope.updateObjects = function(objs){
        var user = localStorageService.get('user');
        angular.forEach(objs, function(obj){
            $scope.updateUserLikes(user,obj);
        });
    }

    $scope.listConsti = function(){
        startProgress($scope);
        $scope.consti = $routeParams.consti;
        profile.listConsti($scope).then(function(resp){
            $scope.profiles = [];
            angular.forEach(resp, function(p){
                p.prof_img_url = getKeyFromMeta(p.meta, 'prof_img_url');
                $scope.updateObjects([p]);
                $scope.updateObjects(p.comments);
                $scope.updateObjects(p.surveys);
                $scope.profiles.push(p);
            });
            endProgress($scope)
        });
    }

    $scope.recall= function(){
        var lop = localStorageService.get("lastOper");
            if(lop!= null && lop.lastMethod == "toggleLike"){
                localStorageService.set("recall",true);
                $scope.toggleLike(lop.args[0], lop.args[1]);
                localStorageService.set("lastOper",null);
            }else if(lop!= null && lop.lastMethod == "toggleUnLike"){
                localStorageService.set("recall",true);
                $scope.toggleUnlike(lop.args[0], lop.args[1]);
                localStorageService.set("lastOper",null);
            }
    }

    $scope.setUser = function(callback){
        profile.getUser().then(function(resp){
            localStorageService.set("user", resp.user);
            if(callback != null){
                callback();
            }

        });
    }

    $scope.clearLocalStore = function(){
        localStorageService.set("user", null);
        localStorageService.set("lastOper", null);
    }

    $scope.isAuthenticated = function(){
        if(localStorageService.get("user") != null){
            return true;
        }
        return false;
    }

    $scope.toggleLike = function(p, like_type){
        var id = p.id;
        if(like_type == "comment"){
            $scope.like_type = "comment";
            $scope.prof_id = p.prof_id;
            $scope.det_id = p.det_id;
        }else if(like_type == "profile"){
            $scope.like_type = "profile";
            $scope.prof_id = p.id;
            $scope.det_id = p.details.id;
        }else if(like_type == "survey"){
            $scope.like_type = "survey";
            $scope.prof_id = p.prof_id;
            $scope.det_id = p.det_id;
        }
        $scope.like_id = id;
        profile.toggleLikes($scope).then(function(resp){
            if(resp.authenticated == "false"){
                if(LocalStorage){
                    var lastOper = {lastMethod:"toggleLike", args:[p,like_type], path:$location.path()};
                    localStorageService.set("lastOper", lastOper);
                }
                if(localStorageService.get('recall') == null)
                    $window.location.href = "login"
                else{
                    localStorageService.set("recall",null);  
                }
            }else{
                $scope.setUser(function(){
                    $scope.updateObjects([p]);
                });
                
            }
            p.likes = resp.likes;
        });

    }

    $scope.toggleUnlike = function(p, like_type){
         var id = p.id;
        if(like_type == "comment"){
            $scope.like_type = "comment";
            $scope.prof_id = p.prof_id;
            $scope.det_id = p.det_id;
        }else if(like_type == "profile"){
            $scope.like_type = "profile";
            $scope.prof_id = p.id;
            $scope.det_id = p.details.id;
        }else if(like_type == "survey"){
            $scope.like_type = "survey";
            $scope.prof_id = p.prof_id;
            $scope.det_id = p.det_id;
        }
        $scope.like_id = id;
        profile.toggleUnlikes($scope).then(function(resp){
             if(resp.authenticated == "false"){
                if(LocalStorage){
                    var lastOper = {lastMethod:"toggleUnLike", args:[p,like_type], path:$location.path()};
                    localStorageService.set("lastOper", lastOper);
                }

                if(localStorageService.get('recall') == null)
                    $window.location.href = "login"
                else{
                    localStorageService.set("recall",null);  
                }
            }else{
                $scope.setUser(function(){
                    $scope.updateObjects([p]);
                });
            }
            p.unlikes = resp.unlikes;
        });

    }

    $scope.path = function(path){
        $location.path(path);
    }

    $scope.previous = function(){
        $location.path('/');
    }

    $scope.setUser();
    $scope.listConsti();
    $scope.recall();

}


function ProfileController($rootScope, $scope, $location,profile, $routeParams,$controller,translit) {
    console.log($scope.sel_consti);
    $scope.alpha = "A";

    $scope.current_url = $location.absUrl();


    angular.extend(this, $controller(ConstiController, {$scope: $scope}));

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

$scope.toggleLang = function(){
    if($scope.alpha == "A"){
        $scope.alpha = "ஆ";
    }else{
        $scope.alpha = "A";
    }
}
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
            $scope.updateObjects([$scope.p]);
            $scope.updateObjects($scope.p.comments);
            $scope.updateObjects($scope.p.surveys);
            angular.forEach($scope.p.surveys,function(r){
                r.prof_id = $scope.prof_id;
                r.det_id = $scope.det_id;
            });
            $scope.p.t_comment = {};
            $scope.p.prof_img_url = getKeyFromMeta($scope.p.meta, 'prof_img_url');
            $scope.consti = $scope.p.consti;
            $scope.candidate_name = $scope.p.details.name;
            endProgress($scope)
        });
    }

    $scope.addComment = function(){
        startProgress($scope);
        $scope.prof_id = $routeParams.prof_id;
        $scope.det_id = $routeParams.det_id;
        $scope.p.new_comment = $scope.p.t_comment.text;
        profile.addComment($scope).then(function(resp){
            $scope.p.comments = resp;
            endProgress($scope)
        });
    }

    $scope.previous = function(){
        $location.path('/consti/'+$scope.p.consti);
    }

    $scope.input = function(d) {
        if($scope.alpha != "A"){
        $scope.data = d;
        translit.input($scope).then(function(data) {
            $scope.words = data;
        });
    }
    }

    $scope.select = function(index, data) {
        if($scope.alpha != "A"){
        translit.select($scope, index, data);
    }
    }

    $scope.getProfile();


}

function VolController($rootScope, $scope, $location,profile, $routeParams,$controller) {

$scope.consti = CONSTI;

    $scope.sendVolRequest = function() {
        profile.sendVolRequest($scope).then(function(resp){
            
        });
    }

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
    when('/volunteer', {
        templateUrl: '/assets/html/volunteer/vol_main.html',
        controller: VolController
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
function getKeyFromMeta(profile_meta, key){
    var val = "";
    angular.forEach(profile_meta, function(m) {
        if(m['key']== key){
            val = m['value'];
            return;
        }
    })
    return val;
}

app.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('kyp')
});

function contains(a, obj) {
    var i = a.length;
    while (i--) {
       if (a[i] === obj) {
           return true;
       }
    }
    return false;
}


