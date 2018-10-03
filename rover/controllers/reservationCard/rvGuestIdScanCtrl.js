sntRover.controller('rvGuestIdScanCtrl', ['$scope',
	'$rootScope',
	'$filter',
	'ngDialog',
	'RVGuestCardsSrv',
	function($scope, $rootScope, $filter, ngDialog, RVGuestCardsSrv) {

		BaseCtrl.call(this, $scope);
		var isIDChanged = false;

		$scope.callAPI(RVGuestCardsSrv.fetchNationsList, {
			params: {},
			successCallBack: function(response) {
				$scope.countyList = response;
			}
		});

		$scope.closeGuestIdModal = function() {
			if (isIDChanged) {
				$scope.$emit('ON_GUEST_ID_POPUP_CLOSE');
			}
			ngDialog.close();
		};

		var dobDialog,
			expirationDateDialog;

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
			isIDChanged = true;
		};

		$scope.ImageChange = function(imageType) {
			var apiParams = {
				'is_manual_upload': true,
				'is_front_image': imageType === 'front-image',
				'image': imageType === 'front-image' ? $scope.guestIdData.front_image_data : $scope.guestIdData.back_image_data,
				'guest_id': $scope.guestIdData.guest_id
			};

			$scope.callAPI(RVGuestCardsSrv.uploadGuestId, {
				params: apiParams,
				successCallBack: markIDDetailsHasChanged
			});
		};

		$scope.deleteImage = function(imageType) {
			var apiParams = {
				'is_front_image': imageType === 'front-image',
				'guest_id': $scope.guestIdData.guest_id
			};
			var deleteSuccessCallback = function() {
				if (imageType === 'front-image') {
					$scope.guestIdData.front_image_data = "";
				} else {
					$scope.guestIdData.back_image_data = "";
				}
			};
				
			$scope.callAPI(RVGuestCardsSrv.deleteGuestId, {
				params: apiParams,
				successCallBack: deleteSuccessCallback
			});
		};

		$scope.saveGuestIdDetails = function () {
			var apiParams = {
				'last_name': $scope.guestIdData.last_name,
				'first_name': $scope.guestIdData.first_name,
				'dob': $scope.guestIdData.date_of_birth,
				'nationality_id': $scope.guestIdData.nationality_id,
				'document_number': $scope.guestIdData.document_number,
				'expiration_date': $scope.guestIdData.expiration_date
			};

			$scope.callAPI(RVGuestCardsSrv.saveGuestIdDetails, {
				params: apiParams,
				successCallBack: markIDDetailsHasChanged
			});
		};

		var buildGuestInfo = function() {
			var firstName = _.isEmpty($scope.guestIdData.first_name) ? '' : $scope.guestIdData.first_name;
			var lastName = _.isEmpty($scope.guestIdData.last_name) ? '' : $scope.guestIdData.last_name;
			var docExpiry = _.isEmpty($scope.guestIdData.expiration_date) ? '' : $scope.guestIdData.expiration_date;
			var guestInfo = $filter('translate')('GUEST_FIRST_NAME') + ": " + firstName + "\r\n" +
				$filter('translate')('GUEST_LAST_NAME') + ": " + lastName + "\r\n" +
				$filter('translate')('DOB') + ": " + $scope.guestIdData.date_of_birth + "\r\n" +
				$filter('translate')('NATIONALITY') + ": " + $scope.guestIdData.nationality + "\r\n" +
				$filter('translate')('ID_NUMBER') + ": " + $scope.guestIdData.document_number + "\r\n" +
				$filter('translate')('ID_EXPIRY') + ": " + docExpiry;

			return guestInfo;
		};

		$scope.dowloadDocumnetDetails = function() {
			var zip = new JSZip();
			var fileNamePrefix;

			if (_.isEmpty($scope.guestIdData.last_name)) {
				fileNamePrefix = $scope.guestIdData.first_name;
			} else if (_.isEmpty($scope.guestIdData.first_name)) {
				fileNamePrefix = $scope.guestIdData.last_name;
			} else if (_.isEmpty($scope.guestIdData.first_name) && _.isEmpty($scope.guestIdData.last_name)) {
				fileNamePrefix = 'document';
			} else {
				fileNamePrefix = $scope.guestIdData.first_name + '-' + $scope.guestIdData.last_name;
			}
			// Add the guest details to a txt file
			zip.file(fileNamePrefix + "-info.txt", buildGuestInfo());
			// Add a file to the directory, in this case an image with data URI as contents
			zip.file(fileNamePrefix + "-ID.png", $scope.guestIdData.front_image_data.split(',')[1], {
				base64: true
			});
			// download backside if present
			if ($scope.guestIdData.back_image_data && $scope.guestIdData.back_image_data.length > 0) {
				zip.file(fileNamePrefix + "-ID-back-side.png", $scope.guestIdData.back_image_data.split(',')[1], {
					base64: true
				});
			}
			// Download signature
			zip.file(fileNamePrefix + "-signature.png", $scope.guestIdData.signature.split(',')[1], {
				base64: true
			});

			zip.generateAsync({
					type: "blob"
				})
				.then(function(blob) {
					saveAs(blob, fileNamePrefix + ".zip");
				});

		};

	}
]);