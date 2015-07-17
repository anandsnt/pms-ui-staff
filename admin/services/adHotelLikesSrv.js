admin.service('ADHotelLikesSrv',['$q', 'ADBaseWebSrv', function( $q, ADBaseWebSrv){
   /*
    * To fetch hotel likes
    * @return {object}late checkout upsell details
    */


    this.fetch = function(){
    	var deferred = $q.defer();
    	var url = '/admin/hotel_likes/get_hotel_likes.json';

    	ADBaseWebSrv.getJSON(url).then(function(data) {
    		deferred.resolve(data);
    	},function(errorMessage){
    		deferred.reject(errorMessage);
    	});
    	return deferred.promise;
    };


	  /*
     * To add new feature
     * @param {object} new upsell details
     */
     this.addNewFeature = function(data){
     	var updateData = data;
     	var deferred = $q.defer();
     	var url = '/admin/hotel_likes/add_feature_type';

     	ADBaseWebSrv.postJSON(url,updateData).then(function(data) {
     		deferred.resolve(data);
     	},function(data){
     		deferred.reject(data);
     	});
     	return deferred.promise;
     };

	  /*
     * To handle switch toggle
     * @param {object} new upsell details
     */
     this.toggleSwitch = function(data){
     	var updateData = data;
     	var deferred = $q.defer();
     	var url = '/admin/hotel_likes/activate_feature';

     	ADBaseWebSrv.postJSON(url,updateData).then(function(data) {
     		deferred.resolve(data);
     	},function(data){
     		deferred.reject(data);
     	});
     	return deferred.promise;
     };

	 /*
    * To get the details of the like selected
    * @param {object} like id
    * @return {object} chain data
    */
    this.edit = function(data){
    	var editID = data.editID;
    	var deferred = $q.defer();
    	var url = '/admin/hotel_likes/'+editID+'/edit_hotel_likes.json';

    	ADBaseWebSrv.getJSON(url).then(function(data) {
    		deferred.resolve(data);
    	},function(data){
    		deferred.reject(data);
    	});
    	return deferred.promise;
    };


	 /*
    * To get the details of the like
    * @param {object} like id
    * @return {object} like data
    */
    this.editRoom = function(data){
    	var editID = data.editID;
    	var deferred = $q.defer();
    	var url = '/admin/hotel_likes/'+editID+'/edit_hotel_likes.json';


    	ADBaseWebSrv.getJSON(url).then(function(data) {
    		deferred.resolve(data);
    	},function(data){
    		deferred.reject(data);
    	});
    	return deferred.promise;
    };



	 /*
    * To update the like details
    * @param {object} like id
    * @return {object} status
    */
    this.update = function(data){
    	var updateData = data;
    	var deferred = $q.defer();
    	var url = '/admin/hotel_likes/add_feature_type';

    	ADBaseWebSrv.putJSON(url,updateData).then(function(data) {
    		deferred.resolve(data);
    	},function(data){
    		deferred.reject(data);
    	});
    	return deferred.promise;
    };


	 /*
    * To update the like details
    * @param {object} like id
    * @return {object} status
    */
    this.customLikeSave = function(data){
    	var updateData = data;
    	var deferred = $q.defer();
    	var url = '/admin/hotel_likes/save_custom_likes';

    	ADBaseWebSrv.postJSON(url,updateData).then(function(data) {
    		deferred.resolve(data);
    	},function(data){
    		deferred.reject(data);
    	});
    	return deferred.promise;
    };


     /*
    * To delete the like options
    * @param {object} like id
    * @return {object} status
    */
    this.deleteChecbox = function(id){
        var updateData = {'id':id};
        var deferred = $q.defer();
        var url = '/admin/hotel_likes/delete_feature';

        ADBaseWebSrv.postJSON(url,updateData).then(function(data) {
            deferred.resolve(data);
        },function(data){
            deferred.reject(data);
        });
        return deferred.promise;
    };




}]);