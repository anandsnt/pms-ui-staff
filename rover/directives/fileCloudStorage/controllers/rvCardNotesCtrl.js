sntRover.controller('rvCardNotesCtrl', ['$scope', 'rvFileCloudStorageSrv', 'rvCardNotesSrv', '$filter', '$rootScope',
	function($scope, rvFileCloudStorageSrv, rvCardNotesSrv, $filter, $rootScope) {

		BaseCtrl.call(this, $scope);

		var generateApiParams = function(noteID) {
			var params = {
				card_id: $scope.cardId,
				note_id: noteID,
				text: $scope.cardData.noteText
			};

			return params;
		};

		var fetchNotes = function() {
			var options = {
				params: generateApiParams(),
				successCallBack: function(response) {
					$scope.notes = response.notes;
					$scope.refreshScroller('card_notes_scroller');
				}
			};

			$scope.callAPI(rvCardNotesSrv.fetchNotes, options);
		};

		$scope.createNewNote = function() {

			var params = generateApiParams();
			var options = {
				params: params,
				successCallBack: fetchNotes
			};

			$scope.callAPI(rvCardNotesSrv.createNote, options);
		};

		$scope.clickedOnNote = function(note) {
			$scope.editingNote = note;
			$scope.cardData.noteText = note.text;
		};

		$scope.cancelEditMode = function() {
			$scope.editingNote = null;
			$scope.cardData.noteText = '';
		};

		$scope.updateActiveNote = function() {
			var params = generateApiParams($scope.editingNote.id);
			var options = {
				params: params,
				successCallBack: fetchNotes
			};

			$scope.callAPI(rvCardNotesSrv.updateNote, options);
		};

		$scope.deleteCardNote = function(event, noteID) {
			event.stopPropagation();
			$scope.cancelEditMode();

			var params = generateApiParams(noteID);
			var options = {
				params: params,
				successCallBack: fetchNotes
			};

			$scope.callAPI(rvCardNotesSrv.deleteNote, options);
		};

		$scope.formatDateForUI = function(date) {
			return $filter('date')(new tzIndependentDate(date), $rootScope.dateFormat);
		};

		(function() {
			$scope.editingNote = null;
			$scope.notes = [];
			$scope.cardData.noteText = '';

			$scope.setScroller('card_notes_scroller', {});
			rvCardNotesSrv.setApiConfigs($scope.cardType);
			fetchNotes();
		}());
	}
]);