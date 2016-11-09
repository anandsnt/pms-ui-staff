admin.service('ADInvoiceSettingsSrv', ['$http', '$q', 'ADBaseWebSrvV2',
	function($http, $q, ADBaseWebSrvV2) {

		this.fetchInvoiceSettings = function(hotel_id) {
			var deferred = $q.defer(),
				url = '/admin/invoice_settings';

			ADBaseWebSrvV2.getJSON(url).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};		

		this.saveInvoiceSettings = function(data) {
			var deferred = $q.defer(),
				url = '/admin/update_invoice_settings';

			ADBaseWebSrvV2.postJSON(url, data).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

	}
]);