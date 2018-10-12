sntRover.controller('rvGuestIdScanCtrl', ['$scope',
	'$rootScope',
	'$filter',
	'ngDialog',
	'RVGuestCardsSrv',
	'dateFilter',
	function($scope, $rootScope, $filter, ngDialog, RVGuestCardsSrv, dateFilter) {

		BaseCtrl.call(this, $scope);

		var dateInHotelsFormat = function(date) {
			return JSON.parse(JSON.stringify(dateFilter(new Date(date), $rootScope.dateFormat)));
		};

		$scope.guestIdData.dob_for_display = $scope.guestIdData.date_of_birth ? dateInHotelsFormat($scope.guestIdData.date_of_birth) : '';
		$scope.guestIdData.expiry_date_for_display = $scope.guestIdData.expiration_date ? dateInHotelsFormat($scope.guestIdData.expiration_date) : '';

		var isIDDetailsChanged = false;

		if ($scope.guestIdData.document_type && $scope.guestIdData.document_type.length > 0) {
			$scope.guestIdData.document_type = $scope.guestIdData.document_type.toUpperCase();
		}

		$scope.callAPI(RVGuestCardsSrv.fetchNationsList, {
			params: {},
			successCallBack: function(response) {
				$scope.countyList = response;
			}
		});

		$scope.closeGuestIdModal = function() {
			if (isIDDetailsChanged) {
				$scope.$emit('ON_GUEST_ID_POPUP_CLOSE');
			}
			ngDialog.close();
		};

		var dobDialog,
			expirationDateDialog,
			errorPopup;

		$scope.dateOfBirthdateOptions = {
			changeYear: true,
			changeMonth: true,
			maxDate: tzIndependentDate($rootScope.businessDate),
			yearRange: "-100:+0",
			onSelect: function() {
				$scope.guestIdData.dob_for_display =  dateInHotelsFormat($scope.guestIdData.date_of_birth);
				dobDialog.close();
			}
		};

		$scope.openDobCalendar = function() {
			dobDialog = ngDialog.open({
				template: '/assets/partials/guestId/rvGuestIDDobCalendar.html',
				className: 'single-date-picker',
				scope: $scope
			});
		};

		$scope.idExpiryDateOptions = {
			changeYear: true,
			changeMonth: true,
			yearRange: "-10:+50",
			onSelect: function() {
				$scope.guestIdData.expiry_date_for_display =  dateInHotelsFormat($scope.guestIdData.expiration_date);
				expirationDateDialog.close();
			}
		};

		$scope.openExpiryCalendar = function() {
			expirationDateDialog = ngDialog.open({
				template: '/assets/partials/guestId/rvGuestIDExpiryCalendar.html',
				className: 'single-date-picker',
				scope: $scope
			});
		};

		$scope.uploadFrontImage = function() {
			$('#front-image-upload').click();
		};

		$scope.uploadBackImage = function() {
			$('#back-image-upload').click();
		};

		var markIDDetailsHasChanged = function() {
			isIDDetailsChanged = true;
		};

		var generalFailureCallBack = function() {
			errorPopup = ngDialog.open({
				template: '/assets/partials/guestId/rvGuestIDDetailsErrorPopup.html',
				className: 'single-date-picker',
				scope: $scope
			});
		};

		$scope.closeErrorPopup = function() {
			errorPopup.close();
		};

		var formatDateForApi = function(date) {
			// API expects date in format dd-mm-yyyyy
			var dateComponents = date.split("-");

			return dateComponents[1] + '-' + dateComponents[0] + '-' + dateComponents[2]
		};

		$scope.saveGuestIdDetails = function(action, imageType) {

			var apiParams = angular.copy($scope.guestIdData);

			apiParams.reservation_id = $scope.reservationData.reservation_card.reservation_id;
			apiParams.document_type = $scope.guestIdData.document_type ? $scope.guestIdData.document_type : 'ID_CARD';

			apiParams.date_of_birth = apiParams.date_of_birth ? formatDateForApi(apiParams.date_of_birth) : '';
			apiParams.expiration_date = apiParams.expiration_date ? formatDateForApi(apiParams.expiration_date) : '';
			
			delete apiParams.expiry_date_for_display;
			delete apiParams.dob_for_display;

			if (action === 'DELETE') {
				apiParams.front_image_data = (imageType === 'front-image') ? '' : apiParams.front_image_data;
				apiParams.back_image_data = (imageType === 'back-image') ? '' : apiParams.back_image_data;
			};

			var saveSuccessCallBack;

			if (action === 'DELETE') {
				saveSuccessCallBack = function() {
					$scope.guestIdData.front_image_data = (imageType === 'front-image') ? '' : $scope.guestIdData.front_image_data;
					$scope.guestIdData.back_image_data = (imageType === 'back-image') ? '' : $scope.guestIdData.back_image_data;
					markIDDetailsHasChanged();
				}
			} else {
				saveSuccessCallBack = function() {
					markIDDetailsHasChanged();

					var idType = $scope.guestIdData.document_type && $scope.guestIdData.document_type === 'ID_CARD' ? 1 : 3;
					var nationalityId = $scope.guestIdData.nationality_id ? parseInt($scope.guestIdData.nationality_id) : '';

					if ($scope.guestIdData.is_primary_guest) {
						var dataToUpdate = {
							id_type: idType,
							nationality_id: nationalityId,
							id_number: $scope.guestIdData.document_number
						};

						$scope.$emit('PRIMARY_GUEST_ID_CHANGED', dataToUpdate);
					}

					$scope.closeGuestIdModal();
				}
			}

			$scope.callAPI(RVGuestCardsSrv.saveGuestIdDetails, {
				params: apiParams,
				successCallBack: saveSuccessCallBack,
				failureCallBack: generalFailureCallBack
			});
		};
	}
]);