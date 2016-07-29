admin.controller('ADMappingCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'ADInterfaceMappingSrv', '$location', function ($scope, $rootScope, $state, $stateParams, ADInterfaceMappingSrv, $location) {

        BaseCtrl.call(this, $scope);
        $scope.hotel_id = $rootScope.hotelId;

        $scope.editData = {};
        $scope.editData.sntValues = [];
        $scope.editData.mapping_types = [];

        $scope.editData.mapping_type = '';
        $scope.editData.snt_value = '';
        $scope.editData.external_value = '';

        $scope.editData.validEditSelection = 'false';

        $scope.siteminder = {};
        $scope.siteminder.active = "true";

        $scope.isEdit = false;
        $scope.isAdd = false;
        $scope.addFormView = false;

        /*
         * To close inline tabs on cancel/save clicks
         */
        $scope.closeInlineTab = function () {
            $scope.isAdd = false;
            $scope.isEdit = false;
        };

        $scope.isActiveClass = function(){
            return $scope.siteminder.active;
        };

        $scope.openAddNew = function () {
            $location.hash('top');
            $scope.isAdd = true;
            $scope.isEdit = false;
            //scroll to top
                    $scope.editData.mapping_type_value = '';
                    $scope.editData.external_value = '';
                    $scope.editData.snt_value = '';
                    $scope.editData.sntValues = [];

        };

        //for preventing drag & drop operations turning into click
        var lastDropedTime = '';
        $scope.onDragStop = function () {
            $scope.isDragging = false;
            //also we are taking the lastDropedTime to preventing click after drag stop operation
            lastDropedTime = new Date();
        };
        $scope.clickedInterfaceMenuItem = function (event, state, submenu) {
            //need to cache the submenu, then go to the next state with the interface id
            cacheInterfaceId(submenu);
            setTimeout(function () {
                $scope.clickedMenuItem(event, state);
            }, 1000);

        };

        $scope.onFailureSetMessage = function(data){
          $scope.errorMessage = data.responseText;
        };

        $scope.toggleSMClicked = function () {
            var active = !$scope.siteminder.active;

            var toggleSMActiveSuccess = function () {
                $scope.siteminder.active = !$scope.siteminder.active;
                $scope.$emit('hideLoader');
            };

            $scope.invokeApi(ADInterfaceMappingSrv.switchToggle, {
                'hotel_id': $scope.hotel_id,
                'interface_id': 2,
                'active': active
            }, toggleSMActiveSuccess, $scope.onFailureSetMessage);
        };

        $scope.onFailureSetMessage = function (data) {
            $scope.errorMessage = data.responseText;
            $scope.$emit('hideLoader');
        };


        $scope.clickedMenuItem = function ($event, stateToGo) {
            var currentTime = new Date();
            if (lastDropedTime !== '' && typeof lastDropedTime === 'object') {
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
        $scope.mappingInterface.mappingTypeRefs = [];
        var cacheInterfaceId = function (data) {
            this.lastInterface = data;
            this.lastInterface.hotelId = $scope.hotel_id;
        };
        $scope.availableMappingTypes = [];
        var fetchExternalMappingItemsSuccess = function (data) {
            var item;
            for (var i in data.interfaces) {
                item = data.interfaces[i];
                $scope.extMappingSubComponents.push(item);
            }
            $scope.$emit('hideLoader');
        };
        $scope.siteminder_setup = {};
        $scope.siteminder_setup.mapping_type_list = [];


        //---------------- do an isDirty check and launch isValid checks
        $scope.$watch('editData.snt_value',function(to, fm, evt){
           $scope.hasValidSelection();

        });
        $scope.$watch('editData.external_value',function(to, fm, evt){
           $scope.hasValidSelection();

        });

        //----------------

        $scope.$watch('editData.mapping_type_value',function(to, fm, evt){
            if (to){
                $scope.editData.sntValues = $scope.mappingInterface.mappingTypeRefs[to];
                // In case external values list has been obtained for this mapping type refer to the list
                if ($scope.mappingInterface.mappingTypeRefsExt && $scope.mappingInterface.mappingTypeRefsExt[to]) {
                    $scope.editData.externalValues = $scope.mappingInterface.mappingTypeRefsExt[to];
                }else{
                    $scope.editData.externalValues = null;
                }
            }

            $scope.hasValidSelection();
        });



        $scope.fetchInterfaceMappingsSuccess = function (data) {
            var mapType, mappingTypeName, mappingTypeId, sntVal, extVal, mv, value, dataObj, mTypeName, mappingTypeRefObject, mappingTypeDesc;
            $scope.mappingInterface = {};
            $scope.mappingInterface = data;

            if (typeof $scope.mappingInterface.mappings !== typeof []) {
                $scope.mappingInterface.mappings = [];
            }
            if (typeof $scope.editData.mapping_types !== typeof []) {
                $scope.editData.mapping_types = [];
            }
            if (typeof $scope.mappingInterface.mappingTypeRefs !== typeof []) {
                $scope.mappingInterface.mappingTypeRefs = [];
            }

            for (var x in data.mapping_type) {//cache this off
                mTypeName = data.mapping_type[x].name;
                for (var vals in data.mapping_type[x].sntvalues) {
                    if (typeof $scope.mappingInterface.mappingTypeRefs[mTypeName] !== typeof []) {
                        $scope.mappingInterface.mappingTypeRefs[mTypeName] = [];
                    }
                    mappingTypeRefObject = {
                        name: data.mapping_type[x].sntvalues[vals].name
                    };
                    if (typeof data.mapping_type[x].sntvalues[vals].description !== "undefined") {
                        mappingTypeRefObject.description = data.mapping_type[x].sntvalues[vals].description; 
                    }
                    $scope.mappingInterface.mappingTypeRefs[mTypeName].push(mappingTypeRefObject);
                }

                if(_.isArray(data.mapping_type[x].extvalues) && data.mapping_type[x].extvalues.length > 0){
                    if(!$scope.mappingInterface.mappingTypeRefsExt){
                        $scope.mappingInterface.mappingTypeRefsExt = [];
                    }

                    if(!$scope.mappingInterface.mappingTypeRefsExt[mTypeName]){
                        $scope.mappingInterface.mappingTypeRefsExt[mTypeName] = [];
                    }
                    _.each(data.mapping_type[x].extvalues, function(extRef){
                        $scope.mappingInterface.mappingTypeRefsExt[mTypeName].push({
                            name:extRef.value,
                            description:extRef.description
                        });
                    });
                }

            }

            for (var n in data.mapping) {
                mapType = data.mapping[n];

                mappingTypeName = mapType.mapping_type;
                mappingTypeDesc = mapType.mapping_description;
                mappingTypeId = mapType.id;
                $scope.availableMappingTypes.push({
                    "mapping_type": mappingTypeName,
                    "mapping_description":mappingTypeDesc
                });
                $scope.editData.mapping_types.push({
                    "name": mappingTypeName,
                    "description":mappingTypeDesc
                });
                for (var v in mapType.mapping_values) {
                    mv = mapType.mapping_values[v];

                    sntVal = mv.snt_value;
                    extVal = mv.external_value;
                    value = mv.value;
                    dataObj = {
                        "mapping_type": mappingTypeName,
                        "description":mappingTypeDesc,
                        "snt_value": sntVal,
                        "external_value": extVal,
                        "mapping_type_id": value
                    };
                    $scope.mappingInterface.mappings.push(dataObj);
                }
            }
            $scope.$emit('hideLoader');
        };

        var getLastInterface = function () {
            return this.lastInterface;
        };
        var setLastInterfaceValue = function (prop, val) {
            this.lastInterface[prop] = val;
        };

        $scope.fetchExternalMappingItems = function () {
            $scope.invokeApi(ADInterfaceMappingSrv.fetchExternalMappingList, {'hotel_id': $scope.hotel_id}, fetchExternalMappingItemsSuccess);
        };

        $scope.fetchInterfaceMappings = function () {
            var lastInterface = getLastInterface();
            $scope.clickedInterfaceName = lastInterface.description;
            $scope.invokeApi(ADInterfaceMappingSrv.fetchInterfaceMappingsList, {
                'hotel_id': lastInterface.hotelId,
                'interface_type_id': lastInterface.id,
                'interface_name': lastInterface.name,
                'interface_hotel_id': lastInterface.hotelId
            }, $scope.fetchInterfaceMappingsSuccess);
        };
        /*
         * Function to render edit screen with mapping data.
         * @param {id} id of the mapping item.
         */
        $scope.editSelected = function (mappingId) {
            $scope.$emit('showLoader');
            $scope.errorMessage = "";
            $scope.editId = mappingId;

            var editInterfaceMappingSuccessCallback = function (data) {
                $scope.isEdit = true;
                $scope.isAdd = false;

                setLastInterfaceValue('mapping_type_id', data.value);

                $scope.editData.mapping_type_value = data.selected_mapping_type;
                $scope.editData.external_value = data.external_value;
                $scope.editData.snt_value = data.selected_snt_value;

                $scope.$emit('hideLoader');
            };

            var lastInterface = getLastInterface();
            $scope.clickedInterfaceName = lastInterface.name;
            var editData = {
                'hotel_id': $scope.hotel_id,
                'interface_type_id': lastInterface.id,
                'interface_name': lastInterface.name,
                'mapping_type_id': mappingId
            };
            $scope.invokeApi(ADInterfaceMappingSrv.fetchEditMapping, editData, editInterfaceMappingSuccessCallback);
        };
        /*
         * Function to render template for add/edit screens.
         */
        $scope.getTemplateUrl = function () {
            return "/assets/partials/mapping/adExternalMappingDetails.html";
        };

        $scope.refreshView = function () {
            var lastInterface = getLastInterface();
            var mappingData = {
                'hotel_id': lastInterface.hotelId,
                'interface_type_id': lastInterface.id,
                'interface_name': lastInterface.name
            };

            if (typeof $scope.mappingInterface.mappings !== typeof []) {
                $scope.mappingInterface.mappings = [];
            } else {
                $scope.mappingInterface.mappings = [];
            }
            if (typeof $scope.editData.mapping_types !== typeof []) {
                $scope.editData.mapping_types = [];
            } else {
                $scope.editData.mapping_types = [];
            }
            if (typeof $scope.mappingInterface.mappingTypeRefs !== typeof []) {
                $scope.mappingInterface.mappingTypeRefs = [];
            } else {
                $scope.mappingInterface.mappingTypeRefs = [];
            }
            $scope.invokeApi(ADInterfaceMappingSrv.fetchInterfaceMappingsList, mappingData, $scope.fetchInterfaceMappingsSuccess);

        };
        $scope.hasValidSelection = function(){
            //check to verify if the selected values are valid
            //ie. don't allow a user to switch from a credit card type to source_code, withoout selecting a valid SNT value
            //loop through the available selections with the currently selected value to verify its avialable for selection

            var snt_value = $scope.editData.snt_value,
                    mapping_type = $scope.editData.mapping_type_value,
                    external_value = $scope.editData.external_value;

            var available_snt_values,
                    available_mapping_types;

            available_mapping_types = $scope.editData.mapping_types;
            available_snt_values = $scope.mappingInterface.mappingTypeRefs[mapping_type];
            var valid_mapping_type = false, valid_snt_value = false, valid_external_value = false;
            if (external_value !== '' && external_value !== " " && typeof external_value === typeof 'string'){
                valid_external_value = true;
            }

            for (var i in available_mapping_types){
                if (mapping_type === available_mapping_types[i].name){
                    valid_mapping_type = true;
                }
            }

            for (var n in available_snt_values){
                if (snt_value === available_snt_values[n].name){
                    valid_snt_value = true;
                }
            }
            if (valid_mapping_type && valid_snt_value && valid_external_value){
                $scope.editData.validEditSelection = 'true';
            } else {
                $scope.editData.validEditSelection = 'false';
            }
        };


        $scope.clickedSave = function () {
            var lastInterface = getLastInterface();
            $scope.clickedInterfaceName = lastInterface.name;

            var snt_value = $scope.editData.snt_value,
                    mapping_type = $scope.editData.mapping_type_value,
                    external_value = $scope.editData.external_value;

            var newData = {
                'hotel_id': lastInterface.hotelId,
                "interface_type_id": lastInterface.id,
                "interface_name": lastInterface.name,
                "snt_value": snt_value,
                "external_value": external_value,
                "mapping_type": mapping_type,
                "mapping_type_id": lastInterface.mapping_type_id
            };

            $scope.$emit('showLoader');

            var successSaveCallback = function (data) {
                $scope.$emit('hideLoader');
                if ($scope.isAdd) {
                    $scope.data.total_count++;
                }

                $scope.closeInlineTab();
                $scope.refreshView();
            };

            if ($scope.isAdd) {
                $scope.invokeApi(ADInterfaceMappingSrv.saveMapping, newData, successSaveCallback);
            } else {
                //isEdit
                $scope.invokeApi(ADInterfaceMappingSrv.saveEditMapping, newData, successSaveCallback);
            }
        };

        $scope.setActiveItem = function (itemObj) {
            this.activeItem = itemObj.id;
        };
        /**
         *   A post method to update Active/Inactive status for an interface mapping type
         */
        $scope.toggleClicked = function () {
            var item = this.activeItem;

            var data = {
                'id': item.id,
                'set_active': item.is_active ? false : true
            };

            var postSuccess = function () {
                $scope.$emit('hideLoader');
                item.is_active = item.is_active ? false : true;
            };

            $scope.invokeApi(ADInterfaceMappingSrv.switchToggle, data, postSuccess);
        };

        /*
         * Function to handle delete button click.
         * @param {mappingId} mappingId of the mapping item.
         */
        $scope.clickedDelete = function (mappingId) {

            var lastInterface = getLastInterface();
            $scope.clickedInterfaceName = lastInterface.name;
            var del_mapping_data = {
                'hotel_id': lastInterface.hotelId,
                'interface_type_id': lastInterface.id,
                'interface_name': lastInterface.name,
                'interface_hotel_id': lastInterface.hotelId,
                'mapping_type_id': mappingId
            };

            var successDeletionCallback = function () {
                $scope.$emit('hideLoader');
                $scope.refreshView();
            };

            $scope.invokeApi(ADInterfaceMappingSrv.deleteMapping, del_mapping_data, successDeletionCallback);
        };
        /*
         * Function to handle data change in 'Mapping type'.
         * Data is injected to sntValues based on 'Mapping type' values.
         */

    }]);
