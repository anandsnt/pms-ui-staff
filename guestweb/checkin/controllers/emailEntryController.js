/*
	email entry Ctrl where the email is added
*/

(function() {
	var emailEntryController = function($scope,$modal,guestDetailsService,$state,$rootScope,$stateParams) {
		
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
        guestDetailsService.postGuestDetails({"email":$scope.guestDetails.email}).then(function(response) {
          $scope.isLoading = false;
          $scope.emailUpdated = true;
          $rootScope.userEmail = $scope.guestDetails.email;
          $rootScope.userEmailEntered = true;
        },function(){
          $scope.isLoading = false;
          $modal.open(emailErrorOpts);
        });
    	}
    };

    $scope.continueToPrecheckin =  function(){
      ($stateParams.isFrom === "checkinLater") ? $state.go('preCheckinStatus') : $state.go('checkinKeys');;
    };
    $scope.changeEmail =  function(){
       $scope.emailUpdated = false;
    };
};

var dependencies = [
'$scope','$modal','guestDetailsService','$state','$rootScope','$stateParams',
emailEntryController
];

sntGuestWeb.controller('emailEntryController', dependencies);
})();