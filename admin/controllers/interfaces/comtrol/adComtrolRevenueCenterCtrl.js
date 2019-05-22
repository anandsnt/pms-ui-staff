admin.controller('adComtrolRevenueCenterCtrl', ['$scope', 'adComtrolRevenueCenterSrv',
    function($scope, adComtrolRevenueCenterSrv) {

        // private methods and variables
        var resetNew = function() {
                $scope.state.new = {
                    name: "",
                    code: ""
                };
            },
            revertEdit = function() {
                if ($scope.state.editRef) {
                    $scope.revCenters[$scope.state.selected] = angular.copy($scope.state.editRef);
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
                successCallBack: function(response) {
                    $scope.revCenters.push({
                        id: response.id,
                        name: name,
                        code: code
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
                    revCenter.isDeleted = true;
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
                deletedCount: 0,
                selected: null,
                mode: "",
                editRef: null,
                new: {
                    name: "",
                    code: ""
                }
            };

          $scope.callAPI(adComtrolRevenueCenterSrv.fetch, {
            onSuccess: function (response) {
              $scope.revCenters = response;
            }
          });
        })();
    }
]);
