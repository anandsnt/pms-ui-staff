angular.module('admin').controller('ADWebhookListCtrl', ['$scope', 'webHooks', 'ADWebhookSrv',
    function ($scope, webHooks, ADWebhookSrv) {

        var listeners = [],
            loadMeta = function (cb) {
                $scope.callAPI(ADWebhookSrv.fetchMeta, {
                    successCallBack: function (response) {
                        $scope.meta = {
                            deliveryTypes: response['DELIVERY_TYPES'],
                            events: response['EVENTS']
                        };
                        cb();
                    }
                });
            },
            buildWebHookSupportingEvents = function (deliveryType) {
              supportedEvents = webHookSupportingEvents(deliveryType, $scope.meta.deliveryTypes);
              $scope.meta[deliveryType] = {events: supportedEvents};
              return $scope.meta[deliveryType].events;
            },
            webHookSupportingEvents = function (deliveryType, deliveryTypes) {
              var supportedEvents = [],
                  eventsTable = {};
              deliveryTypeEvents = _.find(deliveryTypes, {
                                      delivery_type: deliveryType
                                    }).supporting_events;

              _.each(deliveryTypeEvents, function (event) {
                eventsTable[event] = true;
              });

              _.each($scope.meta.events, function(event) {
                if(eventsTable[event.value]){
                  supportedEvents.push(event);
                }
              });

              return supportedEvents;
            },
            resetNewWebhook = function () {
                $scope.state.new = {
                    'url': '',
                    'delivery_type': '',
                    'availableEvents': getTreeSelectorData($scope.meta.events, []),
                    'subscriptions': []
                };
            },
            revertEdit = function () {
                if ($scope.state.editRef) {
                    $scope.webHooks[$scope.state.selected] = angular.copy($scope.state.editRef);
                    $scope.state.editRef = null;
                }
            },
            getTreeSelectorData = function (available, selected) {
                available = angular.fromJson(angular.toJson(available));

                _.each(available, function (event) {
                    if (selected.indexOf(event.value) > -1) {
                        event.selected = true;
                    }
                });

                return available;
            },
            canEditEvents = function (deliveryTypes, deliveryType) {
                return !(_.find(deliveryTypes, {
                    delivery_type: deliveryType
                }).preset_subscription);
            },
            initListeners = function () {
                listeners['SELECTION_CHANGED'] = $scope.$on('SELECTION_CHANGED', function () {
                    var selected,
                        webHook;

                    if ($scope.state.mode === 'ADD') {
                        selected = _.map(_.filter($scope.state.new.availableEvents, {
                            selected: true
                        }), 'value');
                        $scope.state.new.selectedEvents = selected.join(', ');
                    } else {
                        webHook = $scope.webHooks[$scope.state.selected];
                        selected = _.map(_.filter(webHook.availableEvents, {
                            selected: true
                        }), 'value');
                        webHook.selectedEvents = selected.join(', ');
                    }
                });


                $scope.$on('$destroy', listeners['SELECTION_CHANGED']);
            };

        $scope.onClickAdd = function () {
            $scope.state.selected = null;
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
            if ($scope.state.new.canEditEvents) {
                $scope.state.new.subscriptions = _.map(_.filter($scope.state.new.availableEvents, {
                    selected: true
                }), 'value');
            } else {
                $scope.state.new.subscriptions = [];
            }

            $scope.callAPI(ADWebhookSrv.save, {
                params: $scope.state.new,
                successCallBack: function (response) {
                    if (response.status) {
                        $scope.webHooks.push(response.data.webhook);
                        $scope.totalCount++;
                        $scope.state.mode = '';
                    } else {
                        $scope.errorMessage = ['FAILURE'];
                    }
                }
            });
        };

        $scope.onWebHookTypeChange = function (value, webHook) {
            webHook.canEditEvents = canEditEvents($scope.meta.deliveryTypes, webHook.delivery_type);
            $scope.state.new.availableEvents = $scope.meta[webHook.delivery_type] ?
                                    $scope.meta[webHook.delivery_type].events :
                                    buildWebHookSupportingEvents(webHook.delivery_type);
        };

        $scope.onToggleActive = function (webHook) {
            webHook.active = !webHook.active;
            $scope.callAPI(ADWebhookSrv.update, {
                params: webHook,
                successCallBack: function () {
                    $scope.state.mode = '';
                    $scope.state.selected = null;
                }
            });
        };

        $scope.onClickDelete = function (webHook) {
            $scope.callAPI(ADWebhookSrv.delete, {
                params: webHook,
                successCallBack: function () {
                    webHook.isDeleted = true;
                    $scope.state.deletedCount++;
                }
            });
        };

        $scope.onCancelEdit = function () {
            $scope.state.mode = '';
            revertEdit();
            $scope.state.selected = null;
        };

        $scope.onUpdate = function (webHook) {
            if (webHook.canEditEvents) {
                webHook.subscriptions = _.map(_.filter(webHook.availableEvents, {
                    selected: true
                }), 'value');
            } else {
                webHook.subscriptions = [];
            }

            $scope.callAPI(ADWebhookSrv.update, {
                params: webHook,
                successCallBack: function () {
                    $scope.state.mode = '';
                    $scope.state.selected = null;
                }
            });
        };

        $scope.onSelect = function (idx, webHook) {
            var showEdit = function () {
                $scope.state.editRef = angular.copy(webHook);
                webHook.availableEvents = getTreeSelectorData($scope.meta.events, webHook.subscriptions);
                webHook.selectedEvents = webHook.subscriptions.join(', ');
                webHook.canEditEvents = canEditEvents($scope.meta.deliveryTypes, webHook.delivery_type);
                $scope.state.selected = idx;
            };

            if ($scope.state.meta) {
                showEdit();
            } else {
                loadMeta(showEdit);
            }
        };

        $scope.testURLConnectivity = function(webHook) {
            webHook.testMessage = {};
            $scope.callAPI(ADWebhookSrv.testURLConnectivity, {
                params: {
                    url: webHook.url
                },
                successCallBack: function(response) {
                    webHook.testMessage = response;
                }
            });
        };

        (function () {
            $scope.meta = null;
            $scope.webHooks = webHooks;
            $scope.totalCount = webHooks.length;

            $scope.state = {
                deletedCount: 0,
                mode: ''
            };

            initListeners();

        })();
    }
]);
