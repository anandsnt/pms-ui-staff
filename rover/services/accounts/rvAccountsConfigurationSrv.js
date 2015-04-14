sntRover.service('rvAccountsConfigurationSrv', ['$q', 'rvBaseWebSrvV2',
	function($q, rvBaseWebSrvV2) {

		var self = this;

		this.baseAccountSummaryData = {
			"group_id": null,
			"group_name": "",
			"group_code": "",
			"first_name": "",
			"last_name": "",
			"contact_phone": "",
			"contact_email": "",
			"demographics": {
				"reservation_type_id": null,
				"market_segment_id": null,
				"source_id": null,
				"booking_origin_id": null
			},
			"travel_agent": null,
			"company": null,
			"hold_status": "",
			"block_from": "",
			"block_to": "",
			"revenue_actual": null,
			"revenue_potential": null,
			"rooms_total": null,
			"rooms_pickup": null,
			"rate": "",
			"addons_count": null,
			"notes": []
		};



		this.getAccountSummaryData = function(params) {

			var deferred = $q.defer();

			if (params.accountId === "NEW_ACCOUNT") {
				deferred.resolve(angular.copy(self.baseAccountSummaryData));
			} else {
				url = 'api/groups/' + params.accountId;
				rvBaseWebSrvV2.getJSON(url).then(
					function(data) {
						deferred.resolve(data);
					},
					function(errorMessage) {
						deferred.reject(errorMessage);
					}
				);
			}
			return deferred.promise;
		};

	}
]);