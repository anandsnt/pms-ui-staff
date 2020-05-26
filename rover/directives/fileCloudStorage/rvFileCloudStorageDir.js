sntRover.directive('rvFileCloudStorage', function() {
    return {
        restrict: 'AE',
        replace: 'true',
        scope: {
            cardType: '@',
            cardId: '@'
        },
        templateUrl: '/assets/directives/fileCloudStorage/partials/rvFileCloudStorage.html',
        controller: 'rvFileCloudStorageAndNotesCtrl'
    };
});