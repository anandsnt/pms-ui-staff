admin.controller('ADBrandListCtrl',['$scope', '$state',   function($scope, $state){
	$scope.data = {
		"brands": [
			{
				"value":"1",
				"name":"Brand One"
			},
			{
				"value":"2",
				"name":"Brand Two"
			}
		]
	}
	$scope.addFormView = false;
	$scope.addNew = function(index, brand)	{
		$scope.addFormView = true;
	};
	$scope.getTemplateUrl = function(index,name){
		if(index!="undefined" && name != "undefined"){
		
			if($scope.currentClickedElement == index){

				$scope.formTitle ='Edit StayNTouch Demo Brand';
			 	return "/assets/partials/brands/adBrandForm.html";
			 } 
		}
		if(index == ""	){
				$scope.formTitle = 'Add';
			 	return "/assets/partials/brands/adBrandForm.html";
		}
		 
	};
}