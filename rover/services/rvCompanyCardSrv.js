sntRover.service('RVCompanyCardSrv', ['$q', 'rvBaseWebSrvV2',
	function($q, rvBaseWebSrvV2) {

		var self = this;

		/** contact information area */

		/**
		 * service function used to retreive contact information against a accound id
		 */
		this.fetchContactInformation = function(data) {
			var id = data.id;
			var deferred = $q.defer();
			var url = '/api/accounts/' + id;
			rvBaseWebSrvV2.getJSON(url).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

		/**
		 * service function used for retreive country list
		 */
		var _countryList = [];
		this.fetchCountryList = function() {
			var deferred = $q.defer();
			var url = '/ui/country_list';
			
			if ( _countryList.length ) {
				deferred.resolve(_countryList);
			} else {
				rvBaseWebSrvV2.getJSON(url).then(function(data) {
					_countryList = data;
					deferred.resolve(data);
				}, function(data) {
					deferred.reject(data);
				});
			};
			
			return deferred.promise;
		};

		/**
		 * service function used to save the contact information
		 */
		this.saveContactInformation = function(data) {
			var deferred = $q.defer();
			var url = 'api/accounts/save.json';
			rvBaseWebSrvV2.postJSON(url, data).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		}

		/** end of contact information area */

		this.fetchContractsList = function(data) {
			var deferred = $q.defer();
			//var url =  '/sample_json/contracts/rvCompanyCardContractsList.json';	
			var url = '/api/accounts/' + data.account_id + '/contracts';
			rvBaseWebSrvV2.getJSON(url).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

		this.fetchContractsDetails = function(data) {
			var deferred = $q.defer();
			//var url =  '/sample_json/contracts/rvCompanyCardContractsDetails.json';	
			var url = '/api/accounts/' + data.account_id + '/contracts/' + data.contract_id;
			rvBaseWebSrvV2.getJSON(url).then(function(data) {

				/*if (data.selected_type == 'percent') {
					data.selected_type = '%';
					data.rate_value = data.rate_value != '' ? parseFloat(data.rate_value).toFixed(2) : '';
				} else if (data.selected_type == 'amount') {
					data.selected_type = '$';
					data.rate_value = data.rate_value != '' ? parseInt(data.rate_value) : '';
				} else {
					data.selected_type = '';
				}*/
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

		/**
		 * service function used to update the contracts
		 */
		this.updateContract = function(data) {
			/*if (data.postData.selected_type == '$') {
				data.postData.selected_type = 'amount';
			} else if (data.postData.selected_type == '%') {
				data.postData.selected_type = 'percent';
			} else {
				data.postData.selected_type = '';
			}*/
			var deferred = $q.defer();
			var url = '/api/accounts/' + data.account_id + '/contracts/' + data.contract_id;
			rvBaseWebSrvV2.putJSON(url, data.postData).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		}

		/**
		 * service function used to add new contracts
		 */
		this.addNewContract = function(data) {

			/*if (data.postData.selected_type == '$') {
				data.postData.selected_type = 'amount';
			} else if (data.postData.selected_type == '%') {
				data.postData.selected_type = 'percent';
			} else {
				data.postData.selected_type = '';
			}*/
			var deferred = $q.defer();
			var url = '/api/accounts/' + data.account_id + '/contracts';
			rvBaseWebSrvV2.postJSON(url, data.postData).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		}

		this.updateNight = function(data) {
			var deferred = $q.defer();
			var url = '/api/accounts/' + data.account_id + '/contracts/' + data.contract_id + '/contract_nights';
			rvBaseWebSrvV2.postJSON(url, data.postData).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		}

		/**
		 * service function used for retreive rates
		 */
		this.fetchRates = function() {
			var deferred = $q.defer();
			var url = '/api/rates/contract_rates';
			rvBaseWebSrvV2.getJSON(url).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

		this.replaceCard = function(data) {
			var request = {
				"old": {
					type: data.cardType
				},
				"new": {
					type: data.cardType,
					id: data.id
				},
				"change_all_reservations": data.future
			}
			var deferred = $q.defer();
			var url = '/api/reservations/' + data.reservation + '/cards/replace';
			rvBaseWebSrvV2.putJSON(url, request).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		}

		this.removeCard = function(data) {
			var request = {
				type: data.cardType
			}
			var deferred = $q.defer();
			var url = '/api/reservations/' + data.reservation + '/cards/remove';
			rvBaseWebSrvV2.deleteJSON(url, request).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		}

		this.saveAccountContact = function(data) {
			var id = data.id;
			var deferred = $q.defer();
			var url = '/api/accounts/';
			rvBaseWebSrvV2.postJSON(url).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		}


		this.fetchArAccountDetails = function(data) {
			var id = data.id;
			var deferred = $q.defer();
			var url = '/api/accounts/'+id+'/ar_details';
			rvBaseWebSrvV2.getJSON(url).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		}

		this.fetchArAccountNotes = function(data) {
			var id = data.id;
			var deferred = $q.defer();
			var url = '/api/accounts/'+id+'/ar_notes';
			rvBaseWebSrvV2.getJSON(url).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		}

		this.saveARNote = function(data) {
			var deferred = $q.defer();
			var url = '/api/accounts/save_ar_note';
			rvBaseWebSrvV2.postJSON(url,data).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		}

		this.saveARDetails = function(data) {
			var deferred = $q.defer();
			var url = 'api/accounts/save_ar_details';
			rvBaseWebSrvV2.postJSON(url,data).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		}



		this.deleteARNote = function(data) {
			var deferred = $q.defer();
			var url = '/api/accounts/delete_ar_note';
			rvBaseWebSrvV2.postJSON(url,data).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		}

		this.deleteArAccount = function(data) {
			var id = data.id;
			var deferred = $q.defer();
			var url = 'api/accounts/'+id+'/delete_ar_detail';
			rvBaseWebSrvV2.deleteJSON(url).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		}

		this.fetchArAccountsList = function(params){
			var deferred = $q.defer();
			//var url = '/sample_json/cards/arAccountList.json';
			var url = "/api/accounts/"+params.id+"/ar_transactions?paid="+params.paid+"&from_date="+params.from_date+"&to_date="+params.to_date+"&query="+params.query+"&page="+params.page_no+"&per_page="+params.per_page;
			rvBaseWebSrvV2.getJSON(url).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		}

		this.addCreditAmount = function(params){
			var deferred = $q.defer();
			var url = "api/accounts/"+params.id+"/ar_transactions";
			rvBaseWebSrvV2.postJSON(url,params).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		}

		this.payForReservation = function(params){
			var deferred = $q.defer();
			var url = "api/accounts/"+params.id+"/ar_transactions/"+params.transaction_id+"/pay";
			rvBaseWebSrvV2.postJSON(url).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		}

		this.openForReservation = function(params){
			var deferred = $q.defer();
			var url = "api/accounts/"+params.id+"/ar_transactions/"+params.transaction_id+"/open";
			rvBaseWebSrvV2.postJSON(url).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		}

		this.payAll = function(params){
			var deferred = $q.defer();
			var url = "api/accounts/"+params.id+"/ar_transactions/pay_all";
			rvBaseWebSrvV2.postJSON(url).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		}
                
		this.fetchHotelLoyaltiesHlps = function(param){
                    var deferred = $q.defer();
                    var url =  '/staff/user_memberships/get_available_hlps.json';
                    rvBaseWebSrvV2.getJSON(url).then(function(data) {
                            deferred.resolve(data);
                    },function(data){
                            deferred.reject(data);
                    });
                    return deferred.promise;	
                };
		this.fetchHotelLoyaltiesFfp = function(param){
                    var deferred = $q.defer();
                    var url =  '/staff/user_memberships/get_available_ffps.json';
                    rvBaseWebSrvV2.getJSON(url).then(function(data) {
                            deferred.resolve(data);
                    },function(data){
                            deferred.reject(data);
                    });
                    return deferred.promise;	
                };

	}
]);