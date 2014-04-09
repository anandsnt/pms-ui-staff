      admin.controller('ADCheckinCtrl',['$scope','adCheckinSrv','$state','ngTableParams','$filter', function($scope,adCheckinSrv,$state,ngTableParams,$filter){
        
        $scope.errorMessage = '';
        $scope.successMessage = '';

      	BaseCtrl.call(this, $scope);

          $scope.init = function(){
              $scope.checkinData = {};
              $scope.showingEmailOptions = false;
              $scope.emailDatas = {};
              $scope.hours = ["01","02","03","04","05","06","07","08","09","10","11","12"];
              $scope.minutes = ["00","15","30","45"];
              $scope.primeTimes = ["AM","PM"];
          }

          $scope.init();
          

         /*
          * To fetch checkin details
          */
          $scope.fetchCheckinDetails = function(){
            var fetchCheckinDetailsSuccessCallback = function(data) {

              $scope.$emit('hideLoader');
              $scope.checkinData = data;

              $scope.checkinData.is_send_alert_flag = ($scope.checkinData.is_send_alert === 'true') ? true:false;
              $scope.checkinData.is_send_checkin_staff_alert_flag = ($scope.checkinData.is_send_checkin_staff_alert === 'true') ? true:false;
              $scope.checkinData.is_notify_on_room_ready_flag = ($scope.checkinData.is_send_alert === 'true') ? true:false;
              $scope.checkinData.require_cc_for_checkin_email_flag = ($scope.checkinData.require_cc_for_checkin_email=== 'true') ? true:false;

                  //to be confirmed 

                  $scope.checkinData.checkin_alert_primetime = (!$scope.checkinData.checkin_alert_primetime)? "AM":$scope.checkinData.checkin_alert_primetime;

              };
              $scope.invokeApi(adCheckinSrv.fetch, {},fetchCheckinDetailsSuccessCallback);
          };

          $scope.fetchCheckinDetails();


           /*
          * To save checkin details
          * @param {data} 
          *
          */

          $scope.saveCheckin = function(){

             $scope.checkinData.is_send_alert = ($scope.checkinData.is_send_alert_flag) ? 'true':'false';
             $scope.checkinData.is_send_checkin_staff_alert = ($scope.checkinData.is_send_checkin_staff_alert_flag) ? 'true':'false';
             $scope.checkinData.is_notify_on_room_ready = ($scope.checkinData.is_send_alert_flag) ?'true':'false';
             $scope.checkinData.require_cc_for_checkin_email = ($scope.checkinData.require_cc_for_checkin_email_flag) ? 'true':'false';

             var uploadData = {


              'checkin_alert_message': $scope.checkinData.checkin_alert_message,
              'checkin_staff_alert_option':$scope.checkinData.checkin_staff_alert_option,
              'emails':$scope.checkinData.emails,
              'is_notify_on_room_ready':$scope.checkinData.is_notify_on_room_ready,
              'is_send_alert':$scope.checkinData.is_send_alert,
              'is_send_checkin_staff_alert':$scope.checkinData.is_send_checkin_staff_alert,
              'prime_time':$scope.checkinData.checkin_alert_primetime,
              'checkin_alert_time':$scope.checkinData.checkin_alert_time_hour+":"+$scope.checkinData.checkin_alert_time_minute,
              'require_cc_for_checkin_email' : $scope.checkinData.require_cc_for_checkin_email


          }

          var saveCheckinDetailsSuccessCallback = function(data) {
            $scope.$emit('hideLoader');
        }
        $scope.invokeApi(adCheckinSrv.save, uploadData,saveCheckinDetailsSuccessCallback);

      }

          /*
          * To show email list
          *
          */


          $scope.showSendEmailOptions = function(){

          	$scope.showingEmailOptions = true;
          	$scope.emailTitle = 'Guests Checking In';
          	$scope.selectAllOption = false;


            var fetchEmailListSuccessCallback = function(data) {
                $scope.$emit('hideLoader');
                $scope.emailDatas  = data.due_out_guests;

                angular.forEach($scope.emailDatas,function(item, index) {
                   item.is_selected = false;


                      // REMEMBER - ADDED A hidden class in ng-table angular module js. Search for hidde or pull-right
                      $scope.tableParams = new ngTableParams({
                      page: 1,            // show first page
                      count: $scope.emailDatas.length,    // count per page - Need to change when on pagination implemntation
                      sorting: {
                          name: 'asc'     // initial sorting
                      }
                  }, {
                      total: $scope.emailDatas.length, // length of data
                      getData: function($defer, params) {
                          // use build-in angular filter
                          var orderedData = params.sorting() ?
                          $filter('orderBy')($scope.emailDatas, params.orderBy()) :
                          $scope.emailDatas;
                          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                      }
                  });

                  });
      }
      $scope.invokeApi(adCheckinSrv.fetchEmailList, {},fetchEmailListSuccessCallback);

      }


         /*
        * To check if all options are all selected or not
          *
          */

        
        $scope.isAllOptionsSelected = function(){
            var status = true;
            $scope.disableSave = true;
             angular.forEach($scope.emailDatas,function(item, index) {
                   if(item.is_selected === false){
                     status = false;
                   }
                   else
                   {
                    $scope.disableSave = false;
                   }
               });
        
             return status;

        }

         /*
        * To wall if all options are selcted 
          *
          */

        $scope.$watch("selectAllOption", function(o,n){
    
          angular.forEach($scope.emailDatas,function(item, index) {
                   item.is_selected = $scope.selectAllOption;
          });

        });
          $scope.backActionFromEmail = function(){
          	$scope.showingEmailOptions = false;
          }
           /*
          * To toggle options
          *
          */


          $scope.toggleAllOptions = function(){


           var selectedStatus =  $scope.isAllOptionsSelected() ? false : true;
      

          	//$scope.selectAllOption = $scope.selectAllOption ? false:true;

             angular.forEach($scope.emailDatas,function(item, index) {
                   item.is_selected =selectedStatus;
               }); 

            }      

           /*
          * To send mail
          *
          */

          $scope.sendMailClicked = function(){


          	reservations = [];

          	angular.forEach($scope.emailDatas,function(item, index) {
               if(item.is_selected)
                 reservations.push(item.reservation_id)
         });

          	var emailSendingData = {'reservations' : reservations}

            var sendMailClikedSuccessCallback = function(data) {
                $scope.$emit('hideLoader');
                console.log(data)
                $scope.successMessage = data.message;

            }
            $scope.invokeApi(adCheckinSrv.sendMail, emailSendingData,sendMailClikedSuccessCallback);

        }


        $scope.gotToDashboard = function(){

          $state.go('admin.dashboard', {
              menu : 1
          });
      }

      }]);