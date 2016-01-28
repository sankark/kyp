var app = angular.module('KypAdmin', ['ngRoute', 'ngResource', 'textAngular', 'ngTextcomplete', 'autocomplete', 'translit', 'profile','storage']);
var g_consti = ["Alandur", "Alangudi", "Alangulam", "Ambasamudram", "Ambattur", "Ambur", "Anaikattu", "Andipatti", "Anna Nagar", "Anthiyur", "Arakkonam", "Arani", "Aranthangi", "Aravakurichi", "Arcot", "Ariyalur", "Aruppukkottai", "Athoor", "Attur", "Avadi", "Avanashi (SC)", "Bargur", "Bhavani", "Bhavanisagar", "Bhuvanagiri", "Bodinayakanur", "Chengalpattu", "Chengam", "Chepauk-Thiruvallikeni", "Cheyyar", "Cheyyur", "Chidambaram", "Coimbatore (North)", "Coimbatore (South)", "Colachel", "Coonoor", "Cuddalore", "Cumbum", "Dharapuram (SC)", "Dharmapuri", "Dindigul", "Dr.Radhakrishnan Nagar", "Edappadi", "Egmore", "Erode (East)", "Erode (West)", "Gandharvakottai", "Gangavalli", "Gingee", "Gobichettipalayam", "Gudalur", "Gudiyattam", "Gummidipoondi", "Harbour", "Harur", "Hosur", "Jayankondam", "Jolarpet", "Kadayanallur", "Kalasapakkam", "Kallakurichi", "Kancheepuram", "Kangayam", "Kanniyakumari", "Karaikudi", "Karur", "Katpadi", "Kattumannarkoil(SC)", "Kavundampalayam", "Killiyoor", "Kilpennathur", "Kilvaithinankuppam", "Kilvelur", "Kinathukadavu", "Kolathur", "Kovilpatti", "Krishnagiri", "Krishnarayapuram", "Kulithalai", "Kumarapalayam", "Kumbakonam", "Kunnam", "Kurinjipadi", "Lalgudi", "Madathukulam", "Madavaram", "Madurai Central", "Madurai East", "Madurai North", "Madurai South", "Madurai West", "Madurantakam", "Maduravoyal", "Mailam", "Manachanallur", "Manamadurai", "Manapparai", "Mannargudi", "Mayiladuthurai", "Melur", "Mettuppalayam", "Mettur", "Modakkurichi", "Mudhukulathur", "Musiri", "Mylapore", "Nagapattinam", "Nagercoil", "Namakkal", "Nanguneri", "Nannilam", "Natham", "Neyveli", "Nilakkottai", "Oddanchatram", "Omalur", "Orathanadu", "Ottapidaram", "Padmanabhapuram", "Palacode", "Palani", "Palayamkottai", "Palladam", "Pallavaram", "Panruti", "Papanasam", "Pappireddippatti", "Paramakudi", "Paramathi-Velur", "Pattukkottai", "Pennagaram", "Perambalur", "Perambur", "Peravurani", "Periyakulam", "Perundurai", "Pollachi", "Polur", "Ponneri", "Poompuhar", "Poonamallee", "Pudukkottai", "Radhapuram", "Rajapalayam", "Ramanathapuram", "Ranipet", "Rasipuram", "Rishivandiyam", "Royapuram", "Saidapet", "Salem (North)", "Salem (South)", "Salem (West)", "Sankarankovil", "Sankarapuram", "Sankari", "Sattur", "Senthamangalam", "Sholavandan", "Sholingur", "Shozhinganallur", "Singanallur", "Sirkazhi", "Sivaganga", "Sivakasi", "Sriperumbudur", "Srirangam", "Srivaikuntam", "Srivilliputhur", "Sulur", "Tambaram", "Tenkasi", "Thalli", "Thanjavur", "Thiru-Vi-Ka-Nagar", "Thirumangalam", "Thirumayam", "Thiruparankundram", "Thiruporur", "Thiruthuraipoondi", "Thiruvaiyaru", "Thiruvallur", "Thiruvarur", "Thiruverumbur", "Thiruvidaimarudur", "Thiruvottiyur", "Thiyagarayanagar", "Thondamuthur", "Thoothukkudi", "Thousand Lights", "Thuraiyur", "Tindivanam", "Tiruchendur", "Tiruchengodu", "Tiruchirappalli (East)", "Tiruchirappalli (West)", "Tiruchuli", "Tirukkoyilur", "Tirunelveli", "Tirupattur", "Tiruppattur", "Tiruppur (North)", "Tiruppur (South)", "Tiruttani", "Tiruvadanai", "Tiruvannamalai", "Tittakudi (SC)", "Udhagamandalam", "Udumalaipettai", "Ulundurpettai", "Usilampatti", "Uthangarai", "Uthiramerur", "Valparai", "Vandavasi", "Vaniyambadi", "Vanur", "Vasudevanallur", "Vedaranyam", "Vedasandur", "Veerapandi", "Velachery", "Vellore", "Veppanahalli", "Vikravandi", "Vilathikulam", "Vilavancode", "Villivakkam", "Villupuram", "Viralimalai", "Virudhunagar", "Virugampakkam", "Vridhachalam", "Yercaud"];
app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('{%').endSymbol('%}');
});

