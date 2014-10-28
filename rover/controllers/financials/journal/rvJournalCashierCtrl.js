sntRover.controller('RVJournalCashierController', ['$scope',function($scope) {
	BaseCtrl.call(this, $scope);


	$scope.cashierHistory=  [
        {
            "id": "0",
            "status": "closed",
            "user": "cashier",
            "time": "09:13",
            "date": "2014-08-25"
        },
        {
            "id": "1",
            "status": "open",
            "user": "cashier",
            "time": "09:13",
            "date": "2014-08-25"
        },
        {
            "id": "2",
            "status": "opened",
            "user": "new transaction",
            "time": "09:13",
            "date": "2014-08-25"
        },
         {
            "id": "3",
            "status": "closed",
            "user": "cashier",
            "time": "09:13",
            "date": "2014-08-25"
        },
        {
            "id": "4",
            "status": "closed",
            "user": "cashier",
            "time": "09:13",
            "date": "2014-08-25"
        },
        {
            "id": "5",
            "status": "open",
            "user": "new transaction",
            "time": "09:13",
            "date": "2014-08-25"
        },
         {
            "id": "6",
            "status": "closed",
            "user": "cashier",
            "time": "09:13",
            "date": "2014-08-25"
        },
        {
            "id": "7",
            "status": "closed",
            "user": "cashier",
            "time": "09:13",
            "date": "2014-08-25"
        },
        {
            "id": "8",
            "status": "open",
            "user": "new transaction",
            "time": "09:13",
            "date": "2014-08-25"
        },
         {
            "id": "9",
            "status": "closed",
            "user": "cashier",
            "time": "09:13",
            "date": "2014-08-25"
        },
        {
            "id": "10",
            "status": "closed",
            "user": "cashier",
            "time": "09:13",
            "date": "2014-08-25"
        },
        {
            "id": "11",
            "status": "open",
            "user": "new transaction",
            "time": "09:13",
            "date": "2014-08-25"
        }
    ];

  

    $scope.details ={
    "opening_balance_cash": "500",
    "opening_balance_check": "100",
    "total_cash_received": "200",
    "total_check_received": "300",
    "cash_submitted":"200",
    "check_submitted":"100",
    "status":"open"
  
	};

	var details1 ={
    "opening_balance_cash": "100",
    "opening_balance_check": "200",
    "total_cash_received": "300",
    "total_check_received": "700",
    "cash_submitted":"200",
    "check_submitted":"100",
    "status":"closed"
  
	};

	$scope.setScroller('cashier_history', {});
	setTimeout(function(){$scope.refreshScroller('cashier_history');}, 3000);

	$scope.setScroller('cashier_shift', {});
	setTimeout(function(){$scope.refreshScroller('cashier_shift');}, 3000);
	
	$scope.selectedHistory = 0;
	$scope.historyClicked = function(index){
		$scope.selectedHistory = index;
		$scope.details = [];
		$scope.details = details1;
	};
}]);