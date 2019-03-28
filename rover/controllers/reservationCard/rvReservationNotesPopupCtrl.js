
sntRover.controller('RVReservationNotesPopupCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {


	BaseCtrl.call(this, $scope);
	$scope.reservationnote = "";
	// CICO-24928
	$scope.editingNote = null;
	$scope.saveReservationNote = function() {
	    if (!$scope.$parent.isNewsPaperPreferenceAvailable()) {
	        if (!$rootScope.isStandAlone) {
	            $scope.reservationnote = "";
	            $scope.$parent.showFeatureNotAvailableMessage();
	            return;
	        }

	    }
	    var successCallBackReservationNote = function(data) {
	        if (!data.is_already_existing) {
	            $scope.reservationnote = "";
	            data.topic = "GENERAL";
	            $scope.$parent.reservationData.reservation_card.notes.reservation_notes.splice(0, 0, data);
	            $scope.$parent.reservationCardSrv.updateResrvationForConfirmationNumber($scope.$parent.reservationData.reservation_card.confirmation_num, $scope.$parent.reservationData);
	            refreshScroller();
	        }
	        $scope.$parent.$emit('hideLoader');
	    };

	    var params = {};

	    params.reservation_id = $scope.$parent.reservationData.reservation_card.reservation_id;
	    params.text = $scope.reservationnote;
	    params.note_topic = 1;
	    $scope.invokeApi($scope.$parent.reservationCardSrv.saveReservationNote, params, successCallBackReservationNote);
	};

	/*
	 *To delete the reservation note and update the ui accordingly
	 */
	$scope.deleteReservationNote = function(event, index) {
	    $scope.deletedNoteIndex = index;
	    if (event !== null) {
	    	event.stopPropagation();
	    }
	    var successCallBackDeleteReservationNote = function(data) {
	        $scope.$parent.reservationData.reservation_card.notes.reservation_notes.splice($scope.deletedNoteIndex, 1);
	        $scope.$parent.reservationCardSrv.updateResrvationForConfirmationNumber($scope.$parent.reservationData.reservation_card.confirmation_num, $scope.$parent.reservationData);
	        // CICO-24928
	        $scope.cancelEditModeReservationNote();
	        $scope.$parent.$emit('hideLoader');
	        refreshScroller();
	    };

	    var note_id = $scope.$parent.reservationData.reservation_card.notes.reservation_notes[index].note_id;

	    $scope.invokeApi($scope.$parent.reservationCardSrv.deleteReservationNote, note_id, successCallBackDeleteReservationNote);
	};

	// CICO-24928
	$scope.updateActiveReservationNote = function() {
		if ($scope.reservationnote === null) {
          $scope.errorMessage = ['Something went wrong, please try again!'];
          return;
        }
        if (!$scope.$parent.isNewsPaperPreferenceAvailable()) {
          if (!$rootScope.isStandAlone) {
              $scope.reservationnote = "";
              $scope.$parent.showFeatureNotAvailableMessage();
              return;
          }
        }
        $scope.errorMessage = '';
        if ($scope.reservationnote) {
    			var successCallBackReservationNote = function(data) {
                    $scope.editingNote.text = $scope.reservationnote;
                    var noteArrayIndex = _.findIndex($scope.$parent.reservationData.reservation_card.notes.reservation_notes, {note_id: data.note_id});

    				$scope.$parent.reservationData.reservation_card.notes.reservation_notes[noteArrayIndex] = $scope.editingNote;
    				$scope.$parent.reservationCardSrv.updateResrvationForConfirmationNumber($scope.$parent.reservationData.reservation_card.confirmation_num, $scope.$parent.reservationData);
    				refreshScroller();
    				$scope.cancelEditModeReservationNote();
    				$scope.$parent.$emit('hideLoader');
    			},
    			failureCallBackReservationNote = function(errorMessage) {
    				$scope.errorMessage = errorMessage;
    			};
    			var params = {};

                params.id = $scope.editingNote.note_id;
    			params.text = $scope.reservationnote;
    			params.associated_id = $scope.$parent.reservationData.reservation_card.reservation_id;
                params.associated_type = 'Reservation';
    			$scope.invokeApi($scope.$parent.reservationCardSrv.updateReservationNote, params, successCallBackReservationNote, failureCallBackReservationNote);
    	}
	};
	// CICO-24928
	$scope.clickedOnNote = function(note) {
        $scope.editingNote  = note;
        $scope.reservationnote = note.text.replace(new RegExp('<br/>', 'g'), '\n');
    };
    // CICO-24928
    $scope.cancelEditModeReservationNote = function() {
        $scope.editingNote  = null;
        $scope.reservationnote = '';
    };

	var refreshScroller = function() {
        $scope.refreshScroller('reservationNotes');
    };
}]);