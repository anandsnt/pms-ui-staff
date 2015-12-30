/*
	email entry Ctrl where the email is added
*/

(function() {
	var emailEntryController = function($scope,$modal) {
			var errorOpts = {
      backdrop: true,
      backdropClick: true,
      templateUrl: '/assets/checkin/partials/ccErrorModal.html',
      controller: ccVerificationModalCtrl,
      resolve: {
        errorMessage:function(){
          return "Please enter a valid email.";
        }
      }
    };


    $scope.guestDetails = { "email":""};
    $scope.emailUpdated = false;

   
    function validateEmail(email) {
	    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    return re.test(email);
	}

    $scope.emailSubmitted = function(){

    	if(!validateEmail($scope.guestDetails.email)){
    		$modal.open(errorOpts);
    	}
    	else{
    		$scope.emailUpdated = true;
    	}
    }
};

var dependencies = [
'$scope','$modal',
emailEntryController
];

sntGuestWeb.controller('emailEntryController', dependencies);
})();