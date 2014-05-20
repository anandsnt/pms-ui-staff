sntRover.controller('companyCardDetailsContactCtrl',['$scope', 'RVCompanyCardSrv', '$state', '$stateParams', function($scope, RVCompanyCardSrv, $state, $stateParams){
		$scope.$parent.myScrollOptions = {		
	    'company_card_content': {
	    	scrollbars: true,
	    	scrollY: true,
	        snap: false,
	        hideScrollbar: false
	    }
	};
}]);