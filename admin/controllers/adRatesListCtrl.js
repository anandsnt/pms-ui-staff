admin.controller('ADRatesListCtrl',['$scope', '$state', 'ADRatesSrv', 'ADHotelSettingsSrv', 'ngTableParams','$filter',  
	function($scope, $state, ADRatesSrv, ADHotelSettingsSrv, ngTableParams, $filter){
	
	$scope.errorMessage = '';
	$scope.popoverRates = "";
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
			if(data.pms_type !== null)
				$scope.isConnectedToPMS = true;
		}
		$scope.invokeApi(ADHotelSettingsSrv.fetchHotelSettings, {}, fetchSuccessOfHotelSettings);
	};
	$scope.checkPMSConnection();

	$scope.fetchTableData = function($defer, params){
 
		var getParams = $scope.calculateGetParams(params);
		var fetchSuccessOfItemList = function(data){
			$scope.$emit('hideLoader');
			$scope.data = data.results;
			$scope.totalCount = data.total_count;
			$scope.totalPage = Math.ceil(data.total_count/$scope.displyCount);
			$scope.currentPage = params.page();
        	params.total(data.total_count);
            // use build-in angular filter
    
            $defer.resolve($scope.data);
		};
		$scope.invokeApi(ADRatesSrv.fetchRates, getParams, fetchSuccessOfItemList);	
	}	


	$scope.loadTable = function(){

		$scope.tableParams = new ngTableParams({
		        page: 1,  // show first page
		        count: $scope.displyCount, // count per page 
		        sorting: {
		            rate: 'asc' // initial sorting
		        }
		    }, {
		        total: 0, // length of data
		        getData: $scope.fetchTableData
		    }
		);
	}
		
	$scope.loadTable();

	$scope.importFromPms = function(){
		var fetchSuccessOfItemList = function(data){
			$scope.$emit('hideLoader');
		};
		$scope.invokeApi(ADRatesSrv.importRates, {}, fetchSuccessOfItemList);	
	}

	/**
	* To fetch and display the rate popover
	* @param {int} index of the selected rate type
	* @param {string} id of the selected rate type
	* @param {string} number of rates available for the rate type
	*/
	$scope.showRates = function(index, id, fetchKey, baseRate){
		if(baseRate == "" || typeof baseRate == "undefined") return false;
		var rateFetchSuccess = function(data) {
			$scope.$emit('hideLoader');
			$scope.popoverRates = data;
			console.log(data);
			$scope.mouseEnterPopover = true; 
		};

		//Fetch the rates only when we enter the popover area.
		if(!$scope.mouseEnterPopover){
			$scope.popoverRates = "";
			$scope.currentHoverElement = index;
			var params = {};
			params[fetchKey] = id;
			$scope.invokeApi(ADRatesSrv.fetchRates, params, rateFetchSuccess);
		}
	};

	/**
	* To fetch and display the rate popover
	* @param {int} index of the selected rate type
	* @param {string} id of the selected rate type
	* @param {string} number of rates available for the rate type
	*/
	$scope.showDateRanges = function(index, id, fetchKey, dateCount){
		if(dateCount == 0) return false;
		var dateFetchSuccess = function(data) {
			$scope.$emit('hideLoader');
			$scope.popoverRates = data;
			$scope.mouseEnterPopover = true; 
		};

		//Fetch the rates only when we enter the popover area.
		if(!$scope.mouseEnterPopover){
			$scope.popoverRates = "";
			$scope.currentHoverElement = index;
			var params = {};
			params[fetchKey] = id;
			$scope.invokeApi(ADRatesSrv.fetchDateRanges, params, dateFetchSuccess);
		}
	};

	/**
	* To handle the popover state. Reset the flag, rates dict while leaving the popover area
	*/
	$scope.mouseLeavePopover = function(){
		$scope.popoverRates = "";
		$scope.mouseEnterPopover = false; 
	}

	$scope.getPopoverTemplate = function(index, id) {
		if (typeof index === "undefined" || typeof id === "undefined")
			return "";

		if ($scope.currentHoverElement == index) {
			return "/assets/partials/rates/adRatePopover.html";
		}
	}; 

	$scope.getdateRangeTemplate = function(index, id) {
		if (typeof index === "undefined" || typeof id === "undefined")
			return "";

		if ($scope.currentHoverElement == index) {
			return "/assets/partials/rates/addateRangePopover.html";
		}
	};


}]);

