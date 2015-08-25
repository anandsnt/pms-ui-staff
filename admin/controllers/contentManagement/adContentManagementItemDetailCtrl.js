admin.controller('ADContentManagementItemDetailCtrl',['$scope', '$state', '$stateParams', 'ngDialog', 'ADContentManagementSrv', 'ngTableParams','$filter', '$anchorScroll', '$timeout',  '$location', 'ADRatesAddonsSrv',
 function($scope, $state, $stateParams, ngDialog, ADContentManagementSrv, ngTableParams, $filter, $anchorScroll, $timeout, $location, ADRatesAddonsSrv){

	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);

	 $scope.fileName = "Choose file...";
	 $scope.initialIcon = '';
	 $scope.addons = [];
     $scope.min_duration_values = [];
     $scope.max_order_values = [];
     $scope.space_occupancys = [];
     $scope.space_durations = [];




     var init = function(){
     	var  duration;

        for(var i = 0; i < 30; i++){
           duration = {};
           duration.value = i + 1;
           duration.name = duration.value;
           $scope.min_duration_values.push(duration);
        }


        var  order;

        for(var i = 0; i < 5; i++){
           order = {};
           order.value = i + 1;
           order.name = order.value;
           $scope.max_order_values.push(order);
        }
     };

     init();


	 /*Initializing data, for adding a new item.
    */
	$scope.data = {
	            "component_type": "PAGE",
	            "status": false,
	            "name": "",
	            "image": '',
	            "address": "",
	            "phone": "",
	            "page_template": "POI",
	            "website_url": "",
	            "description": "",
	            "addon_id": "",
	            "screen_id": "",
	            "addon_min_duration": "",
	            "addon_max_order": "",
  				"durations": [],
  				"recipient_email_accounts": "",
  				"maximum_occupancy": "",
	            "parent_category": [],
	            "parent_section": [],
            };

$scope.fetchAddons = function(){
    var fetchSuccessOfAddons = function(data) {

       $scope.addons = $scope.getAddonsWithNameValues(data.results);
       $scope.$emit('hideLoader');
   };
   $scope.invokeApi(ADRatesAddonsSrv.fetch, {"no_pagination": true}, fetchSuccessOfAddons);
};

    $scope.getAddonsWithNameValues = function(addons){
        angular.forEach(addons,function(item, index) {
       		item.value = item.id;

  	  });
        return addons;
};

// for fetch meeting room Details
$scope.fetchSpaces = function(){
    var fetchSuccessOfSpaces = function(data) {
       $scope.space_occupancys = $scope.getListWithNameValues(data.meeting_room_occupancy);  // change need 
	   // $scope.space_durations = data.meeting_room_durations;  // change need
       $scope.space_durations = $scope.getDurationsWithNameValues([1,2,3,4]);
       $scope.$emit('hideLoader');
    };
   $scope.invokeApi(ADContentManagementSrv.fetchMeetingRooms, {"no_pagination": true}, fetchSuccessOfSpaces);
};
$scope.getDurationsWithNameValues = function(items) {
	var list = [];
	var obj;
    angular.forEach(items,function(item, index) {
        obj = {};
       	obj.value = item;
       	obj.name = item;
       	obj.isChecked = $scope.data.durations.indexOf(item) === -1?  false : true;
       	list.push(obj);

    });
        return list;
};
$scope.getListWithNameValues = function(items) {
	var list = [];
	var obj;
    angular.forEach(items,function(item, index) {
        obj = {};
       	obj.value = item;
       	obj.name = item;
       	list.push(obj);

    });
        return list;
};

$scope.setSpaceDurations = function(val,index) {
	var duration = $scope.space_durations[index];
	var flag = $scope.data.durations.indexOf(duration.value);
	if(flag === -1){
		$scope.data.durations.push(duration.value);
	}
	else{
		$scope.data.durations.splice(0,flag);
	}
}

$scope.itemTypeSelected = function(){

	if($scope.data.page_template === "ADDON" && $scope.addons.length === 0){
		$scope.fetchAddons();
	}else if($scope.data.page_template === "SPACE" && $scope.space_occupancys.length === 0){
		$scope.fetchSpaces();
	}
};

$scope.getSelectedAddonDescription = function(){
	var description = "";
     angular.forEach($scope.addons,function(item, index) {
       if(item.value === $scope.data.addon_id) {
       	description = item.description;
       }
  	});
     return description;
};

$scope.getSelectedAddonPrice = function(){
	var price = "";
	angular.forEach($scope.addons,function(item, index) {
       if(item.value === $scope.data.addon_id) {
       	price = item.amount;
       }
  });
     return price;
};

	/*Function to fetch the item details
    */
	$scope.fetchItem = function(){
		var fetchItemSuccessCallback = function(data){
			$scope.data = data;
			$scope.initialIcon =  $scope.data.image;
			if(data.page_template === 'ADDON'){
				$scope.fetchAddons();
				$scope.data.addon_max_order = $scope.data.addon_max_order === null? "" : $scope.data.addon_max_order;
				$scope.data.addon_min_duration = $scope.data.addon_min_duration === null ? "" : $scope.data.addon_min_duration;
			}else{
				$scope.$emit('hideLoader');
			}
		};
		$scope.invokeApi(ADContentManagementSrv.fetchComponent, $stateParams.id , fetchItemSuccessCallback);
	};
	/*Checkin if the screen is loaded for a new item or,
	 * for existing item.
    */
	if($stateParams.id !== 'new'){
		$scope.isAddMode = false;
		$scope.fetchItem();
	}
	else{
		$scope.isAddMode = true;
	}
	/*Function to return to preveous state
    */
	$scope.goBack = function(){
        $state.go('admin.cmscomponentSettings');
	};
	/*Function to popup the assign parent modal.
	 *The param isSection === true, implies the modal is for assigning sections
	 *Otherwise the modal is for assigning categories
    */
	$scope.openAddParentModal = function(isSection){
		$scope.isSection = isSection;
		$scope.componentList = [];
          ngDialog.open({
                template: '/assets/partials/contentManagement/adContentManagementAssignComponentModal.html',
                controller: 'ADContentManagementAssignComponentCtrl',
                className: '',
                scope: $scope
            });
	};
	/*Function to save an item
    */
	$scope.saveItem = function(){
		var saveItemSuccessCallback = function(data){
			$scope.$emit('hideLoader');
			$scope.goBack();
		};
		var unwantedKeys = ["icon"];
		if($scope.initialIcon === $scope.data.image) {
			unwantedKeys = ["icon", "image"];
		}
		var data = dclone($scope.data, unwantedKeys);
		$scope.invokeApi(ADContentManagementSrv.saveComponent, data , saveItemSuccessCallback);
	};

	/* delete component starts here*/

	$scope.deleteItem = function(id){
		var successCallbackFetchDeleteDetails = function(data){
			$scope.assocatedChildComponents = [];
			$scope.assocatedChildComponents = data.results;
			$scope.$emit('hideLoader');
			ngDialog.open({
				template: '/assets/partials/contentManagement/adDeleteContent.html',
				className: '',
				controller:'adDeleteContentController',
				scope:$scope,
				closeByDocument:true
			});
			$scope.componentIdToDelete = id;
		};
		$scope.invokeApi(ADContentManagementSrv.fetchChildList, {'id':id} , successCallbackFetchDeleteDetails);

	};
	/* Function to remove the category from selected list*/
	$scope.deleteParentCategory = function(index){
		$scope.data.parent_category.splice(index, 1);
	};
	/* Function to remove the section from selected list*/
	$scope.deleteParentSection = function(index){
		$scope.data.parent_section.splice(index, 1);
	};
	/* Listener to know that the current category is deleted.
	 * Need to go back to preveous state in this case
	 */
	$scope.$on('componentDeleted', function(event, data) {

      $scope.goBack();

   });

}]);

