admin.controller('ADChannelMgrEditCtrl', ['$scope', '$rootScope', '$state', 'ADChannelMgrSrv', '$filter', '$timeout', '$stateParams',
    function ($scope, $rootScope, $state, ADChannelMgrSrv, $filter, $timeout, $stateParams) {

        $scope.errorMessage = '';
        $scope.successMessage = "";
        $scope.selectedInterface = {};
        $scope.is_import_available = true;
        $scope.showMainAddRemove = false;
        $scope.showInlineAddRemove = false;
        
        $scope.available_room_types = [];
        $scope.available_rates = [];
        $scope.addRemoveMode = 'add';//add | edit
        
	var lastDropedTime = '';
        
        $scope.selectInterface = function(interface){
            $scope.selectedInterface = interface;
        };
        $scope.setRateDropdown = function(rate_id){
            for (var x in $scope.rateData){
                if ($scope.rateData[x].id === rate_id){
                    $scope.selectedRate = $scope.rateData[x];
                }
            }
        };
        $scope.editChannelManagerRate = function(rate){
            $scope.editingRate = rate;
            for (var x in $scope.data){
                if ($scope.data[x].id === rate.id){
                    rate.editing = true;
                    $scope.showInlineAddRemove = true;
                    $scope.showMainAddRemove = false;
                    
                    $scope.addRemoveMode = 'edit';//add | edit
                } else {
                    rate.editing = false;
                }
            }
            
            //go through the rate list and add to included which are in the ids of the rate from channelMgr data object
            
            $scope.includedRoomTypes = [];
            $scope.excludedRoomTypes = [];
            for (var xo in $scope.available_room_types){
                $scope.excludedRoomTypes.push($scope.available_room_types[xo]);
            }
            $scope.rateData = $scope.available_rates;
            var item, exItem;
            for (var i in $scope.data){
                item = $scope.data[i];
                if (rate.rate.id === item.rate.id){
                    //for each room in the rate's room_types, add it to the included list,
                    //place all others in excluded
                    for (var ex in $scope.excludedRoomTypes){
                        exItem = $scope.excludedRoomTypes[ex];
                        for (var x in item.room_types){
                            
                            if (typeof item.room_types[x].id !== typeof 0123 && typeof item.room_types[x].id === typeof 'str'){
                                item.room_types[x].id = parseInt(item.room_types[x].id);
                            }
                            if (typeof exItem.id !== typeof 0123 && typeof exItem.id === typeof 'str'){
                                exItem.id = parseInt(exItem.id);
                            }
                            
                            if (item.room_types[x].id === exItem.id){
                                $scope.includedRoomTypes.push(exItem);
                            }
                        }
                    }
                    
                    //remove the ones added to included
                    for (var inc in $scope.includedRoomTypes){
                        
                        for (var ex in $scope.excludedRoomTypes){
                            exItem = $scope.excludedRoomTypes[ex];
                            if ($scope.includedRoomTypes[inc].id === exItem.id){
                                delete $scope.excludedRoomTypes[ex];
                            }
                        }
                        
                    };
                    $scope.setRateDropdown(rate.rate.id);
                    return;
            }
        }
            
        };

        $scope.loadTable = function () {
            $scope.selectInterface($state.selectedInterface);
            $scope.data = $state.selectedInterface.channel_manager_rates;
            $scope.resetShowAddRmove();
        };
        $scope.deleteItem = function(rate_id){
            var data = {
                channel_manager_id: $scope.selectedInterface.id,
                channel_manager_rate_id: rate_id
            };
                
            var fetchSuccess = function (data) {
                $scope.$emit('hideLoader');
                $scope.reloadTable();
                $scope.$emit('hideLoader');
            };
            var fetchFailure = function(data){
                $scope.errorMessage = data;
                $scope.$emit('hideLoader');
                
            };
            $scope.invokeApi(ADChannelMgrSrv.deleteRateOnChannel, data, fetchSuccess, fetchFailure);
                
        };
        $scope.selectedOverExcluded = function(){
            console.log('selectedOverExcluded');
            console.log($scope.selectedIncludedRoomType)
        }
        
        $scope.selectedOverIncluded = function(){
            console.log('selectedOverIncluded');
            console.log($scope.selectedExcludedRoomType)
        }
        
        
        $scope.reloadTable = function(){
            var fetchSuccess = function (data) {
                $scope.$emit('hideLoader');
                $scope.data = data.data.channel_manager_rates;
                $scope.$emit('hideLoader');
            };
            var fetchFailure = function(data){
                $scope.errorMessage = data;
                $scope.$emit('hideLoader');
            };
            $scope.invokeApi(ADChannelMgrSrv.fetchManagerDetails, $scope.selectedInterface, fetchSuccess, fetchFailure);
        };
        
        
        
        
        
        
        
        $scope.resetShowAddRmove = function(){
            if ($scope.data.length === 0){
                $scope.showMainAddRemove = false;
            } else {
                $scope.showInlineAddRemove = false;
                $scope.showMainAddRemove = false;
            }
        };

        $scope.loadTable();

        $scope.toggleActive = function (rate) {
            var interface_id = $scope.selectedInterface.id, active = rate.active;
            var included = rate.room_types;
            //collect rate id's for included/excluded
            var includedRoomIds = $scope.getIds(included);
            
            var params = {
                interface_id: interface_id,
                channel_rate_id: rate.id,
                active: !active,
                room_type_ids: includedRoomIds,
                rate_id: rate.rate.id
            };
            var toggleSuccess = function () {
                $scope.$emit('hideLoader');
                //on success
                angular.forEach($scope.data, function (item, key) {
                    if (item.id === rate.id) {
                        item.active = !item.active;
                    }
                });
            };
            var toggleFailure = function (data) {
                $scope.$emit('hideLoader');
                $scope.errorMessage = data;
            };
            $scope.invokeApi(ADChannelMgrSrv.updateRate, params, toggleSuccess, toggleFailure);
        };
        $scope.updateRate = function () {
            var rate = $scope.editingRate;
            var interface_id = $scope.selectedInterface.id, active = rate.active;
            var included = $scope.includedRoomTypes;
            //collect rate id's for included/excluded
            var includedRoomIds = $scope.getIds(included);
            
            var params = {
                interface_id: interface_id,
                channel_rate_id: rate.id,
                active: active,
                room_type_ids: includedRoomIds,
                rate_id: rate.rate.id
            };
            var toggleSuccess = function () {
                //close edit window
                $scope.showInlineAddRemove = false;
                $scope.resetShowAddRmove();
                $scope.reloadTable();
                $scope.$emit('hideLoader');
                
            };
            var toggleFailure = function (data) {
                $scope.$emit('hideLoader');
                $scope.errorMessage = data;
            };
            $scope.invokeApi(ADChannelMgrSrv.updateRate, params, toggleSuccess, toggleFailure);
        };
        
        $scope.includedRoomTypes = [];
        $scope.excludedRoomTypes = [];
        $scope.selectedExcludedRoomTypeIndex = -1;//to update the class onSelect
        $scope.selectedIncludedRoomTypeIndex = -1;//to update the class onSelect
        
        $scope.excludedRoomTypeSelected;//to update the class onSelect
        $scope.includedRoomTypeSelected;//to update the class onSelect
        
        $scope.selectIncludedRoomType = function(roomType, evt, idx){
            $scope.selectedIncludedRoomTypeIndex = idx;
            $scope.includedRoomTypeSelected = roomType;
        };
        $scope.selectExcludedRoomType = function(roomType, evt, idx){
            $scope.selectedExcludedRoomTypeIndex = idx;
            $scope.excludedRoomTypeSelected = roomType;
        };
        $scope.addToExcluded = function(roomType){
            $scope.excludedRoomTypes.push(roomType);
        };
        
        $scope.includedRoomTypeSelected;
        $scope.leftToRight = function(){
            if ($scope.selectedIncludedRoomTypeIndex === -1){
                return;
            }
          //take the selected room type from selectedIncludedRoomType  
            var includedRoomTypeSelected = $scope.includedRoomTypeSelected;
            for (var i in $scope.includedRoomTypes){
                if (includedRoomTypeSelected.id === $scope.includedRoomTypes[i].id){
                    delete $scope.includedRoomTypes[i];
                }
            }
            $scope.excludedRoomTypes.push(includedRoomTypeSelected);
            $scope.selectedIncludedRoomTypeIndex = -1;
        };
        $scope.deSelectAll = function(){
            $scope.selectedExcludedRoomTypeIndex = -1;
            $scope.selectedIncludedRoomTypeIndex = -1;
            $scope.includedRoomTypeSelected = {};
            $scope.excludedRoomTypeSelected = {};
        };
        $scope.rightToLeft = function(){
            if ($scope.selectedExcludedRoomTypeIndex === -1){
                return;
            }
          //take the selected room type from selectedIncludedRoomType  
            var excludedRoomTypeSelected = $scope.excludedRoomTypeSelected;
            console.log(excludedRoomTypeSelected)
            for (var i in $scope.excludedRoomTypes){
                console.log($scope.excludedRoomTypes[i])
                if (excludedRoomTypeSelected.id === $scope.excludedRoomTypes[i].id){
                    delete $scope.excludedRoomTypes[i];
                }
            }
            $scope.includedRoomTypes.push(excludedRoomTypeSelected);
            $scope.selectedExcludedRoomTypeIndex = -1;
        };
        $scope.droppedToIncluded = function(){
            console.log(arguments);
        }
        
        $scope.refreshLists = function(){
            $scope.includedRoomTypes = [];
            $scope.excludedRoomTypes = [];
            $scope.selectedExcludedRoomTypeIndex = -1;//to update the class onSelect
            $scope.selectedIncludedRoomTypeIndex = -1;//to update the class onSelect
        };
        
        $scope.selectedIncludedRoomType;
        $scope.selectedExcludedRoomType;
        
        $scope.selectRate = function(rate){
            $scope.selectedRate = rate;
            $scope.refreshLists();
            if (!rate.placeholder){//then is valid, load up room_types
                var fetchSuccess = function(data){
                    $scope.includedRoomTypes = data.data.room_types;
                    $scope.resortLists();
                    $scope.$emit('hideLoader');
                };
                var fetchFailure = function(data){
                    $scope.$emit('hideLoader');

                };

                $scope.invokeApi(ADChannelMgrSrv.fetchRoomTypes, {}, fetchSuccess, fetchFailure);
            }
        };
        $scope.droppedSelectedRoomType = function(){
            
        };
        
        $scope.moveAllLeft = function(){
            for (var i in $scope.excludedRoomTypes){
                $scope.includedRoomTypes.push($scope.excludedRoomTypes[i]);
            }
            $scope.excludedRoomTypes = [];
            $scope.deSelectAll();
            $scope.resortLists();
        };
        $scope.moveAllRight = function(){
            for (var i in $scope.includedRoomTypes){
                $scope.excludedRoomTypes.push($scope.includedRoomTypes[i]);
            }
            $scope.includedRoomTypes = [];
            $scope.deSelectAll();
            $scope.resortLists();
        };
        $scope.resortLists = function(){
            $scope.sortList($scope.includedRoomTypes, 'name');
            $scope.sortList($scope.excludedRoomTypes, 'name');
        };
        $scope.sortList = function(lst, prop){
            if (typeof prop === typeof undefined){
                prop = 'name';
            }
            
            lst.sort(function(a, b){
                if(a[prop].toLowerCase() < b[prop].toLowerCase()) return -1;
                if(a[prop].toLowerCase() > b[prop].toLowerCase()) return 1;
                return 0;
            });
          //  return lst;
        };
        
	$scope.reachedUnAssignedRoomType = function(event, ui){
		$scope.selectedIncludedRoomType = -1;
		lastDropedTime = new Date();
	};
        
        $scope.addRateToChannel = function(selectedInterface){
            $scope.addRemoveMode = 'add';//add | edit
            $scope.showInlineAddRemove = false;
            $scope.showMainAddRemove = true;
            var fetchSuccess = function(data){
                $scope.rateData = [];
                for (var i in data.results){
                    $scope.rateData.push(data.results[i]);
                }
                //add the 
                $scope.sortList($scope.rateData, 'name');
                $scope.rateData.unshift({id: 0, placeholder: true, name: 'Select Rate'});
                $scope.selectedRate = $scope.rateData[0];
                $scope.refreshLists();
                $scope.$emit('hideLoader');
            };
            var fetchFailure = function(data){
                $scope.$emit('hideLoader');
            };
            
            $scope.invokeApi(ADChannelMgrSrv.fetchRates, {}, fetchSuccess, fetchFailure);
        };
        $scope.populateAvailableRates = function(){
              var fetchSuccess = function(data){
                $scope.available_rates = [];
                for (var i in data.results){
                    $scope.available_rates.push(data.results[i]);
                }
                $scope.sortList($scope.available_rates, 'name');
                $scope.available_rates.unshift({id: 0, placeholder: true, name: 'Select Rate'});
                $scope.selectedRate = $scope.available_rates[0];
                $scope.refreshLists();
                $scope.$emit('hideLoader');
            };
            var fetchFailure = function(data){
                $scope.$emit('hideLoader');
            };
            
            $scope.invokeApi(ADChannelMgrSrv.fetchRates, {}, fetchSuccess, fetchFailure);
        };
        $scope.populateAvailableRoomTypes = function(){
            var fetchSuccess = function(data){
                    $scope.available_room_types = data.data.room_types;
                    $scope.resortLists();
                    $scope.$emit('hideLoader');
                };
                var fetchFailure = function(data){
                    $scope.$emit('hideLoader');
                };

                $scope.invokeApi(ADChannelMgrSrv.fetchRoomTypes, {}, fetchSuccess, fetchFailure);
        };
        
        $scope.cancelMainAddRemove = function(){
            $scope.showMainAddRemove = false;
            $scope.resetShowAddRmove();
        };
        $scope.addRateToChannelMgr = function(){
            if ($scope.addRemoveMode === 'edit'){
                $scope.updateRate($scope.selectedRate);
            } else {
                var included = $scope.includedRoomTypes, excluded = $scope.excludedRoomTypes;
                var rate = $scope.selectedRate, interface = $scope.selectedInterface;

                if (rate.placeholder){
                    return;
                }
                //collect rate id's for included/excluded
                var includedRoomIds = $scope.getIds(included);
                var excludedRoomIds = $scope.getIds(excluded);

                var params = {
                    channel_id: interface.id,
                    rate_id: rate.id,
                    room_type_ids: includedRoomIds
                };
                var postSuccess = function(){
                    $scope.cancelMainAddRemove();
                    $scope.reloadTable();
                    $scope.$emit('hideLoader');
                };
                var postFailure = function(){

                    $scope.$emit('hideLoader');
                };

                $scope.invokeApi(ADChannelMgrSrv.postRateOnChannel, params, postSuccess, postFailure);
            }
        };
        
        
        
        $scope.getIds = function(lst){
            var ids = [];
            for (var i in lst){
                ids.push(lst[i].id);
            }
            return ids;
        };
        
        $scope.showLoader = function () {
            $scope.$emit('showLoader');
        };
        
        $scope.populateAvailableRates();
        $scope.populateAvailableRoomTypes();

    }]);

