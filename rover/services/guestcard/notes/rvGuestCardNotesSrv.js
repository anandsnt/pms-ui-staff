angular.module('sntRover').service('rvGuestCardNotesSrv', ['$q', 'rvBaseWebSrvV2',
	function($q, rvBaseWebSrvV2) {

		this.fetchNotesForGuest = function(params) {
			var data 		= { 'guest_card_id ': params.guestID },
				url 		= 'ui/show?json_input=cards/notes.json&format=json',
				deferred 	= $q.defer();
			
			rvBaseWebSrvV2.getJSON(url, data).then(
				function(data) {
					deferred.resolve(data.notes);
				},
				function(errorMessage) {
					deferred.reject(errorMessage);
				}
			);
			return deferred.promise;			
		};

		this.deleteNoteFromGuestCard = function(params) {
			var data 		= { 'guest_card_id ': params.guestID, 'note_id': params.noteID },
				url 		= 'ui/show?json_input=cards/notes.json&format=json',
				deferred 	= $q.defer();
			
			rvBaseWebSrvV2.deleteJSON(url, data).then(
				function(data) {
					deferred.resolve(data.notes);
				},
				function(errorMessage) {
					deferred.reject(errorMessage);
				}
			);
			return deferred.promise;			
		};

		this.createNoteFromGuestCard = function(params) {
			var data 		= { 'guest_card_id ': params.guestID, 'text': params.text },
				url 		= 'ui/show?json_input=cards/new_note.json&format=json',
				deferred 	= $q.defer();
			
			rvBaseWebSrvV2.postJSON(url, data).then(
				function(data) {
					deferred.resolve(data);
				},
				function(errorMessage) {
					deferred.reject(errorMessage);
				}
			);
			return deferred.promise;			
		};		
}]);		