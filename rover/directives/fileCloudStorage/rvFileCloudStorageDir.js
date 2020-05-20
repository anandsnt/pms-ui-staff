sntRover.directive('rvFileCloudStorage', function($timeout) {

    return {
    	restrict: 'AE',
        replace: 'true',
      	scope: {
         //    label: '@label',
	        // required: '@required',
         //    isChecked: '=isChecked',
         //    parentLabelClass: '@parentLabelClass',
         //    divClass: '@divClass',
         //    change: '=change',
         //    datagroup: '@datagroup',
         //    isDisabled: '=isDisabled',
         //    index: '@index'
         cardType: '@'
	    },

    	templateUrl: '/assets/directives/fileCloudStorage/rvFileCloudStorage.html',
        controller: 'rvFileCloudStorageCtrl'
    };

});