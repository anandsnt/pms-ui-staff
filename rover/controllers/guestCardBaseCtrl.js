/**
 * Base controller for guest card contact tab, can be used to share functionalities shared
 * in guest card related sections
 * @param {object} Scope object
 * @param {object} Search Service
 * @return {undefined}
 */

function GuestCardBaseCtrl ($scope, RVSearchSrv) {

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

}