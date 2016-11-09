angular.module('sntRover').service('rvGuestCardNotesSrv', ['$q', 'rvBaseWebSrvV2',
	function($q, rvBaseWebSrvV2) {

  this.fetchNotesForGuest = function(params) {
    var url 		= '/api/guest_details/' + params.guestID + '/notes',
    	deferred 	= $q.defer();

    rvBaseWebSrvV2.getJSON(url)
    .then(function(data) {
      	deferred.resolve(data.notes);
    },
	function(errorMessage) {
  	  	deferred.reject(errorMessage);
	});
    return deferred.promise;
  };

  this.updateNoteFromGuestCard = function(params) {
    var url 		= '/api/guest_details/' + params.guestID + '/notes/' + params.noteID,
    	deferred 	= $q.defer(),
    	data 		= {'text': params.text};

    rvBaseWebSrvV2.putJSON(url, data)
    .then(function(data) {
  		deferred.resolve(data);
	},
	function(errorMessage) {
  		deferred.reject(errorMessage);
	});
    return deferred.promise;
  };

  this.deleteNoteFromGuestCard = function(params) {
    var url 		= '/api/guest_details/' + params.guestID + '/notes/' + params.noteID,
    	deferred 	= $q.defer();

    rvBaseWebSrvV2.deleteJSON(url)
    .then(function(data) {
  		deferred.resolve(data);
	}, function(errorMessage) {
  		deferred.reject(errorMessage);
	});
    return deferred.promise;
  };

  this.createNoteFromGuestCard = function(params) {
    var data 		= {'text': params.text},
	    //url 		= 'ui/show?json_input=cards/new_note.json&format=json',
	    url 		= '/api/guest_details/' + params.guestID + '/notes',
	    deferred 	= $q.defer();

    rvBaseWebSrvV2.postJSON(url, data)
    .then(function(data) {
  		deferred.resolve(data);
	},
	function(errorMessage) {
  		deferred.reject(errorMessage);
	});
    return deferred.promise;
  };
}]);
		