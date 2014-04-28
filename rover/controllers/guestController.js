sntRover.controller('guestCardController', ['$scope', 'Likes', function($scope, Likes){
	
	$scope.current = 'contact-info';

	$scope.newspapers = Likes.newspaper;
	
	$scope.set_current = function(div){
		$scope.current = div;
	};

	$scope.show_tab = function(showDiv){
		if(showDiv == $scope.current){
			$scope.current = showDiv;
			return true;
		}
		return false;
	};



}]);