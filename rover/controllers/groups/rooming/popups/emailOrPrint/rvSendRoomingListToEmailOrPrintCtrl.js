angular.module('sntRover').controller('rvSendRoomingListToEmailOrPrint',
 ['$scope',
  'rvGroupRoomingListSrv',
  'rvUtilSrv',
 function($scope, rvGroupRoomingListSrv, util){

    //This controller is only for setting the SCROLLER, we are not using this for any other purpose
    //because every function that we need to use on closing or some other action residing in rvGroupRoomingListCtrl.js
    //Please have a look at there.
    //We are forced to create this controller for this scroller refreshing & it's creattion
    //(since we dont want to interfer with this rooming list scroller)
    BaseCtrl.call(this, $scope);

    /**
     * Function to send e-mail of Rooming list.API call goes here.
     * @return - None
     */
    $scope.sendEmail = function(mailTo) {
        var mailSent = function(data) {
                $scope.closeDialog();
            },
            mailFailed = function(errorMessage) {
                $scope.errorMessage = errorMessage;
                $scope.closeDialog();
            };
        var params = {
            "to_address": mailTo,
            "group_id": $scope.groupConfigData.summary.group_id
        };
        $scope.callAPI(rvGroupRoomingListSrv.emailInvoice, {
            successCallBack: mailSent,
            failureCallBack: mailFailed,
            params: params
        });
    };

    /**
     * Function - Successful callback of printRoomingList.Prints fetched Rooming List.
     * @return - None
     */
    var successCallBackOfFetchAllReservationsForPrint = function(data) {
        //if you are looking for where the HELL this list is printing
        //look for "NG_REPEAT_COMPLETED_RENDERING", thanks!!
        $scope.resevationsBeforePrint = util.deepCopy($scope.reservations);
        $scope.reservations = data.results;
        $scope.print_type = 'rooming_list';
    };

    /**
     * Function to fetch Rooming list for print.
     * @return - None
     */
    $scope.fetchReservationsForPrintingRoomingList = function() {
        var params = {
            group_id: $scope.groupConfigData.summary.group_id,
            per_page: 1000
        };
        var options = {
            params: params,
            successCallBack: successCallBackOfFetchAllReservationsForPrint
        };
        $scope.callAPI(rvGroupRoomingListSrv.fetchReservations, options);
    };
    /**
     * Function to handle success, failure callbacks for toggleHideRate
     */
    var sucessCallbackToggleHideRate = function(data){
        $scope.groupConfigData.summary.hide_rates = !$scope.groupConfigData.summary.hide_rates;
        $scope.errorMessage = "";
    },
    failureCallbackToggleHideRate = function(errorData){
        $scope.errorMessage = errorData;
    };
    /**
     * Function to toggle show rate checkbox value
     */
    $scope.clickedShowRate = function(){
alert("tests")
        var params = {
            'group_id'      : $scope.groupConfigData.summary.group_id,
            'hide_rates'    : !$scope.groupConfigData.summary.hide_rates
        };
        $scope.callAPI(rvGroupConfigurationSrv.toggleHideRate, {
            successCallBack: sucessCallbackToggleHideRate,
            failureCallBack: failureCallbackToggleHideRate,
            params: params
        });
    };
    /**
     * Function to decide whether to show 'no reservations' screen
     * if reservations list is empty, will return true
     * @return {Boolean}
     */
    $scope.shouldShowNoReservations = function() {
        return ($scope.reservations.length === 0);
    };
    /**
     * should we show pagination area
     * @return {Boolean}
     */
    $scope.shouldShowPagination = function() {
        return ($scope.totalResultCount >= $scope.perPage);
    };

}]);