function ProfileController($rootScope, $scope, $location, profile, translit, $routeParams,storage) {

    var self = this;

    $scope.consti = g_consti;

    var english_labels = {
        name: "Name",
        consti: "Constituency",
        party: "Party",
        experience: "Expertise"
    };
    var local_labels = {};
    var all_labels = {
        eng: english_labels,
        loc: local_labels
    }

    $scope.label = all_labels['eng'];

    $scope.comments = [];



    $scope.input = function(d) {
        $scope.data = d;
        translit.input($scope).then(function(data) {
            $scope.words = data;
        });
    }

    $scope.select = function(index, data) {
        translit.select($scope, index, data);
    }

    $scope.recaptcha = function() {
        grecaptcha.render('html_element', {
            'sitekey': '6LewKhQTAAAAAKwG3N1PE6rg5XRghJkHAl05GJXN'
        });
    }

    $scope.createProfile = function() {

        $scope.prof_id = $routeParams.prof_id;
        $scope.det_id = $routeParams.det_id;

        $scope.profile = createProfileFromScope($scope);

        $scope.uploader.queue[0].upload();
        profile.createProfile($scope).then(function(data) {

        });
    }


    $scope.getProfile = function() {
        $scope.prof_id = $routeParams.prof_id;
        $scope.det_id = $routeParams.det_id;

        profile.getProfile($scope).then(function(data) {
            createProfileFromResponse($scope,data);
        });
    }


    $scope.listProfile = function() {
        profile.listProfile($scope).then(function(data) {

        });
    }


    $scope.removeProfile = function() {
        profile.removeProfile($scope).then(function(data) {

        });
    }

    $scope.editProfile = function(prof_id,det_id) {
        var path = "/edit/"
        if (prof_id == null) {
            prof_id = 0;
            det_id = 0;
        }
        $location.path(path + prof_id +"/"+det_id);
    }

    $scope.listProfile = function() {
        profile.listProfile().then(function(resp) {
            $scope.profiles = resp;
        });
    }

  storage.initImageUploader($scope);

}


app.config(function($routeProvider, $locationProvider) {
    $routeProvider.
    when('/', {
        templateUrl: '/assets/html/profiles/list.html',
        controller: ProfileController
    }).
    when('/edit/:prof_id/:det_id', {
        templateUrl: '/assets/html/profiles/edit.html',
        controller: ProfileController
    }).
    otherwise({
        redirectTo: '/'
    });
});

function createProfileFromScope(scope) {
    var profile = {
        consti: scope.myconsti,
        details: {
            party: scope.party.text,
            expert: scope.expert.text,
            name: scope.name.text,
            htmlContent: scope.htmlContent
        }
    }

    if (scope.prof_id != null) {
        profile.id = parseInt(scope.prof_id);
        profile.details.id = parseInt(scope.det_id);
    }
    return profile;
}

function createProfileFromResponse (scope,resp) {
    scope.name = {}; 
    scope.expert={};
    scope.party={};
    scope.myconsti = resp.consti;
    scope.name.text = resp.details.name;
    scope.expert.text = resp.details.expert;
    scope.party.text = resp.details.party;
    scope.htmlContent = resp.details.htmlContent;
    scope.id = resp.id;
    scope.p = resp;
}
