sntRover.controller('RVJournalPrintController', ['$scope','$rootScope','$timeout','$window','RVJournalSrv',function($scope,$rootScope,$timeout,$window,RVJournalSrv) {
	BaseCtrl.call(this, $scope);

	/** Code for PRINT BOX drawer common Resize Handler starts here .. **/
	var resizableMinHeight = 0;
	var resizableMaxHeight = 90;
	$scope.eventTimestamp = '';
	$scope.data.printBoxHeight = resizableMinHeight;
	// Drawer resize options.
	$scope.resizableOptions = {
		minHeight: resizableMinHeight,
		maxHeight: resizableMaxHeight,
		handles: 's',
		resize: function(event, ui) {
			var height = $(this).height();
			if (height > 5){
				$scope.data.isDrawerOpened = true;
				$scope.data.printBoxHeight = height;
			}
			else if(height < 5){
				$scope.closeDrawer();
			}
		},
		stop: function(event, ui) {
			preventClicking = true;
			$scope.eventTimestamp = event.timeStamp;
		}
	};

	// To handle click on drawer handle - open/close.
	$scope.clickedDrawer = function($event){
		$event.stopPropagation();
		$event.stopImmediatePropagation();
		if(getParentWithSelector($event, document.getElementsByClassName("ui-resizable-handle")[0])){
			if(parseInt($scope.eventTimestamp)) {
				if(($event.timeStamp - $scope.eventTimestamp)<2){
					return;
				}
			}
			if($scope.data.printBoxHeight === resizableMinHeight || $scope.data.printBoxHeight === resizableMaxHeight) {
				if ($scope.data.isDrawerOpened)	{
					$scope.closeDrawer();
				}
				else {
					$scope.openDrawer();
				}
			}
			else{
				// mid way click : close guest card
				$scope.closeDrawer();
			}
		}
	};

	// To open the Drawer
	$scope.openDrawer = function(){
		$scope.data.printBoxHeight = resizableMaxHeight;
		$scope.data.isDrawerOpened = true;
	};

	// To close the Drawer
	$scope.closeDrawer = function(){
		$scope.data.printBoxHeight = resizableMinHeight;
		$scope.data.isDrawerOpened = false;
	};

	$scope.$on("CLOSEPRINTBOX",function(){
		$scope.closeDrawer();
	});

	/** Code for Resize Handler ends here ..  **/

	/** Code for Revenue Tab - PRINT BOX - filters  starts here .. **/

	// On changing charge group on PRINT filter
	$scope.chargeGroupChanged = function(){

		$scope.data.activeChargeCodes = [];

		var successCallBackFetchRevenueData = function(data){
			$scope.data.revenueData = {};
			$scope.data.revenueData = data;

			var chargeCodeList = data.charge_groups[0].charge_codes;
			$scope.data.activeChargeCodes = ( chargeCodeList.length >0 ) ? chargeCodeList : [];
			$scope.data.revenueData.charge_groups[0].active = true;

            $scope.errorMessage = "";
            $rootScope.$broadcast('REFRESHREVENUECONTENT');
            $scope.$emit('hideLoader');
		};

		var postData = {
            "from_date":$scope.data.fromDate,
            "to_date":$scope.data.toDate,
            "employee_ids" : $scope.data.selectedEmployeeList ,
            "department_ids" : $scope.data.selectedDepartmentList,
            "charge_group_id": $scope.data.selectedChargeGroup
        };

		$scope.invokeApi(RVJournalSrv.fetchRevenueDataByChargeGroups, postData, successCallBackFetchRevenueData);

       	var uiValue = _.find($scope.data.revenueData.charge_groups, function(each) {
       		return each.id === $scope.data.selectedChargeGroup;
       	});
       	$scope.data.uiSelectedChargeGroup = !!uiValue ? uiValue['name'] : '';
	};

	// On changing charge code on PRINT filter
	$scope.chargeCodeChanged = function(){

		var successCallBackFetchRevenueDataChargeCodes = function(data){

			$scope.data.revenueData.charge_groups[0].charge_codes = [];
			$scope.data.revenueData.charge_groups[0].charge_codes = data.charge_codes;
			$scope.data.revenueData.charge_groups[0].active = true;


			$rootScope.$broadcast('REFRESHREVENUECONTENT');
            $scope.errorMessage = "";
            $scope.$emit('hideLoader');
        };

        var postData = {
        	"from_date":$scope.data.fromDate,
        	"to_date":$scope.data.toDate,
        	"charge_group_id": $scope.data.selectedChargeGroup,
        	"charge_code_id" : $scope.data.selectedChargeCode,
        	"employee_ids" : $scope.data.selectedEmployeeList,
            "department_ids" : $scope.data.selectedDepartmentList
        };

        $scope.invokeApi(RVJournalSrv.fetchRevenueDataByChargeCodes, postData, successCallBackFetchRevenueDataChargeCodes);

       	var uiValue = _.find($scope.data.activeChargeCodes, function(each) {
       		return each.id === $scope.data.selectedChargeCode;
       	});
       	$scope.data.uiSelectedChargeCode = !!uiValue ? uiValue['name'] : '';
	};

	// To handle Summary/Details toggle button click - REVENUE
	$scope.toggleSummaryOrDeatilsRevenue = function(){

		$scope.data.isRevenueToggleSummaryActive = !$scope.data.isRevenueToggleSummaryActive;
	};

	// To handle Summary/Details toggle button click - PAYMENT
	$scope.toggleSummaryOrDeatilsPayment = function(){

		$scope.data.isPaymentToggleSummaryActive = !$scope.data.isPaymentToggleSummaryActive;
	};

	/** Code for Revenue Tab - PRINT BOX - filters ends here ..   **/

	/** Code for Payment Tab - PRINT BOX - filters starts here .. **/
	$scope.paymentTypeChanged = function(){

		var successCallBackFetchPaymentData = function(data){
			$scope.data.paymentData = {};
			$scope.data.paymentData = data;

			if(data.payment_type === 'Credit Card'){
				$scope.data.paymentData.payment_types[0].active = true;
			}
            $scope.errorMessage = "";
			$rootScope.$broadcast('REFRESHPAYMENTCONTENT');
			$scope.$emit('hideLoader');
		};

		var postData = {
            "from_date":$scope.data.fromDate,
            "to_date":$scope.data.toDate,
            "employee_ids" : $scope.data.selectedEmployeeList ,
            "department_ids" : $scope.data.selectedDepartmentList
        };

		if($scope.data.selectedPaymentType === "ALL"){
			postData.charge_code_id = "";
		}
		else if($scope.data.selectedPaymentType === "" || typeof $scope.data.selectedPaymentType === "undefined"){
			postData.charge_code_id = "CC";
		}
		else{
			postData.charge_code_id = $scope.data.selectedPaymentType;
		}
		$scope.invokeApi(RVJournalSrv.fetchPaymentDataByPaymentTypes, postData , successCallBackFetchPaymentData);

		var uiValue = _.find($scope.data.paymentData.payment_types, function(each) {
			return each.id === $scope.data.selectedPaymentType;
		});
		$scope.data.uiSelectedPaymentType = !!uiValue ? uiValue['payment_type'] : '';
	};

	/** Code for Payment Tab - PRINT BOX - filters ends here .. **/


	/** PRINT Functionality **/

	$scope.printRevenue = function(){
		printJournal();
	};

	$scope.printPayment = function(){
		printJournal();
	};

	$scope.printCashier = function(){
		printJournal();
	};

	// add the print orientation before printing
	var addPrintOrientation = function() {
		var orientation = 'portrait';

		switch( $scope.data.activeTab ) {
			case 0:
			case 1:
				orientation = 'landscape';
				break;

			default:
				orientation = 'portrait';
				break;
		}

		$( 'head' ).append( "<style id='print-orientation'>@page { size: " + orientation + "; }</style>" );
	};

	// add the print orientation after printing
	var removePrintOrientation = function() {
		$( '#print-orientation' ).remove();
	};

	// print the journal page
	var printJournal = function() {
		$scope.printFilterValues = {};
		$scope.printFilterValues.selectedChargeGroup = $( '#revenue-charge-group option:selected' ).text();
		$scope.printFilterValues.selectedChargeCode = $( '#revenue-charge-code:selected' ).text();
		$scope.printFilterValues.selectedPaymentType = $( '#payments-payment-type option:selected' ).text();

		// add the orientation
		addPrintOrientation();

		/*
		 *	======[ READY TO PRINT ]======
		 */
		// this will show the popup with full bill
	    $timeout(function() {
	    	/*
	    	 *	======[ PRINTING!! JS EXECUTION IS PAUSED ]======
	    	 */

	        $window.print();

	        if ( sntapp.cordovaLoaded ) {
	            cordova.exec(function(success) {}, function(error) {}, 'RVCardPlugin', 'printWebView', []);
	        };
	    }, 100);

	    /*
	     *	======[ PRINTING COMPLETE. JS EXECUTION WILL UNPAUSE ]======
	     */

		// remove the orientation after similar delay
		$timeout(removePrintOrientation, 100);
	};

}]);