admin.service('adTransactionCenterSrv', [

	function() {
		// user actions that require a commit (those that need to be committed before user navigates out!)
		var adminTransactionsList = {
			"SELECT_ROOMS_IN_ASSIGN_FLOORS": {
				running: false,
				broadcastMessage: "CONFIRM_USER_ACTION"
			}
		};

		this.beginTransaction = function(transactionCode) {
			if (_.has(adminTransactionsList, transactionCode)) {
				adminTransactionsList[transactionCode].running = true;
			} else {
				console.warn('transaction code not defined! Please define Transaction in the adAppSrv');
			}
		};

		this.endTransaction = function(transactionCode) {
			if (_.has(adminTransactionsList, transactionCode)) {
				adminTransactionsList[transactionCode].running = false;
			} else {
				console.warn('transaction code not defined! Please define Transaction in the adAppSrv');
			}
		};

		this.isTransactionRunning = function(transactionCode) {
			if (_.has(adminTransactionsList, transactionCode)) {
				return adminTransactionsList[transactionCode].running;
			} else {
				console.warn('transaction code not defined! Please define Transaction in the adAppSrv');
			}
		};

		this.getRunningTransactions = function() {
			var transactions = [];
			_.each(adminTransactionsList, function(status, key) {
				if (status.running) {
					transactions.push({
						transactionCode: key,
						broadcastMessage: status.broadcastMessage
					});
				}
			});
			return transactions;
		}
	}
]);