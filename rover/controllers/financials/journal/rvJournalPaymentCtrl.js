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

	var initPaymentData = function(){
		var successCallBackFetchPaymentData = function(data){
			$scope.data.paymentData = {};
            $scope.data.selectedPaymentType = '';
			$scope.data.paymentData = data;
			$scope.data.activePaymentTypes = data.payment_types;

            $scope.errorMessage = "";
			refreshPaymentScroll();
            $scope.$emit('hideLoader');
		};

        var postData = {
            "from_date":$scope.data.fromDate,
            "to_date":$scope.data.toDate,
            "employee_ids" : $scope.data.selectedEmployeeList ,
            "department_ids" : $scope.data.selectedDepartmentList,
            "type" : ($scope.data.activePaymentTab === "" ? "" : ($scope.data.activePaymentTab).toLowerCase())
        };
		$scope.invokeApi(RVJournalSrv.fetchPaymentDataByPaymentTypes, postData, successCallBackFetchPaymentData);
	};

	initPaymentData();

    $rootScope.$on('fromDateChanged',function(){
        initPaymentData();
        $rootScope.$broadcast('REFRESH_SUMMARY_DATA', $scope.data.fromDate);
    });

    $rootScope.$on('toDateChanged',function(){
        initPaymentData();
    });

    // CICO-28060 : Update dates for Revenue & Payments upon changing summary dates
    $rootScope.$on('REFRESH_REVENUE_PAYMENT_DATA',function( event, date ){
        $scope.data.fromDate = date;
        $scope.data.toDate   = date;
        initPaymentData();
    });

    // Load the transaction details
    var loadTransactionDeatils = function(chargeCodeItem, isFromPagination){

        var successCallBackFetchPaymentDataTransactions = function(data){

            chargeCodeItem.transactions = [];
            chargeCodeItem.transactions = data.transactions;
            chargeCodeItem.total_count = data.total_count;
            chargeCodeItem.end = chargeCodeItem.start + data.transactions.length - 1;

            if(isFromPagination){
                // Compute the start, end and total count parameters
                if(chargeCodeItem.nextAction){
                    chargeCodeItem.start = chargeCodeItem.start + $scope.data.filterData.perPage;
                }
                if(chargeCodeItem.prevAction){
                    chargeCodeItem.start = chargeCodeItem.start - $scope.data.filterData.perPage;
                }
                chargeCodeItem.end = chargeCodeItem.start + chargeCodeItem.transactions.length - 1;
            }
            else if(data.transactions.length > 0){
                chargeCodeItem.active = !chargeCodeItem.active;
            }

            refreshPaymentScroll();
            $scope.errorMessage = "";
            $scope.$emit('hideLoader');
        };

        // Call api only while expanding the tab or on pagination Next/Prev button actions ..
        if(!chargeCodeItem.active || isFromPagination){
            var postData = {
                "from_date":$scope.data.fromDate ,
                "to_date":$scope.data.toDate ,
                "charge_code_id":chargeCodeItem.charge_code_id ,
                "employee_ids" : $scope.data.selectedEmployeeList ,
                "department_ids" : $scope.data.selectedDepartmentList,
                "page_no" :  chargeCodeItem.page_no,
                "per_page": $scope.data.filterData.perPage,
                "type" : ($scope.data.activePaymentTab === "" ? "" : ($scope.data.activePaymentTab).toLowerCase())
            };
            $scope.invokeApi(RVJournalSrv.fetchPaymentDataByTransactions, postData, successCallBackFetchPaymentDataTransactions);
        }
        else{
            chargeCodeItem.active = !chargeCodeItem.active;
        }
    };

    /** Handle Expand/Collapse of Level1 **/
    $scope.clickedFirstLevel = function(index1){

        var toggleItem = $scope.data.paymentData.payment_types[index1];

        if(toggleItem.payment_type !== "Credit Card"){
            loadTransactionDeatils(toggleItem , false);
        }
        else{
            // For Credit cards , level-2 data already exist , so just do expand/collapse only ..
            toggleItem.active = !toggleItem.active;
        }
    };

    // Handle Expand/Collapse of Level2  Credit card section
    $scope.clickedSecondLevel = function(index1, index2){

        var toggleItem = $scope.data.paymentData.payment_types[index1].credit_cards[index2];

        loadTransactionDeatils(toggleItem , false);
    };

    /* To hide/show arrow button for Level1 */
    $scope.checkHasArrowFirstLevel = function(index){
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
    $scope.checkHasArrowSecondLevel = function(index1, index2){
        var hasArrow = false,
        item = $scope.data.paymentData.payment_types[index1].credit_cards[index2].transactions;
        if((typeof item !== 'undefined') && (item.length >0)) {
            hasArrow = true;
        }
        return hasArrow;
    };

    // To hanlde click inside payment tab.
    $scope.clickedOnPayment = function($event){
        $event.stopPropagation();
        if($scope.data.isDrawerOpened){
            $rootScope.$broadcast("CLOSEPRINTBOX");
        }
        $scope.errorMessage = "";
    };

    // Logic for pagination starts here ..
    $scope.loadNextSet = function(index1, index2){

        if(typeof index2 === 'undefined' || index2 === false ){
            var item = $scope.data.paymentData.payment_types[index1];
        }
        else{
            var item = $scope.data.paymentData.payment_types[index1].credit_cards[index2];
        }
        item.page_no ++;
        item.nextAction = true;
        item.prevAction = false;
        loadTransactionDeatils(item , true);
    };

    $scope.loadPrevSet = function(index1, index2){
        if(typeof index2 === 'undefined' || index2 === false ){
            var item = $scope.data.paymentData.payment_types[index1];
        }
        else{
            var item = $scope.data.paymentData.payment_types[index1].credit_cards[index2];
        }
        item.page_no --;
        item.nextAction = false;
        item.prevAction = true;
        loadTransactionDeatils(item, true);
    };

    $scope.isNextButtonDisabled = function(index1, index2){

        if(typeof index2 === 'undefined' || index2 === false ){
            var item = $scope.data.paymentData.payment_types[index1];
        }
        else{
            var item = $scope.data.paymentData.payment_types[index1].credit_cards[index2];
        }
        var isDisabled = false;

        if(item.end >= item.total_count){
            isDisabled = true;
        }
        return isDisabled;
    };

    $scope.isPrevButtonDisabled = function(index1, index2){

        if(typeof index2 === 'undefined' || index2 === false ){
            var item = $scope.data.paymentData.payment_types[index1];
        }
        else{
            var item = $scope.data.paymentData.payment_types[index1].credit_cards[index2];
        }
        var isDisabled = false;

        if(item.page_no === 1){
            isDisabled = true;
        }
        return isDisabled;
    };
    // Pagination logic ends ...

    // Hanlde payment group active toggle
    $scope.clickedPaymentGroup = function( activePaymentTab ){
        $scope.data.activePaymentTab = activePaymentTab;
        initPaymentData();
    };

}]);