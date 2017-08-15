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
                selected_subscriptions: 'RESERVATIONS',
                webhook_type: 'mlife',
                webhook_types: [{
                    id: 1,
                    name: 'mLife'
                }]
            };
        })();
    }
]);
