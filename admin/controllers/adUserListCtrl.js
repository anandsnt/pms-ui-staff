admin.controller('ADUserListCtrl', ['$scope', '$rootScope', '$q', '$state', '$stateParams', 'ADUserSrv', 'ngTableParams', 'ADHotelListSrv', 'ADMPUserSettingsSrv', 'ngDialog', function($scope, $rootScope, $q, $state, $stateParams, ADUserSrv, ngTableParams, ADHotelListSrv, ADMPUserSettingsSrv, ngDialog) {
    BaseCtrl.call(this, $scope);
    $scope.hotelId = $stateParams.id;
    $scope.isAdminSnt = false;
    $scope.$emit("changedSelectedMenu", 0);
    ADBaseTableCtrl.call(this, $scope, ngTableParams);
   /**
    * To check whether logged in user is sntadmin or hoteladmin
    */
    if ($rootScope.adminRole === "snt-admin") {
        $scope.isAdminSnt = true;
    }
    /*
    Failure callback function common to multiple API- invoke functions.
    */
    var failureCallback = function(errorMessage) {
        $scope.$emit('hideLoader');
        $scope.errorMessage = errorMessage;
        // scroll to top of the page where error message is shown
        if (angular.element( document.querySelector('.content')).find('.error_message').length) {
            angular.element( document.querySelector('.content')).scrollTop(0);
        }
    };

    /*
    If logged in as chain-admin user, the corresponding additional data should be loaded.
    */
    if ($rootScope.isChainAdmin) {
        $scope.flagObject = {
            // Scope local flag to indicate that the user is a Chain Admin.
            isChainAdmin: true,
            // Default value for hotel-user/all-user toggle as hotel-user.
            showAllUsers: false,
            // Default state of the hotels filter: Closed.
            showHotelFilters: false,
            // Default value for the hotels filter multi-select : All hotels.
            selectedAllHotels: true,
            // Default value for the 'show chain admins only' checkbox.
            showChainAdminsOnly: false,
            // Default value for the departments filter select: All departments
            departmentSelected: '-1'
        };
        // Array which will contain hotel id's of selected hotels from Hotel multi-select filter.
        $scope.selectedMPHotelIdsInFilter = [];

        var successCallbackfetchMPHotelDetails = function(data) {
            $scope.multiPropertyHotelDetails = data.hotels;
            $scope.homeHotelId = data.home_hotel_id;
            storeAllHotelIdsInFilter();
        };

        var successCallbackfetchMPDeptDetails = function(data) {
            $scope.multiPropertyDepartmentDetails = data.departments;
            filterDepartmentsInSelect();
        };

        $scope.invokeApi(ADMPUserSettingsSrv.fetchMPHotelDetails, {}, successCallbackfetchMPHotelDetails, failureCallback);

        $scope.invokeApi(ADMPUserSettingsSrv.fetchMPDeptDetails, {}, successCallbackfetchMPDeptDetails, failureCallback);
    }

   /**
    * To fetch the list of users
    */
    $scope.fetchTableData = function($defer, params) {
        var getParams = $scope.calculateGetParams(params);

        getParams.isAdminSnt = $scope.isAdminSnt;

        if ($scope.isAdminSnt) {
            getParams.hotel_uuid = ADHotelListSrv.getSelectedProperty();
        }

        var successCallbackFetch = function(data) {
            $scope.$emit('hideLoader');
            $scope.currentClickedElement = -1;
            $scope.totalCount = data.total_count;
            $scope.totalPage = Math.ceil(data.total_count / $scope.displyCount);
            $scope.data = data.users;
            $scope.currentPage = params.page();
            params.total(data.total_count);
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
   /**
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
   /**
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


    /**
    * Handle back action
    */
    $scope.clickBack = function() {
        $state.go('admin.hoteldetails');
    };

    $scope.clickedUserFilter = function(userType) {
        if (userType === 'hotel-user') {
            $scope.flagObject.showAllUsers = false;
        } else if (userType === 'all-users') {
            $scope.flagObject.showAllUsers = true;
        }
    };

    $scope.toggleHotelFilters = function() {
        $scope.flagObject.showHotelFilters = !$scope.flagObject.showHotelFilters;
    };

    $scope.clickedOutside = function(event) {
        if (!!$scope.flagObject && event.target.closest('#hotel-select') === null && $scope.flagObject.showHotelFilters) {
            $scope.flagObject.showHotelFilters = false;
        }
    };

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

    $scope.hotelFilterChange = function(hotel) {
        if (hotel.id === 'all') {
            storeAllHotelIdsInFilter();
        } else {
            storeSelectedHotelIdsInFilter();
        }
        filterDepartmentsInSelect();
        $scope.reloadTable();
    };

    $scope.deptSelectChange = function(value) {
        if (value === '-1') {
            $scope.flagObject.departmentSelected = value;
        } else {
            $scope.flagObject.departmentSelected = value;
        }
        $scope.reloadTable();
    };

    $scope.showChainAdminsOnlyFilter = function() {
        $scope.reloadTable();
    };

    // To handle subscribe button click.
    $scope.subscribeButtonClick = function(user) {
        $scope.selectedUser = user;
        ngDialog.open({
            template: '/assets/partials/users/adMPSubscriptionModal.html',
            controller: 'adMPSubscriptionPopupCtrl',
            className: '',
            scope: $scope,
            closeByDocument: false
        });
    };

}]);
