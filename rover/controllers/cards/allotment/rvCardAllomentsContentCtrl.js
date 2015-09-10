sntRover.controller('rvCardAllomentsContentCtrl', ['$scope', 'rvUtilSrv', function($scope, util){
	BaseCtrl.call(this, $scope);

    /**
     * util function to check whether a string is empty
     * we are assigning it as util's isEmpty function since it is using in html
     * @param {String/Object}
     * @return {boolean}
     */
    $scope.isEmpty = util.isEmpty;
    $scope.searchMode = true;
    /**
     * function to stringify a string
     * sample use case:- directive higlight filter
     * sometimes through error parsing speial charactes
     * @param {String}
     * @return {String}
     */
    $scope.stringify = util.stringify;

    /**
     * util function to get CSS class against diff. Hold status
     * @param {Object} - Allotment
     * @return {String}
     */
    $scope.getClassAgainstHoldStatus = function(allotment) {
        // https://stayntouch.atlassian.net/browse/CICO-13899?focusedCommentId=42708&page=com.atlassian.jira.plugin.system.issuetabpanels:comment-tabpanel#comment-42708
        // API returns a string value for 'is_take_from_inventory'
        return allotment.is_take_from_inventory === 'true' ? '' : 'tentative';
    };

    var isCancelledAllotment = function(allotment) {
        return (allotment.hold_status.toLowerCase() === 'cancel');
    };

    /**
     * util function to get CSS class against guest for arrival
     * @param {Object} - allotment
     * @return {String}
     */
    $scope.getGuestClassForArrival = function(allotment) {
        //"cancel" if cancelled, "check-in" if not cancelled
        var classes = isCancelledAllotment(allotment) ? 'cancel' : 'check-in';
        return classes;
    };

    /**
     * util function to get CSS class against diff. Hold status
     * @param {Object} - Allotment
     * @return {String}
     */
    $scope.getClassAgainstPickedStatus = function(allotment) {
        var classes = '';

        //Add class "green" if No. > 0
        if (allotment.total_picked_count > 0) {
            classes = 'green';
        }
        //Add class "red" if cancelled
        if (isCancelledAllotment(allotment)) {
            classes += ' red';
        }
        return classes;
    };

    /**
     * util function to get CSS class against guest for arrival
     * @param {Object} - Allotment
     * @return {String}
     */
    $scope.getGuestClassForDeparture = function(allotment) {
        //"cancel" if cancelled, 'check-out' if not cancelled
        var classes = isCancelledAllotment(allotment) ? 'cancel' : 'check-out';
        return classes;
    };
        
    /**
     * we want to display date in what format set from hotel admin
     * @param {String/DateObject}
     * @return {String}
     */
    $scope.formatDateForUI = function(date_) {
        var type_ = typeof date_,
            returnString = '';
        switch (type_) {
            //if date string passed
            case 'string':
                returnString = $filter('date')(new tzIndependentDate(date_), $rootScope.dateFormat);
                break;

                //if date object passed
            case 'object':
                returnString = $filter('date')(date_, $rootScope.dateFormat);
                break;
        }
        return (returnString);
    };    

    /**
     * Event propogated by ngrepeatend directive
     * we used to hide activity indicator & refresh scroller
     */
    $scope.$on('NG_REPEAT_COMPLETED_RENDERING', function(event) {
        $timeout(function() {
            refreshScrollers ();
        }, 300);
        $scope.$emit('hideLoader');
    });

    /**
     * utiltiy function for setting scroller and things
     * return - None
     */
    var setScrollerForMe = function() {
        //setting scroller things
        var scrollerOptions = {
            tap: true,
            preventDefault: false,
            deceleration: 0.0001,
            shrinkScrollbars: 'clip'
        };
        $scope.setScroller('result_showing_area', scrollerOptions);
    };

    /**
     * utiltiy function for setting scroller and things
     * return - None
     */
    var refreshScrollers = function() {
        $scope.refreshScroller('result_showing_area');
    };

    $scope.$on("GROUP_SEARCH_STARTED", function() {
        $scope.searchingAllotment = true;
        refreshScrollers ();
    });

    $scope.$on("GROUP_SEARCH_END", function() {
        $scope.searchingAllotment = false;
        refreshScrollers ();
    });


    $scope.$on("FETCH_ALLOTMENT_SEARCH_DATA", function() {
        searchAllotments ();
    });

    /**
     * when the allotment API search is success
     * @param  {[type]} results
     * @return {[type]}         [description]
     */
    var onAllotmentSearchSuccess = function(results) {
        $scope.searchingAllotment   = true;
        $scope.allotmentList        = data.allotments;
    };

    /**
     * function to search allotment
     * @return {[type]} [description]
     */
    var searchAllotments = function() {
        var grpCardData = $scope.searchData.groupCard,
            resData     = $scope.reservationData;

        if (!!grpCardData.name || !!grpCardData.code) {
            var params = {
                name        : grpCardData.name,
                code        : grpCardData.code,
                from_date   : resData.arrivalDate,
                to_date     : resData.departureDate
            };

            var options = {
                params          : params,
                successCallBack : onAllotmentSearchSuccess
            };
            $scope.callAPI(rvGroupSrv.searchGroupCard, options);
        } 

        else {
            $scope.searchingAllotments = false;
            $scope.searchedAllotments = [];
        }
    };

    /**
     * function used to set initlial set of values
     * @return {None}
     */
	var initilizeMe = function(){
        //allotmentlist
        $scope.allotmentList = [];

        //total result count
        $scope.totalResultCount = 0;

        //scroller and related things
        setScrollerForMe();
	}();
}]);