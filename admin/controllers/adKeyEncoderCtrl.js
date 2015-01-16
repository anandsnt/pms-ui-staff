admin.controller('ADKeyEncoderCtrl',['$scope', '$state', 'ADRatesSrv', 'ADKeyEncoderSrv', 'ngTableParams','$filter','$timeout', '$location', '$anchorScroll',
	function($scope, $state, ADRatesSrv, ADKeyEncoderSrv, ngTableParams, $filter, $timeout, $location, $anchorScroll){

	$scope.errorMessage = '';
	$scope.successMessage = "";
	ADBaseTableCtrl.call(this, $scope, ngTableParams);



	$scope.fetchTableData = function($defer, params){
		var getParams = $scope.calculateGetParams(params);
		var fetchSuccessOfItemList = function(data){
			$scope.$emit('hideLoader');
			//No expanded rate view
			$scope.currentClickedElement = -1;
			$scope.totalCount = data.total_count;
			$scope.totalPage = Math.ceil(data.total_count/$scope.displyCount);
			$scope.data = data.results;
			$scope.currentPage = params.page();
        	params.total(data.total_count);
            $defer.resolve($scope.data);
		};
		$scope.invokeApi(ADKeyEncoderSrv.fetchEncoders, getParams, fetchSuccessOfItemList);
	}


	$scope.loadTable = function(){
		$scope.tableParams = new ngTableParams({
		        page: 1,  // show first page
		        count: $scope.displyCount, // count per page
		        /*sorting: {
		            rate: 'asc' // initial sorting
		        }*/
		    }, {
		        total: 0, // length of data
		        getData: $scope.fetchTableData
		    }
		);
	}

	$scope.loadTable();

	/**
	* Render add department screen
	*/
	$scope.addNew = function() {
		$scope.encoderData = {};
		$scope.currentClickedElement = "new";
		$scope.isAddMode = true;
		$timeout(function() {
            $location.hash('new-form-holder');
            $anchorScroll();
    	});
	};

	$scope.editEncoder = function(id, index) {
		console.log(id);
	
		$scope.encoderData = {};
		$scope.currentClickedElement = index;
		$scope.isAddMode = false;
		var successCallbackEdit = function(data) {
			$scope.encoderData = data;
			console.log($scope.encoderData);
			$scope.$emit('hideLoader');
		};
		
		var data = {
			"id" : id
		};
		$scope.invokeApi(ADKeyEncoderSrv.showEncoderDetails, data, successCallbackEdit);
	};

	$scope.saveEncoder = function() {
		console.log(JSON.stringify($scope.data));
		var successCallbackSave = function(data) {
			$scope.$emit('hideLoader');
			/*if ($scope.isAddMode) {
				// To add new data to scope
				$scope.data.push(data);
				var l = $scope.data.length;
				$scope.data[(l - 1)].name = $scope.rateTypeData.name;
				$scope.data[(l - 1)].rate_count = 0;
			} else {				
				//To update data with new value
				$scope.data[parseInt($scope.currentClickedElement)].name = $scope.rateTypeData.name;
			}*/
			$scope.currentClickedElement = -1;
		};
		if ($scope.isAddMode) {
			$scope.invokeApi(ADKeyEncoderSrv.saveEncoder, $scope.encoderData, successCallbackSave);
		} else {
			$scope.invokeApi(ADKeyEncoderSrv.updateEncoder, $scope.encoderData, successCallbackSave);
		}
	};

	$scope.clickCancel = function() {
		$scope.currentClickedElement = -1;
	};


	$scope.getTemplateUrl = function(index, id) {
		if ( typeof index === "undefined" || typeof id === "undefined")
			return "";
		if ($scope.currentClickedElement == index) {
			return "/assets/partials/keyEncoders/adEncoderEdit.html";
		}
	};



	/****************************************************************************************/


	/**
	* To fetch and display the rate popover
	* @param {int} index of the selected rate type
	* @param {string} id of the selected rate type
	* @param {string} number of rates available for the rate type
	*/
	$scope.showRates = function(index, id, fetchKey, baseRate){
		$scope.popoverRates = {};
		if(baseRate == "" || typeof baseRate == "undefined") return false;
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
		if(dateCount == 0) return false;
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


}]);

