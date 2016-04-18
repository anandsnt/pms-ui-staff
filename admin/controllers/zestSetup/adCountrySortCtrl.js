admin.controller('ADCountrySortCtrl', ['$scope','ADCountrySortSrv',
	function($scope,ADCountrySortSrv) {

		BaseCtrl.call(this, $scope);
		$scope.successMessage = '';
		$scope.listingMode = true;
		$scope.countrySelected = "";


		$scope.countries=[{id:2,name:"USA"},{id:22,name:"res"},{id:23,name:"US4A"},{id:24,name:"re45s"}];
		$scope.contentList=[{id:2,name:"USA"},{id:22,name:"res"}];


		$scope.addCountryToSequence = function(){
			$scope.listingMode = false;
		};

		$scope.backClicked = function(){
			$scope.listingMode = true;
		};

		$scope.saveCountry = function(){
			var successCallBack = function(){
				var countrySelected  = _.find($scope.countries, function(country){
			    	return parseInt(country.id) === parseInt($scope.countrySelected);
				});
				$scope.contentList.push(countrySelected);
			};
			
			var selectedCountryIndex = _.findIndex($scope.contentList,function(country){return country.id == $scope.countrySelected});
			//push only if country wasnt added before
			if(selectedCountryIndex === -1){
				successCallBack();
			}
			else{
				//do nothing
			}
			$scope.countrySelected = "";
			$scope.listingMode = true;
			
		};

		$scope.deleteItem = function(id,$index){
			var successCallBack = function(){
				$scope.contentList = _.without($scope.contentList, _.findWhere($scope.contentList, {id: id}));
			};
			successCallBack();
		};

		/* save new order*/

		var saveNewPosition = function(id, position, prevPosition) {
			var data = {
				id : id,
				position : position + 1,
				previous_position : prevPosition + 1
			};
			$scope.invokeApi(ADCountrySortSrv.saveComponentOrder, data, successCallbackSavePosition);

		};

		$scope.sortableOptions = {
			stop: function(e, ui) {
				if (ui.item.sortable.dropindex !== ui.item.sortable.index && ui.item.sortable.dropindex !== null) {
					saveNewPosition(ui.item.sortable.model.id, ui.item.sortable.dropindex, ui.item.sortable.index);
				}
			}
		};
	}
]);