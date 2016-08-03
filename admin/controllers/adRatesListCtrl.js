admin.controller('ADRatesListCtrl',['$scope', '$rootScope', '$state', 'ADRatesSrv', 'ADHotelSettingsSrv', 'ngTableParams','$filter','$timeout', '$stateParams',
	function($scope, $rootScope, $state, ADRatesSrv, ADHotelSettingsSrv, ngTableParams, $filter, $timeout, $stateParams){

	$scope.errorMessage = '';
	$scope.successMessage = "";
	$scope.popoverRates = {};
	ADBaseTableCtrl.call(this, $scope, ngTableParams);

	$scope.isConnectedToPMS = false;

	/**
    * To fetch all rate types
    */
	$scope.fetchFilterTypes = function(){
		$scope.invokeApi(ADRatesSrv.fetchRateTypes, {}, $scope.filterFetchSuccess);
	};

	$scope.fetchFilterTypes();

	$scope.checkPMSConnection = function(){
		var fetchSuccessOfHotelSettings = function(data){
			if(data.pms_type !== null) {
				$scope.isConnectedToPMS = true;
			}
		};
		$scope.invokeApi(ADHotelSettingsSrv.fetch, {}, fetchSuccessOfHotelSettings);
	};
	$scope.checkPMSConnection();

	$scope.fetchTableData = function($defer, params){
		var getParams = $scope.calculateGetParams(params);
		var fetchSuccessOfItemList = function(data){
			$timeout(function() {
		        $scope.$emit('hideLoader');
				//No expanded rate view
				$scope.currentClickedElement = -1;
				$scope.totalCount = data.total_count;
				$scope.totalPage = Math.ceil(data.total_count/$scope.displyCount);
				$scope.data = data.results;
				$scope.currentPage = params.page();
	        	params.total(data.total_count);
	        	//params.total(data.results.length);
	            $defer.resolve($scope.data);
		    }, 1000);

		};
		$scope.invokeApi(ADRatesSrv.fetchRates, getParams, fetchSuccessOfItemList);
	};


	$scope.loadTable = function(){
		$scope.tableParams = new ngTableParams({
		        page: 1,  // show first page
		        count: $scope.displyCount, // count per page
		        sorting: {
		            rate: 'asc' // initial sorting
		        }
		    }, {
		        total: $scope.data.length, // length of data
		        getData: $scope.fetchTableData

		    }
		);
	};

	$scope.loadTable();

	/**
	* To import the PMS rates
	*/
	$scope.importFromPms = function(event){

		event.stopPropagation();

		$scope.successMessage = "Collecting rates data from PMS and adding to Rover...";

		var fetchSuccessOfItemList = function(data){
			$scope.$emit('hideLoader');
			$scope.successMessage = "Completed!";
	 		$timeout(function() {
		        $scope.successMessage = "";
		    }, 1000);
		};
		$scope.invokeApi(ADRatesSrv.importRates, {}, fetchSuccessOfItemList);
	};

	/**
	* To fetch and display the rate popover
	* @param {int} index of the selected rate type
	* @param {string} id of the selected rate type
	* @param {string} number of rates available for the rate type
	*/
	$scope.showRates = function(index, id, fetchKey, baseRate){
		$scope.popoverRates = {};
		if(baseRate === "" || typeof baseRate === "undefined") {
			return false;
		}
		var rateFetchSuccess = function(data) {
			$scope.$emit('hideLoader');
			$scope.popoverRates = data;
			$scope.mouseEnterPopover = true;
		};

		//Fetch the rates only when we enter the popover area -
		//no need to repeat the fetch when we hover over the area.
		if(!$scope.mouseEnterPopover){
			$scope.popoverRates = {};
			$scope.currentHoverElement = index;
			var params = {};
			params[fetchKey] = id;
			$scope.invokeApi(ADRatesSrv.fetchRates, params, rateFetchSuccess, '', 'NONE');
		}
	};

	/**
	* To fetch and display the rate popover
	* @param {int} index of the selected rate type
	* @param {string} id of the selected rate type
	* @param {string} number of rates available for the rate type
	*/
	$scope.showDateRanges = function(index, id, fetchKey, dateCount){
		if(dateCount === 0) {
			return false;
		}
		var dateFetchSuccess = function(data) {
			$scope.$emit('hideLoader');
			$scope.popoverRates = data;
			$scope.mouseEnterPopover = true;
		};

		//Fetch the rates only when we enter the popover area.
		if(!$scope.mouseEnterPopover){
			$scope.popoverRates = {};
			$scope.currentHoverElement = index;
			var params = {};
			params[fetchKey] = id;
			$scope.invokeApi(ADRatesSrv.fetchDateRanges, params, dateFetchSuccess, '', 'NONE');
		}
	};

	/**
	* To handle the popover state. Reset the flag, rates dict while leaving the popover area
	*/
	$scope.mouseLeavePopover = function(){
		$scope.popoverRates = {};
		$scope.mouseEnterPopover = false;
	};

	/**
	* To fetch the popover template for Based on popover
	* @param {int} index of the selected rate type
	* @param {int} id of the selected rate type
	*/
	$scope.getPopoverTemplate = function(index, id, type) {
		if (typeof index === "undefined" || typeof id === "undefined"){
			return "";
		}
		if ($scope.currentHoverElement === index) {
			if(type === 'basedOn') {
				return "/assets/partials/rates/adRatePopover.html";
			}
			if(type === 'rateType') {
				return "/assets/partials/rates/adRateTypePopover.html";
			}
			if(type === 'dateRange') {
				return "/assets/partials/rates/adDateRangePopover.html";
			}
		}
	};

	/*
    * To get the template of edit screen
    * @param {int} index of the selected rate
    * @param {string} id of the rate
    */
	$scope.getTemplateUrl = function(index, id){

		if(typeof index === "undefined" || typeof id === "undefined") {
			return "";
		}
		if($scope.currentClickedElement === index){
			return "/assets/partials/rates/adRateInlineEdit.html";
		}
	};

	/*
   	* To update rate details for non-standalone PMS
   	*/
   	$scope.saveRateForNonStandalone = function(){
    	var successCallbackSave = function(data){
    		$scope.$emit('hideLoader');
    		//To update data with new value
    		$scope.data[parseInt($scope.currentClickedElement)].name = $scope.rateDetailsForNonStandalone.name;
    		$scope.data[parseInt($scope.currentClickedElement)].description = $scope.rateDetailsForNonStandalone.description;
    		$scope.currentClickedElement = -1;
    	};
   		$scope.invokeApi(ADRatesSrv.updateRateForNonStandalone, $scope.rateDetailsForNonStandalone , successCallbackSave);
    };
   /*
    * To handle click event
    */
	$scope.clickCancelForInlineEdit = function(){
		$scope.currentClickedElement = -1;
	};

	/**
	* To delete a rate
	* @param {int} index of the selected rate type
	*
	*/

	$scope.deleteRate = function(selectedId){

		//call service for deleting
		var rateDeleteSuccess = function(){
			$scope.tableParams.reload();
			$scope.$emit('hideLoader');
		};
		var rateDeleteFailure = function(data){
			$scope.$emit('hideLoader');
			$scope.errorMessage =  data;
		};
		$scope.invokeApi(ADRatesSrv.deleteRate, selectedId, rateDeleteSuccess,rateDeleteFailure);


	};
	/**
	* To activate/deactivate a rate
	* @param {int} index of the selected rate type
	*
	*/
	$scope.toggleActive = function(selectedId,checkedStatus,activationAllowed){
		var params = {'id': selectedId, is_active: !checkedStatus };
		var rateToggleSuccess = function(){
		$scope.$emit('hideLoader');
			//on success
		angular.forEach($scope.data, function(rate, key) {
	      if(rate.id === selectedId){
	      	rate.status = !rate.status;
	      }
	     });
		};
		var rateToggleFailure = function(data){
			$scope.$emit('hideLoader');
			$scope.errorMessage =  data;
		};

		$scope.invokeApi(ADRatesSrv.toggleRateActivate, params, rateToggleSuccess,rateToggleFailure);

	};

	$scope.showLoader = function() {
		$scope.$emit('showLoader');
	};

	$scope.editRatesClicked = function(rateId, index) {
		//If PMS connected, we show an inline edit screen for rates.
		//Only rate name and description should be editable.
                $stateParams.rateId = rateId;
		if($scope.isConnectedToPMS){
			$scope.rateDetailsForNonStandalone = {};
			$scope.currentClickedElement = index;

		 	var successCallbackRender = function(data){
		 		$scope.rateDetailsForNonStandalone = data;
		 		$scope.$emit('hideLoader');
		 	};
		 	var data = {"id": rateId };
	 		$scope.invokeApi(ADRatesSrv.getRateDetailsForNonstandalone, data , successCallbackRender);
		//If standalone PMS, then the rate configurator wizard should be appeared.
		}else{
			$scope.showLoader();
			$state.go('admin.rateDetails', {rateId : rateId});
		}

	};

}]);

