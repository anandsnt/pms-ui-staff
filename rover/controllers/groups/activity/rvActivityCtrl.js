angular.module('sntRover').controller('rvActivityCtrl', [
	'$scope',
	'$rootScope',
	'$filter',
	'$stateParams',
	'$timeout',
	function($scope, $rootScope, $filter, $stateParams, $timeout) {
		BaseCtrl.call(this, $scope);

		/**
		 * initialisation and basic configuration
		 *
		 */
		$scope.init = function(){
			$scope.page = 1;
	        $scope.perPage = 50;
	        $scope.nextAction = false;
	        $scope.prevAction = false;
	        $scope.errorMessage = '';
	        $scope.start = 1;
	        $scope.end = 0;
	        $scope.setScroller('report_content');

		};
		$scope.$on('PopulateLogData',function(e,data){
			$scope.count = data.total_count;
			$scope.activityLogData = data.results;
			$scope.dataLength = $scope.activityLogData.length;
			if ($scope.nextAction) {
					$scope.page++;
	                $scope.start = $scope.start + $scope.perPage;
	                $scope.nextAction = false;
	                $scope.initSort();
	                }
	            if ($scope.prevAction) {
	            	$scope.page--;
	                $scope.start = $scope.start - $scope.perPage;
	                $scope.prevAction = false;
	                $scope.initSort();
	                }
	        $scope.end = $scope.start + $scope.dataLength - 1;
	        $scope.$emit('hideLoader');
	        $scope.refreshScroller('report_content');
		});
		/**
		 * load next page
		 */
		$scope.loadNextSet = function(){
	        $scope.nextAction = true;
	        $scope.prevAction = false;
	        $scope.updateReport();
		};

		/**
		 * load Previous page
		 */
		$scope.loadPrevSet = function(){
	        $scope.nextAction = false;
	        $scope.prevAction = true;
	        $scope.updateReport();
		};

		/**
		 * checking Whether oldvalue of detail have any value
		 *@return - Boolean
		 */
		$scope.isOldValue = function(value){
	        if(value ==="" || typeof value === "undefined" || value === null){
	            return false;
	        	}else{
	            return true;
	        	}
    	};

		/**
		 * for pagination
		 * @return {boolean}
		 */
		$scope.isPrevButtonDisabled = function(){
			var isDisabled = false;
	        if ($scope.page === 1) {
	            isDisabled = true;
	        }
	        return isDisabled;
		};

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
		};

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
	    };

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
    	};

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
    	};

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
	    };
		$scope.updateReport = function(){
	        var params = {
	            page: $scope.prevAction?$scope.page - 1:($scope.nextAction?$scope.page + 1:$scope.page),
	            per_page: $scope.perPage
	        	};
	        params['sort_order'] = $scope.sort_order;
	        params['sort_field'] = $scope.sort_field;
	        $scope.$emit("updateLogdata",params);
    	};

		/**
         * add the print orientation before printing
         * @return - None
         */
        var addPrintOrientation = function() {
            $('head').append("<style id='print-orientation'>@page { size: landscape; }</style>");
        };

        /**
         * remove the print orientation before printing
         * @return - None
         */
        var removePrintOrientation = function() {
            $('#print-orientation').remove();
        };

        /**
         * CICO-27954: missing print functionality for activity logs
         */
    	$scope.print = function() {

    		$("header h1").addClass('text-hide');
    		$(".cards-header").css({marginBottom: '2%'});

    		//changing the orientation to landscape
            addPrintOrientation();

            //as part of https://stayntouch.atlassian.net/browse/CICO-14384?focusedCommentId=48871&page=com.atlassian.jira.plugin.system.issuetabpanels:comment-tabpanel#comment-48871
            //We dont know the icon background-image loaded or not. We need to start print preview
            //only when it is loaded, this is wrong practice (accessing DOM elements from controller), but there is no option
            var $container = $('#print-orientation'),
                bg = $container.css('background-image'),
                src = bg.replace(/(^url\()|(\)$|[\"\'])/g, ''),
                $img = $('<img>').attr('src', src).on('load', function() {
                    //unbinding the events & removing the elements inorder to prevent memory leaks
                    $(this).off('load');
                    $(this).remove();

                    //yes we have everything we wanted
                    window.print();

                    //if we are in the app
                    $timeout(function() {
                        if (sntapp.cordovaLoaded) {
                            cordova.exec(
                                function(success) {},
                                function(error) {},
                                'RVCardPlugin',
                                'printWebView', []
                            );
                        };
                    }, 300);


                    $timeout(function() {
                    	$("header h1").removeClass('text-hide');
                    	$(".cards-header").css({marginBottom: '0'});
                        removePrintOrientation();
                    }, 1200);
                });
    	};

    	$scope.init();
	}
]);