angular.module('profile', [])

.factory('profile', ['$q', 'Profiles','Consti','Comments','Likes','Unlikes','User','Volunteer','AdmUser', 
         function($q, Profiles, Consti,Comments,Likes, Unlikes,User,Volunteer,AdmUser) {
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

        toggleLikes : function(scope){
            var deferred = $q.defer();
            var req = {prof_id:scope.prof_id,det_id:scope.det_id, type:scope.like_type, like_id: scope.like_id};
            Likes.query(req, function(resp, headers) {
                deferred.resolve(resp);
            });

            return deferred.promise;
        },

        toggleUnlikes: function(scope){
            var deferred = $q.defer();
            var req = {prof_id:scope.prof_id,det_id:scope.det_id, type:scope.like_type, like_id: scope.like_id};
            Unlikes.query(req, function(resp, headers) {
                deferred.resolve(resp);
            });

            return deferred.promise;
        },

        getUser: function(scope) {
            var deferred = $q.defer();

            User.get({},function(resp, headers) {
                deferred.resolve(resp);
            });

            return deferred.promise;
        },


        sendVolRequest:function(scope){
            var deferred = $q.defer();
            Volunteer.save({id:scope.vol_email, name:scope.vol_name, consti:scope.myconsti, message:scope.vol_message}, function(resp, headers) {
                deferred.resolve(resp);
            });

            return deferred.promise;
        },

        listAdmUser: function(scope) {
            var deferred = $q.defer();
            AdmUser.query({}, function(resp, headers) {
                deferred.resolve(resp);
            });

            return deferred.promise;
        },

        updateAdmUser: function(scope) {
            var deferred = $q.defer();
            AdmUser.save(scope.user, function(resp, headers) {
                deferred.resolve(resp);
            });

            return deferred.promise;
        }, 

        getAdmUser: function(scope) {
            var deferred = $q.defer();

            AdmUser.get({user_id:scope.user_id},function(resp, headers) {
                deferred.resolve(resp);
            });

            return deferred.promise;
        },

    };
}])


.factory('AdmUser', function($resource) {
    return $resource('/user/:user_id'); // Note the full endpoint address
})


.factory('Volunteer', function($resource) {
    return $resource('/volunteer'); // Note the full endpoint address
})

.factory('User', function($resource) {
    return $resource('/me'); // Note the full endpoint address
})

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

.factory('Likes', function($resource) {
    return $resource('/likes/:prof_id/:det_id',{},{
        'query' : {
            isArray: false
        }
    });
})

.factory('Unlikes', function($resource) {
    return $resource('/unlikes/:prof_id/:det_id',{},{
        'query' : {
            isArray: false
        }
    }); // Note the full endpoint address
})

