sntRover.service('rvGroupConfigurationSrv', ['$q', 'rvBaseWebSrvV2', 'rvAccountsConfigurationSrv',
	function($q, rvBaseWebSrvV2, rvAccountsConfigurationSrv) {

		var self = this;

		this.baseConfigurationSummary = {
			"group_id": null,
			"group_name": "",
			"group_code": null,
			"first_name": "",
			"last_name": "",
			"contact_phone": "",
			"contact_email": "",
			"demographics": {
				"reservation_type_id": "",
				"market_segment_id": "",
				"source_id": "",
				"booking_origin_id": ""
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

		/**
		 * Function to get list of Hold status to display
		 * @return {Promise} - After resolving it will return the list of Hold status
		 */
		this.getHoldStatusList = function() {
			var deferred = $q.defer(),
				//url = '/ui/show?format=json&json_input=groups/hold_status_list.json';
				url = '/api/group_hold_statuses';

			rvBaseWebSrvV2.getJSON(url).then(
				function(data) {
					deferred.resolve(data);
				},
				function(errorMessage) {
					deferred.reject(errorMessage);
				}
			);

			return deferred.promise;
		};


		/**
		 * To save the selected Room types and its bookings
		 * @return {Promise}
		 */
		this.saveRoomBlockBookings = function(params) {
			var deferred = $q.defer(),
				url = '/api/groups/save_inventories';
			//url = '/ui/show?format=json&json_input=groups/group_room_types_and_rates.json';

			rvBaseWebSrvV2.postJSON(url, params).then(
				function(data) {
					deferred.resolve(data);
				},
				function(errorMessage) {
					deferred.reject(errorMessage);
				}
			);

			return deferred.promise;
		};

		/**
		 * Function to get Room Block Grid Details
		 * @param {param} -group id
		 * @return {Promise} -
		 */
		this.getRoomBlockGridDetails = function(param) {
			var deferred = $q.defer(),
				url = '/api/groups/' + param.group_id + '/inventories';
			//url = '/ui/show?format=json&json_input=groups/griddata.json';
			rvBaseWebSrvV2.getJSON(url).then(
				function(data) {
					deferred.resolve(data);
				},
				function(errorMessage) {
					deferred.reject(errorMessage);
				}
			);

			return deferred.promise;
		};

		/**
		 * Function to get list of Room types
		 * @return {Promise} - After resolving it will return the list of Hold Room types
		 */
		this.getAllRoomTypes = function() {
			var deferred = $q.defer(),
				url = '/api/room_types.json?is_exclude_pseudo=true';

			rvBaseWebSrvV2.getJSON(url).then(
				function(data) {
					deferred.resolve(data);
				},
				function(errorMessage) {
					deferred.reject(errorMessage);
				}
			);

			return deferred.promise;
		};

		/**
		 * Function to get Room type availablity as well as best availbale rate
		 * @return {Promise} [will get the details]
		 */
		this.getSelectedRoomTypesAndRates = function(params) {
			var deferred = $q.defer(),
				group_id = params.id,
				url = '/api/groups/' + group_id + "/room_type_and_rates";
			//url = '/ui/show?format=json&json_input=groups/group_room_types_and_rates.json';

			rvBaseWebSrvV2.getJSON(url, params).then(
				function(data) {
					deferred.resolve(data);
				},
				function(errorMessage) {
					deferred.reject(errorMessage);
				}
			);

			return deferred.promise;
		};

		/**
		 * To update the selected Room types and its rates
		 * @return {Promise}
		 */
		this.updateSelectedRoomTypesAndRates = function(params) {
			var deferred = $q.defer(),
				url = '/api/groups/update_room_type_and_rates';
			//url = '/ui/show?format=json&json_input=groups/group_room_types_and_rates.json';

			rvBaseWebSrvV2.postJSON(url, params).then(
				function(data) {
					deferred.resolve(data);
				},
				function(errorMessage) {
					deferred.reject(errorMessage);
				}
			);

			return deferred.promise;
		};


		this.cancelGroup = function(params) {
			var deferred = $q.defer(),
				url = '/api/groups/'+params.group_id+'/cancel';
			rvBaseWebSrvV2.postJSON(url, params).then(
				function(data) {
					deferred.resolve(data);
				},
				function(errorMessage) {
					deferred.reject(errorMessage);
				}
			);

			return deferred.promise;
		}

		/**
		 * Function to get Room type availablity as well as best availbale rate
		 * @return {Promise} [will get the details]
		 */
		this.getRoomTypeBestAvailableRateAndOccupancyCount = function(params) {
			var deferred = $q.defer(),
				url = '/api/groups/availability';

			rvBaseWebSrvV2.getJSON(url, params).then(
				function(data) {
					deferred.resolve(data);
				},
				function(errorMessage) {
					deferred.reject(errorMessage);
				}
			);

			return deferred.promise;
		};

		var summaryHolder = {},
			getAccountSummary = function(deferred, params) {
				if (params.accountId === "NEW_ACCOUNT") {
					deferred.resolve({
						"accountSummary": angular.copy(rvAccountsConfigurationSrv.baseAccountSummaryData)
					});
				} else {
					url = 'api/posting_accounts/' + params.accountId;
					rvBaseWebSrvV2.getJSON(url).then(
						function(data) {
							summaryHolder.accountSummary = data;
							deferred.resolve(summaryHolder);
						},
						function(errorMessage) {
							deferred.reject(errorMessage);
						}
					);
				}
				return deferred.promise;
			};

		this.getGroupSummary = function(params) {
			var deferred = $q.defer();

			if (params.groupId === "NEW_GROUP") {
				deferred.resolve(angular.copy({
					"groupSummary": self.baseConfigurationSummary
				}));
			} else {
				url = 'api/groups/' + params.groupId;
				rvBaseWebSrvV2.getJSON(url).then(
					function(data) {
						summaryHolder.groupSummary = data;
						getAccountSummary(deferred, {
							accountId: data.posting_account_id
						});
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

		this.updateGroupSummary = function(data) {
			var deferred = $q.defer(),
				url = 'api/groups/' + data.summary.group_id;

			rvBaseWebSrvV2.putJSON(url, data.summary)
				.then(function(data) {
					deferred.resolve(data);
				}.bind(this), function(data) {
					deferred.reject(data);
				});

			return deferred.promise;
		}

		this.saveGroupSummary = function(data) {
			var deferred = $q.defer(),
				url = 'api/groups';

			rvBaseWebSrvV2.postJSON(url, data.summary)
				.then(function(data) {
					deferred.resolve(data);
				}.bind(this), function(data) {
					deferred.reject(data);
				});

			return deferred.promise;
		}

		this.addGroupEnhancement = function(data) {
			var deferred = $q.defer(),
				url = '/api/groups/' + data.id + '/addons';

			rvBaseWebSrvV2.postJSON(url, data)
				.then(function(data) {
					deferred.resolve(data);
				}.bind(this), function(data) {
					deferred.reject(data);
				});

			return deferred.promise;

		}

		this.removeGroupEnhancement = function(data) {
			var deferred = $q.defer(),
				url = '/api/groups/' + data.id + '/addons';

			rvBaseWebSrvV2.deleteJSON(url, data)
				.then(function(data) {
					deferred.resolve(data);
				}.bind(this), function(data) {
					deferred.reject(data);
				});

			return deferred.promise;

		}


		this.getGroupEnhancements = function(data) {
			var deferred = $q.defer(),
				url = '/api/groups/' + data.id + '/addons';

			rvBaseWebSrvV2.getJSON(url)
				.then(function(data) {
					deferred.resolve(data);
				}.bind(this), function(data) {
					deferred.reject(data);
				});

			return deferred.promise;
		}

		this.saveGroupNote = function(data) {
			var deferred = $q.defer(),
				url = 'api/groups/save_group_note';

			rvBaseWebSrvV2.postJSON(url, data)
				.then(function(data) {
					deferred.resolve(data);
				}.bind(this), function(data) {
					deferred.reject(data);
				});
			return deferred.promise;
		}



		this.removeGroupNote = function(data) {
			var deferred = $q.defer(),
				url = 'api/groups/delete_group_note';

			rvBaseWebSrvV2.deleteJSON(url, data)
				.then(function(data) {
					deferred.resolve(data);
				}.bind(this), function(data) {
					deferred.reject(data);
				});
			return deferred.promise;
		}

		this.updateRoomingListItem = function(data) {
			var deferred = $q.defer(),
				url = 'api/group_reservations/' + data.id;
			rvBaseWebSrvV2.putJSON(url, data)
				.then(function(data) {
					deferred.resolve(data);
				}.bind(this), function(data) {
					deferred.reject(data);
				});
			return deferred.promise;
		}

		this.removeRoomingListItem = function(data) {
			var deferred = $q.defer(),
				url = 'api/group_reservations/' + data.id + '/cancel';
			rvBaseWebSrvV2.postJSON(url, data)
				.then(function(data) {
					deferred.resolve(data);
				}.bind(this), function(data) {
					deferred.reject(data);
				});
			return deferred.promise;
		}

		this.releaseRooms = function(data) {
			var deferred = $q.defer(),
				url = 'api/groups/' + data.groupId + '/release_now';
			rvBaseWebSrvV2.getJSON(url, data)
				.then(function(data) {
					deferred.resolve(data);
				}.bind(this), function(data) {
					deferred.reject(data);
				});
			return deferred.promise;
		}

		/**
		 * Method used to fetch appropriate Rates for the group
		 * @param  {Object} data contains from_date, to_date (block period), travel_agent_id and company_id
		 * @return {promise}
		 */
		this.getRates = function(data) {
			var deferred = $q.defer(),
				url = 'api/groups/rates';
			rvBaseWebSrvV2.getJSON(url, data)
				.then(function(data) {
					deferred.resolve(data);
				}.bind(this), function(data) {
					deferred.reject(data);
				});
			return deferred.promise;
		}
	}
]);