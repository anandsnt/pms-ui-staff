    admin.controller('ADHKSectionDetailsCtrl',
        [   '$scope',
            '$state',
            'ADHKSectionSrv',
            '$filter',
            '$stateParams',
            'sectionDetails',
        function(
            $scope,
            $state,
            ADHKSectionSrv,
            $filter,
            $stateParams, sectionDetails) {

        BaseCtrl.call(this, $scope);

        /**
        * To clear error message
        * @return - None
        */
        var clearErrorMessage = function() {
            $scope.errorMessage = '';
        };

        /**
        * set of initial settings - edit mode
        * @return - None
        */
        var setUpForAddMode = function() {
            $scope.sectionData = {};
            // list of unassigned rooms
            $scope.unassignedRooms = [];

            // list of assigned rooms
            $scope.assignedRooms = [];
        };

        $scope.navigateToSectionListing = function () {
            $state.go ('admin.houseKeepingSections');
        };

        /*
        * Upon cancelling, navigate to the section listing screen
        * @return - None
        */
        $scope.clickCancel = function() {
            $scope.navigateToSectionListing();
        };

        /**
        * To enable/disable save button
        * @return {Boolean}
        */
        $scope.shouldDisableSaveButton = function() {
            if ($scope.sectionData.number &&
                $scope.sectionData.number.trim() !== '') {
                return false;
            }
            return true;
        };

        /*
        * To save/update room type details
        * @return - None
        */
        $scope.saveSection = function() {
            clearErrorMessage();

            var params = {},
                sectionDetails = {};

            sectionDetails.number = $scope.sectionData.number;
            sectionDetails.description = $scope.sectionData.description;

            params.hk_section = sectionDetails;
            params.sectionId = $scope.sectionData.id;

            var serviceToInvoke = null;

            if ($scope.isAddMode) {
                serviceToInvoke = ADHKSectionSrv.addHKSection;
            } else {
                serviceToInvoke = ADHKSectionSrv.updateHKSection;
            }
            var onHKSectionFetchSuccess = function() {
                $scope.navigateToSectionListing();
            };

            var options = {
                    params: params,
                    successCallBack: onHKSectionFetchSuccess
            };

            $scope.callAPI(serviceToInvoke, options);
        };

        // Set up the data for edit
        var setUpForEditMode = function() {
            $scope.sectionData = sectionDetails;

        };

        /**
        * set of initial settings
        * @return - None
        */
        var init = function() {
            $scope.errorMessage = '';

            // if we have id in stateparams, we have to switch to edit mode
            $scope.isAddMode = !$stateParams.sectionId;

            $scope.isSearchResult = false ;

            // if it is in editMode
            if (!$scope.isAddMode) {
                setUpForEditMode();
            }
            // if it is in addMode
            if ($scope.isAddMode) {
                setUpForAddMode();
            }
            // list of selected rooms from unassigned rooms list
            $scope.selectedUnassignedRooms = [];

            $scope.selectedAssignedRooms = [];

        };

        init();

    }]);

