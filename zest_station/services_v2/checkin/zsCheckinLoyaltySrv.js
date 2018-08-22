sntZestStation.service('zsCheckinLoyaltySrv', ['zsBaseWebSrv2', function (zsBaseWebSrv2) {

    this.fetchUserMemberships = function (params) {
        var url = '/staff/user_memberships.json';

        return zsBaseWebSrv2.getJSON(url, params);
    };

    this.setLoyaltyForReservation = function (params) {
        var url = '/staff/user_memberships/link_to_reservation';

        return zsBaseWebSrv2.postJSON(url, params);
    };

    this.getAvailableHotelLoyaltyPgms = function () {
        var url = '/staff/user_memberships/get_available_hlps.json';

        return zsBaseWebSrv2.getJSON(url);
    };

    this.getAvailableFreaquentFlyerLoyaltyPgms = function () {
        var url = '/staff/user_memberships/get_available_ffps.json';

        return zsBaseWebSrv2.getJSON(url);
    };

    this.generateAPIParams = function(userId, reservationId, userMembership, classType) {
        return {
            "user_id": userId,
            "user_membership": {
                "membership_card_number": userMembership.code,
                "membership_class": classType,
                "membership_type": userMembership.id,
                "membership_level": userMembership.level
            },
            "reservation_id": reservationId,
            "application": "KIOSK"
        };
    };

    this.saveLoyaltyPgm = function (params) {
        var url = '/staff/user_memberships';

        return zsBaseWebSrv2.postJSON(url, params);
    };

}]);
