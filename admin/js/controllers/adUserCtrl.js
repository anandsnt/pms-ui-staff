admin.controller('ADUserListCtrl',['$scope', '$state', 'ADUserSrv',  function($scope, $state, ADUserSrv){
	
	ADUserSrv.fetch().then(function(data) {
		        $scope.data = data;
		        //$scope.$parent.myScroll['rooms'].refresh();
		}, function(){
			console.log("fetch failed");

		});	
	
	
	// $scope.data = {
				    // "users": [
				        // {
				            // "id": "2",
				            // "full_name": "Admin Staff",
				            // "email": "hoteladmin@hotel.com",
				            // "department": "",
				            // "last_login": "03/20/2014  06:28 AM",
				            // "is_active": "true",
				            // "can_delete": "false"
				        // },
				        // {
				            // "id": "28",
				            // "full_name": "Priya  Rajamani",
				            // "email": "adi.prashanth@hotmail.com",
				            // "department": "",
				            // "last_login": "",
				            // "is_active": "false",
				            // "can_delete": "true"
				        // },
				        // {
				            // "id": "41",
				            // "full_name": "Winston Abraham",
				            // "email": "ganeshsbhat1990@gmail.com",
				            // "department": "",
				            // "last_login": "",
				            // "is_active": "true",
				            // "can_delete": "true"
				        // },
				        // {
				            // "id": "69",
				            // "full_name": "Priya Prashanth",
				            // "email": "priya.prashanth2014@hotmail.com",
				            // "department": "",
				            // "last_login": "01/17/2014  01:51 PM",
				            // "is_active": "true",
				            // "can_delete": "true"
				        // },
				        // {
				            // "id": "72",
				            // "full_name": "Rashila Noushad",
				            // "email": "rashila@stayntouch.com",
				            // "department": "",
				            // "last_login": "",
				            // "is_active": "true",
				            // "can_delete": "true"
				        // },
				        // {
				            // "id": "93",
				            // "full_name": "Nicki Dehler",
				            // "email": "nicole@stayntouch.com",
				            // "department": "",
				            // "last_login": "",
				            // "is_active": "true",
				            // "can_delete": "true"
				        // },
				        // {
				            // "id": "95",
				            // "full_name": "Aswanth VVV",
				            // "email": "aswanth@stayntouch.com",
				            // "department": "IT",
				            // "last_login": "",
				            // "is_active": "true",
				            // "can_delete": "true"
				        // },
				        // {
				            // "id": "101",
				            // "full_name": "sdfjksfkjds sdfsdfdsfds",
				            // "email": "dilna@qburst.com",
				            // "department": "Housekeeping",
				            // "last_login": "01/23/2014  09:35 AM",
				            // "is_active": "true",
				            // "can_delete": "true"
				        // },
				        // {
				            // "id": "102",
				            // "full_name": "Priya Rajamani",
				            // "email": "priya.prashanth2014@outlook.com",
				            // "department": "Housekeeping",
				            // "last_login": "01/23/2014  01:43 PM",
				            // "is_active": "true",
				            // "can_delete": "true"
				        // },
				        // {
				            // "id": "104",
				            // "full_name": "Ganesh S Bhat",
				            // "email": "nasarp@qburst.com",
				            // "department": "",
				            // "last_login": "01/24/2014  01:13 AM",
				            // "is_active": "true",
				            // "can_delete": "true"
				        // },
				        // {
				            // "id": "105",
				            // "full_name": "Britto John",
				            // "email": "megha@qburst.com",
				            // "department": "",
				            // "last_login": "01/24/2014  02:36 AM",
				            // "is_active": "true",
				            // "can_delete": "true"
				        // },
				        // {
				            // "id": "127",
				            // "full_name": "Shiju pc",
				            // "email": "shiju@stayntouch.com",
				            // "department": "",
				            // "last_login": "",
				            // "is_active": "true",
				            // "can_delete": "true"
				        // },
				        // {
				            // "id": "226",
				            // "full_name": "test123 123",
				            // "email": "test123@gmail.com",
				            // "department": "Housekeeping",
				            // "last_login": "02/11/2014  12:46 AM",
				            // "is_active": "true",
				            // "can_delete": "true"
				        // },
				        // {
				            // "id": "250",
				            // "full_name": "Zoe Schaap",
				            // "email": "zoe@stayntouch.com",
				            // "department": "Housekeeping",
				            // "last_login": "",
				            // "is_active": "false",
				            // "can_delete": "true"
				        // },
				        // {
				            // "id": "271",
				            // "full_name": "Shiju Devarajan",
				            // "email": "shiju@qburst.com",
				            // "department": "IT",
				            // "last_login": "02/25/2014  07:43 AM",
				            // "is_active": "true",
				            // "can_delete": "true"
				        // },
				        // {
				            // "id": "275",
				            // "full_name": "Rashila Fathim",
				            // "email": "rashila@qburst.com",
				            // "department": "IT",
				            // "last_login": "",
				            // "is_active": "true",
				            // "can_delete": "true"
				        // },
				        // {
				            // "id": "281",
				            // "full_name": "Geerhard Schaap",
				            // "email": "jschaap@stayntouch.com",
				            // "department": "IT",
				            // "last_login": "02/21/2014  03:43 PM",
				            // "is_active": "true",
				            // "can_delete": "true"
				        // }
				    // ],
				    // "departments": [
				        // {
				            // "value": "20",
				            // "name": "Concierge"
				        // },
				        // {
				            // "value": "18",
				            // "name": "Dep 1"
				        // },
				        // {
				            // "value": "19",
				            // "name": "Dep 1"
				        // },
				        // {
				            // "value": "21",
				            // "name": "Engineering"
				        // },
				        // {
				            // "value": "6",
				            // "name": "Front Desk"
				        // },
				        // {
				            // "value": "3",
				            // "name": "Housekeeping"
				        // },
				        // {
				            // "value": "5",
				            // "name": "IT"
				        // },
				        // {
				            // "value": "36",
				            // "name": "One test"
				        // },
				        // {
				            // "value": "11",
				            // "name": "Test dep 1"
				        // },
				        // {
				            // "value": "4",
				            // "name": "Test Department"
				        // },
				        // {
				            // "value": "7",
				            // "name": "Test Front Desk"
				        // },
				        // {
				            // "value": "8",
				            // "name": "Test IT"
				        // },
				        // {
				            // "value": "38",
				            // "name": "Three test"
				        // },
				        // {
				            // "value": "37",
				            // "name": "Two test"
				        // }
				    // ]
				// };
// 	
}]);

    
