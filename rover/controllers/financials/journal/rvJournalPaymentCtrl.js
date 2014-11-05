sntRover.controller('RVJournalPaymentController', ['$scope','$rootScope','RVJournalSrv',function($scope, $rootScope, RVJournalSrv) {
	BaseCtrl.call(this, $scope);
	$scope.setScroller('payment-content');
    var refreshPaymentScroll = function(){
        setTimeout(function(){$scope.refreshScroller('payment-content');}, 200);
    };

    $rootScope.$on('REFRESHPAYMENTCONTENT',function(){
        refreshPaymentScroll();
    });

	$scope.initPaymentData = function(){
		var successCallBackFetchPaymentData = function(data){
			console.log(data);
			$scope.data.paymentData = {};
			$scope.data.paymentData = data;
			$scope.$emit('hideLoader');
			setTimeout(function(){$scope.refreshScroller('payment-content');}, 200);
		};
		$scope.invokeApi(RVJournalSrv.fetchPaymentData, { "date":$scope.data.paymentDate }, successCallBackFetchPaymentData);
	};
	$scope.initPaymentData();

    $rootScope.$on('paymentDateChanged',function(){
    	console.log("paymentDateChanged"+$scope.data.paymentDate);
    	$scope.initPaymentData();
    });

    /** Handle Expand/Collapse on each payments level items **/
    $scope.clickedFirstLevel = function(index1){
        $scope.data.paymentData.payment_types[index1].active = !$scope.data.paymentData.payment_types[index1].active;
        refreshPaymentScroll(); 
    };
    $scope.clickedSecondLevel = function(index1, index2){
    	$scope.data.paymentData.payment_types[index1].credit_cards[index2].active = !$scope.data.paymentData.payment_types[index1].credit_cards[index2].active;
        refreshPaymentScroll();
    };

    $scope.isShowTableHeadingLevel2 = function(index1, index2){
        var isShowTableHeading = false;
        var data = $scope.data.paymentData.payment_types[index1].credit_cards[index2].transactions;
        if(data.length>0){
            angular.forEach(data,function(transactions, index) {
                if(transactions.show) isShowTableHeading=true;
            });
        }
        return isShowTableHeading;
    };

    $scope.isShowTableHeadingLevel1 = function(index1){
        var isShowTableHeading = false;
        var data = $scope.data.paymentData.payment_types[index1].transactions;
        if(data.length>0){
            angular.forEach(data,function(transactions, index) {
                if(transactions.show) isShowTableHeading=true;
            });
        }
        return isShowTableHeading;
    };
    
	
}]);