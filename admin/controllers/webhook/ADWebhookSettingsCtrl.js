angular.module('admin').controller('ADWebhookSettingsCtrl', ['$scope',
    function ($scope) {

        $scope.subscriptions = [{
            label: 'All Events',
            value: 'ALL',
            children: [{
                label: 'Reservations',
                value: 'RESERVATIONS',
                selected: true
            }, {
                label: 'Housekeeping',
                value: 'HOUSEKEEPING'
            }]
        }];

        (function () {
            $scope.name = '';
            $scope.config = {
                webhook_type: 1,
                webhook_types: [{
                    id: 1,
                    name: 'mLife'
                }]
            };
        })();
    }
]);
