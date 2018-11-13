admin.controller('ADTemplateConfigurationCtrl', ['$scope', '$state', 'ADHotelListSrv', 'ADHotelConfigurationSrv', 'ngTableParams', '$filter', '$anchorScroll', '$timeout', '$location',
  function($scope, $state, ADHotelListSrv, ADHotelConfigurationSrv, ngTableParams, $filter, $anchorScroll, $timeout, $location) {

	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);

    /*
    * Variables set to show/hide forms
    */
	$scope.isAddmode = false;
	$scope.isEditmode = false;
   /*
    * Method to fetch all hotel brands
    */
	$scope.fetchHotelList = function() {
		var fetchSuccess = function(data) {
			$scope.$emit('hideLoader');
			$scope.data = data.hotels;
		};

		$scope.invokeApi(ADHotelListSrv.fetch, {}, fetchSuccess);
	};
	$scope.fetchHotelList();
	/*
    * To get brand details form - used for both add and edit
    */
	$scope.getTemplateUrl = function() {
		return "/assets/partials/templateConfiguration/adHotelConfigurationEdit.html";
	};
	$scope.editHotelConfiguration = function(index, hotelId) {


		$scope.isAddmode = false;
		$scope.errorMessage = "";
		$scope.currentClickedElement = index;
		$scope.clickedHotel = hotelId;

		var postData = { 'hotel_id': hotelId };
		var editHotelConfigurationSuccessCallback = function(data) {
			$scope.$emit('hideLoader');
			$scope.hotelConfig   = data;
			$scope.formTitle = data.hotel_name;// To show hotel name in title
			$scope.isEditmode = true;
			$scope.hotelConfig.theme = $scope.hotelConfig.existing_email_template_theme;

			for (var i = 0; i < $scope.hotelConfig.email_templates.length; i++) {
				$scope.hotelConfig.email_templates[i].selected = false;
				if ($scope.hotelConfig.existing_email_templates.indexOf($scope.hotelConfig.email_templates[i].id) !== -1) {
					$scope.hotelConfig.email_templates[i].selected = true;
				}
			}

		};

		$scope.invokeApi(ADHotelConfigurationSrv.editHotelConfiguration, postData, editHotelConfigurationSuccessCallback);
	};

	$scope.updateTemplateConfiguration = function() {
		var updateHotelConfigurationSuccessCallback = function() {
			$scope.$emit('hideLoader');
			$scope.currentClickedElement = -1;
 			$scope.isAddmode = false;
 			$scope.isEditmode = false;
		};
		var assignedEmailTemplates = [];

		angular.forEach($scope.hotelConfig.email_templates, function(templates, index) {
			if (templates.selected) {
				assignedEmailTemplates.push(templates.id);
			}
		});
		var assignedTheme = $scope.hotelConfig.theme;

		var postData = {
			"hotel_id": $scope.clickedHotel,
			"hotel_theme": assignedTheme,
			"templates": assignedEmailTemplates,
			"use_common_email_templates": $scope.hotelConfig.use_common_email_templates
		};


		$scope.invokeApi(ADHotelConfigurationSrv.updateHotelConfiguration, postData, updateHotelConfigurationSuccessCallback);
	};

	$scope.cancelClicked = function() {
		$scope.currentClickedElement = -1;
		$scope.isAddmode = false;
		$scope.isEditmode = false;
	};
	/*
	 * to get the templates associated with the selected theme
	 *
	 */
	$scope.displayThemeTemplates = function() {

		var data = {
			"email_template_theme_id": $scope.hotelConfig.theme
		};
		var displayThemeCallback = function(data) {
			$scope.$emit('hideLoader');
			$scope.hotelConfig.email_templates = data.email_templates;
		};

		$scope.invokeApi(ADHotelConfigurationSrv.getTemplateThemes, data, displayThemeCallback);
	};

}]);

