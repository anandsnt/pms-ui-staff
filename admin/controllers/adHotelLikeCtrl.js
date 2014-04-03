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


	$scope.switchClicked = function(index){

		//on success

		$scope.likeListArray[index].is_active = ($scope.likeListArray[index].is_active ==='true') ? 'false':'true';
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