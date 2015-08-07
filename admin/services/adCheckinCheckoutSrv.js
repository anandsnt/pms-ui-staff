admin.service('adCheckinCheckoutSrv',['$http', '$q', 'ADBaseWebSrv', function($http, $q, ADBaseWebSrv){
/*
* To retrive  email list
*
*/
this.fetchEmailList = function(data){

	var deferred = $q.defer();

	var url ="";
	if(data.id === 'checkin') {
	    url = '/admin/get_due_in_guests.json';
	}
	else if(data.id === 'checkout') {
		url = '/admin/get_due_out_guests.json';
	}
	ADBaseWebSrv.getJSON(url,data).then(function(data) {
		deferred.resolve(data);
	},function(data){
		deferred.reject(data);
	});
	return deferred.promise;
};

/*
 * To send  email
 *@param {object} emails
*/
this.sendMail = function(emailData){
	var deferred = $q.defer();


	var url ="";
	if(emailData.id === 'checkin') {
	   url = '/admin/checkin_setups/notify_all_checkin_guests';
	}
	else if(emailData.id === 'checkout') {
		url =  '/admin/send_checkout_alert';
	}
	var data = emailData.data;

	ADBaseWebSrv.postJSON(url,data).then(function(data) {
		deferred.resolve(data);
	},function(data){
		deferred.reject(data);
	});
	return deferred.promise;
};


}]);