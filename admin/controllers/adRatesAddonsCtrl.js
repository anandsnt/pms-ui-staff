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
		};

		$scope.init();

		// fetch addon list
		$scope.fetchAddons = function() {
			var callback = function(data) {
				$scope.$emit('hideLoader');
				
				$scope.addonList  = data.results;
				$scope.total      = data.total_count;
				$scope.bestseller = data.bestseller;
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
			$scope.likeTitle    = "Add New";
			$scope.likeSubtitle = "Addon";

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
			$scope.likeTitle    = "Edit";
			$scope.likeSubtitle = this.item.name;

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
	}
]);