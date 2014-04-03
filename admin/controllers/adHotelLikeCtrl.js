admin.controller('ADHotelLikesCtrl', ['$scope', '$state', 'ADHotelLikesSrv',
function($scope, $state, ADHotelLikesSrv) {

	BaseCtrl.call(this, $scope);
	$scope.likeList = {};

		/**
	 * To fetch upsell details
	 *
	 */
	$scope.fetchHotelLikes = function() {
		var fetchHotelLikesSuccessCallback = function(data) {
			$scope.$emit('hideLoader');
			$scope.likeList = data;
			console.log(data)
			
		};
		$scope.invokeApi(ADHotelLikesSrv.fetch, {}, fetchHotelLikesSuccessCallback);
	};

	$scope.fetchHotelLikes();

	/*
   * To render add screen
   */
	$scope.addNew = function(){
		$scope.likeData   = {};
		$scope.likeData.type = "textbox"
		$scope.isAddmode = true;
	};
	 /*
    * To handle switch
    */
	$scope.switchClicked = function(index){

		//on success

		$scope.likeListArray[index].is_active = ($scope.likeListArray[index].is_active ==='true') ? 'false':'true';
	}

	 /*
    * To fetch the template for chains details add/edit screens
    */
 	$scope.getAddNewTemplateUrl = function(){
 		return "/assets/partials/Likes/adNewLike.html";
 	};


 	$scope.addCancelCliked   = function(){

 		$scope.isAddmode = false;
 	}

 	$scope.addSaveCliked   = function(){

 		console.log($scope.likeData)

 		$scope.isAddmode = false;
 	}
 	

 	$scope.typeChanged = function(id){

 		alert(id)
 	}




	$scope.likeList = {
    "likes": [
        {
            "id": 1,
            "name": "ROOM FEATURE",
            "is_system_defined": "false",
            "is_active": "true"
        },
        {
            "id": 2,
            "name": "FLOOR",
            "is_system_defined": "true",
            "is_active": "false"
        },
        {
            "id": 3,
            "name": "SMOKING",
            "is_system_defined": "true",
            "is_active": "true"
        },
        {
            "id": 4,
            "name": "ELEVATOR",
            "is_system_defined": "true",
            "is_active": "false"
        },
        {
            "id": 5,
            "name": "NEWSPAPER",
            "is_system_defined": "false",
            "is_active": "false"
        },
        {
            "id": 6,
            "name": "ROOM TYPE",
            "is_system_defined": "false",
            "is_active": "false"
        }
    ]
}
	$scope.likeListArray = $scope.likeList.likes;

}]);	