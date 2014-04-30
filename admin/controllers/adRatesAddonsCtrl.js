admin.controller('ADRatesAddonsCtrl', [
	'$scope',
	'ADRatesAddonsSrv',
	'dateFilter',
	function($scope, ADRatesAddonsSrv, dateFilter) {

		// extend base controller
		$scope.init = function() {
			BaseCtrl.call(this, $scope);

			// various addon data holders
			$scope.addonList   = [];
			$scope.singleAddon = {};

			// for adding 
			$scope.isAddMode = false;

			// api load count
			$scope.apiLoadCount = 0;
		};

		$scope.init();

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

		// fetch addon list
		$scope.fetchAddons = function() {
			var callback = function(data) {				
				$scope.addonList  = data.results;
				$scope.total      = data.total_count;
				$scope.bestseller = data.bestseller;

				// when ever we are ready to emit 'hideLoader'
				$scope.apiLoadCount++
				if ( $scope.apiLoadCount > 4 ) {
					$scope.$emit('hideLoader');
				};
			};

			$scope.invokeApi(ADRatesAddonsSrv.fetch, {}, callback);
		};

		$scope.fetchAddons();

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
			$scope.singleAddon.begin_date = dateFilter(new Date(), 'yyyy-MM-dd');
			$scope.singleAddon.end_date   = dateFilter(new Date(), 'yyyy-MM-dd');
		}

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
					$scope.fetchAddons();
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
	}
]);