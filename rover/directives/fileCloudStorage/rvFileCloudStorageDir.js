sntRover.directive('rvFileCloudStorage', function($timeout) {
    return {
    	restrict: 'AE',
        replace: 'true',
      	scope: {
         cardType: '@',
         cardId: '@'
	    },
    	templateUrl: '/assets/directives/fileCloudStorage/partials/rvFileCloudStorage.html',
        controller: 'rvFileCloudStorageAndNotesCtrl'
    };
});