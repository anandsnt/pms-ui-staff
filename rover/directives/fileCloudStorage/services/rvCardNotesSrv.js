angular.module('sntRover').service('rvCardNotesSrv', ['$q', 'rvBaseWebSrvV2',
	function($q, rvBaseWebSrvV2) {

		var service = this;

		service.apiPrefix = '';

		service.setApiConfigs = function(cardType) {
			if (cardType === 'guest_card') {
				service.apiPrefix = '/api/guest_details/';
			}
		};

		service.fetchNotes = function(params) {
			var url = service.apiPrefix + params.card_id + '/notes';

			return rvBaseWebSrvV2.getJSON(url);
		};

		service.updateNote = function(params) {
			var url = service.apiPrefix + params.card_id + '/notes/' + params.note_id;

			return rvBaseWebSrvV2.putJSON(url, params)
		};

		service.deleteNote = function(params) {
			var url = service.apiPrefix + params.card_id + '/notes/' + params.note_id;

			return rvBaseWebSrvV2.deleteJSON(url);
		};

		service.createNote = function(params) {
			var url = service.apiPrefix + params.card_id + '/notes';

			return rvBaseWebSrvV2.postJSON(url, params);
		};
	}
]);