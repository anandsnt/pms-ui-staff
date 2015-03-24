sntRover.service('rvGroupConfigurationSrv', ['$q', 'rvBaseWebSrvV2',
	function($q, rvBaseWebSrvV2) {

		var self = this;

		this.baseConfigurationSummary = {
			"summary": {
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
				"rate": null,
				"addons_count": null,
				"notes": []
			}
		};

		this.getGroupSummary = function(params) {

			var deferred = $q.defer();

			if (params.groupId === "NEW_GROUP") {
				deferred.resolve(self.baseConfigurationSummary);
			} else {
				url = '/ui/show?format=json&json_input=groups/1.json';
				rvBaseWebSrvV2.getJSON(url, params).then(
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

		this.searchCompanyCards = function(query) {
			var deferred = $q.defer(),
				url = 'api/accounts?account_type=COMPANY&query=' + query;

			rvBaseWebSrvV2.getJSON(url)
				.then(function(data) {
					deferred.resolve(data.accounts);
				}.bind(this), function(data) {
					deferred.reject(data);
				});

			return deferred.promise;
		}

		this.searchTravelAgentCards = function(query) {
			var deferred = $q.defer(),
				url = 'api/accounts?account_type=TRAVELAGENT&query=' + query;

			rvBaseWebSrvV2.getJSON(url)
				.then(function(data) {
					deferred.resolve(data.accounts);
				}.bind(this), function(data) {
					deferred.reject(data);
				});

			return deferred.promise;
		}


	}
]);