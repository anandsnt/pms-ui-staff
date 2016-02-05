angular.module('sntRover').controller('rvGuestCardNotesCtrl', 
	['$scope', 
	'rvGuestCardNotesSrv', 'RVDashboardSrv', 
	function($scope, rvGuestCardNotesSrv, RVDashboardSrv){

		BaseCtrl.call(this, $scope);
		
		var guestID = null;

		/**
		 * success call back for notes list fetch
		 * @param  {Array} notes [description]
		 * @return {[type]}       [description]
		 */
		var successCallBackOfFetchNotesForThisGuest = function(notes){
			$scope.notes = notes;
			$scope.refreshScroller('guestcard_notes_scroller');
		};

		/**
		 * to fetch against the 
		 * @return {[type]} [description]
		 */
		var fetchNotesForThisGuest = function(){
			var params  = {
				guestID : guestID
			};
	        var options = {
	            params 			: params,
	            successCallBack : successCallBackOfFetchNotesForThisGuest
	        };
	        $scope.callAPI(rvGuestCardNotesSrv.fetchNotesForGuest, options);
		};

		/**
		 * @param  {Object} data [response from backend]
		 * @param  {Object} successCallBackParameters
		 * @return {undefined}
		 */
		var successCallBackOfFetchDeleteNoteFromGuestCard = function(data, successCallBackParameters) {
			//we are going to stripe the note from the list
			var indexToDelete = successCallBackParameters.index;
			$scope.notes.splice(indexToDelete, 1);
		};

		/**
		 * to delete a note from the list
		 * @param  {number} noteID
		 * @return {undefined}
		 */
		$scope.deleteGuestcardNote = function(noteID, deletingIndex){
			var params  = {
				noteID 	: noteID,
				guestID : guestID
			};
	        var options = {
	            params 			: params,
	            successCallBack : successCallBackOfFetchDeleteNoteFromGuestCard,
	            successCallBackParameters : {
     				index: deletingIndex
     			}
	        };
	        $scope.callAPI(rvGuestCardNotesSrv.deleteNoteFromGuestCard, options);			
		};

		/**
		 * @param  {Object} data [response from backend with new note id, time, user details]
		 * @return {undefined}
		 */
		var successCallBackOfFetchCreateNoteFromGuestCard = function(data) {
			//we are adding to the list with the response
			var userDetails = RVDashboardSrv.getUserDetails();
			var noteToAdd = {
				'posted_user_first_name': userDetails.first_name,
				'posted_user_last_name' : userDetails.last_name,
				'posted_user_image_url' : userDetails.image_url,
				'text'					: $scope.note_text,
				'time' 					: data.time,
				'date' 					: data.date,
				'id' 					: data.id
			};
			$scope.notes.unshift(0);
			$scope.notes[0] = noteToAdd;

			//clearing the textbox
			$scope.note_text = '';

			$scope.refreshScroller('guestcard_notes_scroller');
		};

		/**
		 * to delete a note from the list
		 * @param  {number} noteID
		 * @return {undefined}
		 */
		$scope.createGuestcardNote = function(){
			var params  = {
				guestID : guestID,
				text 	: $scope.note_text
			};
	        var options = {
	            params 			: params,
	            successCallBack : successCallBackOfFetchCreateNoteFromGuestCard
	        };
	        $scope.callAPI(rvGuestCardNotesSrv.createNoteFromGuestCard, options);			
		};

		/**
		 * initialization Stuffs
		 * @return {undefined}
		 */
		var initializeMe = function(){
			guestID 		= $scope.guestCardData.userId;
			$scope.notes 	= [];
			$scope.setScroller('guestcard_notes_scroller', {});
			fetchNotesForThisGuest();
		}();
}]);