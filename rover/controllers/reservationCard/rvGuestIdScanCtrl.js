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

		var resetLeftPanel = function () {
			$scope.guestIdData.date_of_birth = "";
			$scope.guestIdData.nationality_id = "";
			$scope.guestIdData.document_number = "";
			$scope.guestIdData.expiration_date = "";
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

		$scope.ImageChange = function(imageType) {
			var apiParams = {
				'is_front_image': imageType === 'front-image',
				'image': imageType === 'front-image' ? $scope.guestIdData.front_image_data : $scope.guestIdData.back_image_data,
				'guest_id': $scope.guestIdData.guest_id,
				'reservation_id': $scope.reservationData.reservation_card.reservation_id,
				'document_type': $scope.guestIdData.document_type ? $scope.guestIdData.document_type : 'ID_CARD'
			};
			var ImageChangesuccessCallBack = function() {
				markIDDetailsHasChanged();
				if (imageType === 'front-image') {
					resetLeftPanel();
					$scope.saveGuestIdDetails();
				}
			};

			$scope.callAPI(RVGuestCardsSrv.uploadGuestId, {
				params: apiParams,
				successCallBack: ImageChangesuccessCallBack,
				failureCallBack: function() {
					generalFailureCallBack();
					// delete the image
					if (imageType === 'front-image') {
						$scope.guestIdData.front_image_data = '';
					} else {
						$scope.guestIdData.back_image_data = '';
					}
				}
			});
		};

		$scope.deleteImage = function(imageType) {
			var apiParams = {
				'is_front_image': imageType === 'front-image',
				'guest_id': $scope.guestIdData.guest_id,
				'reservation_id': $scope.reservationData.reservation_card.reservation_id
			};
			var deleteSuccessCallback = function() {
				if (imageType === 'front-image') {
					$scope.guestIdData.front_image_data = "";
					resetLeftPanel();
				} else {
					$scope.guestIdData.back_image_data = "";
				}
				markIDDetailsHasChanged();
			};
				
			$scope.callAPI(RVGuestCardsSrv.deleteGuestId, {
				params: apiParams,
				successCallBack: deleteSuccessCallback,
				failureCallBack: generalFailureCallBack
			});
		};

		$scope.saveGuestIdDetails = function () {
			var apiParams = {
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

			$scope.callAPI(RVGuestCardsSrv.saveGuestIdDetails, {
				params: apiParams,
				successCallBack: markIDDetailsHasChanged,
				failureCallBack: generalFailureCallBack
			});
		};
	}
]);