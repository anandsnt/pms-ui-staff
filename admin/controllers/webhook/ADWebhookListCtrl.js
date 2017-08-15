angular.module('admin').controller('ADWebhookListCtrl', ['$scope', 'webHooks', 'ADWebhookSrv',
    function ($scope, webHooks, ADWebhookSrv) {


        $scope.meta = null;

        var loadMeta = function (cb) {
            $scope.callAPI(ADWebhookSrv.fetchMeta, {
                successCallBack: function (response) {
                    $scope.meta = {
                        deliveryTypes: response['DELIVERY_TYPES'],
                        events: response['EVENTS']
                    };
                    cb();
                }
            });
        };

        var resetNewWebhook = function () {
            $scope.state.new = {
                'url': '',
                'delivery_type': '',
                'availableEvents': angular.fromJson(angular.toJson($scope.meta.events)),
                'subscriptions': []
            };
        };


        $scope.onClickAdd = function () {
            if ($scope.meta) {
                resetNewWebhook();
                $scope.state.mode = 'ADD';
            } else {
                loadMeta(function () {
                    resetNewWebhook();
                    $scope.state.mode = 'ADD';
                });
            }
        };

        $scope.onCancelAdd = function () {
            $scope.state.mode = '';
        };

        $scope.onSave = function () {
            $scope.state.new.subscriptions = _.map(_.filter($scope.state.new.availableEvents, {
                selected: true
            }), 'value');

            $scope.callAPI(ADWebhookSrv.save, {
                params: $scope.state.new,
                successCallBack: function (response) {
                    if (response.status) {
                        $scope.webHooks.push(response.data);
                        $scope.totalCount++;
                        $scope.state.mode = '';
                    } else {
                        $scope.errorMessage = ['FAILURE'];
                    }
                }
            });
        };

        $scope.$on('SELECTION_CHANGED', function () {
            var selected = _.map(_.filter($scope.state.new.availableEvents, {
                selected: true
            }), 'value');

            if ($scope.state.mode === 'ADD') {
                $scope.state.new.selectedEvents = selected.join(', ');
            }
        });

        (function () {
            $scope.webHooks = webHooks;
            $scope.totalCount = webHooks.length;
            $scope.state = {};
        })();
    }
])
;
