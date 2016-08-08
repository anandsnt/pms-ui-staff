/*
 * Number pagination directive - controller.
 */
sntRover.controller('rvPaginationCtrl', ['$scope', '$attrs', function($scope, $attrs) {
    //Initializing variables
    $scope.showCount    = 5;
    $scope.pageChange   = false;    //Variable for detecting external changes
    $scope.currentFocus = 1;        //For handling page no. list scroll
    /*
     *   Handle page scroll( Next/Prev actions )
     *   @param  {number} [Destination page number]
     */
    $scope.setScroll = function(page) {
        $scope.currentFocus = page;
        $scope.pageNoArray  = getPageNoArray($scope.currentFocus, $scope.pageOptions.totalPages, $scope.showCount);
    };

    /*
     *   Handle page navigation
     *   @param  {number} [Destination page number]
     */
    $scope.gotoPage = function(page) {

        if (page !== $scope.pageOptions.currentPage) {

            $scope.pageChange = true;
            $scope.pageOptions.currentPage = page;  

            // When the API doesn't need any additional params.
            if (typeof($scope.pageOptions.api) === "function") {
                $scope.pageOptions.api(page);       // invoking apiCall( pageNo )
            }
            // When the API need any additional params.
            // Expecting => api : [ apiCall , additional_params ]
            else {
                var apiCall = $scope.pageOptions.api[0],
                    params  = $scope.pageOptions.api.slice(1);
                params.push(page);
                apiCall.apply($scope, params);      // invoking apiCall( additional_params, pageNo )
            }
        }
    };

    /*
     *   Function to generate page no list on view
     *   @param  {number} current page, total pages, show count
     *   @return  {object} Object containing array of 3 no.s and two delimeter flags
     */
    var getPageNoArray = function(currentPage, totalPages, showCount) {

        var pageNoList = {
            firstDelim  : false,
            lastDelim   : false,
            numbers     : []
        };

        showCount = showCount || 5;     // Maximun number of page number buttons showing. default to 5.

        if (totalPages <= showCount) {
            for (var i = 2; i < totalPages; i++) {
                pageNoList.numbers.push(i);
            }
        }
        else if (currentPage < 4) {
            for (var i = 2; i <= 4; i++) {
                pageNoList.numbers.push(i);
            }
            pageNoList.lastDelim = true;
        }
        else if (currentPage >= (totalPages - 2)) {
            pageNoList.firstDelim = true;
            for (var i = totalPages - 3; i < totalPages; i++) {
                pageNoList.numbers.push(i);
            }
        }
        else {
            pageNoList.firstDelim = true;
            for (var i = currentPage - 1; i <= (currentPage + 1); i++) {
                pageNoList.numbers.push(i);
            }
            pageNoList.lastDelim = true;
        }

        return pageNoList;
    };

    /*
     *   Event to handle API callback
     *   @param  {string} [paginationId(optional)]
     */
    $scope.$on('updatePagination', function( event, paginationId ) {

        if (!($scope.pageOptions.id) || ($scope.pageOptions.id === paginationId)) {

            // Only either no pagination Id or both in match
            if ($scope.pageChange === true) {
                //Internal page transition
                $scope.pageChange = false;
            }
            else {
                //External page transition, set page to 1
                $scope.pageOptions.currentPage = 1;
            }

            if (typeof($scope.pageData) === "object") {
                $scope.totalCount = $scope.pageData.total_count;
            }
            else if (typeof($scope.pageData) !== "undefined") {
                $scope.totalCount = $scope.pageData;
            }
            else {
                console.error("rvPagination error : undefined pageData");
            }
            
            $scope.pageOptions.totalPages = Math.ceil($scope.totalCount / $scope.pageOptions.perPage);
            $scope.setScroll($scope.pageOptions.currentPage);
        }
    });
}]);
