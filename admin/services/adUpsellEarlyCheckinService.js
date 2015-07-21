admin.service('adUpsellEarlyCheckinService',['$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2){
   /*
    * To fetch late checkout upsell details
    * @return {object}late checkout upsell details
    */


   this.fetch = function(){
		var deferred = $q.defer();
		var url = '/api/early_checkin_setups/get_setup.json';

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
			 var room_types_list = [];
			 var list = dclone(data.room_types, []);
			    angular.forEach(data.room_types, function (item, index) {
			      var obj = {};
			      obj.value = item.id;
			      obj.name = item.name;
			      room_types_list.push(obj);
			});
			data.room_type_list = room_types_list;
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};


	 /*
    * To update the upsell details
    * @param {object} new upsell details
    */
	this.update = function(data){
		var updateData = data;
		var deferred = $q.defer();
		var url = '/api/early_checkin_setups/save_setup.json';

		ADBaseWebSrvV2.postJSON(url,updateData).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};


   }]);