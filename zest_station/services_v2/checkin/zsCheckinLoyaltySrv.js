 sntZestStation.service('zsCheckinLoyaltySrv', ['zsBaseWebSrv2', function(zsBaseWebSrv2) {

 	this.fetchUserMemberships = function(params) {
 		var url = '/staff/user_memberships.json?user_id=' + params.userId;;

 		return zsBaseWebSrv2.getJSON(url);
 	};

 	this.setLoyaltyForReservation = function(params) {
 		var url = '/staff/user_memberships/link_to_reservation';

 		return zsBaseWebSrv2.postJSON(url, params);
 	};

 	this.getAvailableHotelLoyaltyPgms = function() {
 		var url = '/staff/user_memberships/get_available_hlps.json';

 		return zsBaseWebSrv2.postJSON(url, params);
 	};

 	this.getAvailableFreaquentFlyerLoyaltyPgms = function() {
 		var url = '/staff/user_memberships/get_available_ffps.json';

 		return zsBaseWebSrv2.postJSON(url, params);
 	};

 }]);