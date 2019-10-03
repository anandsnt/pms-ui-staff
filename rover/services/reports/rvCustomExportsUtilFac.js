angular.module('reportsModule').factory('RVCustomExportsUtilFac', [
    '$rootScope',
    'RVCustomExportFilterParamsConst',
    'RVreportsSubSrv',
    '$q',
    'RVCustomExportSrv',
    function (
        $rootScope,
        customExportFilterParamsConst,
        reportSubSrv,
        $q,
        rvCustomExportSrv ) {

        var boolStateOptions = [
            {
                label: 'Yes',
                value: true
            },
            {
                label: 'No',
                value: false
            }
        ];

        var dayNightUseIndicator = [
            {
                label: 'D',
                value: 'D'
            },
            {
                label: 'N',
                value: 'N'
            } 
        ];


        const rangeOperators = [
            { label: 'Greater than', value: 'greater_than'},
            { label: 'Equal to', value: 'equal_to'},
            { label: 'Less than', value: 'less_than'}
        ];

        /**
         * Group the filter fields by filter type
         * @param {Array} filters all filter fields
         * @return {Object} filterOptions
         */
        var processFilters = (filters) => {
             var filterOptions = {};

            _.each(filters, (filter) => {
                if (!filterOptions[filter.filter_type]) {
                    filterOptions[filter.filter_type] = [];
                } 

                filterOptions[filter.filter_type].push({
                    label: filter.description,
                    value: filter.value
                }); 
            
            });

            return filterOptions;
        };

        /**
         * Mark the the objects in the array as selected when values matches
         * @param {Array} list array of object
         * @param {Array} selectedValues array of selected values
         * @param {String} key key to be used in comparison
         * @return {Array} list - list with selected property added
         */
        var markAsSelected = (list, selectedValues, key) => {
            key = key || 'value';
            if (!selectedValues || selectedValues.length === 0 ) {
                return list;
            }
            _.each (list, function ( each ) {
                if (selectedValues.indexOf(each[key]) !== -1) {
                    each.selected = true;
                }
            });

            return list;
        };

        /**
         * Populate booking origins
         * @param {Object} selectedFilter selected filter
         * @param {Array} selectedValues array of selected values
         * @param {Object} deferred - deferred object
         * @return {void} 
         */
        var populateBookingOrigins = (selectedFilter, selectedValues, deferred) => {
                reportSubSrv.fetchBookingOrigins().then(function (data) {
                    selectedFilter.secondLevelData = markAsSelected(angular.copy(data), selectedValues);
                    selectedFilter.options = {
                        selectAll: false,
                        hasSearch: false,
                        key: 'name',
                        value_key: 'value'
                    };
                    selectedFilter.isMultiSelect = true;

                    deferred.resolve(selectedFilter);
                });
            },

            /**
             * Populate markets
             * @param {Object} selectedFilter selected filter
             * @param {Array} selectedValues array of selected values
             * @param {Object} deferred - deferred object
             * @return {void} 
             */
            populateMarkets = ( selectedFilter, selectedValues, deferred ) => {
                reportSubSrv.fetchMarkets().then(function (data) {
                    selectedFilter.secondLevelData = markAsSelected(angular.copy(data), selectedValues);
                    selectedFilter.options = {
                        selectAll: false,
                        hasSearch: false,
                        key: 'name',
                        value_key: 'value'
                    };
                    selectedFilter.isMultiSelect = true;
                    deferred.resolve(selectedFilter);
                });
            },

            /**
             * Populate reservation status
             * @param {Object} selectedFilter selected filter
             * @param {Array} selectedValues array of selected values
             * @param {Object} deferred - deferred object
             * @return {void} 
             */
            populateReservationStatus = ( selectedFilter, selectedValues, deferred ) => {
                rvCustomExportSrv.getReferenceValuesByType('reservation_status').then(function (data) {
                    selectedFilter.secondLevelData = markAsSelected(angular.copy(data), selectedValues, 'value');
                    selectedFilter.options = {
                        hasSearch: false,
                        selectAll: selectedValues ? data.length === selectedValues.length : true,
                        key: 'value',
                        defaultValue: 'Select Status',
                        value_key: 'value'
                    };
                    selectedFilter.isMultiSelect = true;
                    deferred.resolve(selectedFilter);
                });
            },

            /**
             * Populate sources
             * @param {Object} selectedFilter selected filter
             * @param {Array} selectedValues array of selected values
             * @param {Object} deferred - deferred object
             * @return {void} 
             */
            populateSource = ( selectedFilter, selectedValues, deferred ) => {
                reportSubSrv.fetchSources().then(function (data) {
                    selectedFilter.secondLevelData = markAsSelected(angular.copy(data), selectedValues);
                    selectedFilter.options = {
                        hasSearch: false,
                        selectAll: selectedValues ? data.length === selectedValues.length : true,
                        key: 'name',
                        value_key: 'value'
                    };
                    selectedFilter.isMultiSelect = true;
                    deferred.resolve(selectedFilter);
                });
            },

            /**
             * Populate segments
             * @param {Object} selectedFilter selected filter
             * @param {Array} selectedValues array of selected values
             * @param {Object} deferred - deferred object
             * @return {void} 
             */
            populateSegments = ( selectedFilter, selectedValues, deferred ) => {
                reportSubSrv.fetchSegments().then(function (data) {
                    selectedFilter.secondLevelData = markAsSelected(angular.copy(data), selectedValues);
                    selectedFilter.options = {
                        hasSearch: false,
                        selectAll: selectedValues ? data.length === selectedValues.length : true,
                        key: 'name',
                        value_key: 'value'
                    };
                    selectedFilter.isMultiSelect = true;
                    deferred.resolve(selectedFilter);
                });
            },

            /**
             * Populate room types
             * @param {Object} selectedFilter selected filter
             * @param {Array} selectedValues array of selected values
             * @param {Object} deferred - deferred object
             * @return {void} 
             */
            populateRoomTypes = ( selectedFilter, selectedValues, deferred ) => {
                reportSubSrv.fetchRoomTypeList().then(function (data) {
                    selectedFilter.secondLevelData = markAsSelected(angular.copy(data), selectedValues, 'code');
                    selectedFilter.options = {
                        hasSearch: false,
                        selectAll: selectedValues ? data.length === selectedValues.length : true,
                        key: 'name',
                        value_key: 'code'
                    };
                    selectedFilter.isMultiSelect = true;
                    deferred.resolve(selectedFilter);
                });
            },

            /**
             * Populate dual state options
             * @param {Object} selectedFilter selected filter
             * @param {Array} selectedValues array of selected values
             * @param {Object} deferred - deferred object
             * @return {void} 
             */
            populateDualStates = (stateOptions, selectedFilter, selectedValues, deferred ) => {
                selectedFilter.secondLevelData = angular.copy(stateOptions);
                selectedFilter.hasDualState = true;
                selectedFilter.selectedSecondLevel = selectedValues || '';
                deferred.resolve(selectedFilter);
            },

            /**
             * Populate room nos
             * @param {Object} selectedFilter selected filter
             * @param {Array} selectedValues array of selected values
             * @param {Object} deferred - deferred object
             * @return {void} 
             */
            populateRoomNos = ( selectedFilter, selectedValues, deferred ) => {
                rvCustomExportSrv.getRoomNos().then(function (data) {
                    selectedFilter.secondLevelData = markAsSelected(angular.copy(data), selectedValues, 'name');
                    selectedFilter.options = {
                        hasSearch: false,
                        selectAll: selectedValues ? data.length === selectedValues.length : true,
                        key: 'name',
                        value_key: 'name'
                    };
                    selectedFilter.isMultiSelect = true;
                    deferred.resolve(selectedFilter);
                });
            },

            /**
             * Populate rates list
             * @param {Object} selectedFilter selected filter
             * @param {Array} selectedValues array of selected values
             * @param {Object} deferred - deferred object
             * @return {void} 
             */
            populateRateList = ( selectedFilter, selectedValues, deferred ) => {
                rvCustomExportSrv.getRateList().then(function (data) {
                    selectedFilter.secondLevelData = markAsSelected(angular.copy(data), selectedValues, 'code');
                    selectedFilter.options = {
                        hasSearch: false,
                        selectAll: selectedValues ? data.length === selectedValues.length : true,
                        key: 'name',
                        value_key: 'code'
                    };
                    selectedFilter.isMultiSelect = true;
                    deferred.resolve(selectedFilter);
                });
            },

            /**
             * Populate CI/CO agents
             * @param {Object} selectedFilter selected filter
             * @param {Array} selectedValues array of selected values
             * @param {Object} deferred - deferred object
             * @return {void} 
             */
            populateCICOAgents = ( selectedFilter, selectedValues, deferred ) => {
                rvCustomExportSrv.getCICOAgents().then(function (data) {
                    selectedFilter.secondLevelData = markAsSelected(angular.copy(data), selectedValues, 'full_name');
                    selectedFilter.options = {
                        hasSearch: true,
                        selectAll: selectedValues ? data.length === selectedValues.length : true,
                        key: 'full_name',
                        value_key: 'full_name',
                        altKey: 'email'
                    };
                    selectedFilter.isMultiSelect = true;
                    deferred.resolve(selectedFilter);
                });
            },

            /**
             * Populate CI/CO applications
             * @param {Object} selectedFilter selected filter
             * @param {Array} selectedValues array of selected values
             * @param {Object} deferred - deferred object
             * @return {void} 
             */
            populateCICOApplications = ( selectedFilter, selectedValues, deferred ) => {
                rvCustomExportSrv.getCICOApplications().then(function (data) {
                    selectedFilter.secondLevelData = markAsSelected(angular.copy(data), selectedValues, 'value');
                    selectedFilter.options = {
                        hasSearch: false,
                        selectAll: selectedValues ? data.length === selectedValues.length : true,
                        key: 'value',
                        value_key: 'value',
                        altKey: 'description'
                    };
                    selectedFilter.isMultiSelect = true;
                    deferred.resolve(selectedFilter);
                });
            },

            /**
             * Populate nationality/countries
             * @param {Object} selectedFilter selected filter
             * @param {Array} selectedValues array of selected values
             * @param {Object} deferred - deferred object
             * @return {void} 
             */
            populateCountryOrNationality = ( selectedFilter, selectedValues, deferred, displayKey, valueKey ) => {
                rvCustomExportSrv.getCountries().then(function (data) {
                    selectedFilter.secondLevelData = markAsSelected(angular.copy(data), selectedValues, valueKey);
                    selectedFilter.options = {
                        hasSearch: true,
                        selectAll: selectedValues ? data.length === selectedValues.length : true,
                        key: displayKey,
                        value_key: valueKey
                    };
                    selectedFilter.isMultiSelect = true;
                    deferred.resolve(selectedFilter);
                });
            },

            /**
             * Populate guest languages
             * @param {Object} selectedFilter selected filter
             * @param {Array} selectedValues array of selected values
             * @param {Object} deferred - deferred object
             * @return {void} 
             */
            populateLanguage = ( selectedFilter, selectedValues, deferred ) => {
                rvCustomExportSrv.getGuestLanguages().then(function (data) {
                    selectedFilter.secondLevelData = markAsSelected(angular.copy(data), selectedValues, 'value');
                    selectedFilter.options = {
                        hasSearch: true,
                        selectAll: selectedValues ? data.length === selectedValues.length : true,
                        key: 'value',
                        value_key: 'value'
                    };
                    selectedFilter.isMultiSelect = true;
                    deferred.resolve(selectedFilter);
                });
            },

            /**
             * Populate primary payment methods
             * @param {Object} selectedFilter selected filter
             * @param {Array} selectedValues array of selected values
             * @param {Object} deferred - deferred object
             * @return {void} 
             */
            populatePaymentMethods = ( selectedFilter, selectedValues, deferred ) => {
                rvCustomExportSrv.getPaymentMethods().then(function (data) {
                    selectedFilter.secondLevelData = markAsSelected(angular.copy(data), selectedValues, 'description');
                    selectedFilter.options = {
                        hasSearch: false,
                        selectAll: selectedValues ? data.length === selectedValues.length : true,
                        key: 'description',
                        value_key: 'description'
                    };
                    selectedFilter.isMultiSelect = true;
                    deferred.resolve(selectedFilter);
                });
            },

            /**
             * Populate memberships
             * @param {Object} selectedFilter selected filter
             * @param {Array} selectedValues array of selected values
             * @param {Object} deferred - deferred object
             * @return {void} 
             */
            populateMemberships = ( selectedFilter, selectedValues, deferred ) => {
                rvCustomExportSrv.getMemberShips().then(function (data) {
                    selectedFilter.secondLevelData = markAsSelected(angular.copy(data), selectedValues, 'desc');
                    selectedFilter.options = {
                        hasSearch: false,
                        selectAll: selectedValues ? data.length === selectedValues.length : true,
                        key: 'desc',
                        value_key: 'desc'
                    };
                    selectedFilter.isMultiSelect = true;
                    deferred.resolve(selectedFilter);
                });
            },

            /**
             * Populate membership levels
             * @param {Object} selectedFilter selected filter
             * @param {Array} selectedValues array of selected values
             * @param {Object} deferred - deferred object
             * @return {void} 
             */
            populateMembershipLevels = ( selectedFilter, selectedValues, deferred ) => {
                rvCustomExportSrv.getMemberShips().then(function (data) {
                    selectedFilter.secondLevelData = markAsSelected(angular.copy(data), selectedValues, 'value');
                    selectedFilter.options = {
                        hasSearch: false,
                        selectAll: selectedValues ? data.length === selectedValues.length : true,
                        key: 'value',
                        value_key: 'value'
                    };
                    selectedFilter.isMultiSelect = true;
                    deferred.resolve(selectedFilter);
                });
            };

        /**
         * Populate option filter values
         * @param {String} selectedFieldName selected field name
         * @param {Object} selectedFilter selected filter
         * @param {Array} selectedValues array of selected values
         * @return {Promise} promise
         */
        var populateOptions = (selectedFieldName, selectedFilter, selectedValues) => {
            var deferred = $q.defer();

            switch (selectedFieldName) {
                case customExportFilterParamsConst['BOOKING_ORIGIN_CODE']:
                    populateBookingOrigins(selectedFilter, selectedValues, deferred);
                    break;
                case customExportFilterParamsConst['MARKET_CODE']:
                    populateMarkets(selectedFilter, selectedValues, deferred);
                    break;
                case customExportFilterParamsConst['RESERVATION_STATUS']:
                    populateReservationStatus(selectedFilter, selectedValues, deferred);
                    break;
                case customExportFilterParamsConst['SOURCE_CODE']:
                    populateSource(selectedFilter, selectedValues, deferred);
                    break;
                case customExportFilterParamsConst['SEGMENT_CODE']:
                    populateSegments(selectedFilter, selectedValues, deferred);
                    break;
                case customExportFilterParamsConst['ROOM_TYPE']:
                case customExportFilterParamsConst['ARRIVAL_ROOM_TYPE']:
                case customExportFilterParamsConst['DEPARTURE_ROOM_TYPE']:
                    populateRoomTypes(selectedFilter, selectedValues, deferred);
                    break;
                case customExportFilterParamsConst['ACTIVE']:
                case customExportFilterParamsConst['VIP']:
                    populateDualStates(boolStateOptions, selectedFilter, selectedValues, deferred);
                    break;
                case customExportFilterParamsConst['ROOM_NO']:
                    populateRoomNos(selectedFilter, selectedValues, deferred);
                    break;
                case customExportFilterParamsConst['ARRIVAL_RATE_CODE']:
                    populateRateList(selectedFilter, selectedValues, deferred);
                    break;
                case customExportFilterParamsConst['CI_AGENT']:
                case customExportFilterParamsConst['CO_AGENT']:
                    populateCICOAgents(selectedFilter, selectedValues, deferred);
                    break;
                case customExportFilterParamsConst['CI_APPLICATION']:
                case customExportFilterParamsConst['CO_APPLICATION']:
                    populateCICOApplications(selectedFilter, selectedValues, deferred);
                    break;
                case customExportFilterParamsConst['COUNTRY']:
                    populateCountryOrNationality(selectedFilter, selectedValues, deferred, 'value', 'value');
                    break;
                case customExportFilterParamsConst['LANGUAGE']:
                    populateLanguage(selectedFilter, selectedValues, deferred);
                    break;
                case customExportFilterParamsConst['PRIMARY_PAYMENT_METHOD']:
                    populatePaymentMethods(selectedFilter, selectedValues, deferred);
                    break;
                case customExportFilterParamsConst['MEMBERSHIP']:
                    populateMemberships(selectedFilter, selectedValues, deferred);
                    break;
                case customExportFilterParamsConst['MEMBERSHIP_LEVEL']:
                    populateMembershipLevels(selectedFilter, selectedValues, deferred);
                    break;
                case customExportFilterParamsConst['STAY_TYPE']:
                    populateDualStates(dayNightUseIndicator, selectedFilter, selectedValues, deferred);
                    break;
                case customExportFilterParamsConst['NATIONALITY']:
                    populateCountryOrNationality(selectedFilter, selectedValues, deferred, 'value', 'code');
                    break;
                default:

            }

            return deferred.promise;

        };

        /**
         * Populated range filter values
         * @param {String} selectedFieldName selected field name
         * @param {Object} selectedFilter selected filter
         * @param {Array} appliedFilters array of appliedfilters
         * @param {String} selectedSecondLevel selected second level
         * @param {Number} rangeValue range value
         */
        var populateRangeOperators = (selectedFieldName, selectedFilter, appliedFilters, selectedSecondLevel, rangeValue) => {
            var appliedRangeOperators = _.filter(appliedFilters, function ( each ) {
                    return each.selectedFirstLevel === selectedFieldName;
                }),
                appliedRangeOperatorNames = _.pluck(appliedRangeOperators, 'selectedSecondLevel');

            var availableOperators = _.filter(getRangeOperators(), function (each) {
                return appliedRangeOperatorNames.indexOf(each.value) === -1;
            });
            
            selectedFilter.secondLevelData = availableOperators;
            selectedFilter.selectedSecondLevel = selectedSecondLevel;
            selectedFilter.rangeValue = rangeValue;

        };

        // Get available range operators
        var getRangeOperators = () => {
            return rangeOperators;
        };

        // Object holding factory functions
        var factory = {
            processFilters: processFilters,
            populateOptions: populateOptions,
            getRangeOperators: getRangeOperators,
            populateRangeOperators: populateRangeOperators
        };

        return factory;

}]);