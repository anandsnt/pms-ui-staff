sntRover.controller('RVReportAnalyticsCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    function($scope, $rootScope, $state) {

        BaseCtrl.call(this, $scope);

        document.getElementById("report-iframe").src = "https://sisense-dev.stayntouch.com/app/main#/home";

    }
]);