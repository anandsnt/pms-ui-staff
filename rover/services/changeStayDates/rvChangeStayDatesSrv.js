sntRover.service('RVChangeStayDatesSrv', ['$q', 'rvBaseWebSrvV2', 'RVBaseWebSrv',
    function ($q, rvBaseWebSrvV2, RVBaseWebSrv) {

    	var that = this;
        this.changeStayDetails = {};


        //function to fetch staydate details against a reservation id
        this.fetchStayBasicDetails = function (reservationId, deferred){
            var url = '/staff/change_stay_dates/' + reservationId + '.json';
            RVBaseWebSrv.getJSON(url).then(function(data) {
                that.changeStayDetails.details = data;
            }, function(errorMessage){
                deferred.reject(errorMessage);
            });
        }; 

    	//function to fetch calender details against a reservation id
    	this.fetchCalenderDetails = function (reservationId, deferred){
            var url = '/staff/change_stay_dates/' + reservationId + '/calendar.json';
            RVBaseWebSrv.getJSON(url).then(function(data) {
                that.changeStayDetails.calendarDetails = data;
                deferred.resolve(that.changeStayDetails);
            }, function(errorMessage){
                deferred.reject(errorMessage);
            });
        }; 


        this.fetchInitialData = function(reservationId){
            //Please be care. Only last function should resolve the data
            var deferred = $q.defer ();
            that.fetchStayBasicDetails (reservationId, deferred);
            that.fetchCalenderDetails (reservationId, deferred);
            return deferred.promise;
        }       
}]);