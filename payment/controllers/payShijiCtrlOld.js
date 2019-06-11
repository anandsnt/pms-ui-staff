// angular.module('sntPay').controller('payShijiCtrl',
//     ['$scope', 'sntShijiGatewaySrv', 'ngDialog', '$timeout', 'sntActivity',
//         function($scope, sntShijiGatewaySrv, ngDialog, $timeout, sntActivity) {

//             /**
//              * @return {undefined}
//              */
//             function initScopeState() {
//                 $scope.shijiPaymentState = {
//                     isSuccess: false,
//                     isFailure: false,
//                     notificationText: '',
//                     modal: null,
//                     action: 'CANCEL',
//                     response: null
//                 };
//             }

//             /**
//              *
//              * @param {object} response Success response from the API call to get QR code
//              * @return {undefined}
//              */
//             function showQRCode(response) {
//                 $scope.$emit('SHOW_SIX_PAY_LOADER');

//                 $scope.shijiPaymentState.modal = ngDialog.open({
//                     template: '/assets/partials/payShijiQRPopup.html',
//                     className: '',
//                     scope: $scope,
//                     data: angular.toJson(response.data),
//                     preCloseCallback: function() {
//                         if ($scope.shijiPaymentState.isSuccess || $scope.shijiPaymentState.isFailure) {
//                             $scope.$emit('HIDE_SIX_PAY_LOADER');
//                             $timeout(()=> {
//                                 if ($scope.shijiPaymentState.isSuccess) {
//                                     $scope.$emit('SHIJI_PAYMENT_SUCCESS', $scope.shijiPaymentState.response);
//                                 } else {
//                                     $scope.$emit('SHIJI_PAYMENT_FAILED', $scope.shijiPaymentState.response);
//                                 }
//                                 initScopeState();
//                             }, 700);
//                             return true;
//                         }
//                         $scope.$emit('showLoader');
//                         sntShijiGatewaySrv.stopPolling();
//                         return false;
//                     }
//                 });
//             }

//             /**
//              *
//              * @param {Integer} id transaction identifier for polling
//              * @return {undefined}
//              */
//             function startPolling(id) {
//                 sntShijiGatewaySrv.pollPaymentStatus(
//                     id,
//                     $scope.hotelConfig.emvTimeout
//                 ).then(
//                     response => {
//                         $scope.shijiPaymentState.response = response;
//                         $scope.shijiPaymentState.action = 'CLOSE';
//                         $scope.shijiPaymentState.isSuccess = true;
//                         $scope.shijiPaymentState.notificationText = 'Payment successful';
//                     },
//                     errorMessage => {
//                         $scope.shijiPaymentState.response = errorMessage;
//                         $scope.shijiPaymentState.action = 'CLOSE';
//                         $scope.shijiPaymentState.isFailure = true;
//                         $scope.shijiPaymentState.notificationText = errorMessage[0] || 'There was an error while processing payment';
//                         $scope.$emit('hideLoader');
//                     }
//                 );
//             }

//             /**
//              * @return {undefined}
//              */
//             $scope.onCloseQRModal = function() {
//                 ngDialog.close($scope.shijiPaymentState.modal.id);
//             };

//             /**
//              * @return {undefined}
//              */
//             function initiatePaymentProcess() {
//                 sntActivity.start('INIT_SHIJI_PAYMENT');
//                 sntShijiGatewaySrv.initiatePayment($scope.reservationId, {
//                     payment_type: $scope.selectedPaymentType,
//                     bill_number: $scope.billNumber,
//                     amount: $scope.payment.amount
//                 }).then(response => {
//                     if (Number($scope.payment.amount) > 0) {
//                         startPolling(response.data.async_callback_id);
//                         showQRCode(response);
//                     } else {
//                         $scope.$emit('SHIJI_PAYMENT_SUCCESS', response);
//                     }
//                     sntActivity.stop('INIT_SHIJI_PAYMENT');
//                 }, errorMessage => {
//                     $scope.$emit('SHIJI_PAYMENT_FAILED', errorMessage.data);
//                     sntActivity.stop('INIT_SHIJI_PAYMENT');
//                 });
//             }

//             // ----------- init -------------
//             (() => {
//                 // Initialization code goes here
//                 var listenerPayment = $scope.$on('INITIATE_SHIJI_PAYMENT', initiatePaymentProcess);

//                 initScopeState();
//                 $scope.$on('$destroy', listenerPayment);
//             })();

//         }
//     ]);
