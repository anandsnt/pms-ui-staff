admin.controller('ADChargeGroupsCtrl', ['$scope', 'ADChargeGroupsSrv', '$anchorScroll', '$timeout', '$location', 'availableLanguages',
	function($scope, ADChargeGroupsSrv, $anchorScroll, $timeout, $location, availableLanguages) {

	BaseCtrl.call(this, $scope);
	$scope.$emit("changedSelectedMenu", 5);
	$scope.currentClickedElement = -1;
	$scope.preveousItem = "";

	$scope.availableLanguagesSet = availableLanguages;
	var defaultLanguage = _.filter(availableLanguages.languages, function(language) {
		return language.is_default;
	});
	var setDefaultLanguage = function() {
		$scope.selectedLanguage = {
			code: defaultLanguage.length ? defaultLanguage[0].code : 'en'
		};
	};
	    
	    setDefaultLanguage();

	$scope.onLanguageChange = function() {
		$scope.invokeApi(ADChargeGroupsSrv.fetch, { 'locale': $scope.selectedLanguage.code }, fetchSuccessCallback);
	};
    /*
    * To fetch charge groups list
    */
	var fetchSuccessCallback = function(data) {
		$scope.$emit('hideLoader');
		$scope.data = data;
	};

	$scope.invokeApi(ADChargeGroupsSrv.fetch, { 'locale': $scope.selectedLanguage.code }, fetchSuccessCallback);

    /*
    * To render edit screen
    * @param {int} index index of selected charge groups
    * @paran {string} id - charge groups id
    */
	$scope.editItem = function(index)	{
		if ($scope.data.charge_groups[index].name === 'Allowance') {
			return;
		}
		$scope.currentClickedElement = index;
		$scope.preveousItem = $scope.data.charge_groups[index].name;
	};
	/*
    * To get the template of edit screen
    * @param {int} index of the selected item
    * @param {string} id of the item
    */
	$scope.getTemplateUrl = function(index) {
		if ($scope.currentClickedElement === index) {
			 return "/assets/partials/chargeGroups/adChargeGroupsEdit.html";
		}
	};
	/*
    * To handle cancel click
    */
	$scope.clickedCancel = function() {
		if ($scope.currentClickedElement !== 'new') {
			$scope.data.charge_groups[$scope.currentClickedElement].name = $scope.preveousItem;
			$scope.preveousItem = "";
		}
		$scope.data.name = "";
		$scope.data.charge_group_trl = "";
		$scope.currentClickedElement = -1;
	};
	/*
    * To handle add new button click
    */
	$scope.addNewClicked = function() {
		$scope.currentClickedElement = 'new';
		$timeout(function() {
            $location.hash('add-new');
            $anchorScroll();
    	});

	};
	/*
    * To handle save button in add new box.
    */
  	$scope.saveAddNew = function() {
  		var postSuccess = function(data) {
			$scope.$emit('hideLoader');
			$scope.currentClickedElement = -1;
			$scope.data.name = "";
			$scope.data.charge_group_trl = "";
			$scope.data.charge_groups.push(data);
		};

  		$scope.invokeApi(ADChargeGroupsSrv.save, { 'name': $scope.data.name, 'locale': $scope.selectedLanguage.code, 'charge_group_trl': $scope.data.charge_group_trl }, postSuccess);
	};
	/*
    * To handle save button in edit box.
    */
   	$scope.updateItem = function() {
   		var postSuccess = function(data) {
			$scope.$emit('hideLoader');
			$scope.currentClickedElement = -1;
		};
 		var data = $scope.data.charge_groups[$scope.currentClickedElement];
 		data.locale = $scope.selectedLanguage.code;

  		$scope.invokeApi(ADChargeGroupsSrv.update, data, postSuccess);
   	};
   	/*
    * To handle delete button in edit box and list view.
    */
	$scope.clickedDelete = function(id) {
		var chargeGroupToDelete = _.find($scope.data.charge_groups, {
	        value: id
	    });
	    
	    if (chargeGroupToDelete.name === "Allowance") {
	    	return;
	    }
		var successDeletionCallback = function() {
			$scope.$emit('hideLoader');
			$scope.currentClickedElement = -1;
			// delete data from scope
			$scope.data.charge_groups.splice($scope.data.charge_groups.indexOf(chargeGroupToDelete), 1);
		};

		$scope.invokeApi(ADChargeGroupsSrv.deleteItem, {'value': id }, successDeletionCallback);
	};

}]);

