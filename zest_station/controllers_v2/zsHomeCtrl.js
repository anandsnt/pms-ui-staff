sntZestStation.controller('zsHomeCtrl', [
	'$scope',
	'$rootScope',
	'$state',
	'zsEventConstants',
	'$translate',
	function($scope, $rootScope, $state, zsEventConstants,$translate) {

		/**
		 * when we clicked on pickup key from home screen
		 */
		$scope.clickedOnPickUpKey = function() {
			if($scope.zestStationData.pickup_qr_scan){
				$state.go('zest_station.qrPickupKey');
			}
			else{
				$state.go('zest_station.checkOutReservationSearch',{'mode':'PICKUP_KEY'});
			}
		};

		/**
		 * when we clicked on checkin from home screen
		 */
		$scope.clickedOnCheckinButton = function() {
			$state.go('zest_station.checkInReservationSearch');
		};
		$scope.openExternalWebPage = function(){
			$scope.showExternalWebPage =true;
		};

		$scope.closeExternalWebPage = function(){
			$scope.showExternalWebPage =false;
		};

		$scope.language = {};

		$scope.translateTo = function(lang_code,language){
			$translate.use(lang_code);
			$scope.selectedLanguage = language;
		};


		/**
		 * when we clicked on checkout from home screen
		 */
		$scope.clickedOnCheckoutButton = function() {
			if (!$scope.zestStationData.checkout_keycard_lookup) {
				$state.go('zest_station.checkOutReservationSearch');
			} else {
				$state.go('zest_station.checkoutSearchOptions');
			};
		};
		var initiateLanguagePopUpSetting = function(){
			$scope.showLanguagePopup =false;
			//This value will be updated from child controller ie, zsLanguageHandlerCtrl during init
			$scope.selectedLanguage= {};
		};
		$scope.languageSelect = function(){
			$scope.showLanguagePopup = !$scope.showLanguagePopup;
		};

		/**
		 * [initializeMe description]
		 */
		var initializeMe = function() {
			//hide back button
			$scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);

			//hide close button
			$scope.$emit(zsEventConstants.HIDE_CLOSE_BUTTON);
			//eject if any key card is inserted
			$scope.$emit('EJECT_KEYCARD');
			//set this to false always on entering home screen
			$scope.zestStationData.keyCardInserted = false;
			initiateLanguagePopUpSetting();
            if($scope.zestStationData.workstationStatus === 'out-of-order'){
            	var params = {};
            	params.reason = $scope.zestStationData.wsFailedReason;
				params.status = 'out-of-order';
            	$scope.$emit(zsEventConstants.UPDATE_LOCAL_STORAGE_FOR_WS,params);
				$state.go('zest_station.outOfService');
			}
			else{
				//do nothing
			}
		}();


	}
]);