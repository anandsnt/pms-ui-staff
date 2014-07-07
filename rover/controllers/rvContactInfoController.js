sntRover.controller('RVContactInfoController',['$scope','RVContactInfoSrv','ngDialog','dateFilter',function($scope,RVContactInfoSrv,ngDialog,dateFilter){

/**
  * storing to check if data will be updated
  */
var presentContactInfo = JSON.parse(JSON.stringify($scope.guestCardData.contactInfo));
presentContactInfo.birthday =JSON.parse(JSON.stringify(dateFilter($scope.guestCardData.contactInfo.birthday, 'MM-dd-yyyy')));
$scope.errorMessage = "";

$scope.$on('clearNotifications',function(){
  $scope.errorMessage ="";
  $scope.successMessage ="";
});

$scope.saveContactInfo = function(){
    var saveUserInfoSuccessCallback = function(data){
    	if(!dataUpdated)
    	{
    		var avatarImage = getAvatharUrl(dataToUpdate.title);
    		$scope.$emit("CHANGEAVATAR", avatarImage);
    	}
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
    dataToUpdate.birthday = $scope.birthdayText;
    var dataUpdated = false;

    if(angular.equals(dataToUpdate, presentContactInfo)) {
			dataUpdated = true;
	}
	else{
		presentContactInfo = dataToUpdate;	
		var unwantedKeys = ["avatar","vip"]; // remove unwanted keys for API
		dataToUpdate = dclone(dataToUpdate, unwantedKeys); 
	};	    	
    
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

  $scope.setScroller('contact_info', {click: false});

$scope.$on('CONTACTINFOLOADED', function(event) {
	setTimeout(function(){
    $scope.refreshScroller('contact_info');
		
		}, 
	1500);
	
});
}]);