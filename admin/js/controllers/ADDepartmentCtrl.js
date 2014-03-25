admin.controller('ADDepartmentListCtrl',['$scope', '$state',   function($scope, $state){
	
	$scope.data = {
		    "departments": [
		        {
		            "value": "3",
		            "name": "Housekeeping"
		        },
		        {
		            "value": "5",
		            "name": "IT"
		        },
		        {
		            "value": "6",
		            "name": "Front Desk"
		        },
		        {
		            "value": "20",
		            "name": "Concierge"
		        },
		        {
		            "value": "21",
		            "name": "Engineering"
		        },
		        {
		            "value": "36",
		            "name": "One test"
		        },
		        {
		            "value": "37",
		            "name": "Two test"
		        },
		        {
		            "value": "38",
		            "name": "Three test"
		        }
		    ]
		};	
	
	$scope.currentClickedElement = -1;
	$scope.editDepartments = function(index, department)	{
			$scope.currentClickedElement = index;
	};
	//Function to get the template for edit url
	$scope.getTemplateUrl = function(index, department){
		 if($scope.currentClickedElement == index){
		 	$scope.value = department.value;
		 	$scope.departmentName = department.name;
		 	return "/assets/partials/departments/adDepartmentsEdit.html";
		 } 
	};
	
	$scope.saveDepartment = function(){
		console.log($scope.departmentName);
	};
		

}]);