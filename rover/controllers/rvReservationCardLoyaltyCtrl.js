sntRover.controller('rvReservationCardLoyaltyController',[ '$rootScope','$scope', 'ngDialog', 'RVLoyaltyProgramSrv',  function($rootScope, $scope, ngDialog, RVLoyaltyProgramSrv){
	BaseCtrl.call(this, $scope);

	$scope.selectedLoyaltyID = "";

	$scope.showSelectedLoyalty = function(){
		var display = true;
		var selectedLoyalty = $scope.$parent.reservationData.reservation_card.loyalty_level.selected_loyalty;
		if(selectedLoyalty == null || typeof selectedLoyalty == 'undefined' || selectedLoyalty == '' || selectedLoyalty =={}){
			display = false;
		}
		return display;
	};
	$scope.showLoyaltyProgramDialog = function () {
            	            
						ngDialog.open({
                			template: '/assets/partials/reservationCard/rvAddLoyaltyProgramDialog.html',
               				controller: 'rvAddLoyaltyProgramController',
                			className: 'ngdialog-theme-default',
                			scope: $scope
            			});
						
                
            
        };

        $scope.$on("loyaltyProgramAdded",function(e,data){

        	if(data.membership_class == "HLP"){
        		$scope.$parent.reservationData.reservation_card.loyalty_level.hotelLoyaltyProgram.push(data);
        	}else{
        		$scope.$parent.reservationData.reservation_card.loyalty_level.frequentFlyerProgram.push(data);
        	}
        	$scope.$parent.reservationData.reservation_card.loyalty_level.selected_loyalty = data;
            $scope.selectedLoyaltyID = data.id;
	});
        $scope.$on("loyaltyProgramDeleted",function(e,id){

            $scope.removeLoyaltyWithID(id);
            if($scope.selectedLoyaltyID == id){
                $scope.selectedLoyaltyID = "";
                $scope.$parent.reservationData.reservation_card.loyalty_level.selected_loyalty = "";
            }            
    });
    $scope.removeLoyaltyWithID = function(id){
        var pos = "";
        var hotelLoyaltyPrograms = $scope.$parent.reservationData.reservation_card.loyalty_level.hotelLoyaltyProgram;
        var frequentFlyerPrograms = $scope.$parent.reservationData.reservation_card.loyalty_level.frequentFlyerProgram;
        for(var i = 0; i < hotelLoyaltyPrograms.length; i++){
            if(id == hotelLoyaltyPrograms[i].id){
                pos = i;
                break;
            }
        }
        if(pos != ""){
            $scope.$parent.reservationData.reservation_card.loyalty_level.hotelLoyaltyProgram.splice(pos, 1);
            return;
        }
        for(var i = 0; i < frequentFlyerPrograms.length; i++){
            if(id == frequentFlyerPrograms[i].id){
                pos = i;
                break;
            }
        }
        if(pos != ""){
            $scope.$parent.reservationData.reservation_card.loyalty_level.frequentFlyerProgram.splice(pos, 1);
            return;
        }
    };

        $scope.setSelectedLoyaltyForID = function(id){
        	var hotelLoyaltyProgram = $scope.$parent.reservationData.reservation_card.loyalty_level.hotelLoyaltyProgram;
        		var freequentFlyerprogram = $scope.$parent.reservationData.reservation_card.loyalty_level.frequentFlyerProgram;
        		var flag = false;
        		for(var i = 0; i < hotelLoyaltyProgram.length; i++){
        			if(id == hotelLoyaltyProgram[i].id){
        				flag = true
        				$scope.$parent.reservationData.reservation_card.loyalty_level.selected_loyalty = hotelLoyaltyProgram[i];
        				$scope.selectedLoyaltyID = hotelLoyaltyProgram[i].id;
        				break; 
        			}

        		}
        		if(flag){        			
        			return true;
        		}
        			
        		for(var i = 0; i < freequentFlyerprogram.length; i++){
        			if(id == freequentFlyerprogram[i].id){
       					flag = true;
        				$scope.$parent.reservationData.reservation_card.loyalty_level.selected_loyalty = freequentFlyerprogram[i];
        				$scope.selectedLoyaltyID = freequentFlyerprogram[i].id;
        				break; 
        			}

        		}
        		return flag;
        };
        $scope.setSelectedLoyaltyForID($scope.$parent.reservationData.reservation_card.loyalty_level.selected_loyalty);

        $scope.setSelectedLoyalty = function(id){
        		var isSelectedSet = $scope.setSelectedLoyaltyForID(id);
        		if(!isSelectedSet){
        			$scope.$parent.reservationData.reservation_card.loyalty_level.selected_loyalty = "";
        			$scope.selectedLoyaltyID = "";
        		}
        		$scope.callSelectLoyaltyAPI();
        			
        };
        $scope.callSelectLoyaltyAPI = function(){
        	var successCallback = function(){
        		$scope.$parent.$emit('hideLoader');
        	};
        	var errorCallback = function(errorMessage){
        		$scope.$parent.$emit('hideLoader');
        		$scope.$parent.errorMessage = errorMessage;
        	};
        	var params = {};
        	params.reservation_id = $scope.$parent.reservationData.reservation_card.reservation_id;
        	params.membership_id = $scope.selectedLoyaltyID;
        	$scope.invokeApi(RVLoyaltyProgramSrv.selectLoyalty, params , successCallback, errorCallback);
        };

	
}]);