sntRover.controller('RVLikesController',['$scope','RVLikesSrv','dateFilter',function($scope, RVLikesSrv, dateFilter){
    

	$scope.errorMessage = "";
	$scope.guestCardData.likes = {};
	var presentLikes = {};
	
	$scope.init = function(){
		
		
	    var fetchLikesFailureCallback = function(data){
	        $scope.$emit('hideLoader');
	        $scope.errorMessage = data;
	    };
	    var data = { 'userId' : $scope.guestCardData.contactInfo.user_id };
	    console.log(data);
		$scope.invokeApi(RVLikesSrv.fetchLikes,data,$scope.fetchLikesSuccessCallback,fetchLikesFailureCallback);  	
	};
	$scope.fetchLikesSuccessCallback = function(data){
			console.log(data);
        $scope.$emit('hideLoader');
        $scope.guestCardData.likes = data;
        /**
		  * storing to check if data will be updated
		  */
       // presentLikes = JSON.parse(JSON.stringify($scope.guestCardData.likes));
    };
	$scope.$on('SHOWGUESTLIKESINFO', function(){
		console.log(":::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::;LIKES")
		$scope.init();
	});
	
	
	$scope.saveLikes = function(){
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
	    var dataToUpdate =  JSON.parse(JSON.stringify($scope.guestCardData.likes));
	    var dataUpdated = false;
	
	    if(angular.equals(dataToUpdate, presentLikes)) {
				dataUpdated = true;
		}
		else{
			presentContactInfo = dataToUpdate;	
			//var unwantedKeys = ["avatar","vip"]; // remove unwanted keys for API
			//dataToUpdate = dclone(dataToUpdate, unwantedKeys); 
		};	    	
	    
	    var data ={'data':dataToUpdate,
	    			'userId':$scope.guestCardData.contactInfo.user_id
	    		};
	    if(!dataUpdated)
	     $scope.invokeApi(RVLikesSrv.saveLikes,data,saveUserInfoSuccessCallback,saveUserInfoFailureCallback);  	
	};
	
	
	/**
	  * to handle click actins outside this tab
	 */
	$scope.$on('saveLikes',function(){
		$scope.saveLikes();
	});	
	
	
	
	$scope.$parent.myScrollOptions = {		
	    'contact_info': {
	    	scrollbars: true,
	        snap: false,
	        hideScrollbar: false
	    },
	};
	
	$scope.$on('CONTACTINFOLOADED', function(event) {
		setTimeout(function(){
			$scope.$parent.myScroll['contact_info'].refresh();
			}, 
		1500);
		
	});
}]);