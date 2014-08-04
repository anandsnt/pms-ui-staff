sntRover.controller('rvReservationCardNotesController',['$scope', '$filter', function($scope, $filter){
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
                data.topic = "GENERAL";//$filter('translate')('DEFAULT_NOTE_TOPIC');
        		$scope.$parent.reservationData.reservation_card.notes.reservation_notes.splice(0, 0, data);
        		$scope.$parent.reservationCardSrv.updateResrvationForConfirmationNumber($scope.$parent.reservationData.reservation_card.confirmation_num, $scope.$parent.reservationData);
        		$scope.$parent.$emit('hideLoader');
        		setTimeout(function(){
        			$scope.$parent.myScroll['resultDetails'].refresh();
        		}, 700);
        		

        	};

        	var params = {};
        	params.reservation_id = $scope.$parent.reservationData.reservation_card.reservation_id;
        	params.text = $scope.reservationnote;
        	params.note_topic = 1;
        	$scope.invokeApi($scope.$parent.reservationCardSrv.saveReservationNote, params, successCallBackReservationNote);
        };

        $scope.$on('scrollToErrorMessage',function(){
             //scroll to top of the page where error message is shown
             $scope.$parent.myScroll['resultDetails'].scrollTo(0,0);
             $scope.reservationnote =""; 
        });

        /*
	 	*To delete the reservation note and update the ui accordingly
	 	*/
        $scope.deleteReservationNote = function(index){
        	$scope.deletedNoteIndex = index;
        	var successCallBackDeleteReservationNote = function(data){
        		$scope.$parent.reservationData.reservation_card.notes.reservation_notes.splice($scope.deletedNoteIndex, 1);
        		$scope.$parent.reservationCardSrv.updateResrvationForConfirmationNumber($scope.$parent.reservationData.reservation_card.confirmation_num, $scope.$parent.reservationData);
        		$scope.$parent.$emit('hideLoader');
        		setTimeout(function(){
        			$scope.$parent.myScroll['resultDetails'].refresh();
        		}, 700);
        	};
        
        	var note_id = $scope.$parent.reservationData.reservation_card.notes.reservation_notes[index].note_id;        	
        	$scope.invokeApi($scope.$parent.reservationCardSrv.deleteReservationNote, note_id, successCallBackDeleteReservationNote);
        };
}]);