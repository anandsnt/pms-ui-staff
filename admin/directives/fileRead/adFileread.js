// File reader directive - in HTML <input type="file" ng-model="image" accept="image/*" app-filereader />
admin.directive('appFilereader', function($q) {
    var slice = Array.prototype.slice;

    return {
        restrict: 'A'
        , require: '?ngModel'
        , scope: {
            fileNameKey: '@fileNameKey',
            emitData: '@emitData',
            fileChanged: '&fileChanged'
        }
        , link: function(scope, element, attrs, ngModel) {
            if (!ngModel) {
                return;
            }

            ngModel.$render = function() {};

            element.bind('change', function(e) {
                var element = e.target;

                $q.all(slice.call(element.files, 0).map(readFile))
                .then(function(values) {
                    if (element.multiple) {
                        ngModel.$setViewValue(values);
                    }
                    else {
                        ngModel.$setViewValue(values.length ? values[0] : null);
                    }
                });

                function readFile(file) {

                    var deferred = $q.defer();

                    var reader = new FileReader();

                    reader.onload = function(e) {
                    if (scope.emitData !== '') {
                         $('#' + scope.emitData).val(e.target.result);
                    }
                        deferred.resolve(e.target.result);
                    };
                    reader.onerror = function(e) {
                        deferred.reject(e);
                    };
                    reader.readAsDataURL(file);

                    if (typeof scope.fileNameKey !== 'undefined') {
                        scope.$parent[scope.fileNameKey] = file.name;
                    } else {
                        scope.$parent.fileName = file.name;
                    }
                    if (scope.$parent.fileChanged) {
                        scope.$parent.fileChanged({
                            'file': file
                        });
                    }
                    scope.$apply();
                    return deferred.promise;
                }

            });// change

        }// link

    };// return

})// appFilereader
;