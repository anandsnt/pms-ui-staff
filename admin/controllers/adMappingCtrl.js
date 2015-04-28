admin.controller('ADMappingCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'ADInterfaceMappingSrv', '$location', function ($scope, $rootScope, $state, $stateParams, ADInterfaceMappingSrv, $location) {

        BaseCtrl.call(this, $scope);
        $scope.hotel_id = $rootScope.hotelId;
        
        $scope.editData = {};
        $scope.editData.sntValues = [];
        $scope.editData.mapping_type = [];
        
        $scope.editData.mapping_type = '';
        $scope.editData.snt_value= '';
        $scope.editData.external_value= '';
        
        
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

        $scope.openAddNew = function () {
            $location.hash('top');
            $scope.isAdd = true;
            $scope.isEdit = false;
            //scroll to top

            if ($('[name=snt-value]')) {
                $('[name=snt-value]').val('');
            }
            ;
            if ($('[name=mapping-type]')) {
                $('[name=mapping-type]').val('');
            }
            ;
            if ($('[name=mapping-type]')) {
                $('[name=external-value]').val('');
            }
            ;

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
          console.log(data);
          $scope.errorMessage = data.responseText;
        };
        
        $scope.toggleSMClicked = function () {
            console.log('$scope.siteminder.active');
            var active = !$scope.siteminder.active;
            console.log('changing to: ' + active);

            var toggleSMActiveSuccess = function () {
                $scope.siteminder.active = !$scope.siteminder.active;
                console.log('toggle complete, now: ' + $scope.siteminder.active);
                $scope.$emit('hideLoader');
            };

            console.log('toggle siteminder setup active/inactive');
            $scope.invokeApi(ADInterfaceMappingSrv.switchToggle, {
                'hotel_id': $scope.hotel_id,
                'interface_id': 2,
                'active': active
            }, toggleSMActiveSuccess, $scope.onFailureSetMessage);

        };

        $scope.clickedMenuItem = function ($event, stateToGo) {
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
        $scope.fetchInterfaceMappingsSuccess = function (data) {
            console.log('fetch interface mapping success');
            console.log(data);
            var mapType, mappingTypeName, mappingTypeId, sntVal, extVal, mv, value, dataObj, mTypeName, val;
            $scope.mappingInterface = {};
            $scope.mappingInterface = data;

            if (typeof $scope.mappingInterface.mappings !== typeof []) {
                $scope.mappingInterface.mappings = [];
            }
            if (typeof $scope.editData.mapping_type !== typeof []) {
                $scope.editData.mapping_type = [];
            }
            if (typeof $scope.mappingInterface.mappingTypeRefs !== typeof []) {
                $scope.mappingInterface.mappingTypeRefs = [];
            }

            for (var x in data.mapping_type) {//save off this
                mTypeName = data.mapping_type[x].name;
                for (var vals in data.mapping_type[x].sntvalues) {
                    val = data.mapping_type[x].sntvalues[vals].name;
                    if (typeof $scope.mappingInterface.mappingTypeRefs[mTypeName] !== typeof []) {
                        $scope.mappingInterface.mappingTypeRefs[mTypeName] = [];
                    }
                    $scope.mappingInterface.mappingTypeRefs[mTypeName].push({"name": val});
                }
            }

            for (var n in data.mapping) {
                mapType = data.mapping[n];

                mappingTypeName = mapType.mapping_type;
                mappingTypeId = mapType.id;
                $scope.availableMappingTypes.push({
                    "mapping_type": mappingTypeName
                });
                $scope.editData.mapping_type.push({
                    "name": mappingTypeName
                });
                for (var v in mapType.mapping_values) {
                    mv = mapType.mapping_values[v];

                    sntVal = mv.snt_value;
                    extVal = mv.external_value;
                    value = mv.value;
                    dataObj = {
                        "mapping_type": mappingTypeName,
                        "snt_value": sntVal,
                        "external_value": extVal,
                        "mapping_type_id": value
                    };
                    $scope.mappingInterface.mappings.push(dataObj);
                }
            }
            $scope.$emit('hideLoader');
            //clear the add-new fields
            setTimeout(function () {
                if ($('[name=snt-value]')) {
                    $('[name=snt-value]').val('');
                }
                if ($('[name=mapping-type]')) {
                    $('[name=mapping-type]').val('');
                }
                if ($('[name=mapping-type]')) {
                    $('[name=external-value]').val('');
                }
            }, 1000);
            console.log('$scope.mappingInterface.mappingTypeRefs');
            console.log($scope.mappingInterface.mappingTypeRefs);
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
            $scope.clickedInterfaceName = lastInterface.name;
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
            $scope.errorMessage = "";
            $scope.editId = mappingId;
            $scope.$emit('showLoader');

            var editInterfaceMappingSuccessCallback = function (data) {
                $scope.$emit('hideLoader');
                $scope.isEdit = true;
                $scope.isAdd = false;

                var external_value = data.external_value,
                        selected_mapping_type = data.selected_mapping_type,
                        selected_snt_value = data.selected_snt_value,
                        mapping_type_id = data.value;

                setLastInterfaceValue('mapping_type_id', mapping_type_id);

                setTimeout(function () {
                    if ($('[name=snt-value]')) {
                        $('[name=snt-value]').val(selected_snt_value);
                    }
                    if ($('[name=mapping-type]')) {
                        $('[name=mapping-type]').val(selected_mapping_type);
                    }
                    if ($('[name=mapping-type]')) {
                        $('[name=external-value]').val(external_value);
                    }
                }, 1000);



                // Initial loading data to SNT VALUES dropdown.
                /*	
                 angular.forEach($scope.editData.mapping_type_id,function(item, index) {
                 if (item.name == $scope.editData.selected_mapping_type) {
                 $scope.editData.sntValues = item.sntvalues;
                 }
                 });
                 */
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
        /*
         * Function to render Add screen with mapping data.
         */
        $scope.mappingTypeSelected = function () {
            var name = $('[name=mapping-type]').val();
            $scope.editData.sntValues = $scope.mappingInterface.mappingTypeRefs[name];
            $('[name=snt-value]');//forces dropdown to work
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
            if (typeof $scope.editData.mapping_type !== typeof []) {
                $scope.editData.mapping_type = [];
            } else {
                $scope.editData.mapping_type = [];
            }
            if (typeof $scope.mappingInterface.mappingTypeRefs !== typeof []) {
                $scope.mappingInterface.mappingTypeRefs = [];
            } else {
                $scope.mappingInterface.mappingTypeRefs = [];
            }
            $scope.invokeApi(ADInterfaceMappingSrv.fetchInterfaceMappingsList, mappingData, $scope.fetchInterfaceMappingsSuccess);

        };

        $scope.clickedSave = function () {
            var lastInterface = getLastInterface();
            $scope.clickedInterfaceName = lastInterface.name;

            var snt_value = $('[name=snt-value]').val(),
                    mapping_type = $('[name=mapping-type]').val(),
                    external_value = $('[name=external-value]').val();

            var newData = {
                'hotel_id': lastInterface.hotelId,
                "interface_type_id": lastInterface.id,
                "interface_name": lastInterface.name,
                "snt_value": snt_value,
                "external_value": external_value,
                "mapping_type": mapping_type,
                "mapping_type_id": lastInterface.mapping_type_id
            };

            console.log('save data');
            console.log(newData);

            $scope.$emit('showLoader');

            var successSaveCallback = function (data) {
                $scope.$emit('hideLoader');
                if ($scope.isAdd) {
                    $scope.data.total_count++;
                }
                // To update scope data with added item

                /*
                 angular.forEach($scope.data.mapping,function(item, index) {
                 if (item.mapping_type == postData.mapping_value) {
                 $scope.data.mapping[index].mapping_values.push(newData);
                 }
                 });
                 */
                $scope.closeInlineTab();
                $scope.refreshView();
            };

            /*
             var unwantedKeys = ["mapping_type","sntValues","selected_mapping_type","selected_snt_value" ];
             var postData = dclone($scope.editData, unwantedKeys);
             postData.hotel_id = $scope.data.hotel_id;
             postData.interface_id = $scope.lastClickedInterfaceId;
             */

            //if($scope.isEdit) postData.value = $scope.editId;
            console.log('isAdd: '+$scope.isAdd);
            console.log('isEdit: '+$scope.isEdit);
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
        $scope.$watch('editData.mapping_value', function () {
            $scope.editData.sntValues = [];
            angular.forEach($scope.editData.mapping_type, function (item, index) {
                if (item.name == $scope.editData.mapping_value) {
                    $scope.editData.sntValues = item.sntvalues;
                }
            });
        });

    }]);
