sntRover.controller('RVLikesController',['$scope','RVLikesSrv','dateFilter',function($scope, RVLikesSrv, dateFilter){
    

	$scope.errorMessage = "";
	$scope.guestCardData.likes = {};
	$scope.guestLikesData = {};
	
	$scope.init = function(){
		
	    var fetchLikesFailureCallback = function(data){
	        $scope.$emit('hideLoader');
	        $scope.errorMessage = data;
	    };
	    var data = { 'userId' : $scope.guestCardData.contactInfo.user_id };
		$scope.invokeApi(RVLikesSrv.fetchLikes,data,$scope.fetchLikesSuccessCallback,fetchLikesFailureCallback, 'NONE');  	
	};
	$scope.fetchLikesSuccessCallback = function(data){
		
        $scope.$emit('hideLoader');
        
        $scope.guestLikesData = data;
        
        angular.forEach($scope.guestLikesData.preferences, function(value, key) {
	         angular.forEach(value.values, function(prefValue, prefKey) {
		        	var userPreference = $scope.guestLikesData.user_preference;
		        	if(userPreference.indexOf(prefValue.id) != -1){
		        		prefValue.isChecked = true;
		        	} else {
		        		prefValue.isChecked = false;
		        	}
		     });
	     });
	      angular.forEach($scope.guestLikesData.room_features, function(value, key) {
	         angular.forEach(value.values, function(roomFeatureValue, roomFeatureKey) {
		        	var userRoomFeature = value.user_selection;
		        	if(userRoomFeature.indexOf(roomFeatureValue.id) != -1){
		        		roomFeatureValue.isSelected = true;
		        	} else {
		        		roomFeatureValue.isSelected = false;
		        	}
		     });
	     });
        $scope.guestCardData.likes = $scope.guestLikesData;
        $scope.$parent.myScrollOptions = {		
		    'likes_info': {
		    	scrollbars: true,
		        snap: false,
		        hideScrollbar: false,
		        preventDefault: false
		    },
		};
	
		setTimeout(function(){
			$scope.$parent.myScroll['likes_info'].refresh();
			}, 
		3000);

    };
	$scope.$on('SHOWGUESTLIKESINFO', function(){
		$scope.init();
	});
	
	
	$scope.saveLikes = function(){

	    var saveUserInfoSuccessCallback = function(data){
	        $scope.$emit('hideLoader');
	    };
	    var saveUserInfoFailureCallback = function(data){
	        $scope.$emit('hideLoader');
	        $scope.errorMessage = data;
	        $scope.$emit('likesInfoError',true);
	    };
	   
	   
	    var updateData = {};
	    
	    updateData.guest_id = $scope.guestCardData.contactInfo.guest_id;
	    updateData.preference = [];
	    angular.forEach($scope.guestLikesData.newspapers, function(value, key) {
	    	var newsPaperUpdateData = {};
        	if(value.id == $scope.guestLikesData.user_newspaper){
        		newsPaperUpdateData.type = "NEWSPAPER";
        		newsPaperUpdateData.value = value.name;
        		updateData.preference.push(newsPaperUpdateData);
        	} 
	     });
	     angular.forEach($scope.guestLikesData.roomtype, function(value, key) {
	    	var roomTypeUpdateData = {};
        	if(value.id == $scope.guestLikesData.user_roomtype){
        		roomTypeUpdateData.type = "ROOM TYPE";
        		roomTypeUpdateData.value = value.name;
        		updateData.preference.push(roomTypeUpdateData);
        	} 
	     });
	     
	     angular.forEach($scope.guestLikesData.room_features, function(value, key) {
	         angular.forEach(value.values, function(roomFeatureValue, roomFeatureKey) {
	         	var roomFeatureUpdateData = {};
		     	if(roomFeatureValue.isSelected){
		     		roomFeatureUpdateData.type = "ROOM FEATURE";
		     		roomFeatureUpdateData.value = roomFeatureValue.details;
		     		updateData.preference.push(roomFeatureUpdateData);
		     	}
		        	
		     });
	     });
	    angular.forEach($scope.guestLikesData.preferences, function(value, key) {
	    	 var preferenceUpdateData = {};
	         angular.forEach(value.values, function(prefValue, prefKey) {
	         	
	         	if(prefValue.isChecked){
	         		preferenceUpdateData.type = value.name;
	         		preferenceUpdateData.value = prefValue.details;
	         	} 
		     });
		     updateData.preference.push(preferenceUpdateData);
	     });
	     console.log(JSON.stringify(updateData));

	      var saveData = {
	      	userId: $scope.guestCardData.contactInfo.user_id,
	      	data: updateData
	      };
	      $scope.invokeApi(RVLikesSrv.saveLikes,saveData,saveUserInfoSuccessCallback,saveUserInfoFailureCallback);  	
	};
	
	
	/**
	  * to handle click actins outside this tab
	 */
	$scope.$on('SAVELIKES',function(){
		console.log("--------------reached save likes---------");
		$scope.saveLikes();
	});	
	
	$scope.changedPreference = function(parentIndex, index){
		  angular.forEach($scope.guestLikesData.preferences[parentIndex].values, function(value, key) {
		 	if(key !== index){
		 		value.isChecked = false;
		 	} 
	     });
	};
	$scope.$on("OUTSIDECLICKED", function(event){
		alert("outside likes tab card")
		event.preventDefault();
	});
	
}]);