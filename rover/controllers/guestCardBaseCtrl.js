/**
 * Base controller for guest card contact tab, can be used to share functionalities shared
 * in guest card related sections
 * @param {object} $scope Scope object
 * @param {object} RVSearchSrv Search Service
 * @return {void} 
 */

function GuestCardBaseCtrl ($scope, RVSearchSrv, RVContactInfoSrv, rvPermissionSrv) {

    // Get the contact details object with the required properties only
    $scope.getContactInfo = function (contactInfo) {
        var whiteListedKeys = ['first_name', 'last_name', 'mobile', 'phone', 'email', 'vip'],
            contactDetails = _.pick(contactInfo, whiteListedKeys);

        contactDetails.address = {
            state: contactInfo.address && contactInfo.address.state ? contactInfo.address.state : "",
            city: contactInfo.address && contactInfo.address.city ? contactInfo.address.city : ""
        };

        return contactDetails;
    };

    // update guest details to RVSearchSrv via RVSearchSrv.updateGuestDetails - params: guestid, data
    $scope.updateSearchCache = function(avatarImage) {
        var dataSource = $scope.guestCardData.contactInfo;

        var data = {
            'firstname': dataSource.first_name,
            'lastname': dataSource.last_name,
            'vip': dataSource.vip
        };

        if (avatarImage) {
            data.avatar = avatarImage;
        }

        if (dataSource.address) {
            if ($scope.escapeNull(dataSource.address.city).toString()
                .trim() !== '' || $scope.escapeNull(dataSource.address.state).toString()
                .trim() !== '') {                    
                data.location = (dataSource.address.city + ', ' + dataSource.address.state);
            } else {
                data.location = false;
            }
        }
        RVSearchSrv.updateGuestDetails($scope.guestCardData.contactInfo.user_id, data);
    };

    /**
     * Handler for removing guest details from the guest card
     * @param {Number} guestId Id of the guest
     * @return {void}
     *
     */
    $scope.removeGuestDetails = function (guestId) {
        var canGuestCardDelete = $scope.guestCardData.contactInfo.can_guest_card_delete,
            canGuestDetailsAnonymized = $scope.guestCardData.contactInfo.can_guest_details_anonymized;

        var onSuccess = function () {
            if (canGuestCardDelete) {
                $scope.navigateBack();
            } else if (canGuestDetailsAnonymized) {
                $scope.$broadcast('REFRESH_CONTACT_INFO', { guestId: guestId});
                $scope.$broadcast('UPDATE_GUEST_CARD_ACTIONS_BUTTON_STATUS', {status: true});
            }
             
           },
           onFailure = function (error) {
             $scope.errorMessage = error;
           },
           options = {
             params: guestId,
             successCallBack: onSuccess,
             failureCallBack: onFailure
           };

        if (canGuestCardDelete) {
            $scope.callAPI(RVContactInfoSrv.deleteGuest, options);
        } else if (canGuestDetailsAnonymized) {
           $scope.callAPI(RVContactInfoSrv.removeGuestDetails, options); 
        }
        
    };

    /**
     * Fetch guest details by id
     * @param {Number} guestId id of the guest
     * @return {void}
     */
    var fetchGuestDetails = function (guestId) {
      var onSuccess = function (data) {
             $scope.$broadcast('SET_GUEST_CARD_DATA', data);
             $scope.$broadcast('CONTACTINFOLOADED');
             $scope.$broadcast('RESETCONTACTINFO', data);                                       
           },
           onFailure = function (error) {
             $scope.errorMessage = error;
           },
           options = {
             params: guestId,
             successCallBack: onSuccess,
             failureCallBack: onFailure
           };

        $scope.callAPI(RVContactInfoSrv.getGuestDetailsById, options);
    };

    // Listener for refreshing the contact tab details
    var contactInfoRefreshListener = $scope.$on ('REFRESH_CONTACT_INFO', function (event, data) {
      fetchGuestDetails(data.guestId);
    });

    $scope.$on('$destroy', contactInfoRefreshListener);

    // Checks whether the user has got the permission to remove guest details
    $scope.hasRemoveGuestDetailsPermission = function () {
        return rvPermissionSrv.getPermissionValue ('REMOVE_GUEST_DETAILS');
    };

}