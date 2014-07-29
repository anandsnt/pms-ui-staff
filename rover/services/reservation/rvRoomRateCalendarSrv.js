sntRover.service('RVRoomRateCalendarSrv', ['$q', 'rvBaseWebSrvV2', 'RVBaseWebSrv',
    function ($q, rvBaseWebSrvV2, RVBaseWebSrv) {

    	var that = this;
        this.changeStayDetails = {};


        this.fetchStayDateDetails = function (data) {
            var deferred = $q.defer();

            var url = "/ui/show?format=json&json_input=change_staydates/rooms_available.json";
            RVBaseWebSrv.getJSON(url, data).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
}]);