(function() {
	var guestwebSurveyController = function($scope, $state, guestDetailsService, $rootScope) {


		var init = function() {

			var params = {
				'reservation_id': $rootScope.reservationID
			};

			var fetchSurveyDetailsSuccessCallback = function(response) {
				var screenCMSDetails = {};
				screenCMSDetails.title = response.survey_question_title;
				screenCMSDetails.description = response.survey_question;
				$scope.screenDetails = screenCMSDetails;


				$scope.surveyDetails = response;

				$scope.showSurveyImage = response.survey_question_image.length > 0 ? true : false;

				$scope.responseNumber = 1;
				$scope.responseArray = [];

				for (i = 1; i <= response.numeric_answer_max_limit; i++) {
					$scope.responseArray.push(i);
				};
				
				var questionType = _.find(response.survey_question_types, function(survey_question_type) {
				    return survey_question_type.id === response.survey_question_type_id;
				});

				$scope.surveyDetails.survey_question_type = !!questionType.description ? questionType.description : "Numeric";

				//set initial values
				if ($scope.surveyDetails.survey_question_type === 'Boolean') {
					$scope.survey_response = 'Yes';
				} else if ($scope.surveyDetails.survey_question_type === 'Numeric') {
					$scope.survey_response = 1;
				};
			};
			//call API
			$scope.isLoading = true;
			guestDetailsService.fetchSurveyDetails(params).then(function(response) {

				$scope.isLoading = false;
				fetchSurveyDetailsSuccessCallback(response);

			}, function() {
				$rootScope.netWorkError = true;
				$scope.isLoading = false;
			});
		}();

		$scope.goToNextPage = function() {
			$rootScope.skipBalanceconductSurvey = true;
			$rootScope.netWorkError = false; //unset error flag
			$state.go('preCheckinStatus');
		};

		$scope.checkboxClicked = function(params) {
			$scope.survey_response = !$scope.survey_response;
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