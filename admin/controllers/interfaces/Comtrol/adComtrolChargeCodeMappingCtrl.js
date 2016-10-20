admin.controller('adComtrolChargeCodeMappingCtrl', ['$scope', 'mappedChargeCodes', 'adComtrolChargeCodeMappingSrv', 'ngTableParams',
    function($scope, mappedChargeCodes, adComtrolChargeCodeMappingSrv, ngTableParams) {

        //private methods and variables
        var resetNew = function() {
                $scope.state.new = {
                    revenue_center_code: "",
                    category_name: "",
                    charge_code_id: "",
                    charge_code: ""
                }
            },
            revertEdit = function() {
                if ($scope.state.editRef) {
                    $scope.mappings[$scope.state.selected] = angular.copy($scope.state.editRef);
                    $scope.state.editRef = null;
                }
            },
            loadMetaList = function(cb) {
                $scope.callAPI(adComtrolChargeCodeMappingSrv.fetchMeta, {
                    successCallBack: function(response) {
                        $scope.state.revCenters = response.revCenters;
                        $scope.state.chargeCodes = response.chargeCodes;
                        cb();
                    }
                })
            },
            getChargeCode = function(id) {
                return _.find($scope.state.chargeCodes, {id: Number(id)}).name;
            };

        //scope method and variables
        //-------------------------------------------------------------------------------------------------------------- ADD
        /**
         * Method to open the add form
         */
        $scope.onClickAdd = function() {
            if ($scope.state.revCenters) {
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
            var revenue_center_code = $scope.state.new.revenue_center_code,
                category_name = $scope.state.new.category_name,
                charge_code_id = $scope.state.new.charge_code_id;

            $scope.callAPI(adComtrolChargeCodeMappingSrv.create, {
                params: {
                    revenue_center_code: revenue_center_code,
                    category_name: category_name,
                    charge_code_id: charge_code_id
                },
                successCallBack: function(response) {
                    $scope.mappings.push({
                        id: response.id,
                        revenue_center_code: revenue_center_code,
                        category_name: category_name,
                        charge_code_id: charge_code_id,
                        charge_code: getChargeCode(charge_code_id)
                    });
                    $scope.state.mode = "";
                }
            });
        };
        //-------------------------------------------------------------------------------------------------------------- EDIT
        /**
         * Method to show the edit form
         * @param idx
         */
        $scope.onSelect = function(idx, mapping) {
            if ($scope.state.revCenters) {
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
            $scope.callAPI(adComtrolChargeCodeMappingSrv.update, {
                params: mapping,
                successCallBack: function() {
                    mapping.charge_code = getChargeCode(mapping.charge_code_id);
                    $scope.state.mode = "";
                    $scope.state.selected = null;
                }
            });
        };
        //-------------------------------------------------------------------------------------------------------------- DELETE
        /**
         * Method to delete a Revenue Center
         * Deleted ones are  hidden in UI with help of isDeleted flag
         * @param revCenter
         */
        $scope.onClickDelete = function(mapping) {
            $scope.callAPI(adComtrolChargeCodeMappingSrv.delete, {
                params: mapping.id,
                successCallBack: function() {
                    mapping.isDeleted = true;
                    $scope.state.deletedCount++;
                }
            });
        };
        //--------------------------------------------------------------------------------------------------------------
        /**
         * Initialization method for the controller
         */
        (function() {
            $scope.state = {
                revCenters: null,
                chargeCodes: null,
                deletedCount: 0,
                selected: null,
                mode: "",
                editRef: null,
                new: {
                    revenue_center_code: "",
                    category_name: "",
                    charge_code_id: "",
                    charge_code: ""
                }
            };

            $scope.mappings = mappedChargeCodes;
        })();
    }
]);