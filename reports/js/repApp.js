
// ==========================================================
// NOTE: MANUAL ANGULAR APP BOOTSTRAPING, CHECK THE LAST LINE
// ==========================================================

// create iscroll
var reportScroll = createVerticalScroll( '#reports', {} );

// I want more control with this
// so I am gonna create my own
var reportContent = new IScroll('#report-content', { mouseWheel: true, scrollX: false, scrollbars: true, scrollbars: 'custom' });


var reports = angular.module('reports', ['ngAnimate', 'ngSanitize', 'mgcrea.ngStrap.datepicker']);

reports.config([
    '$datepickerProvider',
    function($datepickerProvider, $rootScope) {
        angular.extend($datepickerProvider.defaults, {
            dateFormat: 'MM-dd-yyyy',
            startWeek: 0,
            autoclose: true,
            container: 'body'
        });
    }
]);

reports.controller('reporstList', [
    '$scope',
    '$rootScope',
    '$filter',
    '$timeout',
    'RepFetchSrv',
    'RepUserSrv',
    'RepFetchReportsSrv',
    function($scope, $rootScope, $filter, $timeout, RepFetchSrv, RepUserSrv, RepFetchReportsSrv) {

        // set the inital report app title
        $rootScope.report_app_title = 'Stats & Reports';

        // hide the details page
        $rootScope.showReportDetails = false;

        sntapp.activityIndicator.showActivityIndicator('BLOCKER');

        $scope.showReports = false;
        $scope.reportList  = [];
        $scope.reportCount = 0;
        $scope.userList    = [];

        // lets fix the results per page to, user can't edit this for now
        // 25 is the current number set by backend server
        $rootScope.resultsPerPage = 25;
        //to keep track of where the user was before clicking on print
        $scope.returnToPage = 1;
        // fetch the reports list with the filters to be used

        RepFetchSrv.fetch()
            .then(function(response) {
                sntapp.activityIndicator.hideActivityIndicator();
                $scope.showReports = true;

                $scope.reportList = response.results;
                $scope.reportCount = response.total_count;

                // looping through results to add more features
                var hasDateFilter, hasCicoFilter, hasUserFilter, hasSortDate, hasSortUser;
                for (var i = 0, j = $scope.reportList.length; i < j; i++) {

                    // add report icon class
                    if ($scope.reportList[i]['title'] == 'Upsell') {
                        $scope.reportList[i]['reportIconCls'] = 'icon-upsell';
                    } else if ($scope.reportList[i]['title'] == 'Late Check Out') {
                        $scope.reportList[i]['reportIconCls'] = 'icon-late-check-out';
                    } else {
                        // lets have cico icon as
                        $scope.reportList[i]['reportIconCls'] = 'icon-check-in-check-out';
                    }

                    // include show_filter
                    $scope.reportList[i]['show_filter'] = false;

                    // has date filter
                    hasDateFilter = _.find($scope.reportList[i]['filters'], function(item) {
                        return item.value === 'DATE_RANGE';
                    });
                    $scope.reportList[i]['hasDateFilter'] = hasDateFilter ? true : false;

                    // has cico filter
                    hasCicoFilter = _.find($scope.reportList[i]['filters'], function(item) {
                        return item.value === 'CICO';
                    });
                    $scope.reportList[i]['hasCicoFilter'] = hasCicoFilter ? true : false;
                    if (hasCicoFilter) {
                        $scope.reportList[i]['cicoOptions'] = [
                            {value: 'BOTH', label: 'Show Check Ins and  Check Outs'},
                            {value: 'IN', label: 'Show only Check Ins'},
                            {value: 'OUT', label: 'Show only Check Outs'}
                        ]
                    };

                    // has user filter
                    hasUserFilter = _.find($scope.reportList[i]['filters'], function(item) {
                        return item.value === 'USER';
                    });
                    $scope.reportList[i]['hasUserFilter'] = hasUserFilter ? true : false;

                    // sort by options
                    $scope.reportList[i].sortByOptions = $scope.reportList[i]['sort_fields']


                    // IMPORTANT used date filter with option 'medium' to avoid incorrect date due to timezone change

                    // set the default values for until date to business date
                    // plus calender will open in the corresponding month, rather than today
                    $scope.reportList[i].untilDate = $filter('date')($rootScope.businessDate, 'medium')

                    // HACK: set the default value for from date to a week ago from business date
                    // so that calender will open in the corresponding month, rather than today
                    var today = new Date( $scope.reportList[i].untilDate );
                    var weekAgo = today.setDate(today.getDate() - 7);
                    $scope.reportList[i].fromDate = $filter('date')(weekAgo, 'medium');
                };
            });

        // fetch the users list
        RepUserSrv.fetch()
            .then(function(response) {
                sntapp.activityIndicator.hideActivityIndicator();
                $scope.showReports = true;

                $scope.userList = response;
            });

        // show hide filter
        $scope.toggleFilter = function() {
            // DO NOT flip as scuh could endup in infinite $digest loop
            this.item.show_filter = this.item.show_filter ? false : true;
        };

        $scope.genReport = function() {
            if ( !this.item.fromDate || !this.item.untilDate ) {
                return;
            };

            // auto correct the CICO value;
            var getProperCICOVal = function(type) {

                // only do this for this report
                // I know this is ugly :(
                if ( this.item.title !== 'Check In / Check Out' ) {
                    return;
                };

                // if user has not chosen anything
                // both 'checked_in' & 'checked_out' must be true
                if ( !this.item.chosenCico ) {
                    this.item.chosenCico = 'BOTH'
                    return true;
                };

                // for 'checked_in'
                if (type === 'checked_in') {
                    return this.item.chosenCico === 'IN' || this.item.chosenCico === 'BOTH';
                };

                // for 'checked_out'
                if (type === 'checked_out') {
                    return this.item.chosenCico === 'OUT' || this.item.chosenCico === 'BOTH';
                };
            }.bind(this);

            var params = {
                from_date: $filter('date')(this.item.fromDate, 'yyyy/MM/dd'),
                to_date: $filter('date')(this.item.untilDate, 'yyyy/MM/dd'),
                user_ids: this.item.chosenUsers || '',
                checked_in: getProperCICOVal('checked_in'),
                checked_out: getProperCICOVal('checked_out'),
                sort_field: this.item.chosenSortBy || '',
                page: 1,
                per_page: $rootScope.resultsPerPage
            }

            // set the new title based on the chosen report
            $rootScope.report_app_title = this.item.title + ' ' + this.item.sub_title;

            // emit that the user wish to see report details
            $rootScope.$emit( 'report.submit', this.item, this.item.id, params );
        };

    }
]);



