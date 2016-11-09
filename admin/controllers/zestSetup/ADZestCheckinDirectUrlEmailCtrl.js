admin.controller('ADZestCheckinDirectUrlEmailCtrl',
    ['$scope', '$state', 'adZestCheckinCheckoutSrv', '$filter', 'directUrlData', 'diretUrls',
    function($scope, $state, adZestCheckinCheckoutSrv, $filter, directUrlData, diretUrls) {


    $scope.errorMessage     = '';
    $scope.successMessage   = '';

    BaseCtrl.call(this, $scope);

    var resetEditScreen  = function() {
        $scope.url                = {   
                                        "name": "",
                                        "url_suffix": "",
                                        "active": false
                                    };
        $scope.editMode           = false;
        $scope.isAddMode          = false;
    };

    var init = function() {
      $scope.currentClickedUrl  = -1;
      $scope.directUrlData = directUrlData;// resolved from router
      $scope.urls  = diretUrls;// resolved from router
      resetEditScreen();
    };

    // hide if is addmode or editmode
    $scope.isAddOrEditMode = function() {
        return $scope.isAddMode || $scope.editMode;
    };
    // hide the row content if its clicked
    $scope.hideRow = function(index) {
        return ($scope.currentClickedUrl === index && $scope.editMode);
    };
   
    // display detail template
    $scope.getTemplateUrl = function() {
        return "/assets/partials/zestSetup/adZestUrlEdit.html";
    };

    // click on invidual row
    $scope.editSingle = function(index) {
        $scope.currentClickedUrl = index;
        $scope.editMode          = true;
        $scope.isAddMode         = false;
        $scope.url               = $scope.urls[$scope.currentClickedUrl];
    };
    // add new button press
    $scope.addNew =  function() {
        resetEditScreen();
        $scope.currentClickedUrl = -1;
        $scope.editMode          = false;
        $scope.isAddMode         = true;
    };
    // canceling add/edit mode
    $scope.cancelAddEdit = function() {
        resetEditScreen();
        $scope.currentClickedUrl = -1;
    };

    var saveNewDirectURLSuccess = function(response) {
        $scope.$emit('hideLoader');
        $scope.urls.push(response);
        resetEditScreen();
        $scope.currentClickedUrl = -1;
    };

    var callSaveApi = function() {
        var data = {
             "active": $scope.url.active,
             "application": "URL",
             "guest_web_url_type": "CHECKIN",
             "name": $scope.url.name,
             "url_suffix": $scope.url.url_suffix
        };

        $scope.invokeApi(adZestCheckinCheckoutSrv.saveNewDirectURL, data, saveNewDirectURLSuccess);
    };

    var saveEditDirectURLSuccess = function(response) {
        $scope.$emit('hideLoader');
        $scope.urls[$scope.currentClickedUrl] = response;
        resetEditScreen();
        $scope.currentClickedUrl = -1;
    };

    var callEditApi = function() {
         var data = {
             "id": $scope.url.id,
             "active": $scope.url.active,
             "application": "URL",
             "guest_web_url_type": "CHECKIN",
             "name": $scope.url.name,
             "url_suffix": $scope.url.url_suffix
        };

        $scope.invokeApi(adZestCheckinCheckoutSrv.editDirectURL, data, saveEditDirectURLSuccess);

    };
    // toggle activate/deactivate

    $scope.switchActivation =  function(index) {
        var toggleSucces = function(response) {
            $scope.$emit('hideLoader');
            $scope.urls[index] = response;
        };
        // call API
         var data = {
             "id": $scope.urls[index].id,
             "active": !$scope.urls[index].active
        };

        $scope.invokeApi(adZestCheckinCheckoutSrv.editDirectURL, data, toggleSucces);
    };
    // delete the selected url        
    $scope.deleteUrl = function(index) {
        // call API

        // successCallBack
        var deleteSuccessCallback = function() {
             $scope.urls.splice(index, 1);
             $scope.$emit('hideLoader');
        };
        var data =  {"id": $scope.urls[index].id};

        $scope.invokeApi(adZestCheckinCheckoutSrv.deteDirectUrl, data, deleteSuccessCallback);
    };
    // save/update  success
    $scope.saveAddEdit = function() {
        if($scope.isAddMode) {
           callSaveApi();
        }
        else{
           callEditApi();
        };
    };
    // save success
    var saveSettingsSuccess = function(data) {
        $scope.$emit('hideLoader');
    };
    // save direct URL settings

    $scope.saveCheckin = function() {
        $scope.invokeApi(adZestCheckinCheckoutSrv.saveDirectSetup, $scope.directUrlData, saveSettingsSuccess);
    };

    init();

}]);