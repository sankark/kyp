var app = angular.module('KypAdmin', ['ngRoute', 'ngResource', 'textAngular', 'ngTextcomplete','autocomplete']);
var g_consti = ["Alandur", "Alangudi", "Alangulam", "Ambasamudram", "Ambattur", "Ambur", "Anaikattu", "Andipatti", "Anna Nagar", "Anthiyur", "Arakkonam", "Arani", "Aranthangi", "Aravakurichi", "Arcot", "Ariyalur", "Aruppukkottai", "Athoor", "Attur", "Avadi", "Avanashi (SC)", "Bargur", "Bhavani", "Bhavanisagar", "Bhuvanagiri", "Bodinayakanur", "Chengalpattu", "Chengam", "Chepauk-Thiruvallikeni", "Cheyyar", "Cheyyur", "Chidambaram", "Coimbatore (North)", "Coimbatore (South)", "Colachel", "Coonoor", "Cuddalore", "Cumbum", "Dharapuram (SC)", "Dharmapuri", "Dindigul", "Dr.Radhakrishnan Nagar", "Edappadi", "Egmore", "Erode (East)", "Erode (West)", "Gandharvakottai", "Gangavalli", "Gingee", "Gobichettipalayam", "Gudalur", "Gudiyattam", "Gummidipoondi", "Harbour", "Harur", "Hosur", "Jayankondam", "Jolarpet", "Kadayanallur", "Kalasapakkam", "Kallakurichi", "Kancheepuram", "Kangayam", "Kanniyakumari", "Karaikudi", "Karur", "Katpadi", "Kattumannarkoil(SC)", "Kavundampalayam", "Killiyoor", "Kilpennathur", "Kilvaithinankuppam", "Kilvelur", "Kinathukadavu", "Kolathur", "Kovilpatti", "Krishnagiri", "Krishnarayapuram", "Kulithalai", "Kumarapalayam", "Kumbakonam", "Kunnam", "Kurinjipadi", "Lalgudi", "Madathukulam", "Madavaram", "Madurai Central", "Madurai East", "Madurai North", "Madurai South", "Madurai West", "Madurantakam", "Maduravoyal", "Mailam", "Manachanallur", "Manamadurai", "Manapparai", "Mannargudi", "Mayiladuthurai", "Melur", "Mettuppalayam", "Mettur", "Modakkurichi", "Mudhukulathur", "Musiri", "Mylapore", "Nagapattinam", "Nagercoil", "Namakkal", "Nanguneri", "Nannilam", "Natham", "Neyveli", "Nilakkottai", "Oddanchatram", "Omalur", "Orathanadu", "Ottapidaram", "Padmanabhapuram", "Palacode", "Palani", "Palayamkottai", "Palladam", "Pallavaram", "Panruti", "Papanasam", "Pappireddippatti", "Paramakudi", "Paramathi-Velur", "Pattukkottai", "Pennagaram", "Perambalur", "Perambur", "Peravurani", "Periyakulam", "Perundurai", "Pollachi", "Polur", "Ponneri", "Poompuhar", "Poonamallee", "Pudukkottai", "Radhapuram", "Rajapalayam", "Ramanathapuram", "Ranipet", "Rasipuram", "Rishivandiyam", "Royapuram", "Saidapet", "Salem (North)", "Salem (South)", "Salem (West)", "Sankarankovil", "Sankarapuram", "Sankari", "Sattur", "Senthamangalam", "Sholavandan", "Sholingur", "Shozhinganallur", "Singanallur", "Sirkazhi", "Sivaganga", "Sivakasi", "Sriperumbudur", "Srirangam", "Srivaikuntam", "Srivilliputhur", "Sulur", "Tambaram", "Tenkasi", "Thalli", "Thanjavur", "Thiru-Vi-Ka-Nagar", "Thirumangalam", "Thirumayam", "Thiruparankundram", "Thiruporur", "Thiruthuraipoondi", "Thiruvaiyaru", "Thiruvallur", "Thiruvarur", "Thiruverumbur", "Thiruvidaimarudur", "Thiruvottiyur", "Thiyagarayanagar", "Thondamuthur", "Thoothukkudi", "Thousand Lights", "Thuraiyur", "Tindivanam", "Tiruchendur", "Tiruchengodu", "Tiruchirappalli (East)", "Tiruchirappalli (West)", "Tiruchuli", "Tirukkoyilur", "Tirunelveli", "Tirupattur", "Tiruppattur", "Tiruppur (North)", "Tiruppur (South)", "Tiruttani", "Tiruvadanai", "Tiruvannamalai", "Tittakudi (SC)", "Udhagamandalam", "Udumalaipettai", "Ulundurpettai", "Usilampatti", "Uthangarai", "Uthiramerur", "Valparai", "Vandavasi", "Vaniyambadi", "Vanur", "Vasudevanallur", "Vedaranyam", "Vedasandur", "Veerapandi", "Velachery", "Vellore", "Veppanahalli", "Vikravandi", "Vilathikulam", "Vilavancode", "Villivakkam", "Villupuram", "Viralimalai", "Virudhunagar", "Virugampakkam", "Vridhachalam", "Yercaud"];
app.config(function($interpolateProvider){
    $interpolateProvider.startSymbol('{%').endSymbol('%}');
});

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

    $scope.editProfile = function(p){
            if(p == null){
                 $location.path('/edit');
            }
    }





}

function ProfileController($rootScope, $scope, $location,IEM) {

$scope.consti = g_consti;

var english_labels = {name:"Name", consti:"Constituency", party:"Party", experience:"Expertise"};
var local_labels = {};
var all_labels = {eng:english_labels,loc:local_labels}

$scope.label = all_labels['eng'];

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

    $scope.recaptcha = function() {
        grecaptcha.render('html_element', {
            'sitekey': '6LewKhQTAAAAAKwG3N1PE6rg5XRghJkHAl05GJXN'
        });
    }


    $scope.createProfile = function(){

    }
}


app.config(function($routeProvider, $locationProvider) {
    $routeProvider.
    when('/', {
        templateUrl: '/assets/html/profiles/list.html',
        controller: MainController
    }).
    when('/edit', {
        templateUrl: '/assets/html/profiles/edit.html',
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
