	sntZestStation.controller('zsSntIDScanCtrl', [
		'$scope',
		'$state',
		'zsEventConstants',
		'$stateParams',
		'zsGeneralSrv',
		'zsCheckinSrv',
		'zsUtilitySrv',
		'$controller',
		'$filter',
		function($scope, $state, zsEventConstants, $stateParams, zsGeneralSrv, zsCheckinSrv, zsUtilitySrv, $controller, $filter) {

			$controller('sntIDCollectionBaseCtrl', {
				$scope: $scope
			});

			var setPageNumberDetails = function() {
				var itemsPerPage = 3;

				$scope.pageData = zsGeneralSrv.proceesPaginationDetails($scope.selectedReservation.guest_details, itemsPerPage, $scope.pageData.pageNumber);
			};

			$scope.paginationAction = function(isNextPage) {
				if ((isNextPage && $scope.pageData.disableNextButton) || (!isNextPage && $scope.pageData.disablePreviousButton)) {
					return;
				}
				$scope.pageData.pageNumber = isNextPage ? ++$scope.pageData.pageNumber : --$scope.pageData.pageNumber;
				setPageNumberDetails();
			};

			var initializeMe = (function() {
				$scope.pageData = zsGeneralSrv.retrievePaginationStartingData();
				$scope.selectedReservation = zsCheckinSrv.getSelectedCheckInReservation();
				angular.forEach($scope.selectedReservation.guest_details, function(guestDetail){
					guestDetail.idScanStatus = $filter('translate')('GID_SCAN_NOT_STARTED');
				});
				setPageNumberDetails();
				// show back button
				$scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
				// show close button
				$scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);

				$scope.results = []; // scan results is the array of guests + status of passport (scanned/verified, etc)
				$scope.allPassportsScanned = false;
				$scope.allPassportReviewed = false;

				$scope.setScreenIcon('checkin'); // yotel only
				$scope.mode = 'SCAN_RESULTS';
				$scope.fromPickupKeyPassportScan = $stateParams.from_pickup_key === 'true';
				$scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, onBackButtonClicked);

				//fetchGuestDetails();

			}());
		}
	]);