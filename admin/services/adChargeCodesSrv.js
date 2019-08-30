admin.service('ADChargeCodesSrv', ['$http', '$q', 'ADBaseWebSrv', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrv, ADBaseWebSrvV2) {

    var service = this;

    var chargeCodeTypes = [];

    var initializeChargeCodeTypes = function(types) {
        _.each(types, function(chargeCodeType) {
            chargeCodeTypes[chargeCodeType.name] = parseInt(chargeCodeType.value, 10);
        });
    };

    /**
     * Returns the VALUE of the charge code type as integer (if invalid returns 1)
     * @param {string} NAME name of the charge code type
     * @return {*|number} returns -1 if invalid
     */
    service.getChargeCodeTypeValue = function(NAME) {
        return chargeCodeTypes[NAME] || -1;
    };

	/**
    *   A getter method to return the charge codes list
    */
	this.fetch = function(params) {
		var deferred = $q.defer();
		var url = '/admin/charge_codes/list.json';

		ADBaseWebSrv.getJSON(url, params).then(function(data) {
		    deferred.resolve(data);
		}, function(data) {
		    deferred.reject(data);
		});
		return deferred.promise;
	};
	/**
    *   A delete method to delete the charge code item.
    */
	this.deleteItem = function(data) {
		var deferred = $q.defer();
		var url = '/admin/charge_codes/' + data.value + '/delete';

		ADBaseWebSrv.getJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		}, function(data) {
		    deferred.reject(data);
		});
		return deferred.promise;
	};
	/**
    *   A getter method to return add new the charge codes data.
    */
	this.fetchAddData = function() {
		var deferred = $q.defer();
		var url = '/admin/charge_codes/new';

		ADBaseWebSrv.getJSON(url).then(function(data) {
            if (!chargeCodeTypes.length) {
                initializeChargeCodeTypes(data['charge_code_types']);
            }
		    deferred.resolve(data);
		}, function(data) {
		    deferred.reject(data);
		});
		return deferred.promise;
	};
	/**
    *   A getter method to return add new the charge codes data.
    */
	this.fetchEditData = function(data) {
		var deferred = $q.defer();
		var url = '/admin/charge_codes/' + data.editId + '/edit.json';

		ADBaseWebSrv.getJSON(url).then(function(data) {
            if (!chargeCodeTypes.length) {
                initializeChargeCodeTypes(data['charge_code_types']);
            }
		    deferred.resolve(data);
		}, function(data) {
		    deferred.reject(data);
		});
		return deferred.promise;
	};
	/**
    *   A post method to add/edit the charge codes data.
    */
	this.save = function(data) {
		var deferred = $q.defer();
		var url = '/admin/charge_codes/save';

		ADBaseWebSrv.postJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		}, function(data) {
		    deferred.reject(data);
		});
		return deferred.promise;
	};
	/**
    *   A post method to import charge codes data.
    */
	this.importData = function(data) {
		var deferred = $q.defer();
		var url = '/admin/charge_codes/import';

		ADBaseWebSrv.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		}, function(data) {
		    deferred.reject(data);
		});
		return deferred.promise;
	};

	/**
    *   Service to search charge code
    */
	this.searchChargeCode = function(params) {
		var deferred = $q.defer();
		var url = '/api/charge_codes/search';

		ADBaseWebSrvV2.getJSON(url, params).then(function(data) {
		    deferred.resolve(data);
		}, function(data) {
		    deferred.reject(data);
		});
		return deferred.promise;
	};

	this.uploadCSVFile = function(params) {
		var deferred = $q.defer();
		var url = "/api/charge_codes/upload";

		ADBaseWebSrvV2.postJSON(url, params).then(function(data) {
			deferred.resolve(data.results);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};


}]);
