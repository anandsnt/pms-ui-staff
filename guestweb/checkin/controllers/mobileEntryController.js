/*
	email entry Ctrl where the email is added
*/

(function() {
	var mobileEntryController = function($scope,$modal,guestDetailsService,$state,$rootScope) {
		
    var errorOpts = {
      backdrop: true,
      backdropClick: true,
      templateUrl: '/assets/checkin/partials/ccErrorModal.html',
      controller: ccVerificationModalCtrl,
      resolve: {
        errorMessage:function(){
          return "Please enter a valid mobile number.";
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
          return "There is a problem saving your mobile number. Please retry.";
        }
      }
    };


    $scope.guestDetails = { "mobile":""};
    $scope.mobileUpdated = false;
    $scope.country_code  = "";

    $scope.countryChanged = function(){
      $scope.dial = _.find($scope.countryDetails,function(countryDetails){ return countryDetails.countrycode === $scope.country_code}).dial;
    };


    
    guestDetailsService.fetchCountryCode().then(function(response) {
      $scope.countryDetails = response;
      $scope.isLoading = false;
    },function(){
      $scope.netWorkError = true;
      $scope.isLoading = false;
    });


   
    function validateMobile(mobile) {
	    // var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    return true;
	  };

    $scope.mobileSubmitted = function(){

    	if(!validateMobile($scope.guestDetails.mobile)){
    		$modal.open(errorOpts);
    	}
    	else{
        guestDetailsService.postGuestDetails({"mobile":$scope.dial+"-"+$scope.guestDetails.mobile}).then(function(response) {
          $scope.isLoading = false;
          $scope.mobileUpdated = true;
          $rootScope.userMobile = $scope.guestDetails.mobile;
        },function(){
          $scope.isLoading = false;
          $modal.open(emailErrorOpts);
        });
    	}
    };

    $scope.continueClicked =  function(){
      $rootScope.userMobileSkipped = true;
      $state.go('preCheckinStatus');
    };
};

var dependencies = [
'$scope','$modal','guestDetailsService','$state','$rootScope',
mobileEntryController
];

sntGuestWeb.controller('mobileEntryController', dependencies);
})();