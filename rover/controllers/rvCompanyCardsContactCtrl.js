sntRover.controller('companyCardDetailsContactCtrl',['$scope', 'RVCompanyCardSrv', '$state', '$stateParams', function($scope, RVCompanyCardSrv, $state, $stateParams){
		$scope.$parent.myScrollOptions = {		
	    'companyCardDetailsContactCtrl': {
	    	scrollbars: true,
	    	scrollY: true,
	        snap: false,
	        hideScrollbar: false
	    }
	};
	SAJITH = $scope;
}]);