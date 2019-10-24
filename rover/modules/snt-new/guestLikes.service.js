module.exports = function($q, RVBaseWebSrv, $http) {

    let preferences;


    /**
     *
     * @return {*|Object}
     */
    function fetchSelectedPreferences() {
        return $http.get('http://localhost:1337/api/user/likes');
    }

    /**
     *
     */
    function fetchLikes() {
        let user_preference,
            promises = [
                fetchRoomPreferences(),
                fetchSelectedPreferences().
                    then((res) => {
                        user_preference = res.data.likes;
                    })
            ],
            deferred = $q.defer();

        $q.all(promises).
            then(() => {
                deferred.resolve({
                    user_preference,
                    ...preferences
                });
            });

        return deferred.promise;
    }

    /**
     *
     * @param params
     * @return {*}
     */
    function fetchRoomPreferences(params) {
        let deferred = $q.defer(),
            url = 'http://localhost:1337/api/room/preferences';

        if (!preferences) {
            $http.get(url, params).
                then(function(res) {
                    preferences = res.data;
                    deferred.resolve(preferences);
                }, function(err) {
                    deferred.reject(err);
                });
        } else {
            deferred.resolve(preferences);
        }
        return deferred.promise;
    }

    /**
     *
     */
    function saveLikes(payLoad) {
        return RVBaseWebSrv.postJSON('/staff/guest_cards/' + payLoad.userId + '/update_preferences', payLoad.data);
    }

    return {
        fetchLikes,
        saveLikes
    };
};
