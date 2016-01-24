angular.module('profile', [])

.factory('profile', ['$q', 'Profiles','Consti','Comments', function($q, Profiles, Consti,Comments) {
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
        },

        addComment: function(scope) {
            var deferred = $q.defer();
            Comments.save({text:scope.p.new_comment, prof_id:scope.prof_id,det_id:scope.det_id}, function(resp, headers) {
                deferred.resolve(resp);
            });

            return deferred.promise;
        }, 


    };
}])


.factory('Profiles', function($resource) {
    return $resource('/profile/:prof_id/:det_id'); // Note the full endpoint address
})

.factory('Consti', function($resource) {
    return $resource('/consti/:id'); // Note the full endpoint address
})

.factory('Comments', function($resource) {
    return $resource('/comments', {}, {
        'save': {
            method: 'POST',
            isArray: true
        }
    }); // Note the full endpoint address
})
