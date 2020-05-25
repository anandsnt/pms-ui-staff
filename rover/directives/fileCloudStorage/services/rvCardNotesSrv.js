angular.module('sntRover').service('rvCardNotesSrv', ['$q', 'rvBaseWebSrvV2',
	function($q, rvBaseWebSrvV2) {

		var service = this;

		service.cardType = '';
		service.cardId = '';

		service.setApiConfigs = function(cardType, cardId) {
			service.cardType = cardType;
			service.cardId = cardId;

			if (cardType === 'guest_card') {
				service.baseApiURL = '/api/guest_details/' + cardId + '/notes';
			}
		};

		var getApiURL = function(method, params) {
			var apiMapping = {
				"guest_card": {
					"fetch": service.baseApiURL,
					"create": service.baseApiURL,
					"update": service.baseApiURL + '/' + params.note_id,
					"delete": service.baseApiURL + '/' + params.note_id
				},
				"company_card": {
					"fetch": '/api/accounts/' + service.cardId + '/account_notes',
					"create": '/api/accounts/' + service.cardId + '/save_account_note',
					"update": '/api/accounts/' + service.cardId + '/update_account_note',
					"delete": '/api/accounts/' + service.cardId + '/delete_account_note'
				},
				"ta_card": {
					"fetch": '/api/accounts/' + service.cardId + '/account_notes',
					"create": '/api/accounts/' + service.cardId + '/save_account_note',
					"update": '/api/accounts/' + service.cardId + '/update_account_note',
					"delete": '/api/accounts/' + service.cardId + '/delete_account_note'
				}
			}

			return apiMapping[service.cardType][method];
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

			return rvBaseWebSrvV2.putJSON(url, params)
		};

		service.deleteNote = function(params) {
			var url =  getApiURL('delete', params);

			return rvBaseWebSrvV2.deleteJSON(url);
		};
	}
]);