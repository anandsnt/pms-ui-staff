admin.controller('ADRatesAddonsCtrl', [
	'$scope',
	'$rootScope',
	'ADRatesAddonsSrv',
	'dateFilter',
	'ngTableParams',
	'ngDialog',
	function($scope, $rootScope, ADRatesAddonsSrv, dateFilter, ngTableParams, ngDialog) {

		

		// extend base controller
		$scope.init = function() {
			ADBaseTableCtrl.call(this, $scope, ngTableParams);

			// various addon data holders
			$scope.addonList   = [];
			$scope.singleAddon = {};

			// for adding 
			$scope.isAddMode = false;

			// api load count
			$scope.apiLoadCount = 0;
		};

		$scope.init();




		$scope.fetchTableData = function($defer, params) {
			var getParams = $scope.calculateGetParams(params);

			var fetchSuccessOfItemList = function(data) {
				$scope.totalCount = data.totall_count;
				$scope.totalPage = Math.ceil(data.total_count / $scope.displyCount);
				
				$scope.currentPage = params.page();
	        	params.total(data.total_count);

	        	$scope.addonList = data.results;
	            $defer.resolve($scope.addonList);

	            // when ever we are ready to emit 'hideLoader'
	            $scope.apiLoadCount++
	            if ( $scope.apiLoadCount > 4 ) {
	            	$scope.$emit('hideLoader');
	            };
			};
			$scope.invokeApi(ADRatesAddonsSrv.fetch, getParams, fetchSuccessOfItemList);	
		}	

		$scope.loadTable = function() {
			$scope.tableParams = new ngTableParams({
			        page: 1,  // show first page
			        count: $scope.displyCount, // count per page 
			        sorting: {
			            rate: 'asc' // initial sorting
			        }
			    }, {
			        total: 0, // length of data
			        getData: $scope.fetchTableData
			    }
			);
		}

		$scope.loadTable();




		// fetch charge groups, charge codes, amount type and post type
		$scope.fetchOtherApis = function() {

			// fetch charge groups
			var cgCallback = function(data) {
				$scope.chargeGroups = data.results;

				// when ever we are ready to emit 'hideLoader'
				$scope.apiLoadCount++
				if ( $scope.apiLoadCount > 4 ) {
					$scope.$emit('hideLoader');
				};
			};
			$scope.invokeApi(ADRatesAddonsSrv.fetchChargeGroups, {}, cgCallback);

			// fetch charge codes
			var ccCallback = function(data) {
				$scope.chargeCodes = data.results;

				// when ever we are ready to emit 'hideLoader'
				$scope.apiLoadCount++
				if ( $scope.apiLoadCount > 4 ) {
					$scope.$emit('hideLoader');
				};
			};
			$scope.invokeApi(ADRatesAddonsSrv.fetchChargeCodes, {}, ccCallback);

			// fetch amount types
			var atCallback = function(data) {
				$scope.amountTypes = data;

				// when ever we are ready to emit 'hideLoader'
				$scope.apiLoadCount++
				if ( $scope.apiLoadCount > 4 ) {
					$scope.$emit('hideLoader');
				};
			};
			$scope.invokeApi(ADRatesAddonsSrv.fetchReferenceValue, { 'type': 'amount_type' }, atCallback);

			// fetch post types
			var ptCallback = function(data) {
				$scope.postTypes = data;

				// when ever we are ready to emit 'hideLoader'
				$scope.apiLoadCount++
				if ( $scope.apiLoadCount > 4 ) {
					$scope.$emit('hideLoader');
				};
			};
			$scope.invokeApi(ADRatesAddonsSrv.fetchReferenceValue, { 'type': 'post_type' }, ptCallback);
		};

		$scope.fetchOtherApis();

		// To fetch the template for chains details add/edit screens
		$scope.getTemplateUrl = function() {
			return "/assets/partials/rates/adNewAddon.html";
		}

		// to add new addon
		$scope.addNew = function() {
			$scope.isAddMode   = true;
			$scope.isEditMode  = false;

			// reset any currently being edited 
			$scope.currentClickedAddon = -1;

			// title for the sub template
			$scope.addonTitle    = "Add New";
			$scope.addonSubtitle = "Addon";

			// params to be sent to server
			$scope.singleAddon            = {};
			$scope.singleAddon.activated  = true;

			// today should be business date, currently not avaliable
			var today = new Date();
            var weekAfter = today.setDate(today.getDate() + 7);

            // today should be business date, currently not avaliable
            $scope.singleAddon.begin_date = dateFilter(new Date(), 'yyyy-MM-dd');
			$scope.singleAddon.end_date   = dateFilter(weekAfter, 'yyyy-MM-dd');
		}

		// listen for datepicker update from ngDialog
		var updateBind = $rootScope.$on('datepicker.update', function(event, chosenDate) {    
			if ( $scope.dateNeeded === 'From' ) {
				$scope.singleAddon.begin_date = chosenDate;
			} else {
				$scope.singleAddon.end_date = chosenDate;
			}
		});

		// the listner must be destroyed when no needed anymore
		$scope.$on( '$destroy', updateBind );

		$scope.editSingle = function() {
			$scope.isAddMode   = false;
			$scope.isEditMode  = true;

			// set the current selected
			$scope.currentClickedAddon = this.$index;

			// title for the sub template
			$scope.addonTitle    = "Edit";
			$scope.addonSubtitle = this.item.name;

			// empty singleAddon
			$scope.singleAddon = {};

			// keep the selected item id in scope
			$scope.currentAddonId = this.item.id;

			var callback = function(data) {
				$scope.$emit('hideLoader');
				
				$scope.singleAddon = data;
			};

			$scope.invokeApi(ADRatesAddonsSrv.fetchSingle, $scope.currentAddonId, callback);
		};

		// on close all add/edit modes
		$scope.cancelCliked = function(){
			$scope.isAddMode  = false;
			$scope.isEditMode = false;

			// remove the item being edited
			$scope.currentClickedAddon = -1;
		}

		// on save add/edit addon
		$scope.addUpdateAddon = function() {

			// if we are adding new addon
			if ( $scope.isAddMode ) {
				var callback = function() {
					$scope.$emit('hideLoader');
					$scope.isAddMode = false;

					$scope.loadTable();
				};

				$scope.invokeApi(ADRatesAddonsSrv.addNewAddon, $scope.singleAddon, callback);
			};

			// if we are editing an addon
			if ( $scope.isEditMode ) {
				var callback = function() {
					$scope.$emit('hideLoader');

					$scope.isEditMode = false;
					$scope.currentClickedAddon = -1;
				};

				// include current addon id also
				$scope.singleAddon.id = $scope.currentAddonId;

				$scope.invokeApi(ADRatesAddonsSrv.updateSingle, $scope.singleAddon, callback);
			};
		};

		// on change activation 
		$scope.switchActivation = function() {
			var item = this.item;

			var callback = function() {
				item.activated = item.activated ? false : true;

				$scope.$emit('hideLoader');
			};

			var data = {
				id: item.id,
				status: item.activated ? false : true
			}

			$scope.invokeApi(ADRatesAddonsSrv.switchActivation, data, callback);
		};

		// on delete addon
		$scope.deleteAddon = function() {
			var item = this.item;

			var callback = function() {
				var withoutThis = _.without( $scope.addonList, item );
				$scope.addonList = withoutThis;

				$scope.$emit('hideLoader');
			};

			var data = {
				id: item.id
			}

			$scope.invokeApi(ADRatesAddonsSrv.deleteAddon, data, callback);
		};

	    $scope.popupCalendar = function(dateNeeded) {
	    	$scope.dateNeeded = dateNeeded;

	    	ngDialog.open({
	    		 template: '/assets/partials/rates/addonsDateRangeCalenderPopup.html',
	    		 controller: 'addonsDatesRangeCtrl',
				 className: 'ngdialog-theme-default calendar-modal single-date-picker',
				 closeByDocument: true,
				 scope: $scope
	    	});
	    };
	}
]);