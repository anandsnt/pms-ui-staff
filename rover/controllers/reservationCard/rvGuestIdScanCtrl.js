sntRover.controller('rvGuestIdScanCtrl', ['$scope',
	'$rootScope',
	'$filter',
	'ngDialog',
	'RVCompanyCardSrv',
	function($scope, $rootScope, $filter, ngDialog, RVCompanyCardSrv) {

		$scope.callAPI(RVCompanyCardSrv.fetchCountryList, {
			params: {},
			successCallBack: function(response) {
				$scope.countyList = response;
			}
		});

		var dobDialog,
			expirationDateDialog;

		$scope.dateOfBirthdateOptions = {
			changeYear: true,
			changeMonth: true,
			maxDate: tzIndependentDate($rootScope.businessDate),
			yearRange: "-100:+0",
			onSelect: function(dateText, inst) {
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
			onSelect: function(dateText, inst) {
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
		$scope.frontImageChange = function(){
			console.log($scope.guestIdData.front_image_data);
		};
		$scope.backImageChange = function(){
			console.log($scope.guestIdData.back_image_data);
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
			if ($scope.guestIdData.twoSidedDoc) {
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