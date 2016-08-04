/**
 * @author : QBurst
 * Date    : 14/07/2016
 */

sntRover.directive('rvPagination', function() {
    var linkFn = function($scope, element, attr) {
        var pageOptions = {
            perPage: 50,
            currentPage: 1,
            totalPages: 1,
            startCount: 1,
            endCount: 1
        }; // To fill essential variables in page options
        // var displayText = {
        //     next: "NEXT",
        //     prev: "PREVIOUS"
        // }; //Default display text
        if (!($scope.pageOptions.api)) {
            console.error("rvPagination error : pageOptions should contain api referance");
        }
        //To add missing params
        $scope.pageOptions = angular.extend(pageOptions, $scope.pageOptions);
        $scope.displayText = angular.extend(displayText, $scope.displayText);
    };
    return {
        restrict: 'AE',
        templateUrl: '/assets/directives/pagination/rvPagination.html',
        scope: {
            pageOptions: '=pageOptions',
            pageData: '=pageData'
            // displayText: '=?displayText'
        },
        controller: 'paginationCtrl',
        link: linkFn
    };
});