reports.controller('reportDetails', [
    '$scope',
    '$rootScope',
    '$window',
    '$timeout',
    '$filter',
    'RepUserSrv',
    'RepFetchReportsSrv',
    function($scope, $rootScope, $window, $timeout, $filter, RepUserSrv, RepFetchReportsSrv) {

        // track the user list
        RepUserSrv.fetch()
            .then(function(response) {
                $scope.userList = response;
            });

        // common methods to do things after fetch report
        var afterFetch = function(response) {

            // fill in data into seperate props
            $scope.totals = response.totals;
            $scope.headers = response.headers;
            $scope.results = response.results;

            // for hard coding styles for report headers
            // if the header count is greater than 4
            // split it up into two parts
            // NOTE: this implementation may need mutation if in future style changes
            // NOTE: this implementation also effects template, depending on design
            // discard previous values
            $scope.firstHalf = [];
            $scope.firstHalf = [];

            // making unique copies of array
            // slicing same array not good.
            // say thanks to underscore.js
            $scope.firstHalf = _.compact( $scope.totals );
            $scope.restHalf  = _.compact( $scope.totals );

            // now lets slice it half and half in order that each have atmost 4
            $scope.firstHalf = $scope.firstHalf.slice( 0, 4 );
            $scope.restHalf  = $scope.restHalf.slice( 4 );

            // now applying some very special and bizzare
            // cosmetic effects for reprots only
            // NOTE: direct dependecy on template
            if ( $scope.chosenReport.title === 'Check In / Check Out' ) {
                if ( $scope.firstHalf[0] ) {
                    $scope.firstHalf[0]['class'] = 'green';

                    // extra hack
                    // if the chosenCico is 'OUT'
                    // class must be 'red'
                    if ( $scope.chosenReport.chosenCico === 'OUT' ) {
                        $scope.firstHalf[0]['class'] = 'red';
                    }
                };

                if ( $scope.restHalf[0] ) {
                    $scope.restHalf[0]['class'] = 'red';
                };
            } else {
                // NOTE: as per todays style this applies to
                // 'Upsell' and 'Late Check Out' only
                if ( $scope.firstHalf[1] ) {
                    $scope.firstHalf[1]['class'] = 'orange';

                    // hack to add $ currency in front
                    $scope.firstHalf[1]['value'] = '$' + $scope.firstHalf[1]['value'];
                };
            };

            
            for (var i = 0, j = $scope.results.length; i < j; i++) {

                // change date format for all
                $scope.results[i][0] = $filter('date')($scope.results[i][0], 'MM-dd-yyyy');

                // hack to add curency $ symbol in front of values
                if ( $scope.chosenReport.title === 'Late Check Out' || $scope.chosenReport.title === 'Upsell' ) {
                    $scope.results[i][ $scope.results[i].length - 1 ] = '$' + $scope.results[i][ $scope.results[i].length - 1 ];
                }

                // hack to append ':00 PM' to time
                // thus makin the value in template 'X:00 PM'
                if ( $scope.chosenReport.title === 'Late Check Out' ) {
                    $scope.results[i][ $scope.results[i].length - 2 ] += ':00 PM';
                }
            };


            // hack to add curency $ symbol in front of values
            // if ( $scope.chosenReport.title === 'Late Check Out' || $scope.chosenReport.title === 'Upsell' ) {
            //     for (var i = 0, j = $scope.results.length; i < j; i++) {
            //         $scope.results[i][ $scope.results[i].length - 1 ] = '$' + $scope.results[i][ $scope.results[i].length - 1 ];

            //         // hack to append ':00 PM' to time
            //         // thus makin the value in template 'X:00 PM'
            //         if ( $scope.chosenReport.title === 'Late Check Out' ) {
            //             $scope.results[i][ $scope.results[i].length - 2 ] += ':00 PM';
            //         }
            //     };
            // }

            // hack to edit the title 'LATE CHECK OUT TIME' to 'SELECTED LATE CHECK OUT TIME'
            // notice the text case, they are as per api response and ui
            if ( $scope.chosenReport.title === 'Late Check Out' ) {
                for (var i = 0, j = $scope.headers.length; i < j; i++) {
                    if ( $scope.headers[i] === 'Late Check Out Time' ) {
                        $scope.headers[i] = 'Selected Late Check Out Time';
                        break;
                    };
                }
            }

            // hack to edit the title 'LATE CHECK OUT TIME' to 'SELECTED LATE CHECK OUT TIME'
            // notice the text case, they are as per api response and ui
            if ( $scope.chosenReport.title === 'Late Check Out' ) {
                for (var i = 0, j = $scope.headers.length; i < j; i++) {
                    if ( $scope.headers[i] === 'Late Check Out Time' ) {
                        $scope.headers[i] = 'Selected Late Check Out Time';
                        break;
                    };
                }
            }


            // hack to set the colspan for reports details tfoot
            $scope.leftColSpan  = $scope.chosenReport.title === 'Check In / Check Out' || $scope.chosenReport.title === 'Upsell' ? 4 : 2;
            $scope.rightColSpan = $scope.chosenReport.title === 'Check In / Check Out' || $scope.chosenReport.title === 'Upsell' ? 5 : 2;

            // track the total count
            $scope.totalCount = response.total_count;
            $scope.currCount = response.results.length;

            // hide the loading indicator
            sntapp.activityIndicator.hideActivityIndicator();

            // lets slide in the details view
            $rootScope.showReportDetails = true;

            // refesh the report scroll
            $timeout(function(){
                reportContent.refresh();
                reportContent.scrollTo(0, 0, 100);
            }, 100);

            // need to keep a separate object to show the date stats in the footer area
            $scope.displayedReport = {};

            // dirty hack to get the val() not model value
            $scope.displayedReport.fromDate = $('#chosenReportFrom').val();
            $scope.displayedReport.untilDate = $('#chosenReportTo').val();
        };

        // we are gonna need to drop some pagination
        // this is done only once when the report details is loaded
        // and when user updated the filters
        var calPagination = function(response, pageNum) {

            if(typeof pageNum == "undefined"){
                pageNum = 1;
            }

            $scope.pagination = [];
            if (response.results.length < response.total_count) {
                var pages = Math.floor( response.total_count / $rootScope.resultsPerPage );
                var extra = response.total_count % response.results.length;

                if (extra > 0) {
                    pages++;
                };

                for (var i = 1; i <= pages; i++) {
                    $scope.pagination.push({
                        no: i,
                        active: i === pageNum ? true : false
                    })
                };
            };
        };

        // hacks to track back the chosenCico & chosenUsers names
        // from their avaliable values
        var findBackNames = function() {
            // keep track of the transcation type for UI
            if ($scope.chosenReport.chosenCico === 'BOTH') {
                $scope.transcationTypes = 'check In, Check Out';
            } else if ($scope.chosenReport.chosenCico === 'IN') {
                $scope.transcationTypes = 'check In';
            } else if ($scope.chosenReport.chosenCico === 'OUT') {
                $scope.transcationTypes = 'check OUT';
            }

            // keep track of the Users chosen for UI
            // if there is just one user
            if ( $scope.chosenReport.chosenUsers ) {
                if (typeof $scope.chosenReport.chosenUsers === 'number') {

                    // first find the full name
                    var name = _.find($scope.userList, function(user) {
                        return user.id === $scope.chosenReport.chosenUsers;
                    });

                    $scope.userNames = name.full_name || false;
                } else {
                    
                    // if there are more than one user
                    for (var i = 0, j = $scope.chosenReport.chosenUsers.length; i < j; i++) {

                        // first find the full name
                        var name = _.find($scope.userList, function(user) {
                            return user.id === $scope.chosenReport.chosenUsers[i];
                            });

                        $scope.userNames += name.full_name + (i < j ? ', ' : '');
                    };
                }
            };
        };

        // listen for report submit form dashboard view
        var submitBind = $rootScope.$on('report.submit', function(event, item, id, params) {    

            // let show the loading indicator
            sntapp.activityIndicator.showActivityIndicator('BLOCKER');

            // let save the report id
            $scope.reportID = id;

            // we already know which user has chosen
            $scope.chosenReport = item;

            // find back the names from chosenCico & chosenUsers values
            findBackNames();

            // make calls to the data service with passed down args
            RepFetchReportsSrv.fetch( id, params )
                .then(function(response) {
                    afterFetch( response );
                    calPagination( response );
                });
        });

        // the listner must be destroyed when no needed anymore
        $scope.$on( '$destroy', submitBind );

        // back btn 
        $scope.returnBack = function() {
            $rootScope.showReportDetails = false;

            // reset the report app title
            $rootScope.report_app_title = 'Stats & Reports';
        };

        // fetch next page on pagination change
        $scope.fetchNextPage = function() {

            // user tried to reload the current page
            if (this.page.active) {
                return;
            };

            // change the current active number
            var currPage = _.find($scope.pagination, function(page) {
                return page.active === true
            });
            currPage.active = false;
            this.page.active = true;

            var params = {
                from_date: $filter('date')($scope.chosenReport.fromDate, 'yyyy/MM/dd'),
                to_date: $filter('date')($scope.chosenReport.untilDate, 'yyyy/MM/dd'),
                user_ids: $scope.chosenReport.chosenUsers,
                checked_in: $scope.chosenReport.chosenCico === 'IN' || $scope.chosenReport.chosenCico === 'BOTH',
                checked_out: $scope.chosenReport.chosenCico === 'OUT' || $scope.chosenReport.chosenCico === 'BOTH',
                sort_field: $scope.chosenReport.chosenSortBy || '',
                page: this.page.no,
                per_page: $rootScope.resultsPerPage
            }

            // let show the loading indicator
            sntapp.activityIndicator.showActivityIndicator('BLOCKER');

            // and make the call
            RepFetchReportsSrv.fetch( $scope.reportID, params )
                .then(function(response) {
                    afterFetch( response );
                });
        };

        // fetch the updated result based on the filter changes
        $scope.fetchUpdatedReport = function(pageNum) {

            if(typeof pageNum == "undefined"){
                pageNum == 1;
            }

            // auto correct the CICO value;
            var getProperCICOVal = function(type) {

                // only do this for this report
                // I know this is ugly :(
                if ( $scope.chosenReport.title !== 'Check In / Check Out' ) {
                    return;
                };

                // if user has not chosen anything
                // both 'checked_in' & 'checked_out' must be true
                if ( !$scope.chosenReport.chosenCico ) {
                    $scope.chosenReport.chosenCico = 'BOTH'
                    return true;
                };

                // for 'checked_in'
                if (type === 'checked_in') {
                    return $scope.chosenReport.chosenCico === 'IN' || $scope.chosenReport.chosenCico === 'BOTH';
                };

                // for 'checked_out'
                if (type === 'checked_out') {
                    return $scope.chosenReport.chosenCico === 'OUT' || $scope.chosenReport.chosenCico === 'BOTH';
                };
            };

            // now sice we are gonna update the filter
            // we are gonna start from page one
            var params = {
                from_date: $filter('date')($scope.chosenReport.fromDate, 'yyyy/MM/dd'),
                to_date: $filter('date')($scope.chosenReport.untilDate, 'yyyy/MM/dd'),
                user_ids: $scope.chosenReport.chosenUsers,
                checked_in: getProperCICOVal(),
                checked_out: getProperCICOVal(),
                page: pageNum,
                per_page: $rootScope.resultsPerPage
            }

            // let show the loading indicator
            sntapp.activityIndicator.showActivityIndicator('BLOCKER');

            // find back the names from chosenCico & chosenUsers values
            findBackNames();

            // and make the call
            RepFetchReportsSrv.fetch( $scope.reportID, params )
                .then(function(response) {
                    afterFetch( response );
                    calPagination( response , pageNum);
                });
        };


        //loads the content in the existing report view in the DOM.
        $scope.fetchFullReport = function() {
            $scope.returnToPage = 1;

            // now sice we are gonna update the filter
            // we are gonna start from page one
            var currPage = _.find($scope.pagination, function(page) {
                return page.active === true
            });

            if(currPage){
               $scope.returnToPage =  currPage.no;
            }

            var params = {
                from_date: $filter('date')($scope.chosenReport.fromDate, 'yyyy/MM/dd'),
                to_date: $filter('date')($scope.chosenReport.untilDate, 'yyyy/MM/dd'),
                user_ids: $scope.chosenReport.chosenUsers,
                checked_in: $scope.chosenReport.chosenCico === 'IN' || $scope.chosenReport.chosenCico === 'BOTH',
                checked_out: $scope.chosenReport.chosenCico === 'OUT' || $scope.chosenReport.chosenCico === 'BOTH',
                page: 1,
                per_page: 10000
            }

            // let show the loading indicator
            sntapp.activityIndicator.showActivityIndicator('BLOCKER');

            // find back the names from chosenCico & chosenUsers values
            findBackNames();

            // and make the call
            RepFetchReportsSrv.fetch( $scope.reportID, params )
                .then(function(response) {
                    afterFetch( response );
                    calPagination( response );
                    $scope.print();
                });
        };

        // print the page
        $scope.print = function() {
            $timeout(function() {
                $window.print();
                if ( sntapp.cordovaLoaded ) {
                    cordova.exec(function(success) {}, function(error) {}, 'RVCardPlugin', 'printWebView', []);
                };
            }, 100);

            $timeout(function() {
                //go back to before print page
                $scope.fetchUpdatedReport($scope.returnToPage);
                // Since I destroyed
                // I need to recreate
                reportContent.refresh();
            }, 500);
        };


        // off again with another dirty hack to resolve an iPad issue
        // when picking the date, clicking on the black mask doesnt close calendar 
        var closeMask = function(e) {
            if ( $(e.target).hasClass('datepicker-mask') ) {
                $( 'body' ).find( '.datepicker-mask' ).trigger( 'click' );
            }
        };
        $( 'body' ).on( 'click', closeMask );
        $scope.$on( '$destroy', function() {
            $( 'body' ).off( closeMask );
        } );
    }
]);














