angular.module('sntRover').controller('RVHKLogTabCtrl', [
	'$scope',
	'$rootScope',
	'RVHkRoomDetailsSrv',
	'roomDetailsLogData',
	function($scope, $rootScope, RVHkRoomDetailsSrv, roomDetailsLogData) {

		BaseCtrl.call(this, $scope);

		$scope.init = function(){
			$scope.roomDetails = $scope.$parent.roomDetails;
			$scope.$emit('hideLoader');
			$scope.roomLogData = roomDetailsLogData.results;

			angular.forEach($scope.roomLogData, function(item, keyValue) {
				item.front_office_status = _.findWhere(item.details, {key: "fo_status"});
				item.room_status = _.findWhere(item.details, {key: "room_status"});
				item.service_status = _.findWhere(item.details, {key: "service_status"});
				item.service_status.old_value = getServiceStatusValue(item.service_status.old_value);
				item.service_status.new_value = getServiceStatusValue(item.service_status.new_value);
			});
			//Paginaton
	        $scope.totalResults = roomDetailsLogData.total_count;
	        if($scope.roomLogData.total_count===0){
              $scope.start = 0;
              $scope.end =0;
	        }else{
	          $scope.start = 1;
	          $scope.end = $scope.start + $scope.roomLogData.length - 1;
	        }
	        $scope.setScroller('log-tab-scroll');
	        setTimeout(function(){
				$scope.refreshScroller('log-tab-scroll');
			}, 1500);
		};

		$scope.updateLog = function(){
	        var callback = function(data) {

	                $scope.roomLogData = data.results;
	                angular.forEach($scope.roomLogData, function(item, keyValue) {
						item.front_office_status = _.findWhere(item.details, {key: "fo_status"});
						item.room_status = _.findWhere(item.details, {key: "room_status"});
						item.service_status = _.findWhere(item.details, {key: "service_status"});
						item.service_status.old_value = getServiceStatusValue(item.service_status.old_value);
						item.service_status.new_value = getServiceStatusValue(item.service_status.new_value);
					});
	                $scope.totalResults = roomDetailsLogData.total_count;
	                if ($scope.nextAction) {
	                    $scope.start = $scope.start + $scope.perPage;
	                    $scope.nextAction = false;
	                   // $scope.initSort();
	                }
	                if ($scope.prevAction) {
	                    $scope.start = $scope.start - $scope.perPage;
	                    $scope.prevAction = false;
	                   // $scope.initSort();
	                }
	                $scope.end = $scope.start + $scope.roomLogData.length - 1;
	                $scope.$emit('hideLoader');
	        };
	        var params = {
	                id: $scope.roomDetails.id,
	                page: $scope.page,
	                per_page: $scope.perPage
	        };

	       // params['sort_order'] = $scope.sort_order;
	        //params['sort_field'] = $scope.sort_field;

	        $scope.invokeApi(RVHkRoomDetailsSrv.getRoomLog, params, callback);
	    };

	    $scope.getRoomStatusClass = function(roomStatus){
	    	return roomStatus.toLowerCase()
	    };

	   /*
	    * Pagination
	    */
	    $scope.initPaginationParams = function() {
	        if($scope.roomLogData.total_count===0){
	             $scope.start = 0;
	             $scope.end =0;
	        }else{
		        $scope.start = 1;
		        $scope.end = $scope.start + $scope.roomLogData.length - 1;
	        }
	        $scope.page = 1;
	        $scope.perPage = 3;
	        $scope.nextAction = false;
	        $scope.prevAction = false;
	    };

	    $scope.loadNextSet = function() {
	        $scope.page++;
	        $scope.nextAction = true;
	        $scope.prevAction = false;
	        $scope.updateLog();
	    };

	    $scope.loadPrevSet = function() {
	        $scope.page--;
	        $scope.nextAction = false;
	        $scope.prevAction = true;
	        $scope.updateLog();
	    };

	    $scope.isNextButtonDisabled = function() {
	        var isDisabled = false;
	        if ($scope.end >= $scope.totalResults) {
	            isDisabled = true;
	        }
	        return isDisabled;
	    };

	    $scope.isPrevButtonDisabled = function() {
	        var isDisabled = false;
	        if ($scope.page === 1) {
	            isDisabled = true;
	        }
	        return isDisabled;
	    };
	    $scope.init();
	    $scope.initPaginationParams();




	}

	]);