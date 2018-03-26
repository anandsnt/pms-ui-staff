admin.controller('ADStationaryTermsAndConditionsCtrl', ['$scope',
	'ADStationarySrv',
	function($scope, ADStationarySrv) {

		BaseCtrl.call(this, $scope);

		$scope.addNewTermsAndConditions = function() {
			$scope.new_tnc = {
				title: '',
				description: ''
			};
			$scope.displayNewTermsAndConditionsForm = true;
		};

		$scope.selectedTnCIndex = -1;

		// SELECT TERMS & CONDITIONS
		$scope.customTnCClicked = function(index) {
			$scope.selectedTnCIndex = ($scope.selectedTnCIndex === index) ? -1 : index;
		};
		$scope.cancelTnCSelection = function() {
			$scope.selectedTnCIndex = -1;
		};

		// EDIT TERMS & CONDITIONS
		$scope.deleteCustomTnC = function(index) {
			console.log(index);
		};
		$scope.saveCustomTnC = function(index) {
			console.log(index);
		};

		// NEW TERMS & CONDITIONS
		$scope.cancelNewTnC = function() {
			$scope.displayNewTermsAndConditionsForm = false;
		};
		$scope.saveNewTnC = function() {
			console.log($scope.new_tnc);
			$scope.cancelNewTnC();
		};

		// TERMS & CONDITIONS changed
		$scope.termsAndConditionsChanged = function (id, assigned_tc_id) {
			console.log(id);
			console.log(assigned_tc_id);
		};

	}
]);