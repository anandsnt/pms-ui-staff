admin.controller('ADAddnewRate', ['$scope', 'ADRatesRangeSrv', 'ADRatesSrv', '$state', '$stateParams',
    function ($scope, ADRatesRangeSrv, ADRatesSrv, $state, $stateParams) {
        $scope.init = function () {
            BaseCtrl.call(this, $scope);

            $scope.rateMenu = 'Details';
            $scope.rateData = {
                "id": "",
                "name": "",
                "description": "",
                "code": "",
                "based_on": {
                    "id": "",
                    "type": "",
                    "value_abs": "",
                    "value_sign": ""
                },
                "rate_type_id": "",
                "date_range_count": 0,
                "status": true,
                "room_type_ids": [],
                "date_ranges": []
            }

            ADRatesRangeSrv.emptyDateRangeData();
            // edit_mode by default false indicate Add New Rate
            $scope.edit_mode = false
            var initialContent = {
                'title': 'Rate',
                'subtitle': 'Details',
                'type': 'Details',
                'id': 'Details'
            };
            $scope.currentStepIndexList = [initialContent];
            $scope.currentRateStepIndex = 0;
            $scope.errorMessage = '';
            $scope.newRateId = $stateParams.rateId;

            // setting rateId and values for Rate Edit
            if ($stateParams.rateId) {
                $scope.edit_mode = true
                $scope.invokeApi(ADRatesSrv.fetchDetails, {
                    rateId: $stateParams.rateId
                }, $scope.updateRateDefaults);
            }
        };


        /*
         * to be updated from child classes
         */
        $scope.$on("changeMenu", function (e, value) {
            console.log(value);
            if (parseInt(value) > 0){
                value = "dateRange."+value;
            }
            $scope.rateMenu = value;
        });


        /*
         * click action to switch between steps
         */
        $scope.clickedStep = function (index, id) {
            console.log(index);
            $scope.currentRateStepIndex = index;
        };

        $scope.$on("errorReceived", function (e, value) {

            $scope.errorMessage = value;
        });

        /**
        * Fetch the based on rate retails, if the rate has chosen a based on rate.
        */
        $scope.$on("updateBasedonRate", function(e){
        	if($scope.rateData.based_on.id == undefined)
        		return false;

            var fetchBasedonSuccess = function(data){
                $scope.basedonRateData = data;
                $scope.updateRateDefaults(data);
                $scope.basedonRateData.rate_type = (data.rate_type != null) ? data.rate_type.id : ''
                $scope.basedonRateData.based_on = (data.based_on != null) ? data.based_on.id : '';
                $scope.$emit('hideLoader');
            };
            $scope.invokeApi(ADRatesSrv.fetchDetails, {
                rateId: $scope.rateData.based_on.id
            }, fetchBasedonSuccess);

        });

        /*
         * to be updated from child classes
         */
        $scope.$on("updateIndex", function (e, value) {
            var nextContent = {}
            if (value.id == 1) {
                $scope.newRateId = value.rateId;
                if ($scope.currentStepIndexList.length < 2) {

                    nextContent = {
                        'title': 'Room',
                        'subtitle': 'Types',
                        'type': 'Type',
                        'id': 'Type'
                    };
                    $scope.currentStepIndexList.push(nextContent);
                }
                $scope.clickedStep(parseInt(value.id));
            } else if (value == 2) {
                if ($scope.currentStepIndexList.length < 3) {

                    nextContent = {
                        'title': 'Date',
                        'subtitle': 'Range',
                        'type': 'Range',
                        'id': 'Range'
                    };
                    $scope.currentStepIndexList.push(nextContent);
                }
                $scope.clickedStep(parseInt(value));
            } else if (value == 3) {
                var getDateRangeData = [];
                if (!$scope.edit_mode) {
                    if ($scope.currentStepIndexList[2].title === 'Date') {
                        $scope.currentStepIndexList.splice(2, 1);
                    }
                    getDateRangeData = ADRatesRangeSrv.getDateRangeData();
                } else {
                    getDateRangeData = $scope.date_ranges;
                }
                $scope.showAddNewDateRangeOptions = false;

                angular.forEach(getDateRangeData, function (value, key) {
                    var nextContent = {
                        'title': 'Configure',
                        'type': 'Configure',
                        'id': value.id,
                        'begin_date': value.begin_date,
                        'end_date': value.end_date,
                        'is_editable': true
                    };
                    $scope.isAlreadyIncurrentStepIndexList = false;
                    angular.forEach($scope.currentStepIndexList, function (stepValue, key) {

                        if (stepValue.id == nextContent.id) {
                            $scope.isAlreadyIncurrentStepIndexList = true;
                        }
                    });
                    if (!$scope.isAlreadyIncurrentStepIndexList)
                        $scope.currentStepIndexList.push(nextContent);

                });
                $scope.clickedStep($scope.currentStepIndexList.length - 1);
            }


        });

        $scope.hideAddNewDateRange = function () {

            if ($scope.currentStepIndexList.length >= 3) {
                if (parseInt($scope.currentStepIndexList[2].id))
                    return false;
                else
                    return true;
            } else
                return true;
        }
        /*
         * to include template
         */

        $scope.includeTemplate = function (index) {

            switch (index) {
            case 0:
                return "/assets/partials/rates/adRatesAddDetails.html";
                break;
            case 1:
                return "/assets/partials/rates/adRatesAddRoomTypes.html";
                break;
            default:
                if ($scope.currentStepIndexList[2].title === "Configure")
                    return "/assets/partials/rates/adRatesAddConfigure.html";
                else
                    return "/assets/partials/rates/adRatesAddRange.html";
                break;
            };
        };

        $scope.addNewDateRange = function () {
            $scope.showAddNewDateRangeOptions = true;
            $scope.$broadcast('resetCalendar');
            $scope.currentRateStepIndex = -1;
        }

        // Fetch details success callback for rate edit

        $scope.updateRateDefaults = function (data) {
            // set rate edit field values for all steps
            $scope.hotel_business_date = data.business_date;
            $scope.rateData = data;
            $scope.rateData.id = $stateParams.rateId;
            $scope.rateData.rate_type_id = (data.rate_type != null) ? data.rate_type.id : '';
            if (data.based_on) {
                $scope.rateData.based_on.value_abs = Math.abs(data.based_on.value)
                $scope.rateData.based_on.value_sign = data.based_on.value > 0 ? "+" : "-";
            } else {
                $scope.rateData.based_on = {
                    "id": "",
                    "type": "",
                    "value_abs": "",
                    "value_sign": ""
                };
            }
            $scope.$emit('hideLoader');
            $scope.$broadcast('onRateDefaultsFetched');
        };

        $scope.setupEdit = function () {
            nextContent = {
                'title': 'Room',
                'subtitle': 'Types',
                'type': 'Type',
                'id': 'Type'
            };
            $scope.currentStepIndexList.push(nextContent);
            $scope.setupConfigureRates();
        }

        $scope.setupConfigureRates = function () {
            getDateRangeData = $scope.date_ranges;

            angular.forEach(getDateRangeData, function (value, key) {
                past_date_range = Date.parse(value.end_date) < Date.parse($scope.hotel_business_date);
                var nextContent = {
                    'title': 'Configure',
                    'type': 'Configure',
                    'id': value.id,
                    'begin_date': value.begin_date,
                    'end_date': value.end_date,
                    'is_editable': !past_date_range
                };
                $scope.currentStepIndexList.push(nextContent);

            });
            $scope.clickedStep($scope.currentStepIndexList.length - 1);

        }

        /*
         * init function
         */
        $scope.init();


    }
]);
