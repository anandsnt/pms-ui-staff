sntRover.controller('RVContactInfoController',['$scope','RVContactInfoSrv','ngDialog','dateFilter',function($scope,RVContactInfoSrv,ngDialog,dateFilter){

/**
  * storing to check if data will be updated
  */
var presentContactInfo = JSON.parse(JSON.stringify($scope.guestCardData.contactInfo));
$scope.errorMessage = "";
$scope.saveContactInfo = function(){
    var saveUserInfoSuccessCallback = function(data){
        $scope.$emit('hideLoader');
    };
    var saveUserInfoFailureCallback = function(data){
        $scope.$emit('hideLoader');
        $scope.errorMessage = data;
         $scope.$emit('contactInfoError',true);
    };
   
/**
  * change date format for API call 
  */
    var dataToUpdate =  JSON.parse(JSON.stringify($scope.guestCardData.contactInfo));
    var dataUpdated = false;
    if(angular.equals(dataToUpdate, presentContactInfo)) {
			dataUpdated = true;
	}
	else{
		presentContactInfo = dataToUpdate;
	};	    	
    dataToUpdate.birthday = $scope.birthdayText;
    var data ={'data':dataToUpdate,
    			'userId':$scope.guestCardData.contactInfo.user_id
    		};
    if(!dataUpdated)
     $scope.invokeApi(RVContactInfoSrv.saveContactInfo,data,saveUserInfoSuccessCallback,saveUserInfoFailureCallback);  	
};

/**
  * watch and update formatted date for display
  */
$scope.$watch('guestCardData.contactInfo.birthday',function(){
$scope.birthdayText = JSON.parse(JSON.stringify(dateFilter($scope.guestCardData.contactInfo.birthday, 'MM-dd-yyyy')));
});
/**
  * to handle click actins outside this tab
 */
$scope.$on('saveContactInfo',function(){
$scope.saveContactInfo();
});	

$scope.popupCalendar = function(){
	ngDialog.open({
		 template: '/assets/partials/guestCard/contactInfoCalendarPopup.html',
		 controller: 'RVContactInfoDatePickerController',
		 className: 'ngdialog-theme-default single-date-picker',
         closeByDocument: true,
		 scope:$scope
	});
};

	$scope.$parent.myScrollOptions = {		
	    'contact_info': {
	    	scrollbars: true,
	        snap: false,
	        hideScrollbar: false
	    },
	};

	$scope.$on('CONTACTINTOLOADED', function(event) {
		setTimeout(function(){
			$scope.$parent.myScroll['contact_info'].refresh();
			}, 
		1500);
		
	});
}]);