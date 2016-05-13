/**
 * Service used for tablet-kiosk UI (Zest Station)
 */

sntZestStation.service('zsPaymentSrv',
        ['$http', '$q', 'zsBaseWebSrv',
            function ($http, $q, zsBaseWebSrv, zsBaseWebSrv2) {
                //service provider for common utilities
                var that = this;
                
                this.savePayment = function (params) {
                    var deferred = $q.defer(),
                            url = '/staff/reservation/save_payment';

                    zsBaseWebSrv.postJSON(url, params).then(function (data) {
                        deferred.resolve(data);
                    }, function (data) {
                        deferred.reject(data);
                    });
                    return deferred.promise;
                };
            
		this.tokenize = function(data) {
			var deferred = $q.defer();
			var url = '/staff/payments/tokenize';

			zsBaseWebSrv.postJSON(url, data).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};
                
		this.acceptEarlyCheckinOffer = function(data) {
			var deferred = $q.defer();
			var url = '/api/reservations/apply_early_checkin_offer';

			zsBaseWebSrv.postJSON(url, data).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};
                
                
		/** Method to check if the web app is accessed from a device */
                //method cloned from rvUtilSrv
		this.checkDevice = {
                    any : function(){
                            return !!navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i);
                    },
                    iOS : function(){
                            return !!navigator.userAgent.match(/iPhone|iPad|iPod/i);
                    }, 
                    android: function() {
                        return navigator.userAgent.match(/Android/i);
                    }
		};
                
                
                
                this.submitDeposit = function(postData){
                        var deferred = $q.defer();
                        var url = '/api/reservations/'+postData.reservation_id+'/submit_payment';
                        zsBaseWebSrv.postJSON(url, postData).then(function(data) {
                                    deferred.resolve(data);
                                },function(data){
                                    deferred.reject(data);
                                });
                        return deferred.promise;
                };
                this.authorizeCC = function(postData){
                    //send is_emv_request = true, to init sixpay device and capture card
                     var deferred = $q.defer();
			var url = '/api/cc/authorize';
			zsBaseWebSrv.postJSON(url, postData).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
                };
                
                this.chipAndPinGetToken = function(postData){
                        var deferred = $q.defer();
                        var url = '/api/cc/get_token.json';
                        //var url = '/api/reservations/'+postData.reservation_id+'/submit_payment';
                        zsBaseWebSrv.postJSON(url, postData).then(function(data) {
                                    deferred.resolve(data);
                                },function(data){
                                    deferred.reject(data);
                                });
                        return deferred.promise;
                };
                 
                
            }]);