sntRover.directive('rvFileCloudStorage', function() {
    return {
        restrict: 'AE',
        replace: 'true',
        scope: {
            cardType: '@',
            cardId: '@',
            showFiles: '='
        },
        templateUrl: '/assets/directives/fileCloudStorage/partials/rvFileCloudStorage.html',
        controller: 'rvFileCloudStorageAndNotesCtrl'
    };
});


sntRover.directive('imgError', function() {
  return {
    link: function(scope, element, attrs) {
      element.bind('error', function() {
        element.attr('src', '/assets/images/preview_image.png');
      });
    }
  };
});