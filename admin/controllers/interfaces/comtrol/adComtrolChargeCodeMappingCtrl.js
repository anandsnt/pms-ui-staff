admin.controller('adComtrolChargeCodeMappingCtrl', ['$scope', 'adComtrolChargeCodeMappingSrv', 'COMTROL_REF',
  function ($scope, adComtrolChargeCodeMappingSrv, COMTROL_REF) {

    // private methods and variables
    var resetNew = function () {
      $scope.state.new = {
        revenue_center_code: "",
        category_name: "",
        charge_code_name: "",
        is_default: false
      };
    },
    revertEdit = function () {
      if ($scope.state.editRef) {
        $scope.mappings[$scope.state.selected] = angular.copy($scope.state.editRef);
        $scope.state.editRef = null;
      }
    },
    loadMetaList = function (cb) {
      $scope.callAPI(adComtrolChargeCodeMappingSrv.fetchMeta, {
        successCallBack: function (response) {
          $scope.state.revCenters = response.revCenters;
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
    $scope.onClickAdd = function () {
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
    $scope.onCancelAdd = function () {
      $scope.state.mode = "";
    };

    /**
     * Method to save a new Revenue Center
     * NOTE: Mandatory check is done on the templates
     */
    $scope.onSave = function () {
      var revenue_center_code = $scope.state.new.revenue_center_code,
        category_name = $scope.state.new.category_name,
        is_default = $scope.state.new.is_default,
        charge_code_name = $scope.state.new.charge_code_name;

      $scope.callAPI(adComtrolChargeCodeMappingSrv.create, {
        params: {
          revenue_center_code: revenue_center_code,
          category_name: category_name,
          charge_code_name: charge_code_name,
          is_default: is_default
        },
        successCallBack: function (response) {
          if (is_default) {
            _.each($scope.mappings, function (obj) {
              obj.is_default = false;
            });
          }

          $scope.mappings.push({
            id: response.id,
            revenue_center_code: revenue_center_code,
            category_name: category_name,
            charge_code_name: charge_code_name,
            is_default: is_default
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
    $scope.onSelect = function (idx, mapping) {
      if ($scope.state.revCenters) {
        $scope.state.editRef = angular.copy(mapping);
        $scope.state.selected = idx;
      } else {
        loadMetaList(function () {
          $scope.state.editRef = angular.copy(mapping);
          $scope.state.selected = idx;
        });
      }
    };

    /**
     * Method to close the edit form
     */
    $scope.onCancelEdit = function () {
      $scope.state.mode = "";
      revertEdit();
      $scope.state.selected = null;
    };

    /**
     * Method to update a revenue Center
     * NOTE: Mandatory check is done on the templates
     * @param revCenter
     */
    $scope.onUpdate = function (mapping) {
      $scope.callAPI(adComtrolChargeCodeMappingSrv.update, {
        params: mapping,
        successCallBack: function () {
          if (mapping.is_default) {
            _.each($scope.mappings, function (obj) {
              obj.is_default = false;
            });
            mapping.is_default = true;
          }
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
    $scope.onClickDelete = function (mapping) {
      $scope.callAPI(adComtrolChargeCodeMappingSrv.delete, {
        params: mapping.id,
        successCallBack: function () {
          mapping.isDeleted = true;
          $scope.state.deletedCount++;
        }
      });
    };

    $scope.getCategoryName = function (externalCategoryName) {
      var mappedExternalCode = _.find(COMTROL_REF.POS_POSTING_CATEGORIES, {
        code: externalCategoryName
      });

      return mappedExternalCode && mappedExternalCode.value;
    };

    $scope.getRevenueCenterName = function (revenueCenterCode) {
      var revenueCenter = _.find($scope.state.revCenters, {
        code: revenueCenterCode
      });

      return revenueCenter && revenueCenter.name;
    };

    $scope.getChargeCodeDescription = function (chargeCodeName) {
      var chargeCode = _.find($scope.state.chargeCodes, {
        name: chargeCodeName
      });

      return chargeCode && chargeCode.description;
    };

    $scope.onToggleDefault = function (mapping) {
      /**
       * In case, the user is turning one entry from a type as default
       * SET ALL OTHERS as not default
       */
      if (!mapping.is_default) {
        _.each($scope.mappings, function (obj) {
          obj.is_default = false;
        });
      }
      mapping.is_default = !mapping.is_default;
      $scope.callAPI(adComtrolChargeCodeMappingSrv.update, {
        params: mapping,
        successCallBack: function () {
          $scope.state.mode = '';
          $scope.state.selected = null;
        }
      });
    };

    // --------------------------------------------------------------------------------------------------------------
    /**
     * Initialization method for the controller
     */
    (function () {
      $scope.state = {
        revCenters: null,
        chargeCodes: null,
        categories: COMTROL_REF.POS_POSTING_CATEGORIES,
        deletedCount: 0,
        selected: null,
        mode: '',
        editRef: null,
        new: {
          revenue_center_code: "",
          category_name: "",
          charge_code_name: "",
          is_default: false
        }
      };

      $scope.callAPI(adComtrolChargeCodeMappingSrv.fetch, {
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
