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
				case "father_name":
					$scope.guestCardFields.father_name.is_visible = !$scope.guestCardFields.father_name.is_visible;
					if (!$scope.guestCardFields.father_name.is_visible) {
						$scope.guestCardFields.father_name.is_mandatory_on_guest_card_creation = false;
					}					
					break;
				case "mother_name":
					$scope.guestCardFields.mother_name.is_visible = !$scope.guestCardFields.mother_name.is_visible;
					if (!$scope.guestCardFields.mother_name.is_visible) {
						$scope.guestCardFields.mother_name.is_mandatory_on_guest_card_creation = false;
					}
					break;
				case "birth_place":
					$scope.guestCardFields.birth_place.is_visible = !$scope.guestCardFields.birth_place.is_visible;
					if (!$scope.guestCardFields.birth_place.is_visible) {
						$scope.guestCardFields.birth_place.is_mandatory_on_guest_card_creation = false;
					}
					break;
				case "gender":
					$scope.guestCardFields.gender.is_visible = !$scope.guestCardFields.gender.is_visible;					
					if (!$scope.guestCardFields.gender.is_visible) {
						$scope.guestCardFields.gender.is_mandatory_on_guest_card_creation = false;
					}
					break;
				case "registration_number":
					$scope.guestCardFields.registration_number.is_visible = !$scope.guestCardFields.registration_number.is_visible;
					if (!$scope.guestCardFields.registration_number.is_visible) {
						$scope.guestCardFields.registration_number.is_mandatory_on_guest_card_creation = false;
					}
					break;
				case "personal_id_no":
					$scope.guestCardFields.personal_id_no.is_visible = !$scope.guestCardFields.personal_id_no.is_visible;
					if (!$scope.guestCardFields.personal_id_no.is_visible) {
						$scope.guestCardFields.personal_id_no.is_mandatory_on_guest_card_creation = false;
					}
					break;
				case "home_town":
					$scope.guestCardFields.home_town.is_visible = !$scope.guestCardFields.home_town.is_visible;
					if (!$scope.guestCardFields.home_town.is_visible) {
						$scope.guestCardFields.home_town.is_mandatory_on_guest_card_creation = false;
					}				
					break;
				case "place_of_residence":
					$scope.guestCardFields.place_of_residence.is_visible = !$scope.guestCardFields.place_of_residence.is_visible;					
					if (!$scope.guestCardFields.place_of_residence.is_visible) {
						$scope.guestCardFields.place_of_residence.is_mandatory_on_guest_card_creation = false;
					}
					break;
				case "vehicle_country_mark":
					$scope.guestCardFields.vehicle_country_mark.is_visible = !$scope.guestCardFields.vehicle_country_mark.is_visible;					
					if (!$scope.guestCardFields.vehicle_country_mark.is_visible) {
						$scope.guestCardFields.vehicle_country_mark.is_mandatory_on_guest_card_creation = false;
					}
					break;
				case "job_title":
					$scope.guestCardFields.job_title.is_visible = !$scope.guestCardFields.job_title.is_visible;					
					if (!$scope.guestCardFields.job_title.is_visible) {
						$scope.guestCardFields.job_title.is_mandatory_on_guest_card_creation = false;
					}
					break;
				case "date_of_birth":
					$scope.guestCardFields.date_of_birth.is_visible = !$scope.guestCardFields.date_of_birth.is_visible;					
					if (!$scope.guestCardFields.date_of_birth.is_visible) {
						$scope.guestCardFields.date_of_birth.is_mandatory_on_guest_card_creation = false;
					}
					break;
				case "nationality":
					$scope.guestCardFields.nationality.is_visible = !$scope.guestCardFields.nationality.is_visible;
					if (!$scope.guestCardFields.nationality.is_visible) {
						$scope.guestCardFields.nationality.is_mandatory_on_guest_card_creation = false;
					}
					break;
				case "entry_date":
                    $scope.guestCardFields.entry_date.is_visible = !$scope.guestCardFields.entry_date.is_visible;
                    if (!$scope.guestCardFields.entry_date.is_visible) {
						$scope.guestCardFields.entry_date.is_mandatory_on_guest_card_creation = false;
					}
					break;
				case "id_issue_date":
                    $scope.guestCardFields.id_issue_date.is_visible = !$scope.guestCardFields.id_issue_date.is_visible;
                    if (!$scope.guestCardFields.id_issue_date.is_visible) {
						$scope.guestCardFields.id_issue_date.is_mandatory_on_guest_card_creation = false;
					}
					break;



			}
	
	};
	/*
	 * Clicked mandatory 
	 * @param fieldName field name
	 */
	$scope.clickedMandatory = function(isFieldVisible, fieldName) {
		if (isFieldVisible)
		{
			switch (fieldName) {
				case "father_name":
					$scope.guestCardFields.father_name.is_mandatory_on_guest_card_creation = !$scope.guestCardFields.father_name.is_mandatory_on_guest_card_creation;
					break;
				case "mother_name":
					$scope.guestCardFields.mother_name.is_mandatory_on_guest_card_creation = !$scope.guestCardFields.mother_name.is_mandatory_on_guest_card_creation;
					break;
				case "birth_place":
					$scope.guestCardFields.birth_place.is_mandatory_on_guest_card_creation = !$scope.guestCardFields.birth_place.is_mandatory_on_guest_card_creation;
					break;
				case "gender":
					$scope.guestCardFields.gender.is_mandatory_on_guest_card_creation = !$scope.guestCardFields.gender.is_mandatory_on_guest_card_creation;					
					break;
				case "registration_number":
					$scope.guestCardFields.registration_number.is_mandatory_on_guest_card_creation = !$scope.guestCardFields.registration_number.is_mandatory_on_guest_card_creation;					
					break;
				case "personal_id_no":
					$scope.guestCardFields.personal_id_no.is_mandatory_on_guest_card_creation = !$scope.guestCardFields.personal_id_no.is_mandatory_on_guest_card_creation;					
					break;
				case "home_town":
					$scope.guestCardFields.home_town.is_mandatory_on_guest_card_creation = !$scope.guestCardFields.home_town.is_mandatory_on_guest_card_creation;					
					break;
				case "place_of_residence":
					$scope.guestCardFields.place_of_residence.is_mandatory_on_guest_card_creation = !$scope.guestCardFields.place_of_residence.is_mandatory_on_guest_card_creation;					
					break;
				case "vehicle_country_mark":
					$scope.guestCardFields.vehicle_country_mark.is_mandatory_on_guest_card_creation = !$scope.guestCardFields.vehicle_country_mark.is_mandatory_on_guest_card_creation;					
					break;
				case "job_title":
					$scope.guestCardFields.job_title.is_mandatory_on_guest_card_creation = !$scope.guestCardFields.job_title.is_mandatory_on_guest_card_creation;					
					break;
				case "date_of_birth":
					$scope.guestCardFields.date_of_birth.is_mandatory_on_guest_card_creation = !$scope.guestCardFields.date_of_birth.is_mandatory_on_guest_card_creation;					
					break;
				case "nationality":
					$scope.guestCardFields.nationality.is_mandatory_on_guest_card_creation = !$scope.guestCardFields.nationality.is_mandatory_on_guest_card_creation;
					break;
                case "entry_date":
                    $scope.guestCardFields.entry_date.is_mandatory_on_guest_card_creation = !$scope.guestCardFields.entry_date.is_mandatory_on_guest_card_creation;
                    break;
                case "id_issue_date":
                    $scope.guestCardFields.id_issue_date.is_mandatory_on_guest_card_creation = !$scope.guestCardFields.id_issue_date.is_mandatory_on_guest_card_creation;
                    break;
			}
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