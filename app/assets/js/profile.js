angular.module('profile', [])

.factory('profile', ['$q', 'Profiles','Consti', function($q, Profiles, Consti) {
    return {
        createProfile: function(scope) {
            var deferred = $q.defer();

            Profiles.save(scope.profile, function(resp, headers) {
                deferred.resolve(resp);
            });

            return deferred.promise;
        },

        listProfile: function(scope) {
            var deferred = $q.defer();
            Profiles.query(function(resp, headers) {
                deferred.resolve(resp);
            });

            return deferred.promise;
        },

        getProfile: function(scope) {
            var deferred = $q.defer();

            Profiles.get({
                prof_id: scope.prof_id,
                det_id : scope.det_id
            },function(resp, headers) {
                deferred.resolve(resp);
            });

            return deferred.promise;
        },

        removeProfile: function(scope) {
            var deferred = $q.defer();

            Profiles.delete({
                prof_id: scope.prof_id,
                det_id : scope.det_id
            },function(resp, headers) {
                deferred.resolve(resp);
            });

            return deferred.promise;
        },

        listConsti: function(scope) {
            var deferred = $q.defer();
            Consti.query({id:scope.consti}, function(resp, headers) {
                deferred.resolve(resp);
            });

            return deferred.promise;
        }



    };
}])


.factory('Profiles', function($resource) {
    return $resource('/profile/:prof_id/:det_id'); // Note the full endpoint address
})

.factory('Consti', function($resource) {
    return $resource('/consti/:id'); // Note the full endpoint address
})
