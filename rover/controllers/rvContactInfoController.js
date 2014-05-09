sntRover.controller('RVContactInfoController',['$scope','RVContactInfoSrv','ngDialog','dateFilter',function($scope,RVContactInfoSrv,ngDialog,dateFilter){


var presentContactInfo =  JSON.parse(JSON.stringify($scope.guestCardData.contactInfo));

$scope.saveContactInfo = function(){
      var saveUserInfoSuccessCallback = function(data){
	        $scope.$emit('hideLoader');
	    };
	    var saveUserInfoFailureCallback = function(data){
	        $scope.$emit('hideLoader');
	    };
	    //change date format for API call and check if data is updated or not 
	    var dataToUpdate =  JSON.parse(JSON.stringify($scope.guestCardData.contactInfo));
	    var dataUpdated = false;
	    if(presentContactInfo!==dataToUpdate)
	    	dataUpdated = true;
	    dataToUpdate.birthday = dateFilter(dataToUpdate.birthday, 'MM-dd-yyyy');
	 
	    var data ={'data':dataToUpdate,
	    			'userId':$scope.guestCardData.contactInfo.user_id
	    		};
	  if (dataUpdated){
	    $scope.invokeApi(RVContactInfoSrv.saveContactInfo,data,saveUserInfoSuccessCallback,saveUserInfoFailureCallback);  	
	};
};

$scope.$on('saveContactInfo',function(){
	$scope.saveContactInfo();
});	


 $scope.popupCalendar = function(){
    	ngDialog.open({
    		 template: '/assets/partials/guestCard/contactInfoCalendarPopup.html',
    		 controller: 'RVContactInfoDatePickerController',
			 className: 'ngdialog-theme-default calendar-modal',
			 scope:$scope
    	});
};

}]);