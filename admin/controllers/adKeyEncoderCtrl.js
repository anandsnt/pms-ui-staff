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
	};


	$scope.loadTable = function(){
		$scope.tableParams = new ngTableParams({
		        page: 1,  // show first page
		        count: $scope.displyCount // count per page

		    }, {
		        total: 0, // length of data
		        getData: $scope.fetchTableData
		    }
		);
	};

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
		$scope.encoderData = {};
		$scope.currentClickedElement = index;
		$scope.isAddMode = false;
		var successCallbackEdit = function(data) {
			$scope.encoderData = data;
			$scope.$emit('hideLoader');
		};

		var data = {
			"id" : id
		};
		$scope.invokeApi(ADKeyEncoderSrv.showEncoderDetails, data, successCallbackEdit);
	};

	$scope.saveEncoder = function() {

		var successCallbackSave = function(data) {
			$scope.$emit('hideLoader');
			if ($scope.isAddMode) {
				// To add new data to scope
				$scope.data.push(data);
				var l = $scope.data.length;
				$scope.data[(l - 1)].description = $scope.encoderData.description;
				$scope.data[(l - 1)].location = $scope.encoderData.location;
				$scope.data[(l - 1)].encoder_id = $scope.encoderData.encoder_id;
				$scope.data[(l - 1)].enabled = $scope.encoderData.enabled;
				$scope.reloadTable();
			} else {
				//To update data with new value
				$scope.data[parseInt($scope.currentClickedElement)].description = $scope.encoderData.description;
				$scope.data[parseInt($scope.currentClickedElement)].location = $scope.encoderData.location;
				$scope.data[parseInt($scope.currentClickedElement)].encoder_id = $scope.encoderData.encoder_id;
				$scope.data[parseInt($scope.currentClickedElement)].enabled = $scope.encoderData.enabled;

			}
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
		if ( typeof index === "undefined" || typeof id === "undefined") {
			return "";
		}
		if ($scope.currentClickedElement === index) {
			return "/assets/partials/keyEncoders/adEncoderEdit.html";
		}
	};

	$scope.statusToggle = function(index) {
		$scope.data[index].activated;
		var data = {
			'id' : $scope.data[index].id,
			'status' : !$scope.data[index].enabled
		};

		var postSuccess = function() {
			$scope.data[index].enabled = !$scope.data[index].enabled;
			$scope.$emit('hideLoader');
		};

		$scope.invokeApi(ADKeyEncoderSrv.updateEncoderStatus, data, postSuccess);
	};



	/****************************************************************************************/


}]);

