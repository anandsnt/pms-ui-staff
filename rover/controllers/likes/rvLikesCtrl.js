sntRover.controller('RVLikesController',['$scope','RVLikesSrv','dateFilter',function($scope, RVLikesSrv, dateFilter){
    

	$scope.errorMessage = "";
	$scope.guestCardData.likes = {};
	$scope.updateData = {};
	
	$scope.init = function(){
		
		
	    var fetchLikesFailureCallback = function(data){
	        $scope.$emit('hideLoader');
	        $scope.errorMessage = data;
	    };
	    var data = { 'userId' : $scope.guestCardData.contactInfo.user_id };
		$scope.invokeApi(RVLikesSrv.fetchLikes,data,$scope.fetchLikesSuccessCallback,fetchLikesFailureCallback);  	
	};
	$scope.fetchLikesSuccessCallback = function(data){
		
        $scope.$emit('hideLoader');
        
        $scope.updateData = data;
        
        angular.forEach($scope.updateData.preferences, function(value, key) {
	         angular.forEach(value.values, function(prefValue, prefKey) {
		        var userPreference = $scope.updateData.user_preference;
		        	if(userPreference.indexOf(prefValue.id) != -1){
		        		prefValue.isChecked = true;
		        	} else {
		        		prefValue.isChecked = false;
		        	}
		     });
	     });
        $scope.guestCardData.likes = $scope.updateData;
        console.log(JSON.stringify($scope.updateData.preferences));
        /**
		  * storing to check if data will be updated
		  */
       // presentLikes = JSON.parse(JSON.stringify($scope.guestCardData.likes));
    };
	$scope.$on('SHOWGUESTLIKESINFO', function(){
		$scope.init();
	});
	
	
	$scope.saveLikes = function(){
		console.log("============SAVEDATA===============");
		console.log($scope.saveData);
	    // var saveUserInfoSuccessCallback = function(data){
	        // $scope.$emit('hideLoader');
	    // };
	    // var saveUserInfoFailureCallback = function(data){
	        // $scope.$emit('hideLoader');
	        // $scope.errorMessage = data;
	        // $scope.$emit('contactInfoError',true);
	    // };
// 	   
	 // /**
	  // * change date format for API call 
	  // */
	    // var dataToUpdate =  JSON.parse(JSON.stringify($scope.guestCardData.likes));
	    // var dataUpdated = false;
// 	
	    // if(angular.equals(dataToUpdate, presentLikes)) {
				// dataUpdated = true;
		// }
		// else{
			// presentContactInfo = dataToUpdate;	
			// //var unwantedKeys = ["avatar","vip"]; // remove unwanted keys for API
			// //dataToUpdate = dclone(dataToUpdate, unwantedKeys); 
		// };	    	
// 	    
	    // var data ={'data':dataToUpdate,
	    			// 'userId':$scope.guestCardData.contactInfo.user_id
	    		// };
	    // if(!dataUpdated)
	     // $scope.invokeApi(RVLikesSrv.saveLikes,data,saveUserInfoSuccessCallback,saveUserInfoFailureCallback);  	
	};
	
	
	/**
	  * to handle click actins outside this tab
	 */
	$scope.$on('SAVELIKES',function(){
		console.log("--------------reached save likes---------");
		$scope.saveLikes();
	});	
	
	$scope.changedPreference = function(){
		
	};
	
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