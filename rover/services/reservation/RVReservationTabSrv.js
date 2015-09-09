sntRover.service('RVReservationTabService', ['$rootScope', 'dateFilter', 'RVReservationStateService', 'RVReservationDataService',
	function($rootScope, dateFilter, RVReservationStateService, RVReservationDataService) {
		var self = this;

		self.newTab = function(count) {
			return RVReservationDataService.getTabDataModel(count);
		};

		self.newRoom = function(count){
			return RVReservationDataService.getRoomDataModel(count);	
		};
	}
]);