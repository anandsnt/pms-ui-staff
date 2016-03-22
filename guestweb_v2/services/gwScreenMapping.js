sntGuestWeb.service('GwScreenMappingSrv', ['$q', function($q) {

	/**
	 * screen Mapping list
	 * @return {undefined}
	 */
	this.screenMappingList = [{
		"value": "EXTERNAL_CHECKOUT",
		"id": "ZS-1"
	}, {
		"value": "CHECKOUT_LANDING",
		"id": "ZS-2"
	}, {
		"value": "CHECKOUT_NOW_LANDING",
		"id": "ZS-3"
	}, {
		"value": "REVIEW_BILL",
		"id": "ZS-4"
	}, {
		"value": "CHECKOUT_FINAL",
		"id": "ZS-5"
	}, {
		"value": "CHECKOUT_LATER_OPTIONS",
		"id": "ZS-6"
	}, {
		"value": "LATE_CHECKOUT_FINAL",
		"id": "ZS-7"
	}, {
		"value": "ROOM_VERIFICATION",
		"id": "ZS-8"
	},{
		"value": "CC_ADDITION",
		"id" : "ZS-9"
	},{
		"value": "EXTERNAL_CHECKIN",
		"id" : "ZS-10"
	},{
		"value": "RESERVATION_DETAILS",
		"id" : "ZS-11"
	},
	{
		"value": "ROOM_UPGRADES",
		"id"  : "ZS-12"
	},
	{
		"value": "ETA_UPDATION",
		"id" : "zs-13"
	},
	{
		"value": "TERMS_AND_CONDITIONS",
		"id": "zs-14"
	},{
		"value" : "AUTO_CHECKIN_FINAL",
		"id" : "zs-15"
	}];
}]);