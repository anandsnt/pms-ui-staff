sntZestStation.controller('zsCheckoutKeyCardActionsCtrl', [
	'$scope',
	'$state',
	'zsEventConstants',
	'zsModeConstants',
	'$stateParams',
	'$sce', 'zsTabletSrv',
	function($scope, $state, zsEventConstants,zsModeConstants, $stateParams, $sce, zsTabletSrv) {

		BaseCtrl.call(this, $scope);
		$scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);
		$scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
		sntZestStation.filter('unsafe', function($sce) {
			return function(val) {
				return $sce.trustAsHtml(val);
			};
		});
		/**
		 * when the back button clicked
		 * @param  {[type]} event
		 * @return {[type]} 
		 */
		$scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {
			$state.go('zest_station.home'); //go back to reservation search results
		});

		$scope.navToPrev = function() {
			$scope.$emit(zsEventConstants.CLICKED_ON_BACK_BUTTON);
		};
		
		var actionSuccesCallback = function(cmd,msg,response){
			console.log(response);
			console.log(cmd);
			console.log(msg);

			if(cmd === 'cmd_insert_key_card'){
				$scope.zestStationData.keyCardInserted =  true;
			}
		};
		var openedCallback = function(){
			console.log("opened");
			 $scope.socketOperator.InsertKeyCard();
		};
		
		$scope.socketOperator.connectWebSocket(openedCallback,actionSuccesCallback);

	}
]);