admin.controller('ADGuestCardFieldsCtrl', ['$scope', '$state', 'ADGuestCardSrv',
function($scope, $state, ADGuestCardSrv) {
	BaseCtrl.call(this, $scope);


	/*
	 * Save fields
	 */
	$scope.saveGuestCardFields = function() {
		var options = {
			params: $scope.guestCardFields			
		};

		$scope.callAPI(ADGuestCardSrv.saveGuestCardFields, options);
	};

	/*
	 * Clicked visible status
	 * @param fieldName field name
	 */
	$scope.clickedStatus = function(fieldName) {
	
			switch (fieldName) {
				case "is_father_name_visible":
					$scope.guestCardFields.is_father_name_visible = !$scope.guestCardFields.is_father_name_visible;
					break;
				case "is_mother_name_visible":
					$scope.guestCardFields.is_mother_name_visible = !$scope.guestCardFields.is_mother_name_visible;
					break;
				case "is_birth_place_visible":
					$scope.guestCardFields.is_birth_place_visible = !$scope.guestCardFields.is_birth_place_visible;
					break;
				case "is_gender_visible":
					$scope.guestCardFields.is_gender_visible = !$scope.guestCardFields.is_gender_visible;					
					break;
				case "is_registration_number_visible":
					$scope.guestCardFields.is_registration_number_visible = !$scope.guestCardFields.is_registration_number_visible;					
					break;
				case "is_personal_id_no_visible":
					$scope.guestCardFields.is_personal_id_no_visible = !$scope.guestCardFields.is_personal_id_no_visible;					
					break;
				case "is_home_town_visible":
					$scope.guestCardFields.is_home_town_visible = !$scope.guestCardFields.is_home_town_visible;					
					break;
				case "is_place_of_residence_visible":
					$scope.guestCardFields.is_place_of_residence_visible = !$scope.guestCardFields.is_place_of_residence_visible;					
					break;
				case "is_vehicle_country_mark_visible":
					$scope.guestCardFields.is_vehicle_country_mark_visible = !$scope.guestCardFields.is_vehicle_country_mark_visible;					
					break;

			}
	
	};
	
	/*
	 * To fetch fields
	 */
	$scope.loadGuestCardFields =  function() {

		var successCallBack = function(data) {
			$scope.guestCardFields = data;
		},
		options = {
			onSuccess: successCallBack
		};

		$scope.callAPI(ADGuestCardSrv.loadGuestCardFields, options);
	};
	
	$scope.loadGuestCardFields();
}]);
