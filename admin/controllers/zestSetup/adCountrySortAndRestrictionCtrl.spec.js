describe('ADCountrySortAndRestrictionCtrl', function() {

	var $controller,
		$scope = {},
		ADCountrySortSrv,
		$q,
		$state;

	beforeEach(function() {
		module('admin');
		inject(function(_$controller_, _$rootScope_, _ADCountrySortSrv_, _$q_, _$state_) {
			$controller = _$controller_;
			ADCountrySortSrv = _ADCountrySortSrv_;
			$q = _$q_;
			$scope = _$rootScope_.$new();
			$state = _$state_;
		});
		$controller('ADCountrySortAndRestrictionCtrl', {
			$scope: $scope
		});
	});

	it('Initail screenmode is SORT and search string is empty', function() {
		expect($scope.screenData.mode).toEqual('SORT');
		expect($scope.listingMode).toEqual(true);
		expect($scope.screenData.countrySearch).toEqual('');
	});

	it('On clicking Sorted country list, change screenmode to SORT', function() {
		$scope.screenData.mode = 'RESTRICTIONS';
		$scope.changeModeToSortingList();
		expect($scope.screenData.mode).toEqual('SORT');
	});

	it('On clicking Restrictions, change screenmode to RESTRICTIONS', function() {
		$scope.screenData.mode = 'SORT';
		$scope.changeModeToRestrictionList();
		expect($scope.screenData.mode).toEqual('RESTRICTIONS');
	});

	it('On clicking Add new country to sort country list, hide list mode and show option to add country', function() {
		$scope.listingMode = true;
		$scope.addCountryToSequence();
		expect($scope.listingMode).toEqual(false);
	});

	describe('On back button action', function() {
		it('If screenmode is SORT and is not in listingMode (is in Add country mode), go to country list mode', function() {
			$scope.screenData.mode = 'SORT';
			$scope.listingMode = false;
			$scope.backClicked();
			expect($scope.screenData.mode).toEqual('SORT');
			expect($scope.listingMode).toEqual(true);
		});

		it('If screenmode is SORT and is in listingMode, go to previous state', function() {
			spyOn($state, 'go');
			$scope.screenData.mode = 'SORT';
			$scope.listingMode = true;
			$scope.backClicked();
			expect($state.go).toHaveBeenCalled();
		});
		it('If screenmode is RESTRICTIONS, change mode to RESTRICTIONS and display listingMode', function() {
			$scope.screenData.mode = 'RESTRICTIONS';
			$scope.listingMode = false;
			$scope.backClicked();
			expect($scope.screenData.mode).toEqual('SORT');
			expect($scope.listingMode).toEqual(true);
		});
	});

	it('Check if any of the option is selected for a country', function() {
		var country = {
			'name': 'USA',
			'check_in': false,
			'check_out': false,
			'room_ready': true
		};
		var isAnyRestrictionSelectd = $scope.isAnyRestrictionSelectd(country);

		expect(isAnyRestrictionSelectd).toEqual(true);
	});

	it('Check if all of the options are selected for a country', function() {
		var country = {
			'name': 'USA',
			'check_in': true,
			'check_out': true,
			'room_ready': true
		};
		var areAllRestrictionSelectd = $scope.areAllRestrictionSelectd(country);

		expect(areAllRestrictionSelectd).toEqual(true);
	});

	it('On toggling all subscriptions, turn on all the flags for the counrty', function() {
		spyOn(ADCountrySortSrv, 'unsubscribeCountryFromList').and.callFake(function() {
			var deferred = $q.defer();

			deferred.resolve({});
			return deferred.promise;
		});
		var country = {
			'name': 'USA',
			'check_in': false,
			'check_out': false,
			'room_ready': true
		};

		$scope.toggleAllSubscription(country);
		$scope.$digest();
		expect(ADCountrySortSrv.unsubscribeCountryFromList).toHaveBeenCalled();
		expect(country.check_in).toEqual(true);
		expect(country.check_out).toEqual(true);
		expect(country.room_ready).toEqual(true);
	});

	it('On toggling on any subscription for a country, call API to save changes and turn on the flags', function() {
		spyOn(ADCountrySortSrv, 'unsubscribeCountryFromList').and.callFake(function() {
			var deferred = $q.defer();

			deferred.resolve({});
			return deferred.promise;
		});
		var country = {
			'name': 'USA',
			'check_in': false,
			'check_out': false,
			'room_ready': true
		};

		$scope.toggleSubscription(country, 'check_in');
		$scope.$digest();
		expect(ADCountrySortSrv.unsubscribeCountryFromList).toHaveBeenCalled();
		expect(country.check_in).toEqual(true);
		expect(country.check_out).toEqual(false);
		expect(country.room_ready).toEqual(true);
	});
});