admin.service('ADIdLookupSrv', ['$http', '$q', 'ADBaseWebSrvV2',
    function($http, $q, ADBaseWebSrvV2) {

        var service = this;

		service.search = function(params) {
            var deferred = $q.defer();

            ADBaseWebSrvV2.getJSON('/admin/id_lookup', params).then(function(response) {
                deferred.resolve(response);
            }, function(response) {
                deferred.reject(response.errors || response);
            });
            return deferred.promise;
        };

        service.exportCSV = function(params) {
            var deferred = $q.defer();

            $http({
                method: 'POST',
                url: '/admin/id_lookup/export.csv?entity='+ params.entity
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
                }
                else {
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
