admin.service('adBrandsSrv',['$http', '$q', 'ADBaseWebSrv', function($http, $q, ADBaseWebSrv){
   /*
    * Service function to fetch the brands list
    * @return {object} brands list
    */
	this.fetch = function(){
		var deferred = $q.defer();
		var url = '/admin/hotel_brands.json';
		ADBaseWebSrv.getJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};
   /*
    * Service function to render add brand screen
    * @return {object} chains list to render chain list dropdown
    */
	this.addRender = function(){
		var deferred = $q.defer();
		var url = '/admin/hotel_brands/new.json';
		ADBaseWebSrv.getJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};
   /*
    * Service function to render edit brand screen
    * @return {object} brand details along with chains list
    */
	this.editRender = function(data){

		var editID = data.editID;

		var deferred = $q.defer();

		var url = '/admin/hotel_brands/'+editID+'/edit.json';

		ADBaseWebSrv.getJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};
   /*
    * Service function to update brand
    * @return {object} status of update
    */
	this.update = function(data){

		var id  = data.value;
		var deferred = $q.defer();
		var url = '/admin/hotel_brands/'+id;
		ADBaseWebSrv.putJSON(url,data).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};
   /*
    * Service function to add a new brand
    * @return {object} status of save
    */
	this.post = function(data){

		var deferred = $q.defer();
		var url = '/admin/hotel_brands';
		ADBaseWebSrv.postJSON(url,data).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};
}]);