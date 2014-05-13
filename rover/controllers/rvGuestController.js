
sntRover.controller('guestCardController', ['$scope', 'Likes', '$window','RVContactInfoSrv', function($scope, Likes, $window, RVContactInfoSrv){

$scope.contactInfoError = false;
BaseCtrl.call(this, $scope);
$scope.decloneUnwantedKeysFromContactInfo =  function(){
	
/**
*  API call needs only rest of keys in the data
*/
    var	unwantedKeys = ["address","birthday","country",
					    "is_opted_promotion_email","job_title",
					    "mobile","passport_expiry",
					    "passport_number","postal_code",
					    "reservation_id","title","user_id",
					    "works_at","birthday"
  					  ];
   var declonedData = dclone($scope.guestCardData.contactInfo, unwantedKeys); 
    return declonedData;
};

/**
*  init guestcard header data
*/
var declonedData = $scope.decloneUnwantedKeysFromContactInfo();
var currentGuestCardHeaderData = declonedData;	
$scope.current = 'guest-contact';

/**
* tab actions
*/
$scope.guestCardTabSwitch = function(div){

	if($scope.current ==='guest-contact' && div !== 'guest-contact')
		$scope.$broadcast('saveContactInfo');
	$scope.current = div;
};

$scope.$on('contactInfoError', function(event, value) { 
	$scope.contactInfoError = value;
});
$scope.updateContactInfo =  function(){
	var saveUserInfoSuccessCallback = function(data){
		$scope.$emit('hideLoader');
	};
	var saveUserInfoFailureCallback = function(data){
		$scope.$emit('hideLoader');
	};
    var newUpdatedData = $scope.decloneUnwantedKeysFromContactInfo();
    // check if there is any chage in data.if so call API for updating data
    if(JSON.stringify(currentGuestCardHeaderData) !== JSON.stringify(newUpdatedData)){
    	currentGuestCardHeaderData =newUpdatedData; 
    	var data ={'data':currentGuestCardHeaderData,
    	'userId':$scope.guestCardData.contactInfo.user_id
    }
    $scope.invokeApi(RVContactInfoSrv.saveContactInfo,data,saveUserInfoSuccessCallback,saveUserInfoFailureCallback); 
} 
};

/**
*   In case of a click or an event occured on child elements
*	of actual targeted element, we need to change it as the event on parent element
*   @param {event} is the actual event
*   @param {selector} is the selector which we want to check against that event
*   @return {Boolean} trueif the event occured on selector or it's child elements
*   @return {Boolean} false if not
*/
function getParentWithSelector($event, selector) {

	var obj = $event.target, matched = false;
	return selector.contains(obj);
	
};
/**
* handle click outside tabs and drawer click
*/
$scope.guestCardClick = function($event){
	var element = $event.target;
	$event.stopPropagation();
	$event.stopImmediatePropagation();			
	if(getParentWithSelector($event, document.getElementsByClassName("ui-resizable-handle")[0])){			
		if(!$scope.guestCardVisible){
			$scope.guestCardHeight = $scope.resizableOptions.maxHeight;
			$scope.guestCardVisible = true;
		}
		else{
			$scope.guestCardHeight = $scope.resizableOptions.minHeight;
			$scope.guestCardVisible = false;
		}
	}
	else{
		if(getParentWithSelector($event, document.getElementById("guest-card-content"))){
			/**
				* handle click on tab navigation bar.
				*/
			if($event.target.id==='guest-card-tabs-nav')
				$scope.$broadcast('saveContactInfo');
			else
			    return;
		}
		else
		{
		  	$scope.$broadcast('saveContactInfo');
		}
	}

};

// $scope.$watch('windowHeight',function(){

// 	$scope.maxHeight = $scope.windowHeight;
// });


/**
* for dragging of guest card 
*/
var maxHeight = $(window).height(); //against angular js practice, sorry :(
$scope.guestCardVisible = false; //varibale used to determine whether to show guest card's different tabs
$scope.guestCardHeight = 90;
//scroller options
$scope.resizableOptions = {
	minHeight: '90',
	maxHeight: maxHeight - 90,
	handles: 's',
	resize: function( event, ui ) {
		if ($(this).height() > 120 && !$scope.guestCardVisible) { //against angular js principle, sorry :(				
			$scope.guestCardVisible = true;
			$scope.$apply();
		}
		else if($(this).height() <= 120 && $scope.guestCardVisible){
			$scope.guestCardVisible = false;
			$scope.$apply();
		}
	}
}

}]);