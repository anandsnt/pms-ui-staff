angular.module('snt.utils').service('sntNotifySrv', [function () {
    var service = this;

    service.setConfiguration = function (type) {
        switch (type) {
            default:
                toastr.options.preventDuplicates = true;
                toastr.options.showDuration = 1000;
                toastr.options.hideDuration = 1000;
                toastr.options.timeOut = 8000;
        }
    };

    service.show = function (message, type) {
        if (angular.isArray(message)) {
            message = message.join(', ');
        }

        service.setConfiguration(type || null);
        toastr[type || 'warning'](message);
    };
}]);

angular.module('snt.utils').component('sntNotify', {
    template: '<div ng-if="!$ctrl.showToasts" ng-show="$ctrl.message && $ctrl.message.length"' +
        '           ng-class="$ctrl.style"' +
        '           ng-click="$ctrl.clearErrorMessage()">' +
        '               <section ng-if="$ctrl.type === \'success\'">' +
        '                   <span>{{$ctrl.message}}</span>' +
        '               </section>' +
        '               <section ng-if="$ctrl.type !== \'success\'"' +
        '                  ng-switch on="$ctrl.message.length">' +
        '                  <span class="close-btn" ng-click="$ctrl.clearErrorMessage()"></span>' +
        '                  <span ng-switch-when="1">{{$ctrl.message[0]}}</span>' +
        '                  <span ng-switch-default>' +
        '                     <span ng-repeat="item in $ctrl.message track by $index" >' +
        '                        <span ng-if=!$last>{{item}},</span>' +
        '                        <span ng-if=$last> {{item}}</span>' +
        '                     </span>' +
        '                  </span>' +
        '               </section>' +
        '       </div>',
    transclude: true,
    bindings: {
        message: '=',
        type: '@'
    },
    controller: ['sntNotifySrv', 'Toggles', function (sntNotifySrv, Toggles) {
        var ctrl = this;

        ctrl.clearErrorMessage = function () {
            this.message = '';
        };


        ctrl.$onInit = function () {
            var currentMsg;

            ctrl.style = 'notice';
            ctrl.style += (ctrl.type === 'success') ? ' success success-message' : ' error error-message';

            ctrl.showToasts = Toggles.isEnabled('show_toast_notifications');

            ctrl.$doCheck = function () {
                if (currentMsg !== this.message) {
                    currentMsg = this.message;
                    if (ctrl.showToasts && this.message) {
                        sntNotifySrv.show(this.message, ctrl.type);
                    }
                }
                
            };

        };
    }]
});
