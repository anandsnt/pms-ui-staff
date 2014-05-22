admin.controller('ADFloorSetupCtrl',['$scope', '$state', 'ADFloorSetupSrv', 'ngTableParams','$filter',  function($scope, $state, ADFloorSetupSrv, ngTableParams, $filter){
	
	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);
	$scope.floorListData = {};
	

   /*
    * To fetch list of room types
    */
	$scope.listFloorTypes = function(){
		console.log("upto list floors");
		var successCallbackFetch = function(data){
			$scope.$emit('hideLoader');
			$scope.data = data;
			$scope.currentClickedElement = -1;
			console.log($scope.data);
			// REMEMBER - ADDED A hidden class in ng-table angular module js. Search for hidde or pull-right
		    $scope.tableParams = new ngTableParams({
		        page: 1,            // show first page
		        count: $scope.data.floors.length,    // count per page - Need to change when on pagination implemntation
		        sorting: {
		            description: 'asc'     // initial sorting
		        }
		    }, {
		        total: $scope.data.floors.length, // length of data
		        getData: function($defer, params) {
		            // use build-in angular filter
		            var orderedData = params.sorting() ?
		                                $filter('orderBy')($scope.data.floors, params.orderBy()) :
		                                $scope.data.floors;
		                              
		            $scope.orderedData =  orderedData;
		            // console.log($scope.orderedData);
		                       
		            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
		        }
		    });
		};
		var res = {"floors":[{"name":1,"floor_number":"1","description":"Description - 1"},{"name":2,"floor_number":"2","description":"Description - 2"},{"name":3,"floor_number":"3","description":"Description - 3"},{"name":4,"floor_number":"4","description":"Description - 4"},{"name":5,"floor_number":"5","description":"Description - 5"},{"name":6,"floor_number":"6","description":"Description - 6"},{"name":7,"floor_number":"7","description":"Description - 7"},{"name":8,"floor_number":"8","description":"Description - 8"},{"name":9,"floor_number":"9","description":"Description - 9"},{"name":10,"floor_number":"10","description":"Description - 10"},{"name":11,"floor_number":"11","description":"Description - 11"},{"name":12,"floor_number":"12","description":"Description - 12"},{"name":13,"floor_number":"13","description":"Description - 13"},{"name":14,"floor_number":"14","description":"Description - 14"},{"name":15,"floor_number":"15","description":"Description - 15"},{"name":16,"floor_number":"16","description":"Description - 16"},{"name":17,"floor_number":"17","description":"Description - 17"},{"name":18,"floor_number":"18","description":"Description - 18"},{"name":19,"floor_number":"19","description":"Description - 19"},{"name":20,"floor_number":"20","description":"Description - 20"},{"name":21,"floor_number":"21","description":"Description - 21"},{"name":22,"floor_number":"22","description":"Description - 22"},{"name":23,"floor_number":"23","description":"Description - 23"},{"name":24,"floor_number":"24","description":"Description - 24"},{"name":25,"floor_number":"25","description":"Description - 25"},{"name":26,"floor_number":"26","description":"Description - 26"},{"name":27,"floor_number":"27","description":"Description - 27"},{"name":28,"floor_number":"28","description":"Description - 28"},{"name":29,"floor_number":"29","description":"Description - 29"},{"name":30,"floor_number":"30","description":"Description - 30"},{"name":31,"floor_number":"31","description":"Description - 31"},{"name":32,"floor_number":"32","description":"Description - 32"},{"name":33,"floor_number":"33","description":"Description - 33"},{"name":34,"floor_number":"34","description":"Description - 34"},{"name":35,"floor_number":"35","description":"Description - 35"},{"name":36,"floor_number":"36","description":"Description - 36"},{"name":37,"floor_number":"37","description":"Description - 37"},{"name":38,"floor_number":"38","description":"Description - 38"},{"name":39,"floor_number":"39","description":"Description - 39"},{"name":40,"floor_number":"40","description":"Description - 40"},{"name":41,"floor_number":"41","description":"Description - 41"},{"name":42,"floor_number":"42","description":"Description - 42"},{"name":43,"floor_number":"43","description":"Description - 43"},{"name":44,"floor_number":"44","description":"Description - 44"},{"name":45,"floor_number":"45","description":"Description - 45"},{"name":46,"floor_number":"46","description":"Description - 46"},{"name":47,"floor_number":"47","description":"Description - 47"},{"name":48,"floor_number":"48","description":"Description - 48"},{"name":49,"floor_number":"49","description":"Description - 49"},{"name":50,"floor_number":"50","description":"Description - 50"},{"name":51,"floor_number":"51","description":"Description - 51"},{"name":52,"floor_number":"52","description":"Description - 52"},{"name":53,"floor_number":"53","description":"Description - 53"},{"name":54,"floor_number":"54","description":"Description - 54"},{"name":55,"floor_number":"55","description":"Description - 55"},{"name":56,"floor_number":"56","description":"Description - 56"},{"name":57,"floor_number":"57","description":"Description - 57"},{"name":58,"floor_number":"58","description":"Description - 58"},{"name":59,"floor_number":"59","description":"Description - 59"},{"name":60,"floor_number":"60","description":"Description - 60"},{"name":61,"floor_number":"61","description":"Description - 61"},{"name":62,"floor_number":"62","description":"Description - 62"},{"name":63,"floor_number":"63","description":"Description - 63"},{"name":64,"floor_number":"64","description":"Description - 64"},{"name":65,"floor_number":"65","description":"Description - 65"},{"name":66,"floor_number":"66","description":"Description - 66"},{"name":67,"floor_number":"67","description":"Description - 67"},{"name":68,"floor_number":"68","description":"Description - 68"},{"name":69,"floor_number":"69","description":"Description - 69"},{"name":70,"floor_number":"70","description":"Description - 70"},{"name":71,"floor_number":"71","description":"Description - 71"},{"name":72,"floor_number":"72","description":"Description - 72"},{"name":73,"floor_number":"73","description":"Description - 73"},{"name":74,"floor_number":"74","description":"Description - 74"},{"name":75,"floor_number":"75","description":"Description - 75"},{"name":76,"floor_number":"76","description":"Description - 76"},{"name":77,"floor_number":"77","description":"Description - 77"},{"name":78,"floor_number":"78","description":"Description - 78"},{"name":79,"floor_number":"79","description":"Description - 79"},{"name":80,"floor_number":"80","description":"Description - 80"},{"name":81,"floor_number":"81","description":"Description - 81"},{"name":82,"floor_number":"82","description":"Description - 82"},{"name":83,"floor_number":"83","description":"Description - 83"},{"name":84,"floor_number":"84","description":"Description - 84"},{"name":85,"floor_number":"85","description":"Description - 85"},{"name":86,"floor_number":"86","description":"Description - 86"},{"name":87,"floor_number":"87","description":"Description - 87"},{"name":88,"floor_number":"88","description":"Description - 88"},{"name":89,"floor_number":"89","description":"Description - 89"},{"name":90,"floor_number":"90","description":"Description - 90"},{"name":91,"floor_number":"91","description":"Description - 91"},{"name":92,"floor_number":"92","description":"Description - 92"},{"name":93,"floor_number":"93","description":"Description - 93"},{"name":94,"floor_number":"94","description":"Description - 94"},{"name":95,"floor_number":"95","description":"Description - 95"},{"name":96,"floor_number":"96","description":"Description - 96"},{"name":97,"floor_number":"97","description":"Description - 97"},{"name":98,"floor_number":"98","description":"Description - 98"},{"name":99,"floor_number":"99","description":"Description - 99"},{"name":100,"floor_number":"100","description":"Description - 100"}]}
		successCallbackFetch(res);
		// $scope.invokeApi(ADFloorSetupSrv.fetch, {} , successCallbackFetch);	
	};
	//To list room types
	$scope.listFloorTypes(); 
   /*
    * To render edit room types screen
    * @param {index} index of selected room type
    * @param {id} id of the room type
    */	
	$scope.editFloor = function(index, id)	{
		$scope.departmentData={};
		$scope.currentClickedElement = index;
	 	var successCallbackRender = function(data){	
	 		$scope.$emit('hideLoader');
	 		$scope.floorListData = data;
	 		// if($scope.floorListData.is_pseudo_room_type == "true" || $scope.floorListData.is_pseudo_room_type == true){
	 		// 	$scope.floorListData.is_pseudo_room_type = true;
	 		// }
	 		// else{
	 		// 	$scope.floorListData.is_pseudo_room_type = false;
	 		// }
	 		// if($scope.floorListData.is_suite == "true" || $scope.floorListData.is_suite == true){
	 		// 	$scope.floorListData.is_suite = true;
	 		// }
	 		// else{
	 		// 	$scope.floorListData.is_suite = false;
	 		// }
	 	};
	 	var data = {"id":id };
	 	var res = {"name":1,"floor_number":"1","description":"Description - 1"};
	 	successCallbackRender(res);
	 	// $scope.invokeApi(ADFloorSetupSrv.getRoomTypeDetails, data , successCallbackRender);    
	};
   
   /*
    * To get the template of edit screen
    * @param {int} index of the selected room type
    * @param {string} id of the room type
    */
	$scope.getTemplateUrl = function(index, id){
		// if(typeof index === "undefined" || typeof id === "undefined") return "";
		if(typeof index === "undefined" ) return "";
		if($scope.currentClickedElement == index){ 
			 	return "/assets/partials/floorSetups/adFloorDetails.html";
		}
	};
  /*
   * To save/update room type details
   */
   $scope.saveFloor = function(){
		
		var unwantedKeys = [];
		console.log($scope.floorListData);
		if($scope.floorListData.image_of_room_type.indexOf("data:")!= -1){
		} else {
			unwantedKeys = ["image_of_room_type"];
		}
		 var data = dclone($scope.floorListData, unwantedKeys);
		 
    	var successCallbackSave = function(data){
    		$scope.$emit('hideLoader');
    		//Since the list is ordered. Update the ordered data
    		$scope.orderedData[parseInt($scope.currentClickedElement)].name = $scope.floorListData.room_type_name;
    		$scope.orderedData[parseInt($scope.currentClickedElement)].code = $scope.floorListData.room_type_code;
    		$scope.currentClickedElement = -1;
    	};
    	$scope.invokeApi(ADFloorSetupSrv.updateRoomTypes, data , successCallbackSave);
    };
   /*
    * To handle click event
    */	
	$scope.clickCancel = function(){
		$scope.currentClickedElement = -1;
	};	
   /*
    * To delete department
    * @param {int} index of the selected department
    * @param {string} id of the selected department
    */		
	$scope.importFromPms = function(){
		var successCallbackImport = function(data){	
	 		$scope.$emit('hideLoader');
	 		$scope.listRoomTypes();
	 		// $scope.data.departments.splice(index, 1);
	 	};
		$scope.invokeApi(ADFloorSetupSrv.importFromPms, '' , successCallbackImport);
	};
}]);

