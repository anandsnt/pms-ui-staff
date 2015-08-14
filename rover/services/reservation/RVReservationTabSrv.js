sntRover.service('RVReservationTabService', ['$rootScope', 'dateFilter', 'RVReservationStateService', 'RVReservationDataService',
	function($rootScope, dateFilter, RVReservationStateService, RVReservationDataService) {
		var self = this;

		self.newTab = function() {
			return RVReservationDataService.getTabDataModel();
		};
	}
]);