sntRover.controller('rvGroupActivityCtrl', [
	'$scope', 
	'$rootScope', 
	'$filter', 
	'$stateParams',
	'rvGroupActivitySrv',
	function($scope, $rootScope, $filter, $stateParams,rvGroupActivitySrv) {
		BaseCtrl.call(this, $scope);		

		/**		
		 * initialisation and basic configuration
		 * @return {none}
		 */
		$scope.init = function(){						
			$scope.errorMessage = '';
			$scope.page = 1;
			//TODO - $scope.selectedGroupOrAccountId
			$scope.selectedGroupOrAccountId = 11;
			 var params = {
			 	"id":$scope.selectedGroupOrAccountId,
			 	"page":$scope.page,
			 	"perPage":50
			 }
			var fetchCompleted = function(data){				
				$scope.count = data.total_count;
				$scope.$emit('hideLoader');
				$scope.activityLogData = data.results;
				$scope.initPaginationParams();
			}
			$scope.invokeApi(rvGroupActivitySrv.fetchActivityLog, params, fetchCompleted);

		}
		
		/**		 
		 * load next page		
		 */
		$scope.loadNextSet = function(){
			$scope.page++;
	        $scope.nextAction = true;
	        $scope.prevAction = false;
	        $scope.updateReport();
		}

		/**
		 * load Previous page		
		 */
		$scope.loadPrevSet = function(){
			$scope.page--;
	        $scope.nextAction = false;
	        $scope.prevAction = true;
	        $scope.updateReport();
		}

		/**
		 * checking Whetheroldvalue of detail have any value
		 *@return - Boolean		
		 */
		$scope.isOldValue = function(value){
        if(value =="" || typeof value == "undefined" || value == null){
            return false;
        	}else{
            return true;
        	}
    	}
		
		/**		 
		 * for pagination
		 * @return {boolean}		
		 */
		$scope.isPrevButtonDisabled = function(){
			var isDisabled = false;
	        if ($scope.page == 1) {
	            isDisabled = true;
	        }
	        return isDisabled;			
		}

		/**		 
		 * for pagination
		 * @return {boolean}		
		 */
		$scope.isNextButtonDisabled = function(){
			var isDisabled = false;			
	        if ($scope.end >= $scope.count) {
	            isDisabled = true;
	        }
	        return isDisabled;
		}

		/*
		*@param {none}
	    *setting all sort flags false
	    *@return {none}
	    */    
	    $scope.initSort =function(){
	        $scope.sortOrderOfUserASC = false;
	        $scope.sortOrderOfDateASC = false;
	        $scope.sortOrderOfActionASC = false;
	        $scope.sortOrderOfUserDSC = false;
	        $scope.sortOrderOfDateDSC = false;
	        $scope.sortOrderOfActionDSC = false;
	    }

	    /**	@param {none}	 
		 * selecting sorting order for user field
		 * @return {none}		
		 */
	    $scope.sortByUserName = function(){
        	$scope.sort_field ="USERNAME";
	        if($scope.sortOrderOfUserASC){
	            $scope.initSort();
	            $scope.sortOrderOfUserDSC = true;
	            $scope.sort_order="desc";
	        }
	        else{
	            $scope.initSort();
	            $scope.sortOrderOfUserASC = true;
	            $scope.sort_order="asc";
	        }
        	$scope.updateReport();
    	}

    	/**	@param {none}	 
		 * selecting sorting order for date
		 * @return {none}		
		 */
    	$scope.sortByDate = function(){
        $scope.sort_field ="DATE";
        if($scope.sortOrderOfDateASC){
            $scope.initSort();
            $scope.sortOrderOfDateDSC = true;
            $scope.sort_order="desc";
        }
        else{
            $scope.initSort();
            $scope.sortOrderOfDateASC = true;
            $scope.sort_order="asc";
        }
        $scope.updateReport();
    	}

    	/**	@param {none}	 
		 * selecting sorting order for Action
		 * @return {none}		
		 */
	    $scope.sortByAction = function(){
	        $scope.sort_field ="ACTION";
	        if($scope.sortOrderOfActionASC){
	            $scope.initSort();
	            $scope.sortOrderOfActionDSC = true;
	            $scope.sort_order="desc";
	        }
	        else{
	            $scope.initSort();
	            $scope.sortOrderOfActionASC = true;
	            $scope.sort_order="asc";
	        }
	        $scope.updateReport();
	    }

		/**	@param {none}	 
		 * Initiating pagination param
		 * @return {none}		
		 */
	    $scope.initPaginationParams = function() {
	        if($scope.count==0){           
	             $scope.start = 0;
	             $scope.end =0;
	        }else{
		        $scope.start = 1;		        
		        $scope.end = $scope.start + $scope.count - 1;//
		        }
	        $scope.page = 1;
	        $scope.perPage = 50;        
	        $scope.nextAction = false;
	        $scope.prevAction = false;	        
	    }

		/**	@param {none}	 
		 * update log detail
		 * @return {none}		
		 */
		$scope.updateReport = function(){
	        var fetchCompleted = function(data) {
	                $scope.count = data.total_count;
	                $scope.activityLogData = data.results;
	                if ($scope.nextAction) {
	                    $scope.start = $scope.start + $scope.perPage;
	                    $scope.nextAction = false;
	                    $scope.initSort();
	                }
	                if ($scope.prevAction) {
	                    $scope.start = $scope.start - $scope.perPage;
	                    $scope.prevAction = false;
	                    $scope.initSort();
	                }
	                $scope.end = $scope.start + $scope.count - 1;
	                $scope.$emit('hideLoader');
	        	}
	        var params = {
	        		id:$scope.selectedGroupOrAccountId,
	                page: $scope.page,
	                per_page: $scope.perPage
	        	};     
	        params['sort_order'] = $scope.sort_order;
	        params['sort_field'] = $scope.sort_field;       
	        $scope.invokeApi(rvGroupActivitySrv.fetchActivityLog, params, fetchCompleted);
    	}


		/**
		 *Show starts here!!!!
		 */
		 $scope.init();
		
	}
]);