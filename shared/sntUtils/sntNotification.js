angular.module('snt.utils').service('sntNotifySrv', [function () {
    var service = this;

    service.setConfiguration = function (type) {
        switch (type) {
            default:
                toastr.options.preventDuplicates = true;
        }
    };

    service.warn = function (message, type) {
        if (angular.isArray(message)) {
            message = message.join(', ');
        }

        service.setConfiguration(type || null);
        toastr.warning(message);
    };
}]);

angular.module('snt.utils').component('sntNotify', {
    template: '<div ng-if="!$ctrl.showToasts" ng-show="$ctrl.message"' +
        '           ng-class="{notice: $ctrl.message}"' +
        '           class="error error_message"' +
        '           ng-switch on="$ctrl.message.length"' +
        '           ng-click="$ctrl.clearErrorMessage()">' +
        '               <span class="close-btn" ng-click="$ctrl.clearErrorMessage()"></span>' +
        '               <span ng-switch-when="1">{{$ctrl.message[0]}}</span>' +
        '               <span ng-switch-default>' +
        '                  <span ng-repeat="item in $ctrl.message track by $index" >' +
        '                     <span ng-if=!$last>{{item}},</span>' +
        '                     <span ng-if=$last> {{item}}</span>' +
        '                  </span>' +
        '               </span>' +
        '       </div>',
    transclude: true,
    bindings: {
        message: '<'
    },
    controller: ['sntNotifySrv', 'Toggles', function (sntNotifySrv, Toggles) {
        var ctrl = this;

        ctrl.clearErrorMessage = function () {
            this.message = '';
        };

        // Initialize
        (function () {
            ctrl.showToasts = Toggles.isEnabled('show_toast_notifications');

            // Initialize the listener only if the feature is enabled for this property
            if (ctrl.showToasts) {
                ctrl.$onChanges = function (changes) {
                    changes['message'] = changes['message'] || {};
                    if (changes['message'].currentValue) {
                        sntNotifySrv.warn(changes['message'].currentValue);
                    }
                };
            }
        })();
    }]
});
