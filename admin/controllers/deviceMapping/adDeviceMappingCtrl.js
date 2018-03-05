admin.controller('ADDeviceMappingsCtrl', ['ngTableParams', '$rootScope', '$scope', '$state', 'ADDeviceSrv', 'ADKeyEncoderSrv', 'ADEmvTerminalsSrv', '$timeout', '$location', '$anchorScroll',
    function(ngTableParams, $rootScope, $scope, $state, ADDeviceSrv, ADKeyEncoderSrv, ADEmvTerminalsSrv, $timeout, $location, $anchorScroll) {

        $scope.errorMessage = '';
        ADBaseTableCtrl.call(this, $scope, ngTableParams);
        $scope.mapping = {};
        $scope.isAddMode = false;
        $scope.addEditTitle = "";
        $scope.isEditMode = false;
        
        /*
         * To fetch list of device mappings
         */
        $scope.getKeyEncoderDescription = function(id) {
            var encoder =  _.find($scope.key_encoders, function(t) {
                return (t.id == id);
            });

            if (!_.isUndefined(encoder)) {
                return encoder.description;    
            } else {
                return '';
            }
        };
        $scope.getEmvDescription = function(id) {
            var terminal =  _.find($scope.emv_terminals, function(t) {
                return (t.id == id);
            });

            if (!_.isUndefined(terminal)) {
                return terminal.name;    
            } else {
                return '';
            }
        };
        $scope.listDevices = function($defer, params) {
            var getParams = $scope.calculateGetParams(params);
            var fetchSuccessOfItemList = function(data) {
                $scope.$emit('hideLoader');
                // No expanded rate view
                $scope.currentClickedElement = -1;
                $scope.totalCount = data.total_count;
                $scope.totalPage = Math.ceil(data.total_count / $scope.displyCount);

                for (var i in data.work_stations) { // pull in the description of the key encoder
                    data.work_stations[i].key_encoder_description = $scope.getKeyEncoderDescription(data.work_stations[i].key_encoder_id);
                    data.work_stations[i].emv_name = $scope.getEmvDescription(data.work_stations[i].emv_terminal_id);
                }

                $scope.data = data.work_stations;
                $scope.currentPage = params.page();
                params.total(data.total_count);
                $scope.isAddMode = false;
                $defer.resolve($scope.data);
            };

            $scope.invokeApi(ADDeviceSrv.fetch, getParams, fetchSuccessOfItemList);
        };


        $scope.loadTable = function() {
            $scope.tableParams = new ngTableParams({
                page: 1, // show first page
                count: $scope.displyCount, // count per page
                sorting: {
                    name: 'asc' // initial sorting
                }
            }, {
                total: 0, // length of data
                getData: $scope.listDevices
            });

        };

        $scope.failureCallBack = function(response) {
            console.warn(response);
        };
        $scope.key_encoders = [];
        $scope.selectedKeyEncoder;
        $scope.isLoaded = false;
        $scope.isEmvLoaded = false;
        $scope.isKeysLoaded = false;
        $scope.fetchKeyEncoderList = function() {
            var onSuccess = function(data) {
                $scope.key_encoders = data.results;
                $scope.isKeysLoaded = true;
                if ($scope.isEmvLoaded) {
                    $scope.loadTable(); // this loads up after key encoders so we can get the key encoder description first
                }
                $scope.$emit('hideLoader');
            };
            var options = {
                params: {},
                successCallBack: onSuccess,
                failureCallBack: $scope.failureCallBack
            };

            $scope.callAPI(ADKeyEncoderSrv.fetchEncoders, options);
        };
        $scope.fetchEmvList = function() {
            var onSuccess = function(data) {
                $scope.emv_terminals = data.results;
                $scope.isEmvLoaded = true;
                if ($scope.isKeysLoaded) {
                    $scope.loadTable(); // this loads up after key encoders so we can get the key encoder description first
                }
                $scope.$emit('hideLoader');
            };
            var options = {
                params: {},
                successCallBack: onSuccess,
                failureCallBack: $scope.failureCallBack
            };

            $scope.callAPI(ADEmvTerminalsSrv.fetchItemList, options);
        };
        /*
         * Function to get the hotel infrasec (blackbox) details
         */
        $scope.getInfrasecDetails = function() {
            var onSuccessGetInfrasecDetails = function(data) {
                $scope.infrasecDetails = data.data;           
            };
            var options = {
                params: {
                    hotel_id: $rootScope.hotelId
                },
                successCallBack: onSuccessGetInfrasecDetails
            };

            $scope.callAPI(ADEmvTerminalsSrv.getHotelInfrasecDetails, options);
        };

        $scope.fetchKeyEncoderList();
        $scope.fetchEmvList();
        $scope.getInfrasecDetails();

        // To list device mappings
        /*
         * To render edit device mapping screen
         * @param {index} index of selected device mapping
         * @param {id} id of the device mapping
         */
        $scope.editDeviceMapping = function(index, id) {
            $scope.mapping = {};
            $scope.currentClickedElement = index;
            $scope.isAddMode = false;
            $scope.isEditMode = true;
            $scope.isDeviceIdReadOnly = "yes";
            $scope.addEditTitle = "EDIT";
            var successCallbackRender = function(data) {
                $scope.mapping = data;
                $scope.mapping.selectedKeyEncoder = data.key_encoder_id;
                $scope.mapping.selectedEmvTerminal = data.emv_terminal_id;
                $scope.mapping.is_out_of_order = data.is_out_of_order;
                $scope.mapping.out_of_order_msg = data.out_of_order_msg;
                $scope.$emit('hideLoader');
            };

            $scope.mapping.id = id;
            var data = {
                "id": id
            };

            $scope.invokeApi(ADDeviceSrv.getDeviceMappingDetails, data, successCallbackRender);
        };
        /*
         * Render add device mapping screen
         */
        $scope.addNewDeviceMapping = function() {
            $scope.mapping = {};
            $scope.currentClickedElement = "new";
            $scope.isAddMode = true;
            $scope.isDeviceIdReadOnly = "no";
            $scope.addEditTitle = "ADD";
            $scope.mapping = {};
            $scope.mapping.register_identity = '';
            $scope.mapping.is_mobile = false;
            $timeout(function() {
                $location.hash('new-form-holder');
                $anchorScroll();
            });
        };
        /*
         * To get the template of edit screen
         * @param {int} index of the selected department
         * @param {string} id of the department
         */
        $scope.getTemplateUrl = function(index, id) {
            if (_.isUndefined(index) || _.isUndefined(id)) {
                return "";
            }
            if ($scope.currentClickedElement === index) {
                return "/assets/partials/deviceMapping/adDeviceMappingDetails.html";
            }
        };

        /*
         * To handle click event
         */
        $scope.clickCancel = function() {
            $scope.isEditMode = false;
            $scope.currentClickedElement = -1;
        };
        /*
         * To delete department
         * @param {int} index of the selected department
         * @param {string} id of the selected department
         */
        $scope.deleteDeviceMapping = function(index, id) {
            var successCallbackDelete = function(data) {
                $scope.$emit('hideLoader');
                $scope.data.splice(index, 1);
                $scope.currentClickedElement = -1;
                $scope.totalCount--;
            };

            $scope.invokeApi(ADDeviceSrv.deleteDeviceMapping, id, successCallbackDelete);
        };
        /*
         * To save mapping
         */

        $scope.isValidWorkStation = function() {
            // check if required fields are filled out
            if (!$scope.mapping.name || !$scope.mapping.station_identifier) {
                return false;
            } else return true;

        };
        $scope.updateInline = false;
        $scope.updateCurrentWorkstation = function() {
            if (!$scope.updateInline) {
                // To update data with new value
                $scope.data[parseInt($scope.currentClickedElement)].name = $scope.mapping.name;
                $scope.data[parseInt($scope.currentClickedElement)].station_identifier = $scope.mapping.station_identifier;
                $scope.data[parseInt($scope.currentClickedElement)].encoder_id = $scope.mapping.selectedKeyEncoder;
                $scope.data[parseInt($scope.currentClickedElement)].key_encoder_id = $scope.mapping.selectedKeyEncoder;
                $scope.data[parseInt($scope.currentClickedElement)].emv_terminal_id = $scope.mapping.selectedEmvTerminal;
                $scope.data[parseInt($scope.currentClickedElement)].is_out_of_order = $scope.mapping.is_out_of_order;
                $scope.data[parseInt($scope.currentClickedElement)].out_of_order_msg = $scope.mapping.out_of_order_msg;
                $scope.data[parseInt($scope.currentClickedElement)].default_key_encoder_id = $scope.mapping.selectedKeyEncoder;
                $scope.data[parseInt($scope.currentClickedElement)].key_encoder_description = $scope.getKeyEncoderDescription($scope.mapping.selectedKeyEncoder);
                $scope.data[parseInt($scope.currentClickedElement)].emv_name = $scope.getEmvDescription($scope.mapping.selectedEmvTerminal);
            }
            $scope.updateInline = false;
        };
        $scope.addWorkstationRenderData = function(successData) {
            // // To add new data to scope
            var pushData = {
                "id": successData.id,
                "encoder_id": $scope.mapping.selectedKeyEncoder,
                "station_identifier": $scope.mapping.station_identifier,
                "name": $scope.mapping.name,
                "out_of_order_msg": $scope.mapping.out_of_order_msg,
                "is_out_of_order": $scope.mapping.is_out_of_order,
                "key_encoder_id": $scope.mapping.selectedKeyEncoder,
                "emv_terminal_id": $scope.mapping.selectedEmvTerminal,
                "hue_light_id": $scope.mapping.hue_light_id,
                "key_encoder_description": $scope.getKeyEncoderDescription($scope.mapping.selectedKeyEncoder)
            };

            $scope.data.push(pushData);
            $scope.totalCount++;
        };
        $scope.successSaveMapping = function(successData) {
            $scope.$emit('hideLoader');
            if ($scope.isAddMode) {
                $scope.addWorkstationRenderData(successData);
            } else {
                $scope.updateCurrentWorkstation();
            }

            $scope.currentClickedElement = -1;
            $scope.isEditMode = false;
            $scope.tableParams.reload();
        };

        $scope.saveWorkstation = function(workstation) {
            // updates a workstation without opening details, used for quick toggle a workstation Out of Service, or back in service.
            $scope.mapping = workstation;
            $scope.updateInline = true; // currently only for OOS + refresh Station toggles
            setTimeout(function() {
                $scope.saveMapping(true);
            }, 250);
        };

        $scope.saveMapping = function(inline) {
            var data = { // not getting list of printers from the api at this point, 
                // so we will have to rely on zest station or another UI to update the workstation with a default printer
                "name": $scope.mapping.name,
                "identifier": $scope.mapping.station_identifier
            };

            if (!_.isUndefined($scope.mapping.selectedKeyEncoder)) {
                data.default_key_encoder_id = $scope.mapping.selectedKeyEncoder;
            }
            if (!_.isUndefined($scope.mapping.selectedEmvTerminal)) {
                data.emv_terminal_id = $scope.mapping.selectedEmvTerminal;
            }
            if (inline) {
                data.emv_terminal_id = $scope.mapping.emv_terminal_id;
                data.default_key_encoder_id = $scope.mapping.key_encoder_id;
            }
            // CICO-18808
            if (!_.isUndefined($scope.mapping.rover_device_id)) {
                data.rover_device_id = $scope.mapping.rover_device_id;
            }
            if (!$scope.mapping.refresh_station) {
                $scope.mapping.refresh_station = false;
            }
            data.refresh_station = $scope.mapping.refresh_station;
            data.hue_light_id = $scope.mapping.hue_light_id;
            // CICO-10506 //zest station
            if (!$scope.mapping.is_out_of_order) {
                $scope.mapping.is_out_of_order = false;
            }
            if ($scope.infrasecDetails.country_name === $rootScope.infrasecSpecificCountry 
                && $scope.infrasecDetails.is_infrasec_activated 
                && $scope.infrasecDetails.max_control_unit > 0) {
                data.is_control_unit_enabled = $scope.mapping.is_control_unit_enabled;
                data.register_identity = $scope.mapping.register_identity !== '' ? $scope.mapping.register_identity : null;
                data.is_mobile = $scope.mapping.is_mobile;
            }
            data.is_out_of_order = $scope.mapping.is_out_of_order;

            if (typeof $scope.mapping.out_of_order_msg !== typeof true) {
                data.out_of_order_msg = $scope.mapping.out_of_order_msg;
            }

            if ($scope.isAddMode) {
                $scope.invokeApi(ADDeviceSrv.createMapping, data, $scope.successSaveMapping);
            } else {
                data.id = $scope.mapping.id;
                $scope.mapping.selectedKeyEncoder = data.default_key_encoder_id;
                $scope.invokeApi(ADDeviceSrv.updateMapping, data, $scope.successSaveMapping);
            }
        };

    }
]);