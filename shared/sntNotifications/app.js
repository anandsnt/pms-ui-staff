angular.module('sntNotification', []);

angular.module('sntNotification').service('sntNotifySrv', [function () {
    var service = this;

    service.warn = function (params) {
        toastr.warning(params.message, params.title);
    };
}]);

angular.module('sntNotification').directive('sntNotify', function () {
    return {
        link: function (scope, element, attrs) {
            attrs.$observe('sntNotify', function (present, past) {
                if (present) {
                    angular.fromJson(present).forEach(message => {
                        toastr.warning(message, 'ERR');
                    });
                }
            });
        }
    };
});
