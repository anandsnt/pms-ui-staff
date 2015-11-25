admin.controller('ADDeviceMappingsCtrl',['ngTableParams', '$scope', '$state', 'ADDeviceSrv', 'ADKeyEncoderSrv', '$timeout', '$location', '$anchorScroll',
					function(ngTableParams, $scope, $state, ADDeviceSrv, ADKeyEncoderSrv, $timeout, $location, $anchorScroll){

	$scope.errorMessage = '';
	ADBaseTableCtrl.call(this, $scope, ngTableParams);
	$scope.mapping = {};
	$scope.isAddMode = false;
	$scope.addEditTitle = "";
	$scope.isEditMode = false;
        /*
         * To fetch list of device mappings
         */
        $scope.getKeyEncoderDescription = function(id){
            var encoders = $scope.key_encoders;
            for (var i in encoders){
                if (encoders[i].id === id){
                    return encoders[i].description;
                }
            }
        };
	$scope.listDevices = function($defer, params){
		var getParams = $scope.calculateGetParams(params);
		var fetchSuccessOfItemList = function(data){
			$scope.$emit('hideLoader');
			//No expanded rate view
			$scope.currentClickedElement = -1;
			$scope.totalCount = data.total_count;
			$scope.totalPage = Math.ceil(data.total_count/$scope.displyCount);
                        
                        for (var i in data.work_stations){//pull in the description of the key encoder
                            data.work_stations[i].key_encoder_description = $scope.getKeyEncoderDescription(data.work_stations[i].key_encoder_id);
                        }
                        
			$scope.data = data.work_stations;
			$scope.currentPage = params.page();
                        params.total(data.total_count);
                        $scope.isAddMode = false;
                        $defer.resolve($scope.data);
		};
		$scope.invokeApi(ADDeviceSrv.fetch, getParams, fetchSuccessOfItemList);
	};


	$scope.loadTable = function(){
		$scope.tableParams = new ngTableParams({
		        page: 1,  // show first page
		        count: $scope.displyCount, // count per page
		        sorting: {
		            name: 'asc' // initial sorting
		        }
		    }, {
		        total: 0, // length of data
		        getData: $scope.listDevices
		    }
		);
                
	};

        
        
	$scope.failureCallBack =  function(response){
            console.warn(response);
	};
        $scope.key_encoders = [];
        $scope.selectedKeyEncoder;
        $scope.fetchKeyEncoderList = function(){
            var onSuccess = function(data){
                    $scope.key_encoders = data.results;
                    $scope.loadTable();//this loads up after key encoders so we can get the key encoder description first
                    $scope.$emit('hideLoader');
            };
            var options = {
                params:                 {},
                successCallBack: 	    onSuccess,
                failureCallBack:        $scope.failureCallBack
            };
            $scope.callAPI(ADKeyEncoderSrv.fetchEncoders, options);
        };
        
            $scope.fetchKeyEncoderList();
        
	//To list device mappings
	/*
    * To render edit device mapping screen
    * @param {index} index of selected device mapping
    * @param {id} id of the device mapping
    */
	$scope.editDeviceMapping = function(index, id)	{
		$scope.mapping = {};
		$scope.currentClickedElement = index;
		$scope.isAddMode = false;
		$scope.isEditMode = true;
		$scope.addEditTitle = "EDIT";
	 	var successCallbackRender = function(data){
	 		$scope.mapping = data;
                        $scope.mapping.selectedKeyEncoder = data.key_encoder_id;
	 		$scope.$emit('hideLoader');
	 	};
	 	$scope.mapping.id = id;
	 	var data = {"id":id };
	 	$scope.invokeApi(ADDeviceSrv.getDeviceMappingDetails, data , successCallbackRender);
	};
   /*
    * Render add device mapping screen
    */
	$scope.addNewDeviceMapping = function()	{
		$scope.mapping={};
		$scope.currentClickedElement = "new";
		$scope.isAddMode = true;
		$scope.addEditTitle = "ADD";
		$scope.mapping = {};
		$timeout(function() {
            $location.hash('new-form-holder');
            $anchorScroll();
    	});
	};
   /*
    * To get the template of edit screen
    * @param {int} index of the selected department
    * @param {string} id of the department
    */
	$scope.getTemplateUrl = function(index, id){
		if(typeof index === "undefined" || typeof id === "undefined") {
			return "";
		}
		if($scope.currentClickedElement === index){
			 	return "/assets/partials/deviceMapping/adDeviceMappingDetails.html";
		}
	};

   /*
    * To handle click event
    */
	$scope.clickCancel = function(){
		$scope.isEditMode = false;
		$scope.currentClickedElement = -1;
	};
   /*
    * To delete department
    * @param {int} index of the selected department
    * @param {string} id of the selected department
    */
	$scope.deleteDeviceMapping = function(index, id){
		var successCallbackDelete = function(data){
	 		$scope.$emit('hideLoader');
	 		$scope.data.splice(index, 1);
	 		$scope.currentClickedElement = -1;
	 		$scope.totalCount--;
	 	};
		$scope.invokeApi(ADDeviceSrv.deleteDeviceMapping, id , successCallbackDelete);
	};
	/*
	 * To save mapping
	 */
        
        $scope.isValidWorkStation = function(){
            //check if required fields are filled out
            if (!$scope.mapping.name || !$scope.mapping.station_identifier){
                return false;
            } else return true;
            
        };
        $scope.updateCurrentWorkstation = function(){
            // To update data with new value
             $scope.data[parseInt($scope.currentClickedElement)].name = $scope.mapping.name;
             $scope.data[parseInt($scope.currentClickedElement)].station_identifier = $scope.mapping.station_identifier;
             $scope.data[parseInt($scope.currentClickedElement)].encoder_id = $scope.mapping.selectedKeyEncoder;
             $scope.data[parseInt($scope.currentClickedElement)].key_encoder_id = $scope.mapping.selectedKeyEncoder;
             $scope.data[parseInt($scope.currentClickedElement)].default_key_encoder_id = $scope.mapping.selectedKeyEncoder;
             $scope.data[parseInt($scope.currentClickedElement)].key_encoder_description = $scope.getKeyEncoderDescription($scope.mapping.selectedKeyEncoder);
        };
        $scope.addWorkstationRenderData = function(successData){
                // // To add new data to scope
                var pushData = {
                        "id":successData.id,
                        "encoder_id":$scope.mapping.selectedKeyEncoder,
                        "station_identifier": $scope.mapping.station_identifier,
                        "name": $scope.mapping.name,
                        "key_encoder_id":$scope.mapping.selectedKeyEncoder,
                        "key_encoder_description":$scope.getKeyEncoderDescription($scope.mapping.selectedKeyEncoder)
                };
             $scope.data.push(pushData);
             $scope.totalCount++;
        };
        $scope.successSaveMapping = function(successData){
            $scope.$emit('hideLoader');
            if($scope.isAddMode){
                $scope.addWorkstationRenderData(successData);
            } else {
                $scope.updateCurrentWorkstation();
            }

            $scope.currentClickedElement = -1;
            $scope.isEditMode = false;
            $scope.loadTable();
        };
	$scope.saveMapping = function(){
		var data = {//not getting list of printers from the api at this point, 
                            //so we will have to rely on zest station or another UI to update the workstation with a default printer
			"name": $scope.mapping.name,
			"identifier": $scope.mapping.station_identifier
		};
                if (typeof $scope.mapping.selectedKeyEncoder !== typeof undefined){
                    data.default_key_encoder_id = $scope.mapping.selectedKeyEncoder;
                }
                
                
		if($scope.isAddMode){
                    $scope.invokeApi(ADDeviceSrv.createMapping, data , $scope.successSaveMapping);
		} else {
                    data.id = $scope.mapping.id;
                    $scope.mapping.selectedKeyEncoder = data.default_key_encoder_id;
                    $scope.invokeApi(ADDeviceSrv.updateMapping, data , $scope.successSaveMapping);
		}
	};
}]);

