angular.module('snt.utils')
    .service('sntLoadScriptSrv', ['$q', '$timeout',
        function ($q, $timeout) {
            var service = this,
                libraryServices = {};

            service.loadScript = function (url) {
                var deferred = $q.defer();

                if (libraryServices[url]) {
                    $timeout(function () {
                        deferred.resolve();
                    }, 100);
                } else {
                    $.getScript(url)
                        .done(function () {
                            libraryServices[url] = true;
                            deferred.resolve();
                        })
                        .fail(function (jqxhr, settings, exception) {
                            deferred.reject(exception);
                        });
                }
                
                return deferred.promise;
            };
        }]);