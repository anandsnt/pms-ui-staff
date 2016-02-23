sntGuestWeb.service('GwScreenMappingSrv', ['$q', function($q) {

	/**
	 * screen Mapping list
	 * @return {undefined}
	 */
	this.screenMappingList = [{
		"value": "EXTERNAL_CHECKOUT",
		"id": "123"
	}, {
		"value": "CHECKOUT_LANDING",
		"id": "121"
	}, {
		"value": "CHECKOUT_NOW_LANDING",
		"id": "111"
	}, {
		"value": "REVIEW_BILL",
		"id": "151"
	}, {
		"value": "CHECKOUT_FINAL",
		"id": "15556"
	}, {
		"value": "CHECKOUT_LATER_OPTIONS",
		"id": "12312"
	}, {
		"value": "LATE_CHECKOUT_FINAL",
		"id": "555"
	}, {
		"value": "ROOM_VERIFICATION",
		"id": "1233"
	},{
		"value": "CC_ADDITION",
		"id" : "2233"
	}];
}]);