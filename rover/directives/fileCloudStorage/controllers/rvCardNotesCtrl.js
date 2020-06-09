sntRover.controller('rvCardNotesCtrl', ['$scope', 'rvFileCloudStorageSrv', 'rvCardNotesSrv', '$filter', '$rootScope',
	function($scope, rvFileCloudStorageSrv, rvCardNotesSrv, $filter, $rootScope) {

		BaseCtrl.call(this, $scope);

		var generateApiParams = function(noteID) {
			var params = {
				card_id: $scope.cardId,
				note_id: noteID,
				text: $scope.cardData.noteText, // used in guest details Apis
				description: $scope.cardData.noteText // used in  TA and company note Apis
			};

			if ($scope.cardType === 'stay_card') {
				delete params.card_id;
				params.reservation_id = $scope.cardId;
			}

			return params;
		};
		var processCoTaNotes = function(notes) {
			_.each(notes, function(note) {
				note.posted_user_image_url = note.avatar;
				note.posted_user_first_name = note.user_name;
				note.posted_user_last_name = '';
				note.posted_user_image_url = note.avatar;
				note.text = note.note;
			});
			return notes;
		};

		var processStayCardNotes = function(notes) {
			_.each(notes, function(note) {
				note.posted_user_image_url = note.user_image;
				note.posted_user_first_name = note.username;
				note.posted_user_last_name = '';
				note.text = note.text;
				note.time = note.posted_time;
				note.date = note.posted_date;
				note.id = note.note_id;
			});
			return notes;
		};

		var fetchNotes = function() {
			var options = {
				params: generateApiParams(),
				successCallBack: function(response) {
					if ($scope.cardType === 'cota_card') {
						response.notes = processCoTaNotes(response.notes);
					} else if ($scope.cardType === 'stay_card') {
						response.notes = response.notes.reservation_notes;
						response.notes = processStayCardNotes(response.notes);
					}
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
				successCallBack: function () {
					$scope.cardData.noteText = "";
					fetchNotes();
				}
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

		$scope.$on('FETCH_NOTES', function() {
			fetchNotes();
			$scope.setScroller('card_notes_scroller', {});
		});

		(function() {
			$scope.cardData.noteText = "";
			$scope.editingNote = null;
			$scope.notes = [];
			$scope.cardData.noteText = '';
			rvCardNotesSrv.setApiConfigs($scope.cardType, $scope.cardId);
		}());
	}
]);