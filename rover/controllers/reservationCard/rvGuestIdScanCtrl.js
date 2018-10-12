sntRover.controller('rvGuestIdScanCtrl', ['$scope',
	'$rootScope',
	'$filter',
	'ngDialog',
	'RVGuestCardsSrv',
	function($scope, $rootScope, $filter, ngDialog, RVGuestCardsSrv) {

		BaseCtrl.call(this, $scope);
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

		$scope.uploadFrontImage = function (){
			$('#front-image-upload').click();
		};

		$scope.uploadBackImage = function (){
			$('#back-image-upload').click();
		};

		var markIDDetailsHasChanged = function () {
			isIDDetailsChanged = true;
		};

		var generalFailureCallBack = function () {
			errorPopup = ngDialog.open({
				template: '/assets/partials/guestId/rvGuestIDDetailsErrorPopup.html',
				className: 'single-date-picker',
				scope: $scope
			});
		};

		$scope.closeErrorPopup = function() {
			errorPopup.close();
		};

		$scope.saveGuestIdDetails = function (action, imageType) {

			var apiParams = {
				'front_image_data': $scope.guestIdData.front_image_data,
				'back_image_data':$scope.guestIdData.back_image_data,
				'signature':$scope.guestIdData.signature,
				'guest_id': $scope.guestIdData.guest_id,
				'last_name': $scope.guestIdData.last_name,
				'first_name': $scope.guestIdData.first_name,
				'date_of_birth': $scope.guestIdData.date_of_birth,
				'nationality_id': $scope.guestIdData.nationality_id,
				'document_number': $scope.guestIdData.document_number,
				'expiration_date': $scope.guestIdData.expiration_date,
				'reservation_id': $scope.reservationData.reservation_card.reservation_id,
				'document_type': $scope.guestIdData.document_type ? $scope.guestIdData.document_type : 'ID_CARD'
			};

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