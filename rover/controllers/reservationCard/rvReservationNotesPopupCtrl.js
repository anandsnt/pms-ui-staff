
sntRover.controller('RVReservationNotesPopupCtrl',['$scope','$rootScope', function($scope,$rootScope){


	BaseCtrl.call(this, $scope);
	$scope.reservationnote = "";
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
	$scope.deleteReservationNote = function(index) {
	    $scope.deletedNoteIndex = index;
	    var successCallBackDeleteReservationNote = function(data) {
	        $scope.$parent.reservationData.reservation_card.notes.reservation_notes.splice($scope.deletedNoteIndex, 1);
	        $scope.$parent.reservationCardSrv.updateResrvationForConfirmationNumber($scope.$parent.reservationData.reservation_card.confirmation_num, $scope.$parent.reservationData);
	        $scope.$parent.$emit('hideLoader');
	        refreshScroller();
	    };

	    var note_id = $scope.$parent.reservationData.reservation_card.notes.reservation_notes[index].note_id;
	    $scope.invokeApi($scope.$parent.reservationCardSrv.deleteReservationNote, note_id, successCallBackDeleteReservationNote);
	};

	var refreshScroller = function() {
        $scope.refreshScroller('reservationNotes');
    };
}]);