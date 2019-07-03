admin.controller('adComtrolRoomMappingCtrl', ['$scope', 'adComtrolRoomMappingSrv', 'ngTableParams', 'COMTROL_REF',
    function($scope, adComtrolRoomMappingSrv, ngTableParams, COMTROL_REF) {

        ADBaseTableCtrl.call(this, $scope, ngTableParams);

        // private methods and variables
        var resetNew = function() {
                $scope.state.new = {
                    room_no: '',
                    external_room: '',
                    external_extension: '',
                    external_access_level: ''
                };
            },
            revertEdit = function() {
                if ($scope.state.editRef) {
                    $scope.mappings[$scope.state.selected] = angular.copy($scope.state.editRef);
                    $scope.state.editRef = null;
                }
            },
            loadMetaList = function(cb) {
                $scope.callAPI(adComtrolRoomMappingSrv.fetchMeta, {
                    successCallBack: function(response) {
                        $scope.state.roomNumbers = response.roomNumbers;
                        cb();
                    }
                });
            };

        // scope method and variables
        // -------------------------------------------------------------------------------------------------------------- ADD
        /**
         * Method to open the add form
         */
        $scope.onClickAdd = function() {
            if ($scope.state.roomNumbers) {
                $scope.state.mode = 'ADD';
                $scope.state.selected = null;
                resetNew();
            } else {
                loadMetaList($scope.onClickAdd);
            }
        };

        /**
         * Method to close the ad form
         */
        $scope.onCancelAdd = function() {
            $scope.state.mode = '';
        };

        /**
         * Method to save a new Revenue Center
         * NOTE: Mandatory check is done on the templates
         */
        $scope.onSave = function() {
            var room_no = $scope.state.new.room_no,
                external_room = $scope.state.new.external_room,
                external_extension = $scope.state.new.external_extension,
                external_access_level = $scope.state.new.external_access_level;

            $scope.callAPI(adComtrolRoomMappingSrv.create, {
                params: {
                    room_no: room_no,
                    external_room: external_room,
                    external_extension: external_extension,
                    external_access_level: external_access_level
                },
                successCallBack: function() {
                    $scope.tableParams.reload();
                    $scope.state.mode = '';
                }
            });
        };
        // -------------------------------------------------------------------------------------------------------------- EDIT
        /**
         * Method to show the edit form
         * @param idx
         */
        $scope.onSelect = function(idx, mapping) {
            if ($scope.state.roomNumbers) {
                $scope.state.editRef = angular.copy(mapping);
                $scope.state.selected = idx;
            } else {
                loadMetaList(function() {
                    $scope.state.editRef = angular.copy(mapping);
                    $scope.state.selected = idx;
                });
            }
        };

        /**
         * Method to close the edit form
         */
        $scope.onCancelEdit = function() {
            $scope.state.mode = '';
            revertEdit();
            $scope.state.selected = null;
        };

        /**
         * Method to update a revenue Center
         * NOTE: Mandatory check is done on the templates
         * @param revCenter
         */
        $scope.onUpdate = function(mapping) {
            $scope.callAPI(adComtrolRoomMappingSrv.update, {
                params: mapping,
                successCallBack: function() {
                    $scope.state.mode = '';
                    $scope.state.selected = null;
                }
            });
        };

        /**
         * Method to delete a Revenue Center
         * Deleted ones are  hidden in UI with help of isDeleted flag
         * @param {Object} mapping Mapping to delete
         * @returns {undefined}
         */
        $scope.onClickDelete = function(mapping) {
            $scope.callAPI(adComtrolRoomMappingSrv.delete, {
                params: mapping.id,
                successCallBack: function() {
                    $scope.tableParams.reload();
                }
            });
        };

        $scope.getAccessLevelName = function(externalCategoryName) {
            var mappedExternalCode = _.find(COMTROL_REF.POS_POSTING_CATEGORIES, {
                code: externalCategoryName
            });

            return mappedExternalCode && mappedExternalCode.value;
        };

        $scope.fetchTableData = function($defer, params) {
            var getParams = $scope.calculateGetParams(params),
                fetchSuccessOfItemList = function(data) {
                    $scope.$emit('hideLoader');
                    $scope.currentClickedElement = -1;
                    $scope.totalCount = data.total_records;
                    $scope.totalPage = Math.ceil(data.total_records / $scope.displyCount);
                    $scope.data = data.room_mappings;
                    $scope.currentPage = params.page();
                    params.total(data.total_records);
                    $defer.resolve($scope.data);
                };

            $scope.invokeApi(adComtrolRoomMappingSrv.fetch, getParams, fetchSuccessOfItemList);
        };

        $scope.getAccessLevelName = function(id) {
            var accessLevel = _.find(COMTROL_REF.ACCESS_LEVELS, {
                id: parseInt(id, 10)
            });

            return accessLevel && accessLevel.value;
        };

        $scope.loadTable = function() {
            $scope.tableParams = new ngTableParams({
                page: 1, // show first page
                count: $scope.displyCount, // count per page
                sorting: {
                    room_no: 'asc' // initial sorting
                }
            }, {
                total: 0, // length of data
                getData: $scope.fetchTableData
            });
        };

        // --------------------------------------------------------------------------------------------------------------
        /**
         * Initialization method for the controller
         */
        (function() {
            $scope.state = {
                accessLevels: COMTROL_REF.ACCESS_LEVELS,
                roomNumbers: null,
                deletedCount: 0,
                selected: null,
                mode: '',
                editRef: null,
                new: {
                    room_no: '',
                    external_room: '',
                    external_extension: '',
                    external_access_level: ''
                }
            };

            // $scope.mappings = roomMappings.room_mappings;

            $scope.loadTable();
        })();
    }
]);
