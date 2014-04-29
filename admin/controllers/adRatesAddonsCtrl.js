admin.controller('ADRatesAddonsCtrl', [
	'$scope',
	'ADRatesAddonsSrv',
	'dateFilter',
	function($scope, ADRatesAddonsSrv, dateFilter) {

		// $scope.date = dateFilter(new Date(), 'yyyy-MM-dd');
		// $scope.minDate = '2013-10-06';
		// $scope.maxDate = '2014-10-06';

		// extend base controller
		$scope.init = function() {
			BaseCtrl.call(this, $scope);

			// various addon data holders
			$scope.addonList   = [];
			$scope.newAddon    = {};
			$scope.singleAddon = {};

			// for adding 
			$scope.isAddMode = false;

			// for editing
			$scope.isEditMode = false;
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
		$scope.getTemplateUrl = function(rowName) {
			return "/assets/partials/rates/adNewAddon.html";
		}

		// to add new addon
		$scope.addNew = function(){
			$scope.isAddMode  = true;
			$scope.isEditMode = false;

			// title for the sub template
			$scope.likeTitle    = "Add New";
			$scope.likeSubtitle = "Addon";

			// params to be sent to server
			$scope.newAddon            = {};
			$scope.newAddon.activated  = true;
			$scope.newAddon.begin_date = dateFilter(new Date(), 'yyyy-MM-dd');
			$scope.newAddon.end_date   = dateFilter(new Date(), 'yyyy-MM-dd');
		}

		$scope.editSingle = function() {
			$scope.isAddMode  = false;
			$scope.isEditMode = true;

			var callback = function(data) {
				$scope.$emit('hideLoader');
				
				$scope.singleAddon = data.results;
			};

			$scope.invokeApi(ADRatesAddonsSrv.fetchSingle, this.item.id, callback);
		};

		// on close all add/edit modes
		$scope.cancelCliked = function(){
			$scope.isAddMode  = false;
			$scope.isEditMode = false;
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

				$scope.invokeApi(ADRatesAddonsSrv.addNewAddon, $scope.newAddon, callback);
			};

			// if we are editing an addon
			if ( $scope.isEditMode ) {

			};
		};
	}
]);