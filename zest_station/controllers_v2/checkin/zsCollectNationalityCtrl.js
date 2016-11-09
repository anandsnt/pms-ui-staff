sntZestStation.controller('zsCollectNationalityCtrl', [
	'$scope',
	'$state',
	'zsEventConstants',
	'$stateParams',
	'$sce', 'countryList', 'sortedCountryList', 'zsCheckinSrv', '$timeout',
	function($scope, $state, zsEventConstants, $stateParams, $sce, countryList, sortedCountryList, zsCheckinSrv, $timeout) {

		/** ********************************************************************************************
		 **		Please note that, not all the stateparams passed to this state will not be used in this state, 
		 **      however we will have to pass this so as to pass again to future states which will use these.
		 **
		 **      Expected state params -----> guest_id    
		 **      Exit function -> successCallBack                              
		 **                                                                       
		 ***********************************************************************************************/

		BaseCtrl.call(this, $scope);
		sntZestStation.filter('unsafe', function($sce) {
			return function(val) {
				return $sce.trustAsHtml(val);
			};
		});
		$scope.countryListFocused = false;
		$scope.init = function() {
			$scope.countryList = [];
			$scope.sortedCountries = sortedCountryList.sorted;
			$scope.unSortedCountries = sortedCountryList.unsorted;
			// if not using the sorted list, get country names with the country native languages to popuplate the list as well
			if (!$scope.zestStationData.kiosk_enforce_country_sort) {
			  countryList.forEach(function(countryObj) {
			  // objects inside the array of countries
			      countryObj.names.forEach(function(nativeCountryName) {
			        $scope.countryList.push({
			          id: countryObj.id,
			          value: nativeCountryName
			        });
			      });
			    });
				
			} else {
				$scope.countryList = countryList;
			}

			$scope.selectedCountry = {
				"id": ""
			};

			$scope.$emit('hideLoader');

			// touch-friendly, +searchable list
			// initializes the jquery plugin for search-filtering in the UI
			if ($scope.zestStationData.theme === 'yotel') {
				// for yotel only right now, TODO: need to optimize on IPAD for zoku and others
				$timeout(function() {
					// initializes autocomplete, changes the <select> into an <input> field with autocomplete features
					$('select').selectToAutocomplete();

					$timeout(function() {
						$scope.showOnScreenKeyboard('country-selector');
						$scope.focusInputField('country-selector');
					}, 0);
				}, 0);
			}

		};
		$scope.showingAutoCompleteArea = false;
		$scope.showingAutoComplete = function() {
			if ($scope.zestStationData.theme !== 'yotel') {
				$scope.showingAutoCompleteArea = false;
				return false;
			}
			var val = $('input').val().length;
			// autocomplete plugin overwrites the <select>tags and appends an <input> with autocomplete trigger
			// need to update the css based on the new dom elements, ie. the border in the input needs to be updated
			//  when there are autocomplete elements on-screen

			$scope.showingAutoCompleteArea = (val > 0 && !$scope.selectedCountry.id);
			if (val < 1) {
				$scope.selectedCountry.id = "";	
			}
			try {
				$scope.$digest();	
			} catch(err) {
				console.warn(err);
			}
		};

		$scope.clearNationality = function() {
			$scope.selectedCountry.id = "";
			$('input').val('');
			$scope.showingAutoComplete();
		};
		/**
		 * when the back button clicked
		 * @param  {[type]} event
		 * @return {[type]}
		 */
		$scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {
			var reservations = zsCheckinSrv.getCheckInReservations();

			$state.go('zest_station.checkInReservationSearch');
			// check if this page was invoked through pickupkey flow
			if (!!$stateParams.pickup_key_mode) {
				$state.go('zest_station.checkOutReservationSearch', {
					'mode': 'PICKUP_KEY'
				});
			} else if (reservations.length > 0) {
				$state.go('zest_station.selectReservationForCheckIn');
			} else {
				$state.go('zest_station.checkInReservationSearch');
			}
		});

		/**
		 * [initializeMe description]
		 * @return {[type]} [description]
		 */
		var initializeMe = function() {
			// hide back button
			$scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);
			// show close button
			$scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);

			$scope.init();
		}();

		$scope.saveNationality = function() {
			var successCallBack = function() {
				$state.go('zest_station.checkInReservationDetails', $stateParams);
			};
			var options = {
				params: {
					guest_id: $stateParams.guestId,
					nationality_id: $scope.selectedCountry.id
				},
				successCallBack: successCallBack
			};

			$scope.callAPI(zsCheckinSrv.saveNationality, options);
		};
	}
]);