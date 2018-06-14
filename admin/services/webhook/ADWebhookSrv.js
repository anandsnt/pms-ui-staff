angular.module('admin').service('ADWebhookSrv', ['$http', '$q', 'ADBaseWebSrvV2',
    function ($http, $q, ADBaseWebSrvV2) {
        var service = this,
            cache = {};

        service.fetchWebHooks = function () {
            var deferred = $q.defer(),
                url = 'admin/webhooks',
                webHooks;


            ADBaseWebSrvV2.getJSON(url).then(function (response) {
                webHooks = (response.data && response.data.webhooks) || [];
                deferred.resolve(webHooks);
            }, function (data) {
                deferred.reject(data);
            });

            return deferred.promise;
        };


        service.getDeliveryTypes = function () {
            var deferred = $q.defer(),
                url = 'admin/webhooks/delivery_types';

            if (cache['DELIVERY_TYPES']) {
                deferred.resolve(cache['DELIVERY_TYPES']);
            } else {
                ADBaseWebSrvV2.getJSON(url).then(function (response) {
                    var supportingEvents = (response.data && response.data.delivery_types) || [];

                    cache['DELIVERY_TYPES'] = supportingEvents;
                    deferred.resolve(supportingEvents);
                }, function (data) {
                    deferred.reject(data);
                });
            }

            return deferred.promise;
        };


        service.getSupportedEvents = function () {
            var deferred = $q.defer(),
                url = 'admin/webhooks/supporting_events';

            if (cache['EVENTS']) {
                deferred.resolve(cache['EVENTS']);
            } else {
                ADBaseWebSrvV2.getJSON(url).then(function (response) {
                    var supportingEvents = (response.data && response.data.supporting_events) || [],
                        arrEvents = [];

                    _.each(supportingEvents, function (event) {
                        arrEvents.push({
                            label: event,
                            value: event
                        });
                    });

                    cache['EVENTS'] = arrEvents;
                    deferred.resolve(arrEvents);
                }, function (data) {
                    deferred.reject(data);
                });
            }
            return deferred.promise;
        };


        service.fetchMeta = function () {
            var deferred = $q.defer(),
                promises = [];

            promises.push(service.getDeliveryTypes());
            promises.push(service.getSupportedEvents());

            $q.all(promises).then(function () {
                deferred.resolve(cache);
            }, function (errorMessage) {
                deferred.reject(errorMessage);
            });

            return deferred.promise;
        };


        service.save = function (params) {
            var deferred = $q.defer();
            var url = 'admin/webhooks';

            ADBaseWebSrvV2.postJSON(url, params).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });

            return deferred.promise;
        };

        service.update = function (params) {
            var deferred = $q.defer();
            var url = 'admin/webhooks/' + params.uuid;

            ADBaseWebSrvV2.putJSON(url, params).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });

            return deferred.promise;
        };

        service.delete = function (params) {
            var deferred = $q.defer();
            var url = 'admin/webhooks/' + params.uuid;

            ADBaseWebSrvV2.deleteJSON(url).then(function (response) {
                if (response.status) {
                    deferred.resolve(response);
                } else {
                    deferred.reject(response.errors);
                }
            }, function (data) {
                deferred.reject(data);
            });

            return deferred.promise;
        };


        service.testURLConnectivity = function(params) {
            var url = '/admin/webhooks/test_url';
            
            return ADBaseWebSrvV2.postJSON(url, params);
        };
    }
]);
