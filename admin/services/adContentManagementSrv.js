admin.service('ADContentManagementSrv',['$http', '$q', 'ADBaseWebSrv', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrv, ADBaseWebSrvV2){
   /**
    * To fetch the grid view list
    * @return {object} grid view list json
    */
	this.fetchGridViewList = function(){
		
		var deferred = $q.defer();
		var url = '/api/cms_components.json';

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};

	/**
    * To fetch the tree view list
    * @return {object} tree view list json
    */
	this.fetchTreeViewList = function(){
		
		var deferred = $q.defer();
		var url = '/api/cms_components/tree_view.json';

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};

	/**
    * To fetch the section/category/item details
    * @return {object} section/category/item details json
    */
	this.fetchComponent = function(id){
		
		var deferred = $q.defer();
		var url = '/api/cms_components/'+ id;

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};
   /*
    * To update section/category/item details
    * @param {array} data of the modified section/category/item
    * @return {object} status of updated section/category/item
    */
	this.saveComponent = function(data){

		var deferred = $q.defer();
		var url = 'api/cms_components/save';
		ADBaseWebSrvV2.postJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};


    /*
    * To update category/item order for a particular parent
    * @param {object} data of the modified order for category/item, parent_id
    * @return {object} status of updated section/category/item
    */
	this.saveComponentOrder = function(data){

		var deferred = $q.defer();
		var url = 'api/cms_components/assign_sequence';
		ADBaseWebSrvV2.putJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};

	/*
    * To delete section data
    * @param {array} data of the section to be deleted
    * @return {object} status of deleted section
    */
	this.deleteSection = function(data){

		var deferred = $q.defer();
		var url = 'api/cms_components/' + data.id;
		ADBaseWebSrvV2.deleteJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};

	/*
    * To set the availability status
    * @param {array} data of the section to be deleted
    * @return {object} status of deleted section
    */
	this.setAvailablity = function(data){

		var deferred = $q.defer();
		var url = '';
		ADBaseWebSrvV2.postJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};

	/*
    * To fetch child components for a section/category
    * @param {object} id
    * @return {array} children
    */
	this.fetchChildList = function(data){

		var deferred = $q.defer();
		var url = 'api/cms_components/'+ data.id+'/sub_categories.json';

		ADBaseWebSrvV2.getJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};

}]);