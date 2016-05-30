admin.controller('ADRateTypeCtrl', ['$scope', '$rootScope', 'ADRateTypeSrv', 'ADRatesSrv', '$anchorScroll', '$timeout', '$location', 'rateClassifications',
function($scope, $rootScope, ADRateTypeSrv, ADRatesSrv, $anchorScroll, $timeout, $location, rateClassifications) {
	$scope.halfwayPoint = 0;

	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);
	$scope.rateTypeData = {};
	$scope.isAddMode = false;
	$scope.popoverRates = "";
	$scope.mouseEnterPopover = false;

	$scope.rateClassifications = rateClassifications;


	var fetchSuccess = function(data) {
		$scope.data = data;
		$scope.$emit('hideLoader');

		$scope.halfwayPoint = data.length >> 1;
	};

	$scope.invokeApi(ADRateTypeSrv.fetch, {}, fetchSuccess);

	/**
	* Render add department screen
	*/
	$scope.addNew = function() {
		$scope.rateTypeData = {};
		$scope.currentClickedElement = "new";
		$scope.isAddMode = true;
		$timeout(function() {
            $location.hash('new-form-holder');
            $anchorScroll();
    	});
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
		if ( typeof index === "undefined" || typeof id === "undefined") {
			return "";
		}
		if ($scope.currentClickedElement === index) {
			return "/assets/partials/rateTypes/adRateTypeEdit.html";
		}
	};

	$scope.getPopoverTemplate = function(index, id) {
		if ( typeof index === "undefined" || typeof id === "undefined") {
			return "";
		}
		if ($scope.currentHoverElement === index) {
			return "/assets/partials/rateTypes/adRateTypePopover.html";
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
				$scope.data.push(data);
				var l = $scope.data.length;
				$scope.data[(l - 1)].name = $scope.rateTypeData.name;
				if($scope.rateTypeData.classification !== null && typeof $scope.rateTypeData.classification !== "undefined") {
         	$scope.data[(l - 1)].classification = _.findWhere($scope.rateClassifications,{id: parseInt($scope.rateTypeData.classification.id,10)});
        }
				$scope.data[(l - 1)].rate_count = 0;
			} else {
				//To update data with new value
				$scope.data[parseInt($scope.currentClickedElement)].name = $scope.rateTypeData.name;
				if($scope.rateTypeData.classification !== null && typeof $scope.rateTypeData.classification !== "undefined") {
					$scope.data[parseInt($scope.currentClickedElement)].classification = _.findWhere($scope.rateClassifications,{id: parseInt($scope.rateTypeData.classification.id,10)});
        }
			}
			$scope.currentClickedElement = -1;
		};
		if ($scope.isAddMode) {
			$scope.invokeApi(ADRateTypeSrv.saveRateType, $scope.rateTypeData, successCallbackSave);
		} else {
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
		var deleteRateSuccess = function(data) {
			$scope.$emit('hideLoader');
			$scope.data.splice(index, 1);
			$scope.currentClickedElement = -1;
		};
		$scope.invokeApi(ADRateTypeSrv.deleteRateType, id, deleteRateSuccess);
	};

	/**
	* To fetch and display the rate popover
	* @param {int} index of the selected rate type
	* @param {string} id of the selected rate type
	* @param {string} number of rates available for the rate type
	*/
	$scope.showRates = function(index, rateTypeId, rateCount){
		if(rateCount <= 0) {
			return false;
		}
		var rateFetchSuccess = function(data) {
			$scope.$emit('hideLoader');
			$scope.popoverRates = data;
			$scope.mouseEnterPopover = true;
		};

		//Fetch the rates only when we enter the popover area.
		if(!$scope.mouseEnterPopover){
			$scope.popoverRates = "";
			$scope.currentHoverElement = index;
			$scope.invokeApi(ADRatesSrv.fetchRates, {'rate_type_id': rateTypeId}, rateFetchSuccess, undefined, 'NOOP');
		}
	};

	/**
	* To handle the popover state. Reset the flag, rates dict while leaving the popover area
	*/
	$scope.mouseLeavePopover = function(){
		$scope.popoverRates = "";
		$scope.mouseEnterPopover = false;
	};

	$scope.showLoader = function() {
		$scope.$emit('showLoader');
	};
}]);
