sntRover.controller('companyCardArAccountCtrl', ['$scope', 'RVCompanyCardSrv', '$timeout', 'rvPermissionSrv',
	function($scope, RVCompanyCardSrv, $timeout, rvPermissionSrv) {

		BaseCtrl.call(this, $scope);

		$scope.setScroller('cardAccountsScroller');

		var refreshScroller = function() {
			$timeout(function() {
				if ($scope.myScroll && $scope.myScroll['cardAccountsScroller']) {
					$scope.myScroll['cardAccountsScroller'].refresh();
				}
				$scope.refreshScroller('cardAccountsScroller');
			}, 500);
		};

		$scope.$on('refreshAccountsScroll', refreshScroller);

		var init = function() {
			$scope.ARData = {};
			$scope.ARData.note = "";
		};
		init();
		var presentArDetails = {};

		$scope.$on('setgenerateNewAutoAr', function(e, bool) {
			$scope.$parent.generateNewAutoAr = bool;
			if( !$scope.arAccountDetails.is_auto_assign_ar_numbers && bool ) {
				updateArAccount(true);
			}
		});

		var updateArAccount = function( initialUpdate ) {
			
			var successCallbackOfsaveARDetails = function(data) {
				$scope.$emit("hideLoader");
				$scope.errorMessage = "";
				if ($scope.arAccountDetails.is_auto_assign_ar_numbers && !$scope.arAccountDetails.ar_number) {
					$scope.arAccountDetails.ar_number = data.ar_number;
					$scope.$parent.generateNewAutoAr = false;
				};
				$scope.$emit('ARNumberChanged', {
					'newArNumber': $scope.arAccountDetails.ar_number
				});
			};

			var successCallbackOfsaveARDetailsWithoutARNumber = function(data) {
				$scope.$emit("hideLoader");
				$scope.errorMessage = "";
			};

			var failureCallback = function(errorMessage){
				$scope.$emit("hideLoader");
				$scope.errorMessage = errorMessage;
				$scope.$emit('ERRORONARTAB');
			};

			var dataToSend = $scope.arAccountDetails;
			if(!!$scope.contactInformation.id) {
				dataToSend.id = $scope.contactInformation.id;
				presentArDetails.id = $scope.contactInformation.id;
			}
			var presentArDetailsAfterEdit = JSON.parse(JSON.stringify($scope.arAccountDetails));
			var dataNotUpdated = false;

			//check if data was edited
			if (!angular.equals(presentArDetailsAfterEdit, presentArDetails)) {
				dataNotUpdated = true;
				presentArDetails = presentArDetailsAfterEdit;
			}
			if (($scope.generateNewAutoAr && $scope.arAccountDetails.is_auto_assign_ar_numbers) || (dataNotUpdated && $scope.arAccountDetails.ar_number)) {
				$scope.invokeApi(RVCompanyCardSrv.saveARDetails, dataToSend, successCallbackOfsaveARDetails, failureCallback );
			}
			else if( (!$scope.arAccountDetails.is_auto_assign_ar_numbers && dataNotUpdated ) || initialUpdate ){
				// CICO-24472 => If is_auto_assign_ar_numbers property is OFF and some data updated on AR TAB , 
				// we call save API without AR Number.
				$scope.invokeApi(RVCompanyCardSrv.saveARDetails, dataToSend, successCallbackOfsaveARDetailsWithoutARNumber, failureCallback );
			}
		};

		$scope.$on("arAccountTabActive", function() {
			setTimeout(function() {
				refreshScroller();
			}, 500);
			// if automatic mode is on,call save action to generate a random number
			if (!!$scope.arAccountDetails && !!$scope.arAccountDetails.is_auto_assign_ar_numbers && !$scope.arAccountDetails.ar_number) {
				updateArAccount();
			}
			
		});

		// to set data to be compared from time to time
		//to check if data has been edited or not
		$scope.$on('ARDetailsRecieved', function() {
			presentArDetails = JSON.parse(JSON.stringify($scope.arAccountDetails));
		});

		$scope.checkboxModelChanged = function() {
			refreshScroller();
		};

		$scope.saveNote = function() {

			var successCallbackOfsaveARNote = function(data) {
				$scope.$emit("hideLoader");
				$scope.arAccountNotes.ar_notes.push(data);
				$scope.ARData.note = "";
				refreshScroller();
			};

			var dataToSend = {
				"id": $scope.contactInformation.id,
				"note": $scope.ARData.note,
				"ar_number": $scope.arAccountDetails.ar_number
			};
			$scope.invokeApi(RVCompanyCardSrv.saveARNote, dataToSend, successCallbackOfsaveARNote);
		};

		$scope.deletePost = function(note_id, index) {

			var deleteARNoteSuccess = function() {
				$scope.$emit("hideLoader");
				$scope.arAccountNotes.ar_notes.splice(index, 1);
				refreshScroller();
			};

			var dataToSend = {
				"id": $scope.contactInformation.id,
				"note_id": note_id
			};
			$scope.invokeApi(RVCompanyCardSrv.deleteARNote, dataToSend, deleteARNoteSuccess);

		};

		/**
		 * recieving function for save AR accounts with data
		 */
		$scope.$on('saveArAccount', function(event) {
			event.preventDefault();
			updateArAccount();
		});

		$scope.$on('ArAccountDeleted', function(event) {
			var bool = $scope.arAccountDetails.is_auto_assign_ar_numbers;
			$scope.arAccountDetails = {};
			$scope.arAccountDetails.is_use_main_contact = true;
			$scope.arAccountDetails.is_use_main_address = true;
			$scope.arAccountDetails.is_auto_assign_ar_numbers = bool;
			$scope.arAccountDetails.ar_number = "";
			$scope.arAccountNotes.ar_notes = [];
		});


		$scope.clearErrorMessage = function() {
			$scope.errorMessage = "";
		};

		/**
		* function to check whether the user has permission
		* to edit the direct bill restriction
		* @return {Boolean}
		*/
		$scope.hasPermissionToEditDirectBillRestriction = function() {
			return rvPermissionSrv.getPermissionValue ('EDIT_DIRECT_BILL_RESTRICTION');
		};

	}
]);