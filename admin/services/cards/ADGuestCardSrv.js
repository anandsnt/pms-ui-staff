admin.service('ADGuestCardSrv', ['$q', 'ADBaseWebSrvV2',
function($q, ADBaseWebSrvV2) {
   /*
	* To fetch mandatory fields
	*/
	this.loadGuestCardFields = function(params) {
		var deferred = $q.defer(),
			url = '/admin/guest_card_settings/current_settings';

		ADBaseWebSrvV2.getJSON(url, params).then(function(data) {
			data = {
	"birth_place": {
		"is_visible": true,
		"is_mandatory_on_guest_card_creation": false
	},
	"registration_number": {
		"is_visible": true,
		"is_mandatory_on_guest_card_creation": false
	},
	"father_name": {
		"is_visible": true,
		"is_mandatory_on_guest_card_creation": false
	},
	"gender": {
		"is_visible": true,
		"is_mandatory_on_guest_card_creation": false
	},
	"home_town": {
		"is_visible": true,
		"is_mandatory_on_guest_card_creation": false
	},
	"mother_name": {
		"is_visible": true,
		"is_mandatory_on_guest_card_creation": false
	},
	"personal_id_no": {
		"is_visible": true,
		"is_mandatory_on_guest_card_creation": false
	},
	"place_of_residence": {
		"is_visible": true,
		"is_mandatory_on_guest_card_creation": false
	},
	"registraion_number": {
		"is_visible": true,
		"is_mandatory_on_guest_card_creation": false
	},
	"vehicle_country_mark": {
		"is_visible": true,
		"is_mandatory_on_guest_card_creation": false
	},
	"job_title": {
		"is_visible": true,
		"is_mandatory_on_guest_card_creation": false
	},
	"date_of_birth": {
		"is_visible": true,
		"is_mandatory_on_guest_card_creation": false
	},
	"nationality": {
		"is_visible": true,
		"is_mandatory_on_guest_card_creation": false
	}
};
			deferred.resolve(data);
		}, function(errorMessage) {
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};
	/*
	* To fetch mandatory fields
	*/
	this.saveGuestCardFields = function(params) {
		var deferred = $q.defer(),
			url = '/admin/guest_card_settings/save';

		ADBaseWebSrvV2.postJSON(url, params).then(function(data) {
			
			deferred.resolve(data);
		}, function(errorMessage) {
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};
		
	
}]);