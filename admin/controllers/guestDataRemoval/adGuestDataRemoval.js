admin.controller('ADGuestDataRemovalCtrl', [
    '$scope',
    'ngDialog',
    'adGuestDataRemovalSrv',
    function ($scope, ngDialog, adGuestDataRemovalSrv) {
        BaseCtrl.call(this, $scope);

        $scope.confirmSave = function() {
            if ($scope.GDRSettings.chain_hotels_count > 1) {
                ngDialog.open({
                    template: '/assets/partials/guestDataRemoval/adConfirmSaveDailog.html',
                    className: 'ngdialog-theme-default',
                    scope: $scope
                });
            } else {
                $scope.updateGuestDataRemovalSettings();
            }
        };
        $scope.closeDialog = function() {
            ngDialog.close();
        };
        $scope.updateGuestDataRemovalSettings = function() {
            $scope.callAPI(adGuestDataRemovalSrv.updateGDRSettings, {
                params: {
                    automatic_guest_data_removal: $scope.GDRSettings.automatic_guest_data_removal,
                    no_of_days_after_last_checkout: parseInt($scope.GDRSettings.no_of_days_after_last_checkout)
                },
                onFailure: function(err) {
                    $scope.errorMessage = err;
                    $scope.closeDialog();
                },
                onSuccess: function (response) {
                    $scope.GuestDataRemovalSettings = response.data;
                    $scope.successMessage = 'Guest data settings updated';
                    $scope.closeDialog();
                }
            });
        };
        // Initialize the controller
        var init = function () {
                fetchGuestDataRemovalSettings();
            },
            fetchGuestDataRemovalSettings = function() {
                $scope.callAPI(adGuestDataRemovalSrv.initSync, {
                    params: {},
                    onSuccess: function (response) {
                        $scope.GDRSettings = response.data;
                    },
                    onFailure: function(err) {
                        $scope.errorMessage = err;
                    }
                });
            };

        init();
    }]);
