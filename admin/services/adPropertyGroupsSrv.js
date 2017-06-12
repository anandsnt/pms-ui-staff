admin.service('ADPropertyGroupsSrv', ['$http', '$q', 'ADBaseWebSrv', function($http, $q, ADBaseWebSrv) {

	/**
    *   A getter method to return the property groups list
    */
	this.fetch = function(params) {
		var deferred = $q.defer();
		//var url = '/admin/property_groups/list.json';
		var url = '/admin/charge_codes/list.json';


		ADBaseWebSrv.getJSON(url, params).then(function(data) {
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

		ADBaseWebSrv.getJSON(url, data).then(function(data) {
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
		// var url = '/admin/property_groups/new';
		var url = '/admin/charge_codes/new';

		ADBaseWebSrv.getJSON(url).then(function(data) {
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
		// var url = '/admin/property_groups/' + data.editId + '/edit.json';
		var url = '/admin/charge_codes/' + 13290 + '/edit.json';

		ADBaseWebSrv.getJSON(url).then(function(data) {
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
		var url = '/admin/property_groups/save';

		ADBaseWebSrv.postJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		}, function(data) {
		    deferred.reject(data);
		});
		return deferred.promise;
	};
}]);