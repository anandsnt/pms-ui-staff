sntRover.controller('RVContactInfoController',['$scope','RVContactInfoSrv','ngDialog','dateFilter',function($scope,RVContactInfoSrv,ngDialog,dateFilter){

$scope.saveContactInfo = function(){
      var saveUserInfoSuccessCallback = function(data){
	        $scope.$emit('hideLoader');
	    };
	    var saveUserInfoFailureCallback = function(data){
	        $scope.$emit('hideLoader');
	    };
	    $scope.guestCardData.contactInfo.birthday= dateFilter($scope.guestCardData.contactInfo.birthday, 'MM-dd-yyyy')
	    var data ={'data':$scope.guestCardData.contactInfo,
	    			'userId':$scope.guestCardData.contactInfo.user_id
	    		}
	    $scope.invokeApi(RVContactInfoSrv.saveContactInfo,data,saveUserInfoSuccessCallback,saveUserInfoFailureCallback);  

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