reports.factory('RepFetchSrv', [
    '$http',
    '$q',
    '$window',
    function($http, $q, $window) {
        var factory = {};

        factory.fetch = function() {
            var deferred = $q.defer();
            var url = '/api/reports';
                
            $http.get(url)
                .success(function(response, status) {
                    deferred.resolve(response);
                })
                .error(function(response, status) {
                    // please note the type of error expecting is array
                    // so form error as array if you modifying it
                    if(status == 406){ // 406- Network error
                        deferred.reject(errors);
                    }
                    else if(status == 500){ // 500- Internal Server Error
                        deferred.reject(['Internal server error occured']);
                    }
                    else if(status == 401){ // 401- Unauthorized
                        console.log('lets redirect');
                        // so lets redirect to login page
                        $window.location.href = '/logout';
                    }else{
                        deferred.reject(errors);
                    }
                });

            return deferred.promise;
        };

        return factory;
    }
]);


reports.factory('RepUserSrv', [
    '$http',
    '$q',
    '$window',
    function($http, $q, $window) {
        var factory = {};

        factory.users = [];

        factory.fetch = function() {
            var deferred = $q.defer();

            // if we have already fetched the user list already
            if ( this.users && this.users.length ) {
                deferred.resolve( this.users );
                return deferred.promise;
            };

            
            var url = '/api/users/active';
                
            $http.get(url)
                .success(function(response, status) {
                    this.users = response;
                    deferred.resolve(response);
                }.bind(this))
                .error(function(response, status) {
                    // please note the type of error expecting is array
                    // so form error as array if you modifying it
                    if(status == 406){ // 406- Network error
                        deferred.reject(errors);
                    }
                    else if(status == 500){ // 500- Internal Server Error
                        deferred.reject(['Internal server error occured']);
                    }
                    else if(status == 401){ // 401- Unauthorized
                        console.log('lets redirect');
                        // so lets redirect to login page
                        $window.location.href = '/logout' ;
                    }else{
                        deferred.reject(errors);
                    }
                });

            return deferred.promise;
        };

        return factory;
    }
]);


reports.factory('RepFetchReportsSrv', [
    '$http',
    '$q',
    '$window',
    function($http, $q, $window) {
        var factory = {};

        factory.fetch = function(id, params) {
            var deferred = $q.defer();
            var url = '/api/reports/' + id + '/submit';
                
            $http.get(url, { params: params })
                .success(function(response, status) {
                    deferred.resolve(response);
                })
                .error(function(response, status) {
                    // please note the type of error expecting is array
                    // so form error as array if you modifying it
                    if(status == 406){ // 406- Network error
                        deferred.reject(errors);
                    }
                    else if(status == 500){ // 500- Internal Server Error
                        deferred.reject(['Internal server error occured']);
                    }
                    else if(status == 401){ // 401- Unauthorized
                        console.log('lets redirect');
                        // so lets redirect to login page
                        $window.location.href = '/logout' ;
                    }else{
                        deferred.reject(errors);
                    }
                });

            return deferred.promise;
        };

        return factory;
    }
]);



// need manual bootstraping app
angular.bootstrap( angular.element('#reports_main'), ['reports'] );
