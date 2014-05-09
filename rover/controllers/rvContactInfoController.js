sntRover.controller('RVContactInfoController',['$scope','RVContactInfoSrv','ngDialog','dateFilter',function($scope,RVContactInfoSrv,ngDialog,dateFilter){

//storing to check if data will be updated
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
	    var dataUpdated = true;
	    if(presentContactInfo!==dataToUpdate)
	    	dataUpdated = false;
	    dataToUpdate.birthday = $scope.birthdayText;
	 
	    var data ={'data':dataToUpdate,
	    			'userId':$scope.guestCardData.contactInfo.user_id
	    		};
	  if (!dataUpdated){
	    $scope.invokeApi(RVContactInfoSrv.saveContactInfo,data,saveUserInfoSuccessCallback,saveUserInfoFailureCallback);  	
	};
};

$scope.$watch('guestCardData.contactInfo.birthday',function(){
	$scope.birthdayText = JSON.parse(JSON.stringify(dateFilter($scope.guestCardData.contactInfo.birthday, 'MM-dd-yyyy')));
});

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