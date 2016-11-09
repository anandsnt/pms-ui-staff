admin.controller('adComtrolRoomMappingCtrl', ['$scope', 'roomMappings', 'adComtrolRoomMappingSrv',
    function($scope, roomMappings, adComtrolRoomMappingSrv) {

        // private methods and variables
        var resetNew = function() {
                $scope.state.new = {
                    room_no: "",
                    external_room: "",
                    external_extension: ""
                }
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
                })
            };

        // scope method and variables
        // -------------------------------------------------------------------------------------------------------------- ADD
        /**
         * Method to open the add form
         */
        $scope.onClickAdd = function() {
            if ($scope.state.roomNumbers) {
                $scope.state.mode = "ADD";
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
            $scope.state.mode = "";
        };

        /**
         * Method to save a new Revenue Center
         * NOTE: Mandatory check is done on the templates
         */
        $scope.onSave = function() {
            var room_no = $scope.state.new.room_no,
                external_room = $scope.state.new.external_room,
                external_extension = $scope.state.new.external_extension;

            $scope.callAPI(adComtrolRoomMappingSrv.create, {
                params: {
                    room_no: room_no,
                    external_room: external_room,
                    external_extension: external_extension
                },
                successCallBack: function(response) {
                    $scope.mappings.push({
                        id: response.id,
                        room_no: room_no,
                        external_room: external_room,
                        external_extension: external_extension
                    });
                    $scope.state.mode = "";
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
            $scope.state.mode = "";
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
                    $scope.state.mode = "";
                    $scope.state.selected = null;
                }
            });
        };
        // -------------------------------------------------------------------------------------------------------------- DELETE
        /**
         * Method to delete a Revenue Center
         * Deleted ones are  hidden in UI with help of isDeleted flag
         * @param revCenter
         */
        $scope.onClickDelete = function(mapping) {
            $scope.callAPI(adComtrolRoomMappingSrv.delete, {
                params: mapping.id,
                successCallBack: function() {
                    mapping.isDeleted = true;
                    $scope.state.deletedCount++;
                }
            });
        };
        // --------------------------------------------------------------------------------------------------------------
        /**
         * Initialization method for the controller
         */
        (function() {
            $scope.state = {
                roomNumbers: null,
                deletedCount: 0,
                selected: null,
                mode: "",
                editRef: null,
                new: {
                    room_no: "",
                    external_room: "",
                    external_extension: ""
                }
            };

            $scope.mappings = roomMappings;
        })();
    }
]);