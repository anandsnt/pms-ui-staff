angular.module('sntRover').service('RVBillCardSrv', ['$http', '$q', 'BaseWebSrvV2', 'RVBaseWebSrv', 'rvBaseWebSrvV2', function($http, $q, BaseWebSrvV2, RVBaseWebSrv, rvBaseWebSrvV2) {

	var that = this;

	this.fetchReservationBillData = function (reservationId) {

        var deferred = $q.defer(),
		    url = '/api/reservations/' + reservationId + '/bills_summary';

			rvBaseWebSrvV2.getJSON(url).then(function(response) {
				
			   	deferred.resolve(response.data);
			}, function(data) {
			    deferred.reject(data);
			});
        return deferred.promise;
    };
    this.fetchBillData = function (billNo) {

        var deferred = $q.defer(),
		    url = '/api/bills/' + billNo;

			rvBaseWebSrvV2.getJSON(url).then(function(response) {
			   	 deferred.resolve(response.data);
			}, function(data) {
			    deferred.reject(data);
			});
        return deferred.promise;
    };

	this.fetch = function(reservationId) {
			var reservationBillData = '',
			    deferred = $q.defer(),
			    billNumber = '',
        		billIndex = '';

			$q.when().then(function() {
                return that.fetchReservationBillData(reservationId).then(function(response) {
                    reservationBillData = response;
                });
            })           
            .then(function() {
            	billNumber = reservationBillData.bills[0].bill_id;
				billIndex = parseInt(reservationBillData.bills[0].bill_number) - 1;
                return that.fetchBillData(billNumber).then(function(response) {
                    reservationBillData.bills[billIndex] = response;
                });
            })
            .then(function() {
                deferred.resolve(reservationBillData);
            }, function(errorMessage) {
                deferred.reject(errorMessage);
            });


		return deferred.promise;
	};	

	this.fetchBillPrintData = function(params) {
		var deferred = $q.defer();
		var url = 'staff/bills/print_guest_bill';

			RVBaseWebSrv.postJSON(url, params).then(function(data) {
				// Manually creating charge details list & credit deatils list.
				data.charge_details_list = [];
				data.credit_details_list = [];
				angular.forEach(data.fee_details, function(fees, index1) {
					angular.forEach(fees.charge_details, function(charge, index2) {
						charge.date = fees.date;
						data.charge_details_list.push(charge);
					});
					angular.forEach(fees.credit_details, function(credit, index3) {
						credit.date = fees.date;
						data.credit_details_list.push(credit);
					});
				});
		   	 	deferred.resolve(data);
			}, function(data) {
			    deferred.reject(data);
			});

		return deferred.promise;
	};

	this.fetchRegistrationCardPrintData = function(params) {
		var deferred = $q.defer();
		var url = '/api/reservations/' + params.reservation_id + '/print_registration_card';

			rvBaseWebSrvV2.getJSON(url, params).then(function(data) {
		   	 	deferred.resolve(data);
			}, function(data) {
			    deferred.reject(data);
			});

		return deferred.promise;
	};

	this.movetToAnotherBill = function(data) {
		var deferred = $q.defer();
		var url = '/staff/bills/transfer_transaction';

			BaseWebSrvV2.postJSON(url, data).then(function(data) {

			   	 deferred.resolve(data);
			}, function(data) {
			    deferred.reject(data);
			});

		return deferred.promise;
	};

	this.completeCheckin = function(data) {
		var deferred = $q.defer();
		var url = '/staff/checkin';

			RVBaseWebSrv.postJSON(url, data).then(function(data) {
			   	 deferred.resolve(data);
			}, function(data) {
			    deferred.reject(data);
			});

		return deferred.promise;
	};

	this.completeCheckout = function(data) {
		var deferred = $q.defer();
		var url = '/staff/checkout';

			RVBaseWebSrv.postJSON(url, data).then(function(data) {
			   	 deferred.resolve(data);
			}, function(data) {
			    deferred.reject(data);
			});

		return deferred.promise;
	};


	this.getAdvanceBill = function(data) {
		var deferred = $q.defer();
		var url = 'api/reservations/' + data.id + '/advance_bill';

			RVBaseWebSrv.postJSON(url).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
			    deferred.reject(data);
			});

		return deferred.promise;
	};
   /*
	 * Service function to edit transaction
	 * @method PUT
	 * @param {object} data
	 * @return {object} defer promise
	 */

	this.transactionEdit = function(params) {

		var deferred = $q.defer();
		var url = 'api/financial_transactions/' + params.id;

		BaseWebSrvV2.putJSON(url, params.updatedData).then(function(data) {
		   	 deferred.resolve(data);
		}, function(data) {
		    deferred.reject(data);
		});

		return deferred.promise;
	};

	/*
	 * Service function to edit charge code description
	 * @method POST
	 * @param {object} data
	 * @return {object} defer promise
	 */

	this.transactionEditChargeDescription = function(params) {

		var deferred = $q.defer();
		var url = 'api/financial_transactions/' + params.id + '/save_custom_description';

		BaseWebSrvV2.postJSON(url, params.postData).then(function(data) {
		   	 deferred.resolve(data);
		}, function(data) {
		    deferred.reject(data);
		});

		return deferred.promise;
	};

  /*
	 * Service function to delete transaction
	 * @method PUT
	 * @param {object} data
	 * @return {object} defer promise
	 */

	this.transactionDelete = function(deleteData) {

		var deferred = $q.defer();
		var trasactionId = deleteData.id;
		var url = 'api/financial_transactions/' + trasactionId;

		BaseWebSrvV2.putJSON(url, deleteData.data).then(function(data) {
		   	 deferred.resolve(data);
		}, function(data) {
		    deferred.reject(data);
		});

		return deferred.promise;
	};
 /*
	* Service function to split transaction
	* @method PUT
	* @param {object} data
	* @return {object} defer promise
	*/

	this.transactionSplit = function(splitData) {
		var deferred = $q.defer();
		var trasactionId = splitData.id;
		var url = 'api/financial_transactions/' + trasactionId;

		BaseWebSrvV2.putJSON(url, splitData.data).then(function(data) {
		   	 deferred.resolve(data);
		}, function(data) {
		    deferred.reject(data);
		});
		return deferred.promise;
	};

	/*
	 * Get the list of charge codes
	 * @method GET
	 * @return {object} defer promise
	 */
    this.fetchChargeCodes = function() {
        var deferred = $q.defer(),
            url = '/api/charge_codes?exclude_payments=true&per_page=1000';

        BaseWebSrvV2.getJSON(url).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });

        return deferred.promise;
    };

	this.sendEmail = function(data) {
		var deferred = $q.defer();
		var url = 'api/reservations/email_guest_bill.json';

			BaseWebSrvV2.postJSON(url, data).then(function(data) {
			   	 deferred.resolve(data);
			}, function(data) {
			    deferred.reject(data);
			});

		return deferred.promise;
	};

	this.createAnotherBill = function(params) {
		var deferred = $q.defer();
		var url = '/api/bills/create_bill';

			BaseWebSrvV2.postJSON(url, params).then(function(data) {
			   	 deferred.resolve(data);
			}, function(data) {
			    deferred.reject(data);
			});

		return deferred.promise;
	};

	this.changeHousekeepingStatus = function(data) {

		var deferred = $q.defer();
		var url = '/house/change_house_keeping_status.json';

		BaseWebSrvV2.postJSON(url, data).then(function(data) {
		   	 deferred.resolve(data);
		}, function(data) {
		    deferred.reject(data);
		});

		return deferred.promise;
	};

	this.completeReverseCheckout = function(data) {
		var deferred = $q.defer();
		var url = '/staff/reverse_checkout';

			BaseWebSrvV2.postJSON(url, data).then(function(data) {
			   	 deferred.resolve(data);
			}, function(data) {
			    deferred.reject(data);
			});

		return deferred.promise;
	};

	this.toggleHideRate = function( params ) {
		var deferred = $q.defer();
		var url = 'api/reservations/' + params.reservation_id + '/hide_rates';

			BaseWebSrvV2.postJSON(url, params).then(function(data) {
			   	 deferred.resolve(data);
			}, function(data) {
			    deferred.reject(data);
			});

		return deferred.promise;
	};

	/**
	 * Get the bill settings info for the popup for print/email functionality
	 *
	**/
	this.getBillSettingsInfo = function(params) {

		var deferred = $q.defer();
		var url = '/api/bills/get_settings_info';

			BaseWebSrvV2.getJSON(url, params).then(function(data) {
			   	 deferred.resolve(data);
			}, function(data) {
			    deferred.reject(data);
			});

		return deferred.promise;
	};

    // Service that fetches the charge details of a grouped charge - CICO-34039.
    this.groupChargeDetailsFetch = function(params) {
        var deferred = $q.defer(),
            url = '/staff/reservation/transaction_details';

        BaseWebSrvV2.getJSON(url, params).then(function(response) {
            deferred.resolve(response.data);
        }, function (data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    // Service that used to Remove/Hide a bill.
    this.hideBill = function(params) {
        var deferred = $q.defer(),
            url = '/api/bills/' + params.bill_id + '/hide_bill';

        BaseWebSrvV2.postJSON(url).then(function(response) {
            deferred.resolve(response.data);
        }, function (data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

	this.fetchGuestLanguages = function() {
		var deferred = $q.defer();
		var url = '/api/guest_languages';

		rvBaseWebSrvV2.getJSON(url).then(function(data) {
			if (data.languages) {
				data.languages = _.filter(data.languages, {
					is_show_on_guest_card: true
				});
			}
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

	// Service that used to get blackbox details(returns with control numbers)
    this.callBlackBoxApi = function(params) {
        var deferred = $q.defer(),
            url = '/api/hotel_settings/infrasec/generate_control_code';

        BaseWebSrvV2.postJSON(url, params).then(function(response) {
            deferred.resolve(response.data);
        }, function (data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    // Generate folio number 
    this.generateFolioNumber = function(params) {
        var deferred = $q.defer(),
            url = '/api/bills/' + params.bill_id + '/generate_folio_number';

        BaseWebSrvV2.postJSON(url, params).then(function(response) {
            deferred.resolve(response.data);
        }, function (data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    // Generate void bill
    this.generateVoidBill = function(params) {
        var deferred = $q.defer(),
            url = '/api/bills/' + params.bill_id + '/void_bill';

        BaseWebSrvV2.postJSON(url, params.data).then(function(response) {        	
            deferred.resolve(response.data);
        }, function (data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };  
    // Final invoice
    this.settleFinalInvoice = function(params) {
		var deferred = $q.defer(),
			url = '/api/bills/' + params.bill_id + '/final_invoice_settlement';

			BaseWebSrvV2.postJSON(url).then(function(data) {

			   	 deferred.resolve(data);
			}, function(data) {
			    deferred.reject(data);
			});

		return deferred.promise;
	};  

}]);