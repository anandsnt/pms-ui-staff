sntRover.controller('UpdatePriceAndRestrictionsCtrl', ['$q', '$scope', 'ngDialog',
    function ($q, $scope, ngDialog) {

        $scope.hideUpdatePriceAndRestrictionsDialog = function(){
            console.log('reached::hideUpdatePriceAndRestrictionsDialog');
            ngDialog.close();
        }
    }
]);