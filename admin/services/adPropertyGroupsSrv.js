admin.service('ADPropertyGroupsSrv', ['$http', '$q', 'ADBaseWebSrv', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrv, ADBaseWebSrvV2) {

	/**
    *   A getter method to return the property groups list
    */
	this.fetch = function(params) {
		var deferred = $q.defer();
		var url = '/api/property_groups';

		ADBaseWebSrvV2.getJSON(url, params).then(function(data) {
		    deferred.resolve(data);
		}, function(data) {
		    deferred.reject(data);
		});
		return deferred.promise;
	};

	/**
    *   A delete method to delete the property group.
    */
	this.deleteItem = function(data) {
		var deferred = $q.defer();
		var url = '/admin/property_groups/' + data.value + '/delete';

		ADBaseWebSrv.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		}, function(data) {
		    deferred.reject(data);
		});
		return deferred.promise;
	};
	/**
    *   A getter method to return add new the property group data.
    */
	this.fetchAddData = function() {
		var deferred = $q.defer();
		var url = '/api/property_groups/new.json';

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		}, function(data) {
		    deferred.reject(data);
		});
		return deferred.promise;
	};
	/**
    *   A getter method to return add new the property group's data.
    */
	this.fetchEditData = function(data) {
		var deferred = $q.defer();
		var url = '/api/property_groups/' + data.editId;

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		}, function(data) {
		    deferred.reject(data);
		});
		return deferred.promise;
	};
	/**
    *   A post method to add/edit the property groups data.
    */
	this.save = function(data) {
		var deferred = $q.defer();
		var url = '/api/property_groups';

		ADBaseWebSrvV2.postJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		}, function(data) {
		    deferred.reject(data);
		});
		return deferred.promise;
	};

    /**
     *   A post method to add/edit the property groups data.
     */
	this.update = function(data) {
		var deferred = $q.defer();
		var url = '/api/property_groups/'+data.id;

		ADBaseWebSrvV2.putJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		}, function(data) {
		    deferred.reject(data);
		});
		return deferred.promise;
	};
}]);