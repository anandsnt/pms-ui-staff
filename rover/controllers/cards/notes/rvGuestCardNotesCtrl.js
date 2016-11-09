angular.module('sntRover').controller('rvGuestCardNotesCtrl',
	['$scope',
	'rvGuestCardNotesSrv', 'RVDashboardSrv', '$timeout', '$filter', '$rootScope', 
	function($scope, rvGuestCardNotesSrv, RVDashboardSrv, $timeout, $filter, $rootScope) {

  BaseCtrl.call(this, $scope);

  var guestID = null;

  /**
   * used to scroll to top as the user add/edits the note
   * @return {undefined}
   */
  var scrollToTop = function() {
    var scroller = $scope.getScroller('guestcard_notes_scroller');
    $timeout(function() {
        scroller.scrollTo(0, 0, 300);
    }, 0);
  };

  /**
   * success call back for notes list fetch
   * @param  {Array} notes [description]
   * @return {undefined}
   */
  var successCallBackOfFetchNotesForThisGuest = function(notes) {
    $scope.notes = notes;
    $scope.refreshScroller('guestcard_notes_scroller');
  };

  /**
   * to fetch against the
   * @return {undefined}
   */
  var fetchNotesForThisGuest = function() {
    var params  = {
      guestID : guestID
    };

    var options = {
      params : params,
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
    $scope.refreshScroller('guestcard_notes_scroller');
    $scope.guestCardData.contactInfo.notes_count = $scope.notes.length;
  };

  /**
   * @param  {Array} [error message from backend]
   * @return {undefined}
   */
  var failureCallBackOfFetchDeleteNoteFromGuestCard = function(errorMessage) {
    $scope.errorMessage = errorMessage;
    fetchNotesForThisGuest();
  };

  /**
   * to delete a note from the list
   * @param  {number} noteID
   * @return {undefined}
   */
  $scope.deleteGuestcardNote = function(event, noteID, deletingIndex) {
  	event.stopPropagation();
  	
  	$scope.cancelEditMode();
    
    $scope.errorMessage = '';

    var params  = {
      noteID 	  : noteID,
      guestID 	: guestID
    };

    var options = {
      params 			: params,
      successCallBack 	: successCallBackOfFetchDeleteNoteFromGuestCard,
      failureCallBack   : failureCallBackOfFetchDeleteNoteFromGuestCard,
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
  var successCallBackOfCreateNoteFromGuestCard = function(data) {
    //we are adding to the list with the response
    var userDetails = RVDashboardSrv.getUserDetails();
    var noteToAdd = {
      'posted_user_first_name'	: userDetails.first_name,
      'posted_user_last_name' 	: userDetails.last_name,
      'posted_user_image_url' 	: userDetails.user_image_url,
      'text'					: $scope.noteText,
      'time' 					: data.time,
      'date' 					: data.date,
      'id' 						: data.id
    };
    $scope.notes.unshift(0);
    $scope.notes[0] = noteToAdd;

    //clearing the textbox
    $scope.noteText = '';

    $scope.refreshScroller('guestcard_notes_scroller');
    scrollToTop();
    $scope.guestCardData.contactInfo.notes_count = $scope.notes.length;
  };

  /**
   * to delete a note from the list
   * @param  {number} noteID
   * @return {undefined}
   */
  $scope.createGuestcardNote = function() {
    var params  = {
      guestID : guestID,
      text 		: $scope.noteText
    };

    $scope.errorMessage = '';

    var options = {
      params : params,
      successCallBack : successCallBackOfCreateNoteFromGuestCard
    };
    $scope.callAPI(rvGuestCardNotesSrv.createNoteFromGuestCard, options);
  };

  /**
   * [successCallBackOfFetchUpdateActiveNote description]
   * @param  {Object} [API response]
   * @return {undefined}
   */
  var successCallBackOfFetchUpdateActiveNote = function(data) {
    var indexOfNote = _.findIndex($scope.notes, {id: $scope.editingNote.id}) + 1;
  	$scope.cancelEditMode();
  	fetchNotesForThisGuest();
    var scroller = $scope.getScroller('guestcard_notes_scroller');
    $timeout(function() {
        scroller.scrollToElement('.notes.wrapper li:nth-child('+indexOfNote+')', 300);
    }, 0);
  };

  /**
   * to update the current the choosed note
   * @return {undefined}
   */
  $scope.updateActiveNote = function() {
  	if($scope.editingNote === null) {
  		$scope.errorMessage = ['Something went wrong, please switch tab and comeback'];
  		return;
  	}

    $scope.errorMessage = '';
    
    var params  = {
      noteID 	: $scope.editingNote.id,
      guestID : guestID,
      text 		: $scope.noteText
    };

    var options = {
      params : params,
      successCallBack : successCallBackOfFetchUpdateActiveNote
    };
    $scope.callAPI(rvGuestCardNotesSrv.updateNoteFromGuestCard, options);  	
  };

  /**
   * whenever we clicked on note, we will switch to editing mode
   * @return {undefined}
   */
  $scope.clickedOnNote = function(note) {
    $scope.editingNote 	= note;
    $scope.noteText 	= note.text;
  };

  /**
   * to cancel edit mode
   * @return {undefined}
   */
  $scope.cancelEditMode = function() {
    $scope.editingNote 	= null;
    $scope.noteText 	= '';
  };

  /**
   * we want to display date in what format set from hotel admin
   * @param {String/DateObject}
   * @return {String}
   */
  $scope.formatDateForUI = function(date_) {
    var type_ = typeof date_,
        returnString = '';
    switch (type_) {
      //if date string passed
      case 'string':
          returnString = $filter('date')(new tzIndependentDate(date_), $rootScope.dateFormat);
          break;

          //if date object passed
      case 'object':
          returnString = $filter('date')(date_, $rootScope.dateFormat);
          break;
    }
    return (returnString);
  };

  /**
   * initialization Stuffs
   * @return {undefined}
   */
  var initializeMe = function() {
    guestID = $scope.guestCardData.userId;
    $scope.editingNote    = null;
    $scope.notes          = [];
    $scope.noteText       = '';

    $scope.setScroller('guestcard_notes_scroller', {});

    fetchNotesForThisGuest();
  }();
}]);
