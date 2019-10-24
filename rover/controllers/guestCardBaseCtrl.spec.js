describe('GuestCardBaseCtrl', function() {
	var $controller,		
		rvPermissionSrv,
		$scope,
		guestCtrl,
		$rootScope;

	describe("Checks toggling of manage cards button", function() {
		beforeEach(function() {
			module('sntRover');	
			inject(function(_$controller_, _$rootScope_, _rvPermissionSrv_) {
				$controller = _$controller_;							
				rvPermissionSrv = _rvPermissionSrv_;
				$rootScope = _$rootScope_;				
				$scope = _$rootScope_.$new();
			});	
			guestCtrl = $controller(function inline($scope, rvPermissionSrv, $rootScope) {
				GuestCardBaseCtrl.call(this, $scope, null, null, rvPermissionSrv, $rootScope);
			}, {$scope: $scope});

		});

		it('isCardOptionsOpen should be initialized to false', function() {		
			expect($scope.manageCardState.isOpen).toEqual(false);
		});

		it('isCardOptionsOpen should be true after toggling', function() {
			$scope.toggleCardActions();		
			expect($scope.manageCardState.isOpen).toEqual(true);
		});

	});

	describe("Disabling of the remove button", function() {
		beforeEach(function() {
			module('sntRover');	
			inject(function(_$controller_, _$rootScope_, _rvPermissionSrv_) {
				$controller = _$controller_;							
				rvPermissionSrv = _rvPermissionSrv_;
				$rootScope = _$rootScope_;					
				$scope = _$rootScope_.$new();
			});	
			guestCtrl = $controller(function inline($scope, rvPermissionSrv, $rootScope) {
				GuestCardBaseCtrl.call(this, $scope, null, null, rvPermissionSrv, $rootScope);
			}, {$scope: $scope});

		});

		it('should disable the remove btn if can_guest_details_anonymized and can_guest_card_delete is false', 
			function() {
				$scope.guestCardData = {};
				$scope.guestCardData.contactInfo = {
					can_guest_details_anonymized: false,
					can_guest_card_delete: false
				};

				spyOn(rvPermissionSrv, "getPermissionValue").and.callFake(function() {
					return true;
				});	

				expect($scope.shouldDisableRemoveGuestBtn()).toEqual(true);

		});

		it('should disable the remove btn if can_guest_details_anonymized and can_guest_card_delete is true and no permission', 
			function() {
				$scope.guestCardData = {};
				$scope.guestCardData.contactInfo = {
					can_guest_details_anonymized: false,
					can_guest_card_delete: false
				};

				spyOn(rvPermissionSrv, "getPermissionValue").and.callFake(function() {
					return false;
				});	

				expect($scope.shouldDisableRemoveGuestBtn()).toEqual(true);

		});

		it('should not disable the remove btn if can_guest_details_anonymized and can_guest_card_delete is true and has permission', 
			function() {
				$scope.guestCardData = {};
				$scope.guestCardData.contactInfo = {
					can_guest_details_anonymized: true,
					can_guest_card_delete: true
				};

				spyOn(rvPermissionSrv, "getPermissionValue").and.callFake(function() {
					return true;
				});	

				expect($scope.shouldDisableRemoveGuestBtn()).toEqual(false);

		});

	});	

	
});