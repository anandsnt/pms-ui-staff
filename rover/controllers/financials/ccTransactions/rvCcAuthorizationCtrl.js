sntRover.controller('RVccAuthorizationController', ['$scope','$filter','$stateParams', 'ngDialog', '$rootScope','RVccTransactionsSrv','$timeout',function($scope, $filter,$stateParams, ngDialog, $rootScope, RVccTransactionsSrv, $timeout) {
		
	BaseCtrl.call(this, $scope);	

	var init = function(){
		fetchAuthData();
		$scope.setScroller('authorization-scroll', {});

	};

	var fetchAuthData = function(){
		
		var fetchAuthDataSuccess = function(data){
			$scope.data.authData = data;
			refreshAuthorizationScroll();
			console.log($scope.data.authData);
		}
    	var options = {
    		successCallBack: fetchAuthDataSuccess      		
        }
        $scope.callAPI(RVccTransactionsSrv.fetchAuthData, options);

	};

	var refreshAuthorizationScroll = function(){
        setTimeout(function(){
        	$scope.refreshScroller('authorization-scroll');
        }, 500);
    };

    $scope.$on('mainTabSwiched', function(){
		if($scope.data.activeTab === 1){
			refreshAuthorizationScroll();
		}
    });

	$scope.clickedApprovedTab = function(){
		if(isEmptyObject($scope.data.authData.approved)){
			return false;
		}
		$scope.data.authData.approved.active = !$scope.data.authData.approved.active;
		refreshAuthorizationScroll();
	};

	$scope.clickedDeclinedTab = function(){
		if(isEmptyObject($scope.data.authData.declined)){
			return false;
		}
		$scope.data.authData.declined.active = !$scope.data.authData.declined.active;
		refreshAuthorizationScroll();
	};

	$scope.clickedReversalsTab = function(){
		if(isEmptyObject($scope.data.authData.reversals)){
			return false;
		}
		$scope.data.authData.reversals.active = !$scope.data.authData.reversals.active;
		refreshAuthorizationScroll();
	};

	$scope.clickedApprovedTransactionItem = function(item){
		if(item.cc_transactions.length === 0){
			return false;
		}
		item.active = !item.active;
		refreshAuthorizationScroll();
	};

	$scope.clickedDeclinedTransactionItem = function(item){
		if(item.cc_transactions.length === 0){
			return false;
		}
		item.active = !item.active;
		refreshAuthorizationScroll();
	};

	$scope.clickedReversalTransactionItem = function(item){
		if(item.cc_transactions.length === 0){
			return false;
		}
		item.active = !item.active;
		refreshAuthorizationScroll();
	};


	init();
    
}]);