sntZestStation.controller('zsCollectNationalityCtrl', [
    '$scope',
    '$state',
    'zsEventConstants',
    '$stateParams',
    '$sce', 'countryList', 'sortedCountryList', 'zsCheckinSrv', '$timeout',
    function($scope, $state, zsEventConstants, $stateParams, $sce, countryList, sortedCountryList, zsCheckinSrv, $timeout) {

        /** ********************************************************************************************
         **     Please note that, not all the stateparams passed to this state will not be used in this state, 
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
        
        var refreshScroller = function() {
            $timeout(function() {
                $scope.refreshScroller('country-list');
            }, 500);
        };

        $scope.countryListFocused = false;
        $scope.init = function() {
            $scope.countryList = [];
            $scope.sortedCountries = sortedCountryList.sorted;
            $scope.unSortedCountries = sortedCountryList.unsorted;
            // if not using the sorted list, get country names with the country native languages to popuplate the list as well
            if (!$scope.zestStationData.kiosk_enforce_country_sort) {
                countryList.forEach(function(countryObj) {
                    $scope.countryList.push({
                        id: countryObj.id,
                        name: countryObj.value
                    });
                });

            } else {
                $scope.countryList = countryList;
            }

            $scope.selectedCountry = {
                'id': '',
                'searchInput': ''
            };

            $scope.$emit('hideLoader');
        };

        $scope.clearNationality = function() {
            $scope.selectedCountry.id = '';
            $scope.selectedCountry.searchInput = '';
            $scope.hideNationsList = false;
            refreshScroller();
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
            // 

            if ($stateParams.pickup_key_mode) {
                $state.go('zest_station.checkOutReservationSearch', {
                    'mode': 'PICKUP_KEY'
                });

            } else if (reservations.length > 0) {
                $state.go('zest_station.selectReservationForCheckIn');

            } else {
                $state.go('zest_station.checkInReservationSearch');
            }

        });

        $scope.countrySelected = function(country) {
            $scope.selectedCountry.id = country.id;
            $scope.selectedCountry.searchInput = country.name;
            $scope.hideNationsList = true;
        };

        $scope.inputFieldFocus = function() {
            $scope.hideNationsList = false;
            $scope.showOnScreenKeyboard('country-id', 'scroll-up');
            refreshScroller();
        };

        /**
         * [initializeMe description]
         * @return {[type]} [description]
         */
        var initializeMe = (function() {
            // hide back button, fixes mis-navigating after we changed the location of nationality collection
            $scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
            // show close button
            $scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
            $scope.hideNationsList = false;

            var scrollerOptions = {
                tap: true,
                preventDefault: false,
                deceleration: 0.0001,
                shrinkScrollbars: 'clip',
                preventDefaultException: { tagName: /^(SPAN|LI)$/ }
            };

            $scope.setScroller('country-list', scrollerOptions);
            $scope.init();
        }());

        $scope.saveNationality = function() {

            var successCallBack = function() {
                $state.go('zest_station.checkinKeyDispense', $stateParams);

            };
            var options = {
                params: {
                    guest_id: $stateParams.guest_id,
                    nationality_id: $scope.selectedCountry.id
                },
                successCallBack: successCallBack
            };

            $scope.callAPI(zsCheckinSrv.saveNationality, options);
        };
    }
]);
