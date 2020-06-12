angular.module('sntRover').service('rvCardNotesSrv', ['$q', 'rvBaseWebSrvV2',
	function($q, rvBaseWebSrvV2) {

		var service = this;

		var getApiURL = function(method, params) {

			if (params.card_type === 'guest_card') {
				service.baseApiURL = '/api/guest_details/' + params.card_id + '/notes';
			} else if (params.card_type === 'company_ta_card') {
				service.baseApiURL = '/api/accounts/' + params.card_id;
			}
			var apiMapping = {
				"guest_card": {
					"fetch": service.baseApiURL,
					"create": service.baseApiURL,
					"update": service.baseApiURL + '/' + params.note_id,
					"delete": service.baseApiURL + '/' + params.note_id
				},
				"company_ta_card": {
					"fetch": service.baseApiURL + '/account_notes',
					"create": service.baseApiURL + '/save_account_note',
					"update": service.baseApiURL + '/update_account_note',
					"delete": service.baseApiURL + '/delete_account_note'
				},
				"stay_card": {
					"fetch": '/api/reservations/' + params.reservation_id + '/notes',
					"create": '/reservation_notes',
					"update": '/reservation_notes/' + params.note_id,
					"delete": '/reservation_notes/' + params.note_id
				}
			};

			return apiMapping[params.card_type][method];
		};

		service.fetchNotes = function(params) {
			var url =  getApiURL('fetch', params);

			return rvBaseWebSrvV2.getJSON(url);
		};

		service.createNote = function(params) {
			var url =  getApiURL('create', params);

			return rvBaseWebSrvV2.postJSON(url, params);
		};

		service.updateNote = function(params) {
			var url =  getApiURL('update', params);

			return rvBaseWebSrvV2.putJSON(url, params);
		};

		service.deleteNote = function(params) {
			var url =  getApiURL('delete', params);

			return rvBaseWebSrvV2.deleteJSON(url);
		};
	}
]);