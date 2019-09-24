admin.controller('ADRatesSequenceCtrl', ['$scope', 'ADRateSequenceSrv', '$anchorScroll', '$timeout', '$location', '$state',
	function($scope, ADRateSequenceSrv, $anchorScroll, $timeout, $location, $state) {
        var isCustomRateSelected = function( dashboard ) {
                return dashboard.value === 'CUSTOM_RATE';
            },
            fetchSelections = function() {
                var onFetchSelectionsSuccess = function(data) {
                    $scope.sequenceState.selectedOptions = data;
                    $scope.showSearch = isCustomRateSelected( data.dashboard );
                    $scope.$emit('hideLoader');
                };

                $scope.invokeApi(ADRateSequenceSrv.fetchSelections, {}, onFetchSelectionsSuccess, onError);
            },
            initializeView = function() {
                var onFetchPrefereneOptions = function(data) {
                    $scope.sequenceState.availableOptions = data;
                    fetchSelections();
                };

                $scope.invokeApi(ADRateSequenceSrv.fetchOptions, {}, onFetchPrefereneOptions, onError);
            },
            onError = function(err) {
                $scope.errorMessage = err;
                $scope.$emit('hideLoader');
            };

        $scope.clearErrorMessage = function() {
            $scope.errorMessage = [];
        };
        $scope.sequenceState = {
            availableOptions: {
                room_rate: [],
                rate_manager: [],
                dashboard: [],
                admin_dashboard: []
            },
            selectedOptions: {
                room_rates: {},
                rate_manager: {},
                dashboard: {},
                admin_dashboard: {}
            }
        };
        $scope.goBackToRateAdmin = function() {
            $state.go("admin.dashboard", {"menu": 6});
        };

        $scope.changePreference = function(type, option) {
            $scope.sequenceState.selectedOptions[type] = angular.copy(option);
            if ( type === 'dashboard') {
                $scope.showSearch = isCustomRateSelected( option );
            }
        };

        $scope.saveRateSortPreferences = function() {
            var onSaveSuccess = function(data) {
                    initializeView();
                },
                selectedDashboardRate = $scope.sequenceState.selectedOptions['dashboard_rate'];

            $scope.invokeApi(ADRateSequenceSrv.save, {
                'room_rates': $scope.sequenceState.selectedOptions['room_rates'].id,
                'rate_manager': $scope.sequenceState.selectedOptions['rate_manager'].id,
                'dashboard': $scope.sequenceState.selectedOptions['dashboard'].id,
                'admin_dashboard': $scope.sequenceState.selectedOptions['admin_dashboard'].id,
                'dashboard_rate_id': !selectedDashboardRate ? null : selectedDashboardRate.id
            }, onSaveSuccess, onError);
        };

        $scope.goToCustomRateSequence = function() {
            $state.go('admin.customRatesSequence');
        };
        initializeView();
    }
]);
