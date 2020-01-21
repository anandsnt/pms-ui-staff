admin.controller('adComtrolRevenueCenterCtrl', ['$scope', 'adComtrolRevenueCenterSrv', 'ngTableParams',
    function($scope, adComtrolRevenueCenterSrv, ngTableParams) {

        ADBaseTableCtrl.call(this, $scope, ngTableParams);

        /*
         * This methode is to set page count.
         * @param {number} page count
         */
        $scope.displayCountChanged = function(count) {
            $scope.displyCount = count;
        };

        // private methods and variables
        var resetNew = function() {
                $scope.state.new = {
                    name: "",
                    code: ""
                };
            },
            revertEdit = function() {
                if ($scope.state.editRef) {
                    $scope.data[$scope.state.selected] = angular.copy($scope.state.editRef);
                    $scope.state.editRef = null;
                }
            };

        // scope method and variables
        // -------------------------------------------------------------------------------------------------------------- ADD
        /**
         * Method to open the add form
         */
        $scope.onClickAdd = function() {
            $scope.state.mode = "ADD";
            $scope.state.selected = null;
            resetNew();
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
            var name = $scope.state.new.name,
                code = $scope.state.new.code;

            $scope.callAPI(adComtrolRevenueCenterSrv.create, {
                params: {
                    name: name,
                    code: code
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
        $scope.onSelect = function(idx, revCenter) {
            $scope.state.editRef = angular.copy(revCenter);
            $scope.state.selected = idx;
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
        $scope.onUpdate = function(revCenter) {
            $scope.callAPI(adComtrolRevenueCenterSrv.update, {
                params: revCenter,
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
        $scope.onClickDelete = function(revCenter) {
            $scope.callAPI(adComtrolRevenueCenterSrv.delete, {
                params: revCenter.id,
                successCallBack: function() {
                    $scope.tableParams.reload();
                }
            });
        };
        // --------------------------------------------------------------------------------------------------------------

        $scope.fetchTableData = function($defer, params) {
            var getParams = $scope.calculateGetParams(params),
                fetchSuccessOfItemList = function(data) {
                    $scope.$emit('hideLoader');
                    $scope.currentClickedElement = -1;
                    $scope.totalCount = data.total_records;
                    $scope.totalPage = Math.ceil(data.total_records / $scope.displyCount);
                    $scope.data = data.revenue_center_mappings;
                    $scope.currentPage = params.page();
                    params.total(data.total_records);
                    $defer.resolve($scope.data);
                };
            $scope.invokeApi(adComtrolRevenueCenterSrv.fetch, getParams, fetchSuccessOfItemList);
        };

        $scope.loadTable = function() {
            $scope.tableParams = new ngTableParams({
                page: 1, // show first page
                count: $scope.displyCount // count per page
            }, {
                total: 0, // length of data
                getData: $scope.fetchTableData
            });
        };

        /**
         * Initialization method for the controller
         */
        (function() {
            $scope.state = {
                deletedCount: 0,
                selected: null,
                mode: "",
                editRef: null,
                new: {
                    name: "",
                    code: ""
                }
            };
          $scope.loadTable();
        })();
    }
]);
