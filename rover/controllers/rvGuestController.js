sntRover.controller('guestCardController', ['$scope', 'Likes', '$window','RVContactInfoSrv', function($scope, Likes, $window, RVContactInfoSrv){

// init guestcard header data
var currentGuestCardHeaderData ={};
$scope.current = 'guest-contact';
// to be changed
$scope.guestCardHeight = 90;

// tab actions
$scope.guestCardTabSwitch = function(div){

	if($scope.current ==='guest-contact')
		$scope.$broadcast('saveContactInfo');
	$scope.current = div;
};

$scope.guestCardClick = function($event){

	//console.log($event);
};

$scope.updateData =  function(){
	var saveUserInfoSuccessCallback = function(data){
		$scope.$emit('hideLoader');
	};
	var saveUserInfoFailureCallback = function(data){
		$scope.$emit('hideLoader');
	};
    // API call needs only rest of keys in the data
    var	unwantedKeys = ["address","birthday","country",
					    "is_opted_promotion_email","job_title",
					    "mobile","passport_expiry",
					    "passport_number","postal_code",
					    "reservation_id","title","user_id",
					    "works_at","birthday"
  					  ];
    var newUpdatedData = dclone($scope.guestCardData.contactInfo, unwantedKeys); 
    // check if there is any chage in data.if so call API for updating data
    if(JSON.stringify(currentGuestCardHeaderData) !== JSON.stringify(newUpdatedData)){
    	currentGuestCardHeaderData =newUpdatedData; 
    	var data ={'data':currentGuestCardHeaderData,
    	'userId':$scope.guestCardData.contactInfo.user_id
    }
    $scope.invokeApi(RVContactInfoSrv.saveContactInfo,data,saveUserInfoSuccessCallback,saveUserInfoFailureCallback); 
} 
};

$scope.guestCardToggle = function(){
	
	$scope.guestCardHeight = ($scope.guestCardHeight === 90) ? 550:90;
	
	// var $isTablet = navigator.userAgent.match(/Android|iPad/i) != null,
	// 	$maxHeight = $window.innerHeight,
	// 	$breakpoint = ($maxHeight/10);

	// if (!$isTablet) {
	// 	$(window).resize(function() {
	//     	$maxHeight = $(window).height();

	//     	// Resize guest card if too big
	//     	if ($('#guest-card').hasClass('open') && $('#guest-card').height() > ($maxHeight-90))
	//     	{
	//     		$('#guest-card').css({'height':$maxHeight-90+'px'});
	//     	}

	//     	// Close guest card if too small
	//     	if ($('#guest-card').height() < 90)
	//     	{
	//     		$('#guest-card').removeClass('open').css({'height':90+'px'});
	//     	}

	//     	resizableGuestCard($maxHeight);
	// 	});
//}



};

}]);