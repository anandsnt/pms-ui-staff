admin.controller('ADChannelMgrEditCtrl', ['$scope', '$rootScope', '$state', 'ADChannelMgrSrv', '$filter', '$timeout', '$stateParams',
    function ($scope, $rootScope, $state, ADChannelMgrSrv, $filter, $timeout, $stateParams) {

        $scope.errorMessage = '';
        $scope.successMessage = "";
        $scope.selectedInterface = {};
        $scope.is_import_available = true;
        $scope.showMainAddRemove = false;
        $scope.showInlineAddRemove = false;
	var lastDropedTime = '';
        
        $scope.selectInterface = function(interface){
            $scope.selectedInterface = interface;
        };
        
        $scope.editChannelManagerRate = function(rate){
            for (var x in $scope.data){
                if ($scope.data[x].id === rate.id){
                    rate.editing = true;
                    $scope.showInlineAddRemove = true;
                } else {
                    rate.editing = false;
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
        
        
        
        $scope.reloadTable = function(){
            var fetchSuccess = function (data) {
                $scope.$emit('hideLoader');
                $scope.totalCount = data.data.channel_manager_rates.length;
                $scope.totalPage = Math.ceil(data.data.channel_manager_rates.length / $scope.displyCount);
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
                room_type_ids: includedRoomIds
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
            $scope.invokeApi(ADChannelMgrSrv.toggleRateActivate, params, toggleSuccess, toggleFailure);
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
            for (var i in $scope.excludedRoomTypes){
                if (excludedRoomTypeSelected.id === $scope.excludedRoomTypes[i].id){
                    delete $scope.excludedRoomTypes[i];
                }
            }
            $scope.includedRoomTypes.push(excludedRoomTypeSelected);
            $scope.selectedExcludedRoomTypeIndex = -1;
        };
        
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
        
        $scope.cancelMainAddRemove = function(){
            $scope.showMainAddRemove = false;
            $scope.resetShowAddRmove();
        };
        $scope.addRateToChannelMgr = function(rate){
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

    }]);

