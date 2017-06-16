admin.service('ADInterfaceLogsSrv', ['$http', '$q', 'ADBaseWebSrvV2',
    function($http, $q, ADBaseWebSrvV2) {

        var service = this;

        /**
         *
         * @return {deferred.promise|{then, catch, finally}} Promise for a request to fetch the list of interfaces
         */
        service.fetchInterfaces = function() {
            return ADBaseWebSrvV2.getJSON('/admin/hotel_ext_interfaces');
        };

        /**
         *
         * @return {deferred.promise|{then, catch, finally}} Promise for a request to fetch current hotel time
         */
        service.getTime = function() {
            return ADBaseWebSrvV2.getJSON('/api/hotel_current_time');
        };

        service.search = function(params) {
            return ADBaseWebSrvV2.getJSON('/admin/interface_messages', params);
        };

        service.download = function(params) {
            var deferred = $q.defer();

            $http({
                method: 'GET',
                url: params.url,
                data: params.payload
            }).then(function(response) {

                var data = response.data,
                    headers = response.headers,
                    hiddenAnchor = angular.element('<a/>'),
                    blob = new Blob([data]);

                hiddenAnchor.attr({
                    href: window.URL.createObjectURL(blob),
                    target: '_blank',
                    download: headers()['content-disposition'].match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)[1].replace(/['"]+/g, '')
                });

                // The below solution is from
                // http://stackoverflow.com/questions/24673612/element-click-does-not-work-in-firefox-and-ie-but-works-in-chrome
                if (document.createEvent) {
                    var ev = document.createEvent("MouseEvent");

                    ev.initMouseEvent(
                        "click",
                        true /* bubble */, true /* cancelable */,
                        window, null,
                        0, 0, 0, 0, /* coordinates */
                        false, false, false, false, /* modifier keys */
                        0 /* left*/, null
                    );
                    hiddenAnchor[0].dispatchEvent(ev);
                } else {
                    hiddenAnchor[0].fireEvent("onclick");
                }

                deferred.resolve(true);
            }, function(response) {
                deferred.reject(response.errorMessage);
            });
            return deferred.promise;
        };
    }
]);
