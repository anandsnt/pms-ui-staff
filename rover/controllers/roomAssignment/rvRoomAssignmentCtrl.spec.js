describe("RVroomAssignmentController", function() {
	var $controller,
	$rootScope,
	$scope;

	jasmine.getJSONFixtures().fixturesPath = 'base/unitTestSampleData/';
	var fixtures = loadJSONFixtures('roomTypesSampleData.json'),
		roomTypesSampleData = fixtures['roomTypesSampleData.json'],        
		roomPreferences = {
			room_types: roomTypesSampleData,
			floors: {
				floor_details: []
			},
			room_features: []
		},
		roomsList = {
			rooms: []
		};

	describe("Room types available for assignment in the case of group reservations", function() {
		beforeEach(function() {
			module('sntRover');

			inject(function( _$controller_, _$rootScope_) {
				$controller = _$controller_;
				$rootScope = _$rootScope_;
				$scope = $rootScope.$new();
				
				var reservationDataSample = {
					'reservationData': {
						'allotment': {
							'id': ''
						},
						'group': {
							'id': '123'
						}
					},
					'reservation_card': {                    
					}                
				};

				angular.extend($scope, reservationDataSample);
				$scope.$parent.reservation = reservationDataSample;
				
			});

			$controller("RVroomAssignmentController", {
				$scope: $scope,
				roomPreferences: roomPreferences,
				roomsList: roomsList,
				roomUpgrades: []

			});
		});

		it("Should show suite rooms as well for group reservations in the room assignment screen", function() {
			// We are actually testing init(), but this would be invoked during controller initialization
			// So no need to invoke it again
			expect($scope.roomTypes.length).toBe(roomPreferences.room_types.length);
		});

	});   

	describe("Room types available for assignment in the case of Allotment reservations", function() {
		beforeEach(function() {
			module('sntRover');

			inject(function( _$controller_, _$rootScope_) {
				$controller = _$controller_;
				$rootScope = _$rootScope_;
				$scope = $rootScope.$new();

				var reservationDataSample = {
					'reservationData': {
						'allotment': {
							'id': 23
						}
					},
					'reservation_card': {                    
					}                
				};

				angular.extend($scope, reservationDataSample);
				$scope.$parent.reservation = reservationDataSample;
				
			});

			$controller("RVroomAssignmentController", {
				$scope: $scope,
				roomPreferences: roomPreferences,
				roomsList: roomsList,
				roomUpgrades: []

			});
		});

		it("Exclude suite rooms for allotment reservations in the room assignment screen", function() {			
						
			// We are actually testing init(), but this would be invoked during controller initialization
			// So no need to invoke it again
			expect($scope.roomTypes.length).toBe(29);
		});

	});  

	describe("Room types available for assignment in the case of normal reservations without group and allotment", function() {
		beforeEach(function() {
			module('sntRover');

			inject(function( _$controller_, _$rootScope_) {
				$controller = _$controller_;
				$rootScope = _$rootScope_;
				$scope = $rootScope.$new();
				
				var reservationDataSample = {
					'reservationData': {
						'allotment': {
							'id': ''
						},
						'group': {
							'id': ''
						}
					},
					'reservation_card': {                    
					},
					'roomFeatures': [
						{
							'items': []	
						}
					],
					'filteredRooms': []
				};

				angular.extend($scope, reservationDataSample);
				$scope.$parent.reservation = reservationDataSample;						
				
			});

			$controller("RVroomAssignmentController", {
				$scope: $scope,
				roomPreferences: roomPreferences,
				roomsList: roomsList,
				roomUpgrades: []

			});
		});

		it("Should show suite rooms as well for all normal reservations in the room assignment screen", function() {
			
			// We are actually testing init(), but this would be invoked during controller initialization
			// So no need to invoke it again
			expect($scope.roomTypes.length).toBe(roomPreferences.room_types.length);
		});

	}); 

	describe("Checks room no search and room type change API params", function() {
		beforeEach(function() {
			module('sntRover');

			inject(function( _$controller_, _$rootScope_) {
				$controller = _$controller_;
				$rootScope = _$rootScope_;
				$scope = $rootScope.$new();
				
				var reservationDataSample = {
					'reservationData': {
						'allotment': {
							'id': ''
						},
						'group': {
							'id': ''
						}
					},
					'reservation_card': {
						'reservation_id': 101                    
					},
					'roomFeatures': [
						{
							'items': []	
						}
					],
					'filteredRooms': [],
					'searchText': '10',
					'selectedPredefinedFiltersList': [],
					'selectedFiltersList': []
				};

				angular.extend($scope, reservationDataSample);
				$scope.$parent.reservation = reservationDataSample;						
				
			});

			$controller = $controller("RVroomAssignmentController", {
				$scope: $scope,
				roomPreferences: roomPreferences,
				roomsList: roomsList,
				roomUpgrades: []

			});
		});

		it("checks request params for room search API", function() {
			$scope.searchText = '10';
			var requestParams = $controller.getRequestParams(1, true);

			// We are actually testing init(), but this would be invoked during controller initialization
			// So no need to invoke it again
			expect(requestParams.query).toBe('10');
		});

		it("checks request params for room type change API request", function() {
			$scope.currentRoomTypeId = 5;
			var requestParams = $controller.getRequestParams(1, false);
			
			// We are actually testing init(), but this would be invoked during controller initialization
			// So no need to invoke it again
			expect(requestParams.room_type_ids[0]).toBe(5);
		});

	});   

});