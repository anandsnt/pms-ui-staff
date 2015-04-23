admin.controller('ADMappingCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'ADMappingSrv', 'ADInterfaceMappingSrv', function($scope, $rootScope, $state, $stateParams, ADMappingSrv, ADInterfaceMappingSrv) {
	
	BaseCtrl.call(this, $scope);
	$scope.hotelId = $rootScope.hotelId;
	//$scope.hotelId = 1;
	$scope.editData   = {};
	$scope.editData.sntValues = [];
	$scope.currentClickedElement = -1;
	/*
    * Variables set to show/hide forms.
    */
	$scope.isEdit = false;
	$scope.isAdd = false;
	$scope.addFormView = false;
        
        
        $scope.showAddNew = function(){
            $scope.addFormView = true;
        };
        $scope.hideAddNew = function(){
            $scope.addFormView = false;
        };
	
        $scope.openAddNew = function(){
            $scope.isAdd = true;
        };
        $scope.closeAddNew = function(){
            $scope.isAdd = false;
        };
        
        $scope.componentData = {};
        
	var fetchSuccess = function(data){
		$scope.data = data;
		$scope.$emit('hideLoader');
                var debuggin = true;
		// Set Flag to disable Add new.
		if($scope.data.disable_mappings) {
                    if (debuggin){
                        $scope.showAddNew();
                    } else {
                        $scope.closeAddNew();
                        $scope.showAddNew();
                    }
                } else {
                    $scope.showAddNew();
                }
                
                //then save the sub-components by the component name
                //ie. Component -External Mappings- [subcomponents: [SiteMinder Mappings]];
                
	};
        $scope.extMappingSubComponents = [];
        $scope.mappingInterface = {};
        $scope.cacheInterfaceId = function(data){
            $scope.lastInterface = {};
            $scope.lastInterface.id = data.id;
            $scope.lastInterface.name = data.name;
            console.log('pulling out the interface id:');
            console.log('interface id: '+data.id+', interface name: '+data.name);
            console.log(arguments);
        };
        var fetchMappingItemsSuccess = function(data){
            $scope.extMappingSubComponents.push(data.interface_mappings);
            console.log(data);
            $scope.$emit('hideLoader');
        };
        var fetchMappingsSuccess = function(data){
            console.log(data);
            data.interface = $scope.lastInterface;
            console.log(data);
            $scope.mappingInterface = {};
            $scope.mappingInterface = data;
            $scope.$emit('hideLoader');
        };
	
	//$scope.invokeApi(ADMappingSrv.fetchMappingList, {'id':$scope.hotelId}, fetchSuccess);
	
        $scope.fetchExternalMappingItems = function(){
            console.log('fetching mapping items');
            $scope.invokeApi(ADInterfaceMappingSrv.fetchMappingList, {'id':$scope.hotelId}, fetchMappingItemsSuccess);
        };
        $scope.fetchInterfaceMappings = function(){
            console.log('fetching mapping items');
            console.log('last interface');
            console.log($scope.lastInterface);
            $scope.invokeApi(ADInterfaceMappingSrv.fetchMappings, {'id':$scope.hotelId, interface_type_id:$scope.lastClickedInterfaceId}, fetchMappingsSuccess);
        };
        
	/*
    * Function to render edit screen with mapping data.
    * @param {id} id of the mapping item.
    */
	$scope.editSelected = function(id)	{
		
		$scope.errorMessage ="";
		$scope.currentClickedElement = id;
		$scope.editId = id;
		var data = { 'editId' : id };

		var editMappingSuccessCallback = function(data) {
			$scope.$emit('hideLoader');
			$scope.editData = data;
			$scope.editData.mapping_value = data.selected_mapping_type;
			$scope.editData.snt_value = data.selected_snt_value;
			$scope.editData.external_value = data.external_value;
			$scope.editData.source_code = data.source_code;
			$scope.editData.value = data.value;
			$scope.isEdit = true;
			$scope.isAdd = false;
			// Initial loading data to SNT VALUES dropdown.
			angular.forEach($scope.editData.mapping_type,function(item, index) {
	       		if (item.name == $scope.editData.selected_mapping_type) {
	       			$scope.editData.sntValues = item.sntvalues;
			 	}
       		});
		};
		$scope.invokeApi(ADMappingSrv.fetchEditMapping, data, editMappingSuccessCallback );
	};
	/*
    * Function to render template for add/edit screens.
    */
 	$scope.getTemplateUrl = function(){
 		return "/assets/partials/mapping/adExternalMappingDetails.html";
 	};
 	/*
    * Function to render Add screen with mapping data.
    */
 	$scope.addNew = function(){
 		var addMappingSuccessCallback = function(data) {
			$scope.$emit('hideLoader');
			$scope.editData = data;
			$scope.openAddNew();
			$scope.isEdit = false;
		};
		$scope.invokeApi(ADMappingSrv.fetchAddMapping, { 'hotelId': $scope.data.hotel_id }, addMappingSuccessCallback );
	};
	/*
    * To close inline tabs on cancel/save clicks
    */
	$scope.closeInlineTab = function (){
		if($scope.isAdd)
			$scope.isAdd = false;
		else if($scope.isEdit)
			$scope.isEdit = false;
	};
	/*
    * To handle save button click.
    */
	$scope.clickedSave = function(){
		
		var successSaveCallback = function(data){
			$scope.$emit('hideLoader');
			if($scope.isAdd) $scope.data.total_count ++ ;
			// To update scope data with added item
			var newData = {
                            "value": data.value,
                            "snt_value": postData.snt_value,
                            "source_code":postData.source_code,
                            "external_value": postData.external_value
                        };
            
			angular.forEach($scope.data.mapping,function(item, index) {
	       		if (item.mapping_type == postData.mapping_value) {
                            $scope.data.mapping[index].mapping_values.push(newData);
                        }
	       	});
			$scope.closeInlineTab();
			$scope.invokeApi(ADMappingSrv.fetchMappingList, {'id':$scope.hotelId}, fetchSuccess);
		};
		
		var unwantedKeys = ["mapping_type","sntValues","selected_mapping_type","selected_snt_value" ];
		var postData = dclone($scope.editData, unwantedKeys);
		postData.hotel_id = $scope.data.hotel_id;
                postData.interface_id = $scope.lastClickedInterfaceId;
		
		if($scope.isEdit) postData.value = $scope.editId;
		
		$scope.invokeApi(ADMappingSrv.saveMapping, postData, successSaveCallback);
	};
        
        $scope.setActiveItem = function(itemObj){
            this.activeItem = itemObj.id;
        };
	/**
	 *   A post method to update Active/Inactive status for an interface mapping type
	 */

	$scope.toggleClicked = function() {
		var item = this.activeItem;

		var data = {
			'id' : item.id,
			'set_active' : item.is_active ? false : true
		};

		var postSuccess = function() {
			$scope.$emit('hideLoader');
			item.is_active = item.is_active ? false : true;
		};

		$scope.invokeApi(ADInterfaceMappingSrv.switchToggle, data, postSuccess);
	};
        
   	/*
    * Function to handle delete button click.
    * @param {mappingId} mappingId of the mapping item.
    */
	$scope.clickedDelete = function(mappingId){
		
		var successDeletionCallback = function(){
			$scope.$emit('hideLoader');
			$scope.data.total_count -- ;
			// delete data from scope
			angular.forEach($scope.data.mapping,function(item1, index1) {
				angular.forEach(item1.mapping_values,function(item2, index2) {
		 			if (item2.value == mappingId) {
		 				item1.mapping_values.splice(index2, 1);
		 			}
 				});
 			});
		};
		
		$scope.invokeApi(ADMappingSrv.deleteMapping, {'value':mappingId }, successDeletionCallback);
	};
	/*
    * Function to handle data change in 'Mapping type'.
    * Data is injected to sntValues based on 'Mapping type' values.
    */
        $scope.$watch('editData.mapping_value', function() {
        $scope.editData.sntValues = [];
        angular.forEach($scope.editData.mapping_type,function(item, index) {
                 if (item.name == $scope.editData.mapping_value) {
                     $scope.editData.sntValues = item.sntvalues;
                 }
        });
   	});
   	
}]);
