angular.module('sntNotification', ['sntFeatureToggles']);

angular.module('sntNotification').service('sntNotifySrv', [function () {
    var service = this;

    service.warn = function (params) {
        toastr.warning(params.message, params.title);
    };
}]);

angular.module('sntNotification').component('sntNotify', {
    template: '<div ng-show="$ctrl.message"' +
        '           ng-class="{notice: $ctrl.message}"' +
        '           class="error error_message"' +
        '           ng-switch on="$ctrl.message.length"' +
        '           ng-click="clearErrorMessage()">' +
        '               <span class="close-btn" ng-click="clearErrorMessage()"></span>' +
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
    controller: ['sntNotifySrv', function (sntNotifySrv) {
        var ctrl = this;

        ctrl.$onChanges = function (changes) {
            changes['message'] = changes['message'] || {};
            if (changes['message'].currentValue) {
                sntNotifySrv.warn(changes['message'].currentValue);
            }
        };
    }]
});
