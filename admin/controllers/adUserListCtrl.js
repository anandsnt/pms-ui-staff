admin.controller('ADUserListCtrl', ['$scope', '$rootScope', '$q', '$state', '$stateParams', 'ADUserSrv', 'ngTableParams', 'ADHotelListSrv', 'ADMPUserSettingsSrv', 'ngDialog', function($scope, $rootScope, $q, $state, $stateParams, ADUserSrv, ngTableParams, ADHotelListSrv, ADMPUserSettingsSrv, ngDialog) {
    BaseCtrl.call(this, $scope);
    $scope.hotelId = $stateParams.id;
    $scope.isAdminSnt = false;
    $scope.$emit('changedSelectedMenu', 0);
    ADBaseTableCtrl.call(this, $scope, ngTableParams);
    /*
    * To check whether logged in user is sntadmin or hoteladmin
    */
    if ($rootScope.adminRole === 'snt-admin') {
        $scope.isAdminSnt = true;
    }
    /*
    * Failure callback function common to multiple API- invoke functions.
    */
    var failureCallback = function(errorMessage) {
        $scope.$emit('hideLoader');
        $scope.errorMessage = errorMessage;
        // scroll to top of the page where error message is shown
        if (angular.element( document.querySelector('.content')).find('.error_message').length) {
            angular.element( document.querySelector('.content')).scrollTop(0);
        }
    };

    $scope.flagObject = {};
    $scope.flagObject.showIncludeInactiveCheckbox = true;
    /*
    * If logged in as chain-admin user, the corresponding additional data should be loaded.
    * CICO-41385
    */
    if ($rootScope.isChainAdmin) {
        // Scope local flag to indicate that the user is a Chain Admin.
        $scope.flagObject.isChainAdmin = true;
        // Default value for hotel-user/all-user toggle as hotel-user.
        $scope.flagObject.showAllUsers = false;
        // Default state of the hotels filter: Closed.
        $scope.flagObject.showHotelFilters = false;
        // Default value for the hotels filter multi-select : All hotels.
        $scope.flagObject.selectedAllHotels = true;
        // Default value for the 'show chain admins only' checkbox.
        $scope.flagObject.showChainAdminsOnly = false;
        // Default value for the departments filter select: All departments
        $scope.flagObject.departmentSelected = '-1';
        // Array which will contain hotel id's of selected hotels from Hotel multi-select filter.
        $scope.selectedMPHotelIdsInFilter = [];

        /*
        * Success Callback of for Fetching Multi Property Hotel Details API
        * CICO-41385
        */
        var successCallbackfetchMPHotelDetails = function(data) {
            $scope.multiPropertyHotelDetails = data.hotels;
            $scope.homeHotelId = data.home_hotel_id;
            storeAllHotelIdsInFilter();
        };

        /*
        * Success Callback of for Fetching Multi Property Department Details API
        * CICO-41385
        */
        var successCallbackfetchMPDeptDetails = function(data) {
            $scope.multiPropertyDepartmentDetails = data.departments;
            filterDepartmentsInSelect();
        };

        $scope.invokeApi(ADMPUserSettingsSrv.fetchMPHotelDetails, {}, successCallbackfetchMPHotelDetails, failureCallback);

        $scope.invokeApi(ADMPUserSettingsSrv.fetchMPDeptDetails, {}, successCallbackfetchMPDeptDetails, failureCallback);
    }

    /*
    * To fetch the list of users
    * @param {params} ng-table parameters
    */
    $scope.fetchTableData = function($defer, params) {
        var getParams = $scope.calculateGetParams(params);

        getParams.isAdminSnt = $scope.isAdminSnt;

        if ($scope.isAdminSnt) {
            getParams.hotel_uuid = ADHotelListSrv.getSelectedProperty();
        }

        if ($scope.showInactiveUser) {
            getParams.include_inactive = $scope.showInactiveUser;
        }

        /*
        * Success Callback of for Fetching User details API
        */
        var successCallbackFetch = function(data) {
            $scope.$emit('hideLoader');
            $scope.currentClickedElement = -1;
            $scope.totalCount = data.total_count;
            $scope.totalPage = Math.ceil(data.total_count / $scope.displyCount);
            $scope.data = data.users;
            $scope.currentPage = params.page();
            params.total(data.total_count);
            $scope.manualIDScanEnabled = data.kiosk_manual_id_scan;
            $defer.resolve($scope.data);
        };

        if (!!$scope.flagObject && $scope.flagObject.isChainAdmin && $scope.flagObject.showAllUsers) {
            getParams.show_chain_admin_only = $scope.flagObject.showChainAdminsOnly;
            getParams.hotel_ids = $scope.selectedMPHotelIdsInFilter;
            getParams.department_id = $scope.flagObject.departmentSelected >= 0 ? $scope.flagObject.departmentSelected : null;
            $scope.invokeApi(ADMPUserSettingsSrv.fetchMPUserDetails, getParams, successCallbackFetch);
        } else {
            $scope.invokeApi(ADUserSrv.fetch, getParams, successCallbackFetch, failureCallback);
        }
    };

    /*
    * Loads the ng-table in the HTML for list of users
    */
    $scope.loadTable = function() {
        $scope.tableParams = new ngTableParams({
            page: 1,  // show first page
            count: $scope.displyCount, // count per page
            sorting: {
                name: 'asc' // initial sorting
            }
        }, {
            total: 0, // length of data
            getData: $scope.fetchTableData
        });
    };

    $scope.loadTable();
    /*
     * Show inactive users along with active users
     */
    $scope.clickedShowInactiveUsers = function() {
        $scope.reloadTable();
    };
    /*
     * Changed search text
     */
    $scope.changedSearchText = function() {
        if ($scope.searchTerm !== '') {
            $scope.flagObject.showIncludeInactiveCheckbox = false;
        } else {
            $scope.flagObject.showIncludeInactiveCheckbox = true;
        }              
    };

    $scope.reloadTable = function() {
        $scope.tableParams.page(1);
        $scope.tableParams.reload();
    };
    /*
    * To Activate/Inactivate user
    * @param {string} user id
    * @param {string} current status of the user
    * @param {num} current index
    */
    $scope.activateInactivate = function(userId, currentStatus, index) {
        var nextStatus = currentStatus === 'true' ? 'inactivate' : 'activate';
        var data = {
            'activity': nextStatus,
            'id': userId
        };
        var successCallbackActivateInactivate = function(data) {
            $scope.data[index].is_active = currentStatus === 'true' ? 'false' : 'true';
            $scope.$emit('hideLoader');
        };

        $scope.invokeApi(ADUserSrv.activateInactivate, data, successCallbackActivateInactivate);
    };
    /*
    * To delete user
    * @param {int} index of the selected user
    * @param {string} user id
    */
    $scope.deleteUser = function(index, userId) {
        var data = {
            'id': userId,
            'index': index
        };
        var successDelete = function() {
            $scope.$emit('hideLoader');
            // To refresh the user list
            $scope.listUsers();
        };

        $scope.invokeApi(ADUserSrv.deleteUser, data, successDelete );
    };


    /*
    * Handle back action
    */
    $scope.clickBack = function() {
        $state.go('admin.hoteldetails');
    };

    /*
    * Function that is triggered
    * when the list of users is switched between
    * Hotel-Users and All-Users in case of
    * Chain admins
    * CICO-41385
    * @params{string} The button that was clicked - hotel-user/all-users
    */
    $scope.clickedUserFilter = function(userType) {
        if (userType === 'hotel-user') {
            $scope.flagObject.showAllUsers = false;
        } else if (userType === 'all-users') {
            $scope.flagObject.showAllUsers = true;
        }
    };

    /*
    * Function that is triggered to show/hide the Multi-select Hotel Filter
    * CICO-41385
    */
    $scope.toggleHotelFilters = function() {
        $scope.flagObject.showHotelFilters = !$scope.flagObject.showHotelFilters;
    };

    /*
    * Handle outside click to hide the Multi-select Hotel filter
    * CICO-41385
    */
    $scope.clickedOutside = function(event) {
        if (!!$scope.flagObject && event.target.closest('#hotel-select') === null && $scope.flagObject.showHotelFilters) {
            $scope.flagObject.showHotelFilters = false;
        }
    };

    /*
    * Function that maintains the selected hotel id's
    * list with all hotels if the selection is 'All hotels'
    * CICO-41385
    */
    var storeAllHotelIdsInFilter = function() {
        if ($scope.multiPropertyHotelDetails.length > 0 ) {
            $scope.multiPropertyHotelDetails.forEach(function(hotel) {
                if ($scope.selectedMPHotelIdsInFilter.indexOf(hotel.id) === -1) {
                    $scope.selectedMPHotelIdsInFilter.push(hotel.id);
                }
                hotel.selected = false;
            });
        }
        $scope.flagObject.selectedAllHotels = true;
    };

    /*
    * Function that maintains the selected hotel id's
    * list with respect to the selections made in
    * the hotels multi-select filter if the selection is
    * not 'All hotels'
    * CICO-41385
    */
    var storeSelectedHotelIdsInFilter = function() {
        if (!!$scope.flagObject && $scope.flagObject.selectedAllHotels === true) {
            $scope.selectedMPHotelIdsInFilter = [];
        }
        if ($scope.multiPropertyHotelDetails.length > 0) {
            $scope.multiPropertyHotelDetails.forEach(function(hotel) {
                if (hotel.selected) {
                    if ($scope.selectedMPHotelIdsInFilter.indexOf(hotel.id) === -1) {
                        $scope.selectedMPHotelIdsInFilter.push(hotel.id);
                    }
                } else {
                    var hotelIndexInArray = $scope.selectedMPHotelIdsInFilter.indexOf(hotel.id);

                    if (hotelIndexInArray !== -1) {
                        $scope.selectedMPHotelIdsInFilter.splice(hotelIndexInArray, 1);
                    }
                }
            });
        }
        $scope.flagObject.selectedAllHotels = false;
        if ($scope.selectedMPHotelIdsInFilter.length === $scope.multiPropertyHotelDetails.length) {
            storeAllHotelIdsInFilter();
        }
    };

    /*
    * Function which filters the departments to be displayed
    * with respect to the selected hotels in the hotels
    * multi-select filter.
    * CICO-41385
    */
    var filterDepartmentsInSelect = function() {
        if ($scope.multiPropertyDepartmentDetails.length > 0) {
            $scope.multiPropertyDepartmentDetails.forEach(function(department) {
                var hotelIndexInArray = $scope.selectedMPHotelIdsInFilter.indexOf(department.hotel_id);

                if (hotelIndexInArray === -1) {
                    department.showFilter = false;
                } else {
                    department.showFilter = true;
                }
            });
        }
        $scope.flagObject.departmentSelected = '-1';
    };

    /*
    * Function triggered on selecting any one hotel
    * or 'All-hotels' option from the
    * Hotels Multi-select filter
    * CICO-41385
    * @params{object} hotel object
    */
    $scope.hotelFilterChange = function(hotel) {
        if (hotel.id === 'all') {
            storeAllHotelIdsInFilter();
        } else {
            storeSelectedHotelIdsInFilter();
        }
        filterDepartmentsInSelect();
        $scope.reloadTable();
    };

    /*
    * Function triggered on the change of
    * Department from the dropdown
    * CICO-41385
    * @params{num} Department-id
    */
    $scope.deptSelectChange = function(value) {
        if (value === '-1') {
            $scope.flagObject.departmentSelected = value;
        } else {
            $scope.flagObject.departmentSelected = value;
        }
        $scope.reloadTable();
    };

    /*
    * Function triggered on toggling the 'Show Chain Admins Only' checkbox
    * CICO-41385
    */
    $scope.showChainAdminsOnlyFilter = function() {
        $scope.reloadTable();
    };

    // To handle subscribe button click.
    $scope.subscribeButtonClick = function(user) {
        // Success callback after fetching hotel deatails.
        var successFetchMPHotelDetails = function(data) {
            $scope.subscriptionData = data;
            $scope.subscriptionData.user_id = user.id;

            ngDialog.open({
                template: '/assets/partials/users/adMPSubscriptionModal.html',
                controller: 'adMPSubscriptionPopupCtrl',
                className: '',
                scope: $scope,
                closeByDocument: false
            });
            $scope.$emit('hideLoader');
        },
        params = {
            'user_id': user.id
        };

        $scope.invokeApi(ADUserSrv.fetchMPHotelDetails, params, successFetchMPHotelDetails );
    };

    // Reload table data upon closing the subscription popup.
    $scope.$on('ngDialog.closing', function () {
        $scope.reloadTable();
    });

}]);
