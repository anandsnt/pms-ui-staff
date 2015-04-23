admin.controller('ADMappingCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'ADMappingSrv', 'ADInterfaceMappingSrv', function($scope, $rootScope, $state, $stateParams, ADMappingSrv, ADInterfaceMappingSrv) {
	
	BaseCtrl.call(this, $scope);
	$scope.hotelId = $rootScope.hotelId;
	//$scope.hotelId = 1;
	$scope.editData = {};
	$scope.editData.sntValues = [];
	$scope.editData.mapping_type = [];
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
        
        //for preventing drag & drop operations turning into click
        var lastDropedTime = '';
        $scope.onDragStop = function() {
            $scope.isDragging = false;

            //also we are taking the lastDropedTime to preventing click after drag stop operation
            lastDropedTime = new Date();
        };
        $scope.clickedInterfaceMenuItem = function(event, state, submenu){
            //need to cache the submenu, then go to the next state with the interface id
            cacheInterfaceId(submenu);
            setTimeout(function() {
                $scope.clickedMenuItem(event, state);
            }, 1000); 
            
        };
        
        $scope.clickedMenuItem = function($event, stateToGo) {
            var currentTime = new Date();
            if (lastDropedTime != '' && typeof lastDropedTime == 'object') {
                    var diff = currentTime - lastDropedTime;
                    if (diff <= 400) {
                            $event.preventDefault();
                            $event.stopImmediatePropagation();
                            $event.stopPropagation();
                            lastDropedTime = '';
                            return false;
                    } else {
                            lastDropedTime = '';
                            $state.go(stateToGo);
                    }
            } else {
                    lastDropedTime = '';
                    $state.go(stateToGo);
            }
            if ($scope.menuOpen) {
                    $scope.menuOpen = !$scope.menuOpen;
                    $scope.showSubMenu = false;
            }
        };
        
        $scope.extMappingSubComponents = [];
        $scope.mappingInterface = {};
        var cacheInterfaceId = function(data){  
            this.lastInterface = data;
            this.lastInterface.hotelId = $scope.hotelId;
        };
        $scope.availableMappingTypes = [];
        var fetchExternalMappingItemsSuccess = function(data){
            var item;
            for (var i in data.interfaces){
                item = data.interfaces[i];
                $scope.extMappingSubComponents.push(item);
            }
            $scope.$emit('hideLoader');
        };
        var fetchInterfaceMappingsSuccess = function(data){
            $scope.mappingInterface = {};
            $scope.mappingInterface = data;
            
            if (typeof $scope.mappingInterface.mappings !== typeof []){
                $scope.mappingInterface.mappings = [];
            }
            if (typeof $scope.editData.mapping_type !== typeof []){
                $scope.editData.mapping_type = [];
            }
            var mapType, mappingTypeName, mappingTypeId, sntVal, extVal, mv, value, dataObj;
            for (var n in data.mapping){
                mapType = data.mapping[n];
                
                mappingTypeName = mapType.mapping_type;
                mappingTypeId = mapType.id;
                $scope.availableMappingTypes.push({
                    "mapping_type":mappingTypeName
                });
                $scope.editData.mapping_type.push({
                    "name":mappingTypeName
                });
                for (var v in mapType.mapping_values){
                    mv = mapType.mapping_values[v];
                    
                    sntVal = mv.snt_value;
                    extVal = mv.external_value;
                    value = mv.value;
                    dataObj = {
                        "mapping_type":mappingTypeName,
                        "snt_value":sntVal,
                        "external_value":extVal,
                        "mapping_type_id":value
                    };
                    $scope.mappingInterface.mappings.push(dataObj);
                }
            
            }
            
            $scope.$emit('hideLoader');
        };
        var getLastInterface = function(){
            return this.lastInterface;
        };
	
	//$scope.invokeApi(ADMappingSrv.fetchMappingList, {'id':$scope.hotelId}, fetchSuccess);
        $scope.fetchExternalMappingItems = function(){
            $scope.invokeApi(ADInterfaceMappingSrv.fetchExternalMappingList, {'hotel_id':$scope.hotelId}, fetchExternalMappingItemsSuccess);
        };
        $scope.fetchInterfaceMappings = function(){
            var lastInterface = getLastInterface();
            $scope.clickedInterfaceName = lastInterface.name;
            $scope.invokeApi(ADInterfaceMappingSrv.fetchInterfaceMappingsList, {
                'hotel_id':lastInterface.hotelId, 
                interface_type_id: lastInterface.id, 
                interface_name: lastInterface.name,
                interface_hotel_id: lastInterface.hotelId
            }, fetchInterfaceMappingsSuccess);
        };
        
	/*
    * Function to render edit screen with mapping data.
    * @param {id} id of the mapping item.
    */
	$scope.editSelected = function(id){
		$scope.errorMessage ="";	
        	$scope.currentClickedElement = id;
		$scope.editId = id;
                var lastInterface = getLastInterface();
                $scope.clickedInterfaceName = lastInterface.name;
		var data = {
                    'hotel_id':lastInterface.hotelId, 
                    interface_type_id: lastInterface.id, 
                    interface_name: lastInterface.name,
                    interface_hotel_id: lastInterface.hotelId
                };

		var editInterfaceMappingSuccessCallback = function(data) {
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
		$scope.invokeApi(ADInterfaceMappingSrv.fetchEditMapping, data, editInterfaceMappingSuccessCallback );
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
            var lastInterface = getLastInterface();
            $scope.clickedInterfaceName = lastInterface.name;
 		var addMappingSuccessCallback = function(data) {
			$scope.$emit('hideLoader');
			$scope.editData = data;
			$scope.openAddNew();
			$scope.isEdit = false;
		};
		$scope.invokeApi(ADInterfaceMappingSrv.fetchAddMapping, { 'id':$scope.hotelId, interface_type_id:lastInterface.id, interface_name:lastInterface.name }, addMappingSuccessCallback );
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
			$scope.invokeApi(ADMappingSrv.fetchExternalMappingList, {'id':$scope.hotelId}, fetchSuccess);
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
