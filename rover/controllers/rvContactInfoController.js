sntRover.controller('RVContactInfoController',['$scope','RVContactInfoSrv', function($scope,RVContactInfoSrv){


$scope.saveContactInfo = function(){
      var saveUserInfoSuccessCallback = function(data){
	        $scope.$emit('hideLoader');
	    };
	    var saveUserInfoFailureCallback = function(data){
	        $scope.$emit('hideLoader');
	    };
	    var data ={'data':$scope.guestCardData.contactInfo,
	    			'userId':$scope.guestCardData.contactInfo.user_id
	    		}
	    $scope.invokeApi(RVContactInfoSrv.saveContactInfo,data,saveUserInfoSuccessCallback,saveUserInfoFailureCallback);  

};

$scope.$on('saveContactInfo',function(){

	$scope.saveContactInfo();

});	

}]);