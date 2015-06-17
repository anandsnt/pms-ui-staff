sntRover.controller('RVccAuthorizationController', ['$scope','$filter','$stateParams', 'ngDialog', '$rootScope','RVccTransactionsSrv','$timeout',function($scope, $filter,$stateParams, ngDialog, $rootScope, RVccTransactionsSrv, $timeout) {
		
	BaseCtrl.call(this, $scope);	

	var init = function(){
		fetchAuthData();
		$scope.setScroller('authorization-scroll', {});

	};

	var fetchAuthData = function(){
		
		var fetchAuthDataSuccess = function(data){
			$scope.data = data;
			refreshAuthorizationScroll();
			console.log($scope.data);
		}
    	var options = {
    		successCallBack: fetchAuthDataSuccess      		
        }
        $scope.callAPI(RVccTransactionsSrv.fetchAuthData, options);

	};

	var refreshAuthorizationScroll = function(){
		console.log("refreshAuthorizationScroll");
        setTimeout(function(){
        	$scope.refreshScroller('authorization-scroll');
        }, 500);
    };

	$scope.clickedApprovedTab = function(){
		if(isEmptyObject($scope.data.approved)){
			return false;
		}
		$scope.data.approved.active = !$scope.data.approved.active;
		refreshAuthorizationScroll();
	};

	$scope.clickedDeclinedTab = function(){
		if(isEmptyObject($scope.data.declined)){
			return false;
		}
		$scope.data.declined.active = !$scope.data.declined.active;
		refreshAuthorizationScroll();
	};

	$scope.clickedReversalsTab = function(){
		if(isEmptyObject($scope.data.reversals)){
			return false;
		}
		$scope.data.reversals.active = !$scope.data.reversals.active;
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
		item.active = !item.active;
		refreshAuthorizationScroll();
	};

	$scope.clickedReversalTransactionItem = function(item){
		item.active = !item.active;
		refreshAuthorizationScroll();
	};

	init();
    
}]);