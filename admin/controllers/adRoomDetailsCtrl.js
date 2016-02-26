admin.controller('adRoomDetailsCtrl', ['$scope','ADRoomSrv', '$state', '$stateParams', function($scope, ADRoomSrv, $state, $stateParams){
	/*
	* Controller class for Room Details
	*/
	$scope.errorMessage = '';
	$scope.fileName = "Choose File....";


	//inheriting from base controller
	BaseCtrl.call(this, $scope);

	var roomId = $stateParams.roomId;

	if(roomId){
		//if roomnumber is null returning to room list
		if(typeof roomId === 'undefined' || roomId.trim() === ''){
			$state.go('admin.rooms');
		}
		$scope.editMode = true;
	}
	
	/*
     * To handle add new room number click
     */
	$scope.showNewRoomNumber = function() {
		if($scope.data.suite_room_numbers.length == 0 || _.last($scope.data.suite_room_numbers).room_number !== "") {
			$scope.data.suite_room_numbers.push({'room_number':''});
		}
	};

    $scope.roomTypeChanged = function(value) {
    	$scope.isSuite = _.findWhere($scope.data.room_types,{"value": value}).is_suite;
    };

   
    /*
     * To handle blur event on Suite rooms
     */
    $scope.onBlur = function(index){
        if($scope.data.suite_room_numbers[index].name === "") {
          $scope.data.suite_room_numbers.splice(index, 1);
        }
        angular.forEach($scope.data.suite_room_numbers,function(item, i) {
          if (item.room_number === "") {
           $scope.data.suite_room_numbers.splice(i, 1);
         }
       });
    };

	/*
     * To handle individual deletion of Suite rooms
     */
    $scope.deleteRoomNumber = function(index) {
    	$scope.data.suite_room_numbers.splice(index, 1);
    };


	/*
	* Success function of room details fetch
	* Doing the operatios on data here
	*/
	var fetchSuccessOfRoomDetails = function(data){
		$scope.$emit('hideLoader');
		$scope.data = data;
		$scope.floors = data.floors;
		$scope.roomNumber = $scope.data.room_number;
		/*
		* adding the selected attribute on room feature here
		* which will be used in template for adding class if it the selected attribute is true
		*/
		for(var i = 0; i < $scope.data.room_features.length; i++){
			$scope.data.room_features[i].selected = false;
			if($scope.data.active_room_features.indexOf($scope.data.room_features[i].value) !== -1) {
				$scope.data.room_features[i].selected = true;
			}
		}


		// creating custom copy of room likes and active room likes
		$scope.likeCopy       = angular.copy( $scope.data.room_likes );
		$scope.activeLikeCopy = angular.copy( $scope.data.active_room_likes );

		var i, j, k, l;
		var each, options, match;

		for ( i = 0, j = $scope.likeCopy.length; i < j; i++ ) {
			each    = $scope.likeCopy[i];
			options = each['options'];

			// create a model within each like when the type is dropdown or radio
			// otherwise it will be a checkbox, so model inside options
			if ( 'dropdown' == each.type || 'radio' == each.type ) {

				if ( ! $scope.activeLikeCopy.length ) {
					each.selected = '';
				} else {
					match = _.find(options, function(item) {
						return _.contains( $scope.activeLikeCopy, item.value );
					});

					if ( !! match ) {
						each.selected = match.value;
					};
				};
			} else {
				for ( k = 0, l = options.length; k < l; k++ ) {
					options[k]['selected'] = false;

					if ( _.contains($scope.activeLikeCopy, options[k]['value']) ) {
						options[k]['selected'] = true;
					};
				};
			};
		}; 

	};

	var fetchFailedOfRoomDetails = function(errorMessage){
		$scope.$emit('hideLoader');
		$scope.errorMessage = errorMessage ;
	};

	var fecthAllRoomDetailsSuccessCallback = function(data){
		$scope.$emit('hideLoader');
		$scope.data = data;
		$scope.data.suite_room_numbers = [];
		for(var i = 0; i < $scope.data.room_features.length; i++){
			$scope.data.room_features[i].selected = false;
		}
		for(var i = 0; i < $scope.data.room_likes.length; i++){
			for(var j = 0; j < $scope.data.room_likes[i].options.length; j++){
				$scope.data.room_likes[i].options[j].selected = false;
		    }
	    }
	    $scope.floors = data.floors;
		$scope.likeCopy = angular.copy( $scope.data.room_likes );
		$scope.data.room_image = "";
		$scope.data.room_number="";
		$scope.data.room_type_id="";

	};
	var fecthAllRoomDetailsFailureCallback = function(errorMessage){
		$scope.$emit('hideLoader');
		$scope.errorMessage = errorMessage ;
	};

    if($scope.editMode){
    //getting the room details
	$scope.invokeApi(ADRoomSrv.roomDetails, {'roomId': roomId}, fetchSuccessOfRoomDetails, fetchFailedOfRoomDetails);
    }
    else
    {
     $scope.invokeApi(ADRoomSrv.fecthAllRoomDetails, {}, fecthAllRoomDetailsSuccessCallback, fecthAllRoomDetailsFailureCallback);
    }


    /*
    * To handle cancel click
    */

    $scope.cancelCliked   = function(){

      $scope.isAddmode = false;
      $scope.isEditmode = false;
    };


	/*
	* method for go back to previous stage, it is always room listing
	*/
	$scope.goBack = function(){
        $state.go('admin.rooms');
	};

	/*
	* method to update the room details
	*/
	$scope.updateRoomDetails = function(){
        
		var postData = {};
		postData.room_id = $scope.data.room_id;
		postData.room_number = $scope.data.room_number;
		postData.room_type_id = $scope.data.room_type_id;
		postData.active_room_features = [];
		postData.active_room_likes = [];
		postData.selected_floor = $scope.data.selected_floor;
		postData.max_occupancy = $scope.data.max_occupancy;
		postData.is_exclude_from_manual_room_assignment = $scope.data.is_exclude_from_manual_room_assignment;
		postData.is_exclude_from_auto_room_assignment = $scope.data.is_exclude_from_auto_room_assignment;
		postData.is_exclude_from_manual_checkin = $scope.data.is_exclude_from_manual_checkin;
		postData.is_exclude_from_auto_checkin = $scope.data.is_exclude_from_auto_checkin;
		postData.is_exclude_from_housekeeping = $scope.data.is_exclude_from_housekeeping;
		postData.suite_room_numbers = _.pluck($scope.data.suite_room_numbers,"room_number");

		// to get selected features
		for(var i = 0; i < $scope.data.room_features.length; i++){
			if($scope.data.room_features[i].selected === true ){
				postData.active_room_features.push($scope.data.room_features[i].value);
			}
		}

		// to get seletect likes
		var k, l, m, n, each, options;
		for ( k = 0, l = $scope.likeCopy.length; k < l; k++ ) {
			each    = $scope.likeCopy[k];
			options = each['options'];

			if ( 'dropdown' == each.type || 'radio' == each.type ) {
				postData.active_room_likes.push( each.selected );
			} else {
				for ( m = 0, n = options.length; m < n; m++ ) {
					if ( !! options[m]['selected'] ) {
						postData.active_room_likes.push( options[m]['value'] );
					};
				};
			};
		};

		if($scope.data.room_image.indexOf("data:")!== -1){
			postData.room_image = $scope.data.room_image;
		}

		if($scope.editMode) {
		    $scope.invokeApi(ADRoomSrv.update, {'room_id': $scope.data.room_id, 'updateData': postData}, $scope.successCallbackOfUpdateRoomDetails,$scope.failureCallBackOfUpdateRoomDetails);
		}
		else {
			$scope.invokeApi(ADRoomSrv.createRoom, {'updateData': postData}, $scope.successCallbackOfUpdateRoomDetails,$scope.failureCallBackOfUpdateRoomDetails);
		}
	};

	/**
	* Success function of updateRoomDetails's web service call
	*/
	$scope.successCallbackOfUpdateRoomDetails = function(data){
		$scope.goBack();
	};

	/*
	 * Failure action of updateRoomDetail web service call
	 */
	$scope.failureCallBackOfUpdateRoomDetails = function(errorMessage) {

		$scope.$emit('hideLoader');
		$scope.errorMessage = errorMessage;
	};

}]);