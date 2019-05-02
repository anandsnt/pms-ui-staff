admin.controller('adComtrolGenericMappingCtrl', ['$scope', 'adComtrolGenericMappingSrv', 'COMTROL_REF',
    function($scope, adComtrolGenericMappingSrv, COMTROL_REF) {

        // CICO-42895 This value doesn't change
        var _TIP_CHARGE_CODE_EXT_VALUE = 295;

        // private methods and variables
        var resetNew = function() {
                $scope.state.new = {
                    external_type: "",
                    charge_code_name: "",
                    external_code: "",
                    is_default: false
                };
            },
            revertEdit = function() {
                if ($scope.state.editRef) {
                    $scope.mappings[$scope.state.selected] = angular.copy($scope.state.editRef);
                    $scope.state.editRef = null;
                }
            },
            loadMetaList = function(cb) {
                $scope.callAPI(adComtrolGenericMappingSrv.fetchMeta, {
                    successCallBack: function(response) {
                        $scope.state.chargeCodes = response.chargeCodes;
                        cb && cb();
                    }
                });
            };

        // scope method and variables
        // -------------------------------------------------------------------------------------------------------------- ADD
        /**
         * Method to open the add form
         */
        $scope.onClickAdd = function() {
            if ($scope.state.chargeCodes) {
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
            var external_type = $scope.state.new.external_type,
                external_code = $scope.state.new.external_code,
                is_default = $scope.state.new.is_default,
                charge_code_name = $scope.state.new.charge_code_name;

            $scope.callAPI(adComtrolGenericMappingSrv.create, {
                params: {
                    external_type: external_type,
                    external_code: external_code,
                    is_default: is_default,
                    charge_code_name: charge_code_name
                },
                successCallBack: function(response) {
                    if (is_default) {
                        var similar_types = _.where($scope.mappings, {external_type: external_type});

                        _.each(similar_types, function(obj) {
                            obj.is_default = false;
                        });
                    }

                    $scope.mappings.push({
                        id: response.id,
                        external_type: external_type,
                        external_code: external_code,
                        is_default: is_default,
                        charge_code_name: charge_code_name
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
            if ($scope.state.chargeCodes) {
                $scope.state.editRef = angular.copy(mapping);
                $scope.state.selected = idx;
            } else {
                loadMetaList(function() {
                    $scope.state.editRef = angular.copy(mapping);
                    $scope.state.selected = idx;
                });
            }
        };

        $scope.onToggleDefault = function(mapping) {
            /**
             * In case, the user is turning one entry from a type as default
             * SET ALL OTHERS in that type as not default
             */
            if (!mapping.is_default) {
                var similar_types = _.where($scope.mappings, {external_type: mapping.external_type});

                _.each(similar_types, function(obj) {
                    obj.is_default = false;
                });
            }
            mapping.is_default = !mapping.is_default;
            $scope.callAPI(adComtrolGenericMappingSrv.update, {
                params: mapping,
                successCallBack: function() {
                    $scope.state.mode = "";
                    $scope.state.selected = null;
                }
            });
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
         * Method to update a generic Mapping
         * NOTE: Mandatory check is done on the templates
         * @param mapping
         */
        $scope.onUpdate = function(mapping) {
            $scope.callAPI(adComtrolGenericMappingSrv.update, {
                params: mapping,
                successCallBack: function() {
                    var similar_types;

                    if (mapping.is_default) {
                        similar_types = _.where($scope.mappings, {external_type: mapping.external_type});

                        _.each(similar_types, function(obj) {
                            obj.is_default = false;
                        });
                        mapping.is_default = true;
                    }
                    $scope.state.mode = "";
                    $scope.state.selected = null;
                }
            });
        };

        $scope.getChargeCodeDescription = function(chargeCodeName) {
            var chargeCode = _.find($scope.state.chargeCodes, {
                name: chargeCodeName
            });

            return chargeCode && chargeCode.description;
        };

        // -------------------------------------------------------------------------------------------------------------- DELETE
        /**
         * Method to delete a Generic Mapping
         * Deleted ones are  hidden in UI with help of isDeleted flag
         * @param mapping
         */
        $scope.onClickDelete = function(mapping) {
            $scope.callAPI(adComtrolGenericMappingSrv.delete, {
                params: mapping.id,
                successCallBack: function() {
                    mapping.isDeleted = true;
                    $scope.state.deletedCount++;
                }
            });
        };


        $scope.getExternalType = function(externalTypeCode) {
            var mappedExternalCode = _.find(COMTROL_REF.FOLIO_POSTING_TRANSACTION_CODE, {
                code: externalTypeCode
            });

            return mappedExternalCode && mappedExternalCode.value;
        };

        $scope.onChangeExternalType = function () {
            if ($scope.state.new.external_type === 'tip_charge_code') {
                $scope.state.new.external_code = _TIP_CHARGE_CODE_EXT_VALUE;
            } else {
                $scope.state.new.external_code = '';
            }
        };

        $scope.onChangeMappingExternalType = function (externalType, mapping) {
            if (externalType === 'tip_charge_code') {
                mapping.external_code = _TIP_CHARGE_CODE_EXT_VALUE;
            } else {
                mapping.external_code = '';
            }
        };

        // --------------------------------------------------------------------------------------------------------------
        /**
         * Initialization method for the controller
         */
        (function() {
            $scope.state = {
                extTypes: COMTROL_REF.FOLIO_POSTING_TRANSACTION_CODE,
                extCodes: COMTROL_REF.PHONE_CALL_TYPES,
                chargeCodes: null,
                deletedCount: 0,
                selected: null,
                mode: "",
                editRef: null,
                new: {
                    external_type: "",
                    charge_code_name: "",
                    external_code: "",
                    is_default: false
                }
            };

          $scope.callAPI(adComtrolGenericMappingSrv.fetch, {
            onSuccess: function (response) {
              $scope.mappings = response;

              if ($scope.mappings.length) {
                loadMetaList();
              }
            }
          });
        })();
    }
]);
