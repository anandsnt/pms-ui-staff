angular.module('sntRover').service('RVCompanyCardSrv', ['$q', 'rvBaseWebSrvV2',
	function($q, rvBaseWebSrvV2) {

		var self = this;

		//some default values
		this.DEFAULT_PER_PAGE 	= 10;
		this.DEFAULT_PAGE 		= 1;

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
		 * getting details of commission status of travel agent card
		 */
		this.fetchCommissionDetail = function(data) {
			var deferred = $q.defer();
			var url = ' /api/hotel_settings/default_agent_commission_details';
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
		};

		/** end of contact information area */

		this.fetchContractsList = function(data) {
			var deferred = $q.defer();

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

			var url = '/api/accounts/' + data.account_id + '/contracts/' + data.contract_id;
			rvBaseWebSrvV2.getJSON(url).then(function(data) {


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

			var deferred = $q.defer();
			var url = '/api/accounts/' + data.account_id + '/contracts/' + data.contract_id;
			rvBaseWebSrvV2.putJSON(url, data.postData).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

		/**
		 * service function used to delete contract
		 */
		this.deleteContract = function(data) {

			var deferred = $q.defer();
			var url = '/api/accounts/' + data.account_id + '/contracts/' + data.contract_id;
			rvBaseWebSrvV2.deleteJSON(url).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};


		/**
		 * service function used to add new contracts
		 */
		this.addNewContract = function(data) {


			var deferred = $q.defer();
			var url = '/api/accounts/' + data.account_id + '/contracts';
			rvBaseWebSrvV2.postJSON(url, data.postData).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

		this.updateNight = function(data) {
			var deferred = $q.defer();
			var url = '/api/accounts/' + data.account_id + '/contracts/' + data.contract_id + '/contract_nights';
			rvBaseWebSrvV2.postJSON(url, data.postData).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

		/**
		 * service function used for retreive rates
		 */
		this.fetchRates = function(params) {
			var deferred = $q.defer();
			var url = '/api/rates/contract_rates';
			rvBaseWebSrvV2.getJSON(url, params).then(function(data) {
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
					id: data.id,
					use_card_rate: data.useCardRate
				},
				"change_all_reservations": data.future
			};
			var deferred = $q.defer();
			var url = '/api/reservations/' + data.reservation + '/cards/replace';
			rvBaseWebSrvV2.putJSON(url, request).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

		this.removeCard = function(data) {
			var request = {
				type: data.cardType,
				id: data.cardId
			};
			var deferred = $q.defer();
			var url = '/api/reservations/' + data.reservation + '/cards/remove';
			rvBaseWebSrvV2.deleteJSON(url, request).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

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
		};


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
		};

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
		};

		this.saveARNote = function(data) {
			var deferred = $q.defer();
			var url = '/api/accounts/save_ar_note';
			rvBaseWebSrvV2.postJSON(url,data).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

		this.saveARDetails = function(data) {
			var deferred = $q.defer();
			var url = 'api/accounts/save_ar_details';
			rvBaseWebSrvV2.postJSON(url,data).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};



		this.deleteARNote = function(data) {
			var deferred = $q.defer();
			var url = '/api/accounts/delete_ar_note';
			rvBaseWebSrvV2.postJSON(url,data).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

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
		};

		this.fetchArAccountsList = function(params){
			var deferred = $q.defer();

			var url = "/api/accounts/"+params.id+"/ar_transactions?paid="+params.paid+"&from_date="+params.from_date+"&to_date="+params.to_date+"&query="+params.query+"&page="+params.page_no+"&per_page="+params.per_page+"&transaction_type="+params.transaction_type;
			rvBaseWebSrvV2.getJSON(url).then(function(data) {

				// CICO-28089 - View detailed transactions - setting active flag
				if(!!data.ar_transactions && data.ar_transactions.length > 0 ){
					angular.forEach(data.ar_transactions,function(item, index) {
			       		if(item.transaction_type === 'DEBIT') {
			       			item.active = false;
			       		}
			       	});
				}

				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

		this.addCreditAmount = function(params){
			var deferred = $q.defer();
			var url = "api/accounts/"+params.id+"/ar_transactions";
			rvBaseWebSrvV2.postJSON(url,params).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

		this.payForReservation = function(params){
			var deferred = $q.defer();
			var url = "api/accounts/"+params.id+"/ar_transactions/"+params.transaction_id+"/pay";
			rvBaseWebSrvV2.postJSON(url).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

		this.openForReservation = function(params){
			var deferred = $q.defer();
			var url = "api/accounts/"+params.id+"/ar_transactions/"+params.transaction_id+"/open";
			rvBaseWebSrvV2.postJSON(url).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

		this.payAll = function(params){
			var deferred = $q.defer();
			var url = "api/accounts/"+params.id+"/ar_transactions/pay_all";
			rvBaseWebSrvV2.postJSON(url).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

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

        /**
		 * Service for getting the commission details of a travel agent
		 */
        this.fetchTACommissionDetails = function(reqData) {
			var deferred = $q.defer();
			var url = ' api/accounts/' + reqData.accountId + '/commission_details';
			//var url = "/assets/sampleJson/commissionTa"+ reqData.params.page + ".json";

			rvBaseWebSrvV2.getJSON(url, reqData.params).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

		/**
		 * Service for saving the commission details of travel agents
		 */
        this.saveTACommissionDetails = function(reqData) {
			var deferred = $q.defer(),
				params = {};
			params.reservations = reqData.commissionDetails;
			var url = 'api/accounts/' + reqData.accountId +'/save_commission_details';
			rvBaseWebSrvV2.postJSON(url, params).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

		/**
		 * Service for getting the transacton details
		 */
        this.fetchTransactionDetails = function(param) {
			var deferred = $q.defer(),
				url = ' /api/bills/'+param.bill_id+'/transactions';

			rvBaseWebSrvV2.getJSON(url).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};



	}
]);