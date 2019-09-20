admin.controller('ADItemDetailsCtrl', ['$scope', 'ADItemSrv', '$state', '$stateParams', 'availableLanguages', function($scope, ADItemSrv, $state, $stateParams, availableLanguages) {
	/*
	* Controller class for Room List
	*/

	$scope.errorMessage = '';
	$scope.mod = 'edit';

	$scope.availableLanguagesSet = availableLanguages;
    var defaultLanguage = _.filter(availableLanguages.languages, function(language) {
        return language.is_default;
    });
    $scope.selectedLanguage = {
        code: defaultLanguage.length ? defaultLanguage[0].code : 'en'
    };

	// inheriting from base controller
	BaseCtrl.call(this, $scope);


	var itemId = $stateParams.itemid;
	// if itemid is null, means it is for add item form

	if (typeof itemId === 'undefined' || itemId.trim() === '') {
		$scope.mod = 'add';
	}

	var fetchSuccessOfItemDetails = function(data) {
		$scope.$emit('hideLoader');
		$scope.itemDetails = data;
	};

	var fetchFailedOfItemDetails = function(errorMessage) {
		$scope.$emit('hideLoader');
		$scope.errorMessage = errorMessage ;
	};

	$scope.onLanguageChange = function() {
		loadItemDetails();
    };

    var loadItemDetails = function() {
    	if ($scope.mod === 'edit') {
			$scope.invokeApi(ADItemSrv.getItemDetails, {'item_id': itemId, 'locale': $scope.selectedLanguage.code}, fetchSuccessOfItemDetails, fetchFailedOfItemDetails);
		}
		else {
			$scope.invokeApi(ADItemSrv.addItemDetails, {}, fetchSuccessOfItemDetails, fetchFailedOfItemDetails);
		}
    }

	loadItemDetails();


	$scope.goBack = function() {
		$state.go('admin.items');
	};

	$scope.saveItemDetails = function()	{
		var postData = {};

		if ($scope.mod === 'edit') {
			postData.value = $scope.itemDetails.item_id;
		}

		postData.is_favorite = $scope.itemDetails.is_favourite;
		postData.item_description = $scope.itemDetails.item_description;
		postData.item_description_trl = $scope.itemDetails.item_description_trl;
		postData.unit_price = $scope.itemDetails.unit_price;
		postData.charge_code = $scope.itemDetails.selected_charge_code;
		postData.locale = $scope.selectedLanguage.code;
		var fetchSuccessOfSaveItemDetails = function() {
			$scope.goBack();
		};

		$scope.invokeApi(ADItemSrv.saveItemDetails, postData, fetchSuccessOfSaveItemDetails);
	};

}]);