angular.module('sntPay').directive('payCtrlLoaderDir',
    ['$compile',
        function ($compile) {
            return {
                transclude: 'element',
                scope: {
                    'payCtrlLoaderDir': '='
                },
                link: function (scope, element, attr, ctrl, transclude) {
                    var el = null;

                    scope.$watch('payCtrlLoaderDir', function () {
                        if (el) {
                            el.remove();
                            el = null;
                        }

                        transclude(function (clone) {
                            // Load the appropriate controller
                            // TODO: Ensure the correct controller is loaded and not hardcoded like this for CBA
                            // TODO: Add the controller name in sntPayConfig under each PG and use that value here!
                            if (scope.payCtrlLoaderDir === 'CBA') {
                                clone.attr('ng-controller', 'payCBACtrl');

                            } else if (scope.payCtrlLoaderDir === 'MLI') {
                                clone.attr('ng-controller', 'payMLIOperationsController');
                            }
                            // Remove attribute so doesn't cause infinite
                            // recursion of compiling this directive

                            clone.removeAttr('pay-ctrl-loader-dir');

                            el = $compile(clone[0])(scope);
                            element.after(el);
                        });
                    });
                }
            };
        }]);
