admin.service("adPermissionSrv", [
    "$http",
    "$q",
    "ADBaseWebSrvV2",
    function($http, $q, ADBaseWebSrvV2) {
        
        // variable for storing the permissions, will be a dictionary (object)
        var roverPermissions = null;

        /*
         * method to fetch permissions
         * will assign the permissions to 'roverPermissions'
         */
        this.fetchRoverPermissions = function() {
            var deferred = $q.defer(),
                url = '/api/permissions';

            ADBaseWebSrvV2.getJSON(url).then(
                function(data) {
                    roverPermissions = data.permissions;
                    deferred.resolve(data);
                },
                function(data) {
                    deferred.reject(data);
                }
            );
            return deferred.promise;
        };

        /*
         * method exposed for others to check permissions
         * if not found in the list, will return false
         * will return true or false
         */
        this.getPermissionValue = function(permissionString) {
            var permission = _.findWhere(roverPermissions, {
                code: permissionString
            });

            if (permission) {
                return permission.value;
            }
            return false;
        };
    }
]);