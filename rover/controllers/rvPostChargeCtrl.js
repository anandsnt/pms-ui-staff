sntRover.controller('RVPostChargeController',[ '$rootScope','$scope', function($rootScope, $scope){
	BaseCtrl.call(this, $scope);

	// get the data 
	// https://pms-dev.stayntouch.com/staff/items/35980/get_items.json
	// resv id

	// post the data
	// https://pms-dev.stayntouch.com/staff/items/post_items_to_bill
	// data = {
	// 	reservation_id:35980
	// 	fetch_total_balance:true
	// 	bill_no:1
	// 	total:14.20
	// 	items[0][value]:57
	// 	items[0][amount]:7.20
	// 	items[0][quantity]:1
	// 	items[1][value]:53
	// 	items[1][amount]:7.00
	// 	items[1][quantity]:1
	// }
}]);