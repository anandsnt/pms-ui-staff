(function() {
	var guestwebSurveyController = function($scope, $state, guestDetailsService, $rootScope) {


		var init = function() {
			$scope.isLoading = true;
			var params = {
				'reservation_id': $rootScope.reservationID
			};
			guestDetailsService.fetchSurveyDetails(params).then(function(response) {

				$scope.isLoading = false;
				var screenCMSDetails = {};
				screenCMSDetails.title = response.survey_title;
				screenCMSDetails.description = response.survey_question;
				$scope.screenDetails = screenCMSDetails;

				$scope.responseNumber = 1;
				$scope.responseArray = [];

				for (i = 1; i <= response.numeric_answer_max_limit; i++) {
					$scope.responseArray.push(i);
				};
			}, function() {
				$rootScope.netWorkError = true;
				$scope.isLoading = false;
			});
		}();

		$scope.goToNextPage = function() {
			$rootScope.surveyAttempted =  true;
			$state.go('preCheckinStatus');
		};

		$scope.postSurveyResponse = function() {
			$scope.isLoading = true;
			var params = {
				'survey_response': $scope.survey_response,
				'reservation_id': $rootScope.reservationID
			};
			guestDetailsService.submitSurvey(params).then(function(response) {
				$scope.isLoading = false;
				$scope.goToNextPage();
			}, function() {
				$rootScope.netWorkError = true;
				$scope.isLoading = false;
			});
		};

	};

	var dependencies = [
		'$scope', '$state', 'guestDetailsService', '$rootScope',
		guestwebSurveyController
	];

	sntGuestWeb.controller('guestwebSurveyController', dependencies);
})();