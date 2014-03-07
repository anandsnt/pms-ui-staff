
(function() {
  var checkInKeysController = function($scope,$rootScope,baseWebService) {


  		//set up flags related to webservice

		$scope.isPosting     = true;
		$rootScope.netWorkError  = false;
		$scope.responseData  = [];


		// watch for any change

		$rootScope.$watch('netWorkError',function(){

			if($rootScope.netWorkError)
				$scope.isPosting = false;
		});


		var url = '/guest_web/checkin.json';
		var data = {'reservation_id':$rootScope.reservationID};

		baseWebService.post(url,data).then(function(response) {

					if(response.status === "failure")
						$rootScope.netWorkError  = true;

					 $scope.isPosting = false;
					 $scope.responseData =response;
					 console.log(response)

				});


};

    var dependencies = [
    '$scope','$rootScope','baseWebService',
    checkInKeysController
    ];

    snt.controller('checkInKeysController', dependencies);
    })();
