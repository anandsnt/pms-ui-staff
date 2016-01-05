/*
	email entry Ctrl where the email is added
*/

(function() {
	var emailEntryController = function($scope,$modal,checkinConfirmationService) {
		
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

    var emailErrorOpts = {
      backdrop: true,
      backdropClick: true,
      templateUrl: '/assets/checkin/partials/ccErrorModal.html',
      controller: ccVerificationModalCtrl,
      resolve: {
        errorMessage:function(){
          return "There is a problem saving your email address. Please retry.";
        }
      }
    };


    $scope.guestDetails = { "email":""};
    $scope.emailUpdated = false;

   
    function validateEmail(email) {
	    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    return re.test(email);
	  };

    $scope.emailSubmitted = function(){

    	if(!validateEmail($scope.guestDetails.email)){
    		$modal.open(errorOpts);
    	}
    	else{
        checkinConfirmationService.updateEmail({"email":$scope.guestDetails.email}).then(function(response) {
          $scope.isLoading = false;
          $scope.emailUpdated = true;
        },function(){
          //$scope.netWorkError = true;
          $scope.isLoading = false;
            $modal.open(emailErrorOpts);
        });

    	}
    };
};

var dependencies = [
'$scope','$modal','checkinConfirmationService',
emailEntryController
];

sntGuestWeb.controller('emailEntryController', dependencies);
})();