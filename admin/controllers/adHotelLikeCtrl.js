admin.controller('ADHotelLikesCtrl', ['$scope', '$state', 'ADHotelLikesSrv',
function($scope, $state, ADHotelLikesSrv) {

	BaseCtrl.call(this, $scope);
	$scope.likeList = [];

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


}]);	