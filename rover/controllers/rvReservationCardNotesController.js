sntRover.controller('rvReservationCardNotesController',['$scope', function($scope){
	$scope.reservationnote ="";
	/*
	 *To save the reservation note and update the ui accordingly
	 */
	$scope.saveReservationNote = function(){
        	if(!$scope.$parent.isNewsPaperPreferenceAndWakeupCallAvailable()){
        			$scope.reservationnote ="";
            		$scope.$parent.showFeatureNotAvailableMessage();
            		return;
            	}
        	var successCallBackReservationNote = function(data){
        		$scope.reservationnote ="";
        		$scope.$parent.reservationData.reservation_card.notes.reservation_notes.splice(0, 0, data);
        		$scope.$parent.reservationCardSrv.updateResrvationForConfirmationNumber($scope.$parent.reservationData.reservation_card.confirmation_num, $scope.$parent.reservationData);
        		$scope.$parent.$emit('hideLoader');
        		setTimeout(function(){
        			$scope.$parent.myScroll['resultDetails'].refresh();
        		}, 700);
        		

        	};
        	var errorCallBackReservationNote = function(errorMessage){
        		$scope.reservationnote ="";
        		$scope.$parent.$emit('hideLoader');
        		$scope.$parent.errorMessage = errorMessage; 
        	};
        	var params = {};
        	params.reservation_id = $scope.$parent.reservationData.reservation_card.reservation_id;
        	params.text = $scope.reservationnote;
        	params.note_topic = 1;
        	$scope.invokeApi($scope.$parent.reservationCardSrv.saveReservationNote, params, successCallBackReservationNote, errorCallBackReservationNote);
        };
        /*
	 	*To delete the reservation note and update the ui accordingly
	 	*/
        $scope.deleteReservationNote = function(index){
        	$scope.deletedNoteIndex = index;
        	var successCallBackDeleteReservationNote = function(data){
        		$scope.$parent.reservationData.reservation_card.notes.reservation_notes.splice($scope.deletedNoteIndex, 1);
        		$scope.$parent.reservationCardSrv.updateResrvationForConfirmationNumber($scope.$parent.reservationData.reservation_card.confirmation_num, $scope.$parent.reservationData);
        		$scope.$parent.$emit('hideLoader');
        		$scope.$parent.$parent.myScroll['resultDetails'].refresh();
        	};
        	var errorCallBackDeleteReservationNote = function(errorMessage){
        		$scope.reservationnote ="";
        		$scope.$parent.$emit('hideLoader');
        		$scope.$parent.errorMessage = errorMessage;

        	};
        	var note_id = $scope.$parent.reservationData.reservation_card.notes.reservation_notes[index].note_id;        	
        	$scope.invokeApi($scope.$parent.reservationCardSrv.deleteReservationNote, note_id, successCallBackDeleteReservationNote, errorCallBackDeleteReservationNote);
        };
}]);