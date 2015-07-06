admin.controller('ADRatesAddonsCtrl', [
	'$scope',
	'$rootScope',
	'ADRatesAddonsSrv',
	'ADHotelSettingsSrv',
	'$filter',
	'ngTableParams',
	'ngDialog',
	'$timeout',
	function($scope, $rootScope, ADRatesAddonsSrv, ADHotelSettingsSrv, $filter, ngTableParams, ngDialog, $timeout) {



		// extend base controller
		$scope.init = function() {
			ADBaseTableCtrl.call(this, $scope, ngTableParams);

			// various addon data holders
			$scope.data   = [];
			$scope.singleAddon = {};

			// for adding
			$scope.isAddMode = false;

			// api load count
			$scope.apiLoadCount = 0;
			$scope.chargeCodesForChargeGrp = [];
			$scope.singleAddon.charge_group_id = "";
			$scope.currentClickedAddon = -1;
			$scope.errorMessage = "";
			$scope.successMessage = "";
		};

		$scope.isConnectedToPMS = false;
		$scope.checkPMSConnection = function(){
			var fetchSuccessOfHotelSettings = function(data){
				if(data.pms_type !== null)
					$scope.isConnectedToPMS = true;
			}
			$scope.invokeApi(ADHotelSettingsSrv.fetch, {}, fetchSuccessOfHotelSettings);
		};
		$scope.checkPMSConnection();

		$scope.init();




		$scope.fetchTableData = function($defer, params) {
			var getParams = $scope.calculateGetParams(params);
			$scope.currentClickedAddon = -1;

			var fetchSuccessOfItemList = function(data) {
				$scope.totalCount = data.total_count;
				$scope.totalPage = Math.ceil(data.total_count / $scope.displyCount);

				$scope.currentPage = params.page();
	        	params.total(data.total_count);

	        	// sort the results
	        	$scope.data = params.sorting() ?
	        	                    $filter('orderBy')(data.results, params.orderBy()) :
	        	                    data.results;

	            $defer.resolve($scope.data);

	            $scope.$emit('hideLoader');
	            $scope.fetchOtherApis();
			};
			$scope.invokeApi(ADRatesAddonsSrv.fetch, getParams, fetchSuccessOfItemList);
		};

		$scope.loadTable = function() {
			$scope.currentClickedAddon = -1;
			$scope.tableParams = new ngTableParams({
			        page: 1,  // show first page
			        count: $scope.displyCount, // count per page
			        sorting: {
			            name: 'asc' // initial sorting
			        }
			    }, {
			        total: 0, // length of data
			        getData: $scope.fetchTableData
			    }
			);
		};

		$scope.loadTable();

		// map charge codes for selected charge charge group

		var manipulateChargeCodeForChargeGroups = function(){

			if(!$scope.singleAddon.charge_group_id){
				$scope.chargeCodesForChargeGrp = $scope.chargeCodes;
			}
			else{
				var selectedChargeGrpId = $scope.singleAddon.charge_group_id;
				$scope.chargeCodesForChargeGrp =[];
		   		angular.forEach($scope.chargeCodes, function(chargeCode, key) {
		        angular.forEach(chargeCode.associcated_charge_groups, function(associatedChargeGrp, key) {
		        	if(associatedChargeGrp.id === selectedChargeGrpId){
		        		$scope.chargeCodesForChargeGrp.push(chargeCode);
		        	}
		        });
		     });

			}
		};



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
			$scope.invokeApi(ADRatesAddonsSrv.fetchChargeGroups, {}, cgCallback, '', 'NONE');


			// fetch charge codes
			var ccCallback = function(data) {
				$scope.chargeCodes = data.results;
				manipulateChargeCodeForChargeGroups();
				$scope.$emit('hideLoader');
			};
			$scope.invokeApi(ADRatesAddonsSrv.fetchChargeCodes, {}, ccCallback, '', 'NONE');

			// fetch amount types
			var atCallback = function(data) {
				$scope.amountTypes = data;
				$scope.$emit('hideLoader');
			};
			$scope.invokeApi(ADRatesAddonsSrv.fetchReferenceValue, { 'type': 'amount_type' }, atCallback, '', 'NONE');

			// fetch post types
			var ptCallback = function(data) {
				$scope.postTypes = data;
				$scope.$emit('hideLoader');
			};
			$scope.invokeApi(ADRatesAddonsSrv.fetchReferenceValue, { 'type': 'post_type' }, ptCallback, '', 'NONE');

			// fetch the current business date
			var bdCallback = function(data) {

				// dwad convert the date to 'MM-dd-yyyy'
				$scope.businessDate = data.business_date;
				$scope.$emit('hideLoader');
			};
			$scope.invokeApi(ADRatesAddonsSrv.fetchBusinessDate, {}, bdCallback, '', 'NONE');
		};



		// To fetch the template for chains details add/edit screens
		$scope.getTemplateUrl = function() {
			return "/assets/partials/rates/adNewAddon.html";
		};

		// to add new addon
		$scope.addNew = function() {

			$scope.singleAddon.charge_group_id ="";
			manipulateChargeCodeForChargeGroups();

			$scope.isAddMode   = true;
			$scope.isEditMode  = false;

			// reset any currently being edited
			$scope.currentClickedAddon = -1;

			// title for the sub template
			$scope.addonTitle    = $filter('translate')('ADD_NEW_SMALL');
			$scope.addonSubtitle = $filter('translate')('ADD_ON');

			// params to be sent to server
			$scope.singleAddon            = {};
			$scope.singleAddon.activated  = true;

			// today should be business date, currently not avaliable
			var today = tzIndependentDate();
            var weekAfter = today.setDate(today.getDate() + 7);

            // the inital dates to business date // CICO-17736 Addons can have blank begin-end dates
   			$scope.singleAddon.begin_date = null;
			$scope.singleAddon.end_date   = null;
		};

		// listen for datepicker update from ngDialog
		var updateBind = $rootScope.$on('datepicker.update', function(event, chosenDate) {

			// covert the date back to 'MM-dd-yyyy' format
			if ( $scope.dateNeeded === 'From' ) {
	            $scope.singleAddon.begin_date = chosenDate;
	            // convert system date to MM-dd-yyyy format
				$scope.singleAddon.begin_date_for_display = $filter('date')(tzIndependentDate(chosenDate), $rootScope.dateFormat);


	            // if user moved begin_date in a way
	            // that the end_date is before begin_date
	            // we must set the end_date to begin_date
	            // so that user may not submit invalid dates
	            if ( tzIndependentDate($scope.singleAddon.begin_date) - tzIndependentDate($scope.singleAddon.end_date) > 0 ) {
	                $scope.singleAddon.end_date = chosenDate
	                $scope.singleAddon.end_date_for_display   = $filter('date')(tzIndependentDate(chosenDate), $rootScope.dateFormat);
	            }
			} else {
				  $scope.singleAddon.end_date = chosenDate
	              $scope.singleAddon.end_date_for_display   = $filter('date')(tzIndependentDate(chosenDate), $rootScope.dateFormat);
			}
		});

		$scope.resetDate = function(pickerId) {

			if ( pickerId === 'From' ) {
				$scope.singleAddon.begin_date_for_display = "";
				$scope.singleAddon.begin_date = null;
			}
			else{
				$scope.singleAddon.end_date_for_display   = "";
				$scope.singleAddon.end_date = null;
			};

		};

		// the listner must be destroyed when no needed anymore
		$scope.$on( '$destroy', updateBind );

		$scope.editSingle = function() {
			$scope.isAddMode   = false;
			$scope.isEditMode  = true;

			// set the current selected
			$scope.currentClickedAddon = this.$index;

			// title for the sub template
			$scope.addonTitle    = $filter('translate')('EDIT');
			$scope.addonSubtitle = this.item.name;

			// empty singleAddon
			$scope.singleAddon = {};

			// keep the selected item id in scope
			$scope.currentAddonId = this.item.id;

			var callback = function(data) {
				$scope.$emit('hideLoader');

				$scope.singleAddon = data;
				manipulateChargeCodeForChargeGroups();

				// Display currency with two decimals
				$scope.singleAddon.amount = $filter('number')($scope.singleAddon.amount, 2);

				// now remove commas created by number
				// when the number is greater than 3 digits (without fractions)
				$scope.singleAddon.amount = $scope.singleAddon.amount.split(',').join('');


				// if the user is editing an old addon
				// where the dates are not set
				// set the date to current business date
				if ( !$scope.singleAddon.begin_date ) {
					$scope.singleAddon.begin_date = null; // CICO-17736 Addons can have blank begin-end dates
					$scope.singleAddon.begin_date_for_display = "";
				}else{
					$scope.singleAddon.begin_date_for_display = $filter('date')(tzIndependentDate($scope.singleAddon.begin_date), $rootScope.dateFormat);
				}
				if ( !$scope.singleAddon.end_date ) {
					$scope.singleAddon.end_date = null; // CICO-17736 Addons can have blank begin-end dates
					$scope.singleAddon.end_date_for_display = "";
				}else{
					$scope.singleAddon.end_date_for_display   = $filter('date')(tzIndependentDate($scope.singleAddon.end_date), $rootScope.dateFormat);
				};

				// convert system date to MM-dd-yyyy format



				$scope.singleAddon.begin_date = $scope.singleAddon.begin_date;
				$scope.singleAddon.end_date   =$scope.singleAddon.end_date;

			};

			$scope.invokeApi(ADRatesAddonsSrv.fetchSingle, $scope.currentAddonId, callback);
		};

		// on close all add/edit modes
		$scope.cancelCliked = function(){
			$scope.isAddMode  = false;
			$scope.isEditMode = false;

			// remove the item being edited
			$scope.currentClickedAddon = -1;
		};

		// on save add/edit addon
		$scope.addUpdateAddon = function() {



			var singleAddonData = {};
			singleAddonData.activated = $scope.singleAddon.activated;
			singleAddonData.amount = $scope.singleAddon.amount;
			singleAddonData.amount_type_id = $scope.singleAddon.amount_type_id;
			singleAddonData.bestseller = $scope.singleAddon.bestseller;
			singleAddonData.charge_code_id = $scope.singleAddon.charge_code_id;
			singleAddonData.charge_group_id = $scope.singleAddon.charge_group_id;
			singleAddonData.description = $scope.singleAddon.description;
			singleAddonData.is_reservation_only = $scope.singleAddon.is_reservation_only;
			singleAddonData.name = $scope.singleAddon.name;
			singleAddonData.post_type_id = $scope.singleAddon.post_type_id;
			singleAddonData.rate_code_only = $scope.singleAddon.rate_code_only;
			singleAddonData.manual_posting = $scope.singleAddon.manual_posting;

			// convert dates to system format yyyy-MM-dd
			// if not date null should be passed - read story CICO-7287
			singleAddonData.begin_date = $scope.singleAddon.begin_date ? $filter('date')(tzIndependentDate($scope.singleAddon.begin_date), 'yyyy-MM-dd') : null;
			singleAddonData.end_date = $scope.singleAddon.end_date? $filter('date')(tzIndependentDate($scope.singleAddon.end_date), 'yyyy-MM-dd') : null;



			// if we are adding new addon
			if ( $scope.isAddMode ) {
				var callback = function() {
					$scope.$emit('hideLoader');
					$scope.isAddMode = false;

					$scope.tableParams.reload();
				};


				$scope.invokeApi(ADRatesAddonsSrv.addNewAddon, singleAddonData, callback);
			};

			// if we are editing an addon
			if ( $scope.isEditMode ) {
				var callback = function() {
					$scope.$emit('hideLoader');

					$scope.isEditMode = false;
					$scope.currentClickedAddon = -1;

					$scope.tableParams.reload();
				};

				// include current addon id also
				singleAddonData.id = $scope.currentAddonId;

				$scope.invokeApi(ADRatesAddonsSrv.updateSingle, singleAddonData, callback);
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
			};

			$scope.invokeApi(ADRatesAddonsSrv.switchActivation, data, callback);
		};

		// on delete addon
		$scope.deleteAddon = function() {
			var item = this.item;
			$scope.currentClickedAddon = -1;

			var callback = function() {
				var withoutThis = _.without( $scope.data, item );
				$scope.data = withoutThis;

				$scope.$emit('hideLoader');

				// $scope.tableParams.reload();
			};

			var data = {
				id: item.id
			};

			$scope.invokeApi(ADRatesAddonsSrv.deleteAddon, data, callback);
		};

	    $scope.popupCalendar = function(dateNeeded) {
	    	$scope.dateNeeded = dateNeeded;

	    	ngDialog.open({
	    		 template: '/assets/partials/rates/addonsDateRangeCalenderPopup.html',
	    		 controller: 'addonsDatesRangeCtrl',
				 className: 'ngdialog-theme-default single-date-picker',
				 closeByDocument: true,
				 scope: $scope
	    	});
	    };

	    $scope.chargeGroupChage = function(){
			$scope.singleAddon.charge_code_id = "";
			manipulateChargeCodeForChargeGroups();
		};

		$scope.reservationOnlyChanged = function(){
			$scope.singleAddon.rate_code_only = $scope.singleAddon.is_reservation_only? false : $scope.singleAddon.is_reservation_only;
		};

		$scope.rateOnlyChanged = function(){
			$scope.singleAddon.is_reservation_only = $scope.singleAddon.rate_code_only ? false : $scope.singleAddon.is_reservation_only;
		};
		$scope.sortByName = function(){
		if($scope.currentClickedAddon == -1)
			$scope.tableParams.sorting({'name' : $scope.tableParams.isSortBy('name', 'asc') ? 'desc' : 'asc'});
		};
		$scope.sortByDescription = function(){
		if($scope.currentClickedAddon == -1)
			$scope.tableParams.sorting({'description' : $scope.tableParams.isSortBy('description', 'asc') ? 'desc' : 'asc'});
		};

		/**
		* To import the package details from MICROS PMS.
		*/
		$scope.importFromPms = function(event){

			event.stopPropagation();

			$scope.successMessage = "Collecting package details from PMS and adding to Rover...";

			var fetchSuccessOfPackageList = function(data){
				$scope.$emit('hideLoader');
				$scope.successMessage = "Completed!";
		 		$timeout(function() {
			        $scope.successMessage = "";
			    }, 1000);
			};
			$scope.invokeApi(ADRatesAddonsSrv.importPackages, {}, fetchSuccessOfPackageList);
		}

	}
]);