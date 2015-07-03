sntRover.controller('RVJournalPaymentController', ['$scope','$rootScope','RVJournalSrv','$timeout',function($scope, $rootScope, RVJournalSrv, $timeout) {
	BaseCtrl.call(this, $scope);
    $scope.errorMessage = "";
    
	$scope.setScroller('payment_content', {});
    var refreshPaymentScroll = function(){
        setTimeout(function(){$scope.refreshScroller('payment_content');}, 500);
    };

    $rootScope.$on('REFRESHPAYMENTCONTENT',function(){
        refreshPaymentScroll();
    });

	$scope.initPaymentData = function(){
		var successCallBackFetchPaymentData = function(data){
			$scope.data.paymentData = {};
            $scope.data.selectedPaymentType = 'ALL';
			$scope.data.paymentData = data;
			
            $scope.errorMessage = "";
			refreshPaymentScroll();
		};
		$scope.invokeApi(RVJournalSrv.fetchPaymentData, {"from":$scope.data.fromDate , "to":$scope.data.toDate}, successCallBackFetchPaymentData);
	};
	$scope.initPaymentData();

    $rootScope.$on('fromDateChanged',function(){
        $scope.initPaymentData();
    });

    $rootScope.$on('toDateChanged',function(){
        $scope.initPaymentData();
    });

    /** Handle Expand/Collapse of Level1 **/
    $scope.clickedFirstLevel = function(index1){
        if($scope.checkHasArrowLevel1(index1)){
            var toggleItem = $scope.data.paymentData.payment_types[index1];
            toggleItem.active = !toggleItem.active;
            refreshPaymentScroll();
            // When the system is in detailed view and we are collapsing each first Level
            // We have to toggle Details to Summary on print box.
            if(!toggleItem.active && !$scope.data.isPaymentToggleSummaryActive){
                if($scope.isAllPaymentsCollapsed())
                    $scope.data.isPaymentToggleSummaryActive = true;
            }
        }
    };
    /** Handle Expand/Collapse of Level2 **/
    $scope.clickedSecondLevel = function(index1, index2){
        if($scope.checkHasArrowLevel2(index1, index2)){
            var toggleItem = $scope.data.paymentData.payment_types[index1].credit_cards[index2];
            toggleItem.active = !toggleItem.active;
            refreshPaymentScroll();
        }
    };
    /* To show / hide table heading section for Level2 (Credit card items) */
    $scope.isShowTableHeadingLevel2 = function(index1, index2){
        var isShowTableHeading = false,
        item = $scope.data.paymentData.payment_types[index1].credit_cards[index2].transactions;
        if((typeof item !== 'undefined') && (item.length >0)){
            angular.forEach( item ,function(transactions, index) {
                if(transactions.show) isShowTableHeading = true;
            });
        }
        return isShowTableHeading;
    };
    /* To show / hide table heading section for Level1 (Not Credit card items) */
    $scope.isShowTableHeadingLevel1 = function(index1){
        var isShowTableHeading = false,
        item = $scope.data.paymentData.payment_types[index1].transactions;
        if((typeof item !== 'undefined') && (item.length >0)){
            angular.forEach( item ,function(transactions, index) {
                if(transactions.show) isShowTableHeading = true;
            });
        }
        return isShowTableHeading;
    };
    /* To hide/show arrow button for Level1 */
    $scope.checkHasArrowLevel1 = function(index){
        var hasArrow = false,
        item = $scope.data.paymentData.payment_types[index];
        if((typeof item.credit_cards !== 'undefined') && (item.credit_cards.length >0)){
            hasArrow = true;
        }
        else if((typeof item.transactions !== 'undefined') && (item.transactions.length >0)){
            hasArrow = true;
        }
        return hasArrow;
    };
    /* To hide/show arrow button for Level2 */
    $scope.checkHasArrowLevel2 = function(index1, index2){
        var hasArrow = false,
        item = $scope.data.paymentData.payment_types[index1].credit_cards[index2].transactions;
        if((typeof item !== 'undefined') && (item.length >0)) hasArrow = true;
        return hasArrow;
    };

    // To check whether all paymnt tabs are collpased or not, except the clicked index item.
    $scope.isAllPaymentsCollapsed = function(){
        var isAllTabsCollapsed = true;
        angular.forEach($scope.data.paymentData.payment_types,function(payment_types, key) {
            if(payment_types.active) isAllTabsCollapsed = false;
        });
        return isAllTabsCollapsed;
    };

    // To hanlde click inside payment tab.
    $scope.clickedOnPayment = function($event){
        $event.stopPropagation();
        if($scope.data.isDrawerOpened){
            $rootScope.$broadcast("CLOSEPRINTBOX");
        }
    };

}]);