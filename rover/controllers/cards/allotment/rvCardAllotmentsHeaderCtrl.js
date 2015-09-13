sntRover.controller('rvCardAllotmentsHeaderCtrl', ['$scope', function($scope){
	BaseCtrl.call(this, $scope);
	
    /**
     * function used to set initlial set of values
     * @return {None}
     */
	var initilizeMe = function(){
        $scope.searchMode = true;
	}();
}]);