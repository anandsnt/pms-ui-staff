sntRover.service('rvAllotmentConfigurationSrv', ['$q', 'rvBaseWebSrvV2', 'rvAccountsConfigurationSrv',
	function($q, rvBaseWebSrvV2, rvAccountsConfigurationSrv) {

		var self = this;

		this.baseConfigurationSummary = {
			"allotment_id": null,
			"allotment_name": "",
			"allotment_code": null,
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
			"notes": [],
			"selected_room_types_and_bookings": [],
			"selected_room_types_and_occupanies": [],
			"selected_room_types_and_rates": []
		};

		/**
		 * Function to get list of Hold status to display
		 * @return {Promise} - After resolving it will return the list of Hold status
		 */
		this.getHoldStatusList = function(params) {
			var deferred = $q.defer(),

				url = '/api/group_hold_statuses';

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
		 * To save the selected Room types and its bookings
		 * @return {Promise}
		 */
		this.saveRoomBlockBookings = function(params) {
			var deferred = $q.defer(),
				url = '/api/allotments/save_inventories';


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
		 * To save the selected Room types and its release days
		 * @return {Promise}
		 */
		this.saveRoomBlockReleaseDays = function(params) {
			var deferred = $q.defer(),
				url = '/api/allotments/update_release_date';


			rvBaseWebSrvV2.putJSON(url, params).then(
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
		 * @param {param} -allotment id
		 * @return {Promise} -
		 */
		this.getRoomBlockGridDetails = function(param) {
			var deferred = $q.defer(),
				url = '/api/allotments/' + param.allotment_id + '/inventories';

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
				allotment_id = params.id,
				url = '/api/allotments/' + allotment_id + "/room_type_and_rates";


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
				url = '/api/allotments/update_room_type_and_rates';


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


		this.cancelAllotment = function(params) {
			var deferred = $q.defer(),
				url = '/api/allotments/' + params.allotment_id + '/cancel';
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
		 * Function to get Room type availablity as well as best availbale rate
		 * @return {Promise} [will get the details]
		 */
		this.getRoomTypeBestAvailableRateAndOccupancyCount = function(params) {
			var deferred = $q.defer(),
				url = '/api/allotments/availability';

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

		this.getAllotmentSummary = function(params) {
			var deferred = $q.defer();

			if (params.allotmentId === "NEW_ALLOTMENT") {
				deferred.resolve(angular.copy({
					"allotmentSummary": self.baseConfigurationSummary
				}));
			} else {
				url = 'api/allotments/' + params.allotmentId;
				rvBaseWebSrvV2.getJSON(url).then(
					function(data) {
						if (data.rate === null) {
							data.rate = -1;
						}
						summaryHolder.allotmentSummary = data;
						// To be covered in CICO-19135
						/*getAccountSummary(deferred, {
							accountId: data.posting_account_id
						});*/
						deferred.resolve(summaryHolder); // CICO-12555 avoid account summary call.
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
		};

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
		};

		this.updateAllotmentSummary = function(data) {
			var deferred = $q.defer(),
				url = 'api/allotments/' + data.summary.allotment_id;

			rvBaseWebSrvV2.putJSON(url, data.summary)
				.then(function(data) {
					deferred.resolve(data);
				}.bind(this), function(data) {
					deferred.reject(data);
				});

			return deferred.promise;
		};

		this.saveAllotmentSummary = function(data) {
			var deferred = $q.defer(),
				url = 'api/allotments';

			rvBaseWebSrvV2.postJSON(url, data.summary)
				.then(function(data) {
					deferred.resolve(data);
				}.bind(this), function(data) {
					deferred.reject(data);
				});

			return deferred.promise;
		};

		this.addAllotmentEnhancement = function(data) {
			var deferred = $q.defer(),
				url = '/api/allotments/' + data.id + '/addons';

			rvBaseWebSrvV2.postJSON(url, data)
				.then(function(data) {
					deferred.resolve(data);
				}.bind(this), function(data) {
					deferred.reject(data);
				});

			return deferred.promise;

		};

		this.removeAllotmentEnhancement = function(data) {
			var deferred = $q.defer(),
				url = '/api/allotments/' + data.id + '/addons';

			rvBaseWebSrvV2.deleteJSON(url, data)
				.then(function(data) {
					deferred.resolve(data);
				}.bind(this), function(data) {
					deferred.reject(data);
				});

			return deferred.promise;

		};


		this.getAllotmentEnhancements = function(data) {
			var deferred = $q.defer(),
				url = '/api/allotments/' + data.id + '/addons';

			rvBaseWebSrvV2.getJSON(url)
				.then(function(data) {
					deferred.resolve(data);
				}.bind(this), function(data) {
					deferred.reject(data);
				});

			return deferred.promise;
		};

		this.saveAllotmentNote = function(data) {
			var deferred = $q.defer(),
				url = 'api/allotments/save_allotment_note';

			rvBaseWebSrvV2.postJSON(url, data)
				.then(function(data) {
					deferred.resolve(data);
				}.bind(this), function(data) {
					deferred.reject(data);
				});
			return deferred.promise;
		};



		this.removeAllotmentNote = function(data) {
			var deferred = $q.defer(),
				url = 'api/allotments/delete_allotment_note';

			rvBaseWebSrvV2.deleteJSON(url, data)
				.then(function(data) {
					deferred.resolve(data);
				}.bind(this), function(data) {
					deferred.reject(data);
				});
			return deferred.promise;
		};

		this.updateRoomingListItem = function(data) {
			var deferred = $q.defer(),
				url = '/api/allotments/' + data.id + '/update_reservation';
			rvBaseWebSrvV2.putJSON(url, data)
				.then(function(data) {
					deferred.resolve(data);
				}.bind(this), function(data) {
					deferred.reject(data);
				});
			return deferred.promise;
		};

		this.removeRoomingListItem = function(data) {
			var deferred = $q.defer(),
				url = 'api/allotment_reservations/' + data.id + '/cancel';
			rvBaseWebSrvV2.postJSON(url, data)
				.then(function(data) {
					deferred.resolve(data);
				}.bind(this), function(data) {
					deferred.reject(data);
				});
			return deferred.promise;
		};

		this.releaseRooms = function(data) {
			var deferred = $q.defer(),
				url = 'api/allotments/' + data.allotmentId + '/release_now';
			rvBaseWebSrvV2.postJSON(url, data)
				.then(function(data) {
					deferred.resolve(data);
				}.bind(this), function(data) {
					deferred.reject(data);
				});
			return deferred.promise;
		};

		/**
		 * Method used to fetch appropriate Rates for the allotment
		 * @param  {Object} data contains from_date, to_date (block period), travel_agent_id and company_id
		 * @return {promise}
		 */
		this.getRates = function(data) {
			var deferred = $q.defer(),
				url = 'api/allotments/rates';
			rvBaseWebSrvV2.getJSON(url, data)
				.then(function(data) {
					deferred.resolve(data);
				}.bind(this), function(data) {
					deferred.reject(data);
				});
			return deferred.promise;
		};

		this.toggleHideRate = function(params) {
			var deferred = $q.defer(),
				url = 'api/allotments/' + params.allotment_id + '/hide_rates';
			rvBaseWebSrvV2.postJSON(url, params).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

		this.updateRate = function(params) {
			var deferred = $q.defer(),
				url = 'api/allotments/' + params.allotment_id + '/change_rate';
			rvBaseWebSrvV2.postJSON(url, params).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

	}
]);