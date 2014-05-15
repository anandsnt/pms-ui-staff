sntRover.controller('UpdatePriceAndRestrictionsCtrl', ['$q', '$scope', 'ngDialog',
    function ($q, $scope, ngDialog) {
    	console.log($scope.calendarData);

        $scope.hideUpdatePriceAndRestrictionsDialog = function(){
            console.log('reached::hideUpdatePriceAndRestrictionsDialog');
            ngDialog.close();
        }
    }
]);