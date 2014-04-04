admin.controller('ADRateTypeCtrl', ['$scope', '$rootScope', 'ADRateTypeSrv',
function($scope, $rootScope, ADRateTypeSrv) {
	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);
	$scope.rateTypeData = {};
	$scope.isAddMode = false;

	var fetchSuccess = function(data) {
		$scope.data = data;
		console.log("fetchSuccess");
		console.log($scope.data);
		//console.log($scope.data.rate_types);
		$scope.$emit('hideLoader');
	};

	$scope.invokeApi(ADRateTypeSrv.fetch, {}, fetchSuccess);

	/**
	* Render add department screen
	*/
	$scope.addNew = function() {
		$scope.rateTypeData = {};
		$scope.currentClickedElement = "new";
		$scope.isAddMode = true;
	};

	/**
	* To render edit rate type screen
	* @param {index} index of selected rate type
	* @param {id} id of the rate type
	*/
	$scope.editRateTypes = function(index, id) {
	
		$scope.rateTypeData = {};
		$scope.currentClickedElement = index;
		$scope.isAddMode = false;
		var successCallbackRender = function(data) {
			$scope.rateTypeData = data;
			$scope.$emit('hideLoader');
		};
		
		var data = {
			"id" : id
		};
		$scope.invokeApi(ADRateTypeSrv.getRateTypesDetails, data, successCallbackRender);
	};

	/**
	* To get the template of edit screen
	* @param {int} index of the selected rate type
	* @param {string} id of the rate type
	*/
	$scope.getTemplateUrl = function(index, id) {
		if ( typeof index === "undefined" || typeof id === "undefined")
			return "";
		if ($scope.currentClickedElement == index) {
			return "/assets/partials/rateTypes/adRateTypeEdit.html";
		}
	};
	/**
	*  A post method to update ReservationImport for a hotel
	*  @param {String} index value for the hotel list item.
	*/
	$scope.toggleClicked = function(index) {
		//
		var isActivated = !$scope.data[index].activated;
		var data = {
			'id' : $scope.data[index].id,
			'status' : isActivated
		};

		var postSuccess = function() {
			$scope.data[index].activated = isActivated;
			$scope.$emit('hideLoader');
		};

		$scope.invokeApi(ADRateTypeSrv.postRateTypeToggle, data, postSuccess);
	};
	/**
	* To save/update rate type details
	*/
	$scope.saveRateType = function() {
		var successCallbackSave = function(data) {
			$scope.$emit('hideLoader');
			if ($scope.isAddMode) {
				// To add new data to scope
				$scope.data.rate_types.push(data);
			} else {
				
				//To update data with new value
				$scope.data.rate_types[parseInt($scope.currentClickedElement)].name = $scope.rateTypeData.name;
				$scope.data.rate_types[parseInt($scope.currentClickedElement)].description = $scope.rateTypeData.description;

			}
			$scope.currentClickedElement = -1;
		};
		if ($scope.isAddMode) {
			console.log($scope.rateTypeData)
			$scope.invokeApi(ADRateTypeSrv.saveRateType, $scope.rateTypeData, successCallbackSave);
		} else {
			console.log($scope.rateTypeData)
			$scope.invokeApi(ADRateTypeSrv.updateRateType, $scope.rateTypeData, successCallbackSave);
		}
	};
	/**
	* To handle click event
	*/
	$scope.clickCancel = function() {
		$scope.currentClickedElement = -1;
	};

	/**
	* To delete rate types
	* @param {int} index of the selected rate types
	* @param {string} id of the selected rate types
	*/
	$scope.deleteRateType = function(index, id) {
		var successCallbackDelete = function(data) {
			$scope.$emit('hideLoader');
			$scope.data.rate_types.splice(index, 1);
		};
		$scope.invokeApi(ADRateTypeSrv.deleteRateType, id, successCallbackDelete);
	};
}]);
