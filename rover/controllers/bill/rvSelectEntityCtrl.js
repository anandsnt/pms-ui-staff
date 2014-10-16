sntRover.controller('rvSelectEntityCtrl',['$scope','$rootScope','$filter','RVBillinginfoSrv', 'ngDialog','RVCompanyCardSearchSrv','RVSearchSrv', function($scope, $rootScope,$filter, RVBillinginfoSrv, ngDialog, RVCompanyCardSearchSrv, RVSearchSrv){
	BaseCtrl.call(this, $scope);
	
	$scope.textInQueryBox = "";
  	$scope.isReservationActive = true;
  	
  	var scrollerOptions = {click: true, preventDefault: false};
    $scope.setScroller('cards_search_scroller', scrollerOptions);
    $scope.setScroller('res_search_scroller', scrollerOptions);
    $scope.refreshScroller('cards_search_scroller');
    $scope.refreshScroller('res_search_scroller');

    var scrollerOptions = { preventDefault: false};
    $scope.setScroller('entities', scrollerOptions);  

    setTimeout(function(){
                $scope.refreshScroller('entities'); 
                }, 
            500);

    /**
    * function to fetch the attached entity list
    */
    $scope.fetchEntities = function(){
        
            var successCallback = function(data) {
                $scope.attachedEntities = data;
                 $scope.$parent.$emit('hideLoader');
            };
            var errorCallback = function(errorMessage) {
                $scope.$emit('hideLoader');
                $scope.errorMessage = errorMessage;
            };
           
            $scope.invokeApi(RVBillinginfoSrv.fetchAttachedCards, $scope.reservationData.reservation_id, successCallback, errorCallback);
    };	

    $scope.fetchEntities();
    /*function to select the attached entity
    */
    $scope.selectAttachedEntity = function(index,type){
    		$scope.selectedEntity = {
			    "reservation_status" : $scope.reservationData.reservation_status,
                "is_opted_late_checkout" : $scope.reservationData.is_opted_late_checkout,			    
			    "bill_no": "",			    
			    "has_accompanying_guests" : false,
			    "attached_charge_codes": [],
			    "attached_billing_groups": [],
                "is_new" : true
			};
			if(type == 'GUEST'){
				$scope.selectedEntity.id = $scope.reservationData.reservation_id;
				$scope.selectedEntity.guest_id = $scope.attachedEntities.primary_guest_details.id;
				$scope.selectedEntity.name = $scope.attachedEntities.primary_guest_details.name;
				$scope.images = [{
                    "is_primary":true, 
		            "guest_image": $scope.attachedEntities.primary_guest_details.avatar
		        }];
		        $scope.selectedEntity.entity_type = "RESERVATION";
			}else if(type == 'ACCOMPANY_GUEST'){
				$scope.selectedEntity.id = $scope.reservationData.reservation_id;
				$scope.selectedEntity.guest_id = $scope.attachedEntities.accompanying_guest_details[index].id;
				$scope.selectedEntity.name = $scope.attachedEntities.accompanying_guest_details[index].name;
				$scope.images = [{
                    "is_primary":false, 
		            "guest_image": $scope.attachedEntities.accompanying_guest_details[index].avatar
		        }];		
		        $scope.selectedEntity.has_accompanying_guests = true;        
		        $scope.selectedEntity.entity_type = "RESERVATION";
			}else if(type == 'COMPANY_CARD'){
				$scope.selectedEntity.id = $scope.attachedEntities.company_card.id;
				$scope.selectedEntity.name = $scope.attachedEntities.company_card.name;
				$scope.images = [{
                    "is_primary":true, 
		            "guest_image": $scope.attachedEntities.company_card.logo
		        }];		        
		        $scope.selectedEntity.entity_type = "COMPANY_CARD";
			}else if(type == 'TRAVEL_AGENT'){
				$scope.selectedEntity.id = $scope.attachedEntities.travel_agent.id;
				$scope.selectedEntity.name = $scope.attachedEntities.travel_agent.name;
				$scope.images = [{
                    "is_primary":true, 
		            "guest_image": $scope.attachedEntities.travel_agent.logo
		        }];		        
		        $scope.selectedEntity.entity_type = "TRAVEL_AGENT";
			}
    }

  	/**
  	* function to perform filtering/request data from service in change event of query box
  	*/
	$scope.queryEntered = function(){
		console.log("queryEntered");
		if($scope.textInQueryBox === "" || $scope.textInQueryBox.length < 3){
			$scope.results.cards = [];
			$scope.results.reservations = [];
		}
		else{
	    	displayFilteredResultsCards();
	    	displayFilteredResultsReservations(); 
	   	}
	   	var queryText = $scope.textInQueryBox;
	   	$scope.textInQueryBox = queryText.charAt(0).toUpperCase() + queryText.slice(1);
  	};
  	/**
  	* function to clear the entity search text
  	*/
	$scope.clearResults = function(){
	  	$scope.textInQueryBox = "";
	  	$scope.refreshScroller('entities');
	};
  	var searchSuccessCards = function(data){
		$scope.$emit("hideLoader");
		$scope.results.cards = [];
		$scope.results.cards = data.accounts;
		console.log(data);
		setTimeout(function(){$scope.refreshScroller('cards_search_scroller');}, 750);
	};
  	/**
  	* function to perform filering on results.
  	* if not fouund in the data, it will request for webservice
  	*/
  	var displayFilteredResultsCards = function(){ 
	    //if the entered text's length < 3, we will show everything, means no filtering    
	    if($scope.textInQueryBox.length < 3){
	      //based on 'is_row_visible' parameter we are showing the data in the template      
	      for(var i = 0; i < $scope.results.cards.length; i++){
	          $scope.results.cards[i].is_row_visible = true;
	      }     
	      
	      // we have changed data, so we are refreshing the scrollerbar
	      $scope.refreshScroller('cards_search_scroller');      
	    }
	    else{
	      var value = ""; 
	      var visibleElementsCount = 0;
	      //searching in the data we have, we are using a variable 'visibleElementsCount' to track matching
	      //if it is zero, then we will request for webservice
	      for(var i = 0; i < $scope.results.cards.length; i++){
	        value = $scope.results.cards[i];
	        if (($scope.escapeNull(value.account_first_name).toUpperCase()).indexOf($scope.textInQueryBox.toUpperCase()) >= 0 || 
	            ($scope.escapeNull(value.account_last_name).toUpperCase()).indexOf($scope.textInQueryBox.toUpperCase()) >= 0 ) 
	            {
	               $scope.results.cards[i].is_row_visible = true;
	               visibleElementsCount++;
	            }
	        else {
	          $scope.results.cards[i].is_row_visible = false;
	        }
	              
	      }
	      // last hope, we are looking in webservice.      
	     if(visibleElementsCount == 0){    
	        var dataDict = {'query': $scope.textInQueryBox.trim()};
	        $scope.invokeApi(RVCompanyCardSearchSrv.fetch, dataDict, searchSuccessCards);
	      }
	      // we have changed data, so we are refreshing the scrollerbar
	      $scope.refreshScroller('cards_search_scroller');                  
	    }
  	};	

  	/**
	* remove the parent reservation from the search results
	*/
	$scope.excludeActivereservationFromsSearch = function(){
		var filteredResults = [];
	  	for(var i = 0; i < $scope.results.reservations.length; i++){
	  		if(($scope.results.reservations[i].id != $scope.reservationData.reservation_id) && ($scope.results.reservations[i].reservation_status == 'CHECKING_IN' || $scope.results.reservations[i].reservation_status == 'CHECKEDIN' || $scope.results.reservations[i].reservation_status == 'CHECKING_OUT')){

	  				filteredResults.push($scope.results.reservations[i]);
	  				
	  			}
	  		}
	  		$scope.results.reservations = filteredResults;
	};
	
	/**
	* Success call back of data fetch from webservice
	*/
	var searchSuccessReservations = function(data){
        $scope.$emit('hideLoader');
        $scope.results.reservations = [];
		$scope.results.reservations = data;
		$scope.excludeActivereservationFromsSearch();
		console.log(data);
		setTimeout(function(){$scope.refreshScroller('res_search_scroller');}, 750);
	};

	/**
	* failure call back of search result fetch	
	*/
	var failureCallBackofDataFetch= function(errorMessage){
		$scope.$emit('hideLoader');
		$scope.errorMessage = errorMessage;
	};
	/**
  	* function to perform filering on results for reservations.
  	* if not fouund in the data, it will request for webservice
  	*/
	var displayFilteredResultsReservations = function(){ 
	    //if the entered text's length < 3, we will show everything, means no filtering    
	    if($scope.textInQueryBox.length < 3){
	      	//based on 'is_row_visible' parameter we are showing the data in the template      
	      	for(var i = 0; i < $scope.results.length; i++){
	          $scope.results.reservations[i].is_row_visible = true;
	      	}     
	      	
			$scope.refreshScroller('res_search_scroller');
	    }
	    else{

		    if($scope.textInQueryBox.indexOf($scope.textInQueryBox) == 0 && $scope.results.reservations.length > 0){
		        var value = ""; 
		        //searching in the data we have, we are using a variable 'visibleElementsCount' to track matching
		        //if it is zero, then we will request for webservice
		        var totalCountOfFound = 0;		        
		        for(var i = 0; i < $scope.results.reservations.length; i++){
		          value = $scope.results.reservations[i];
		          if (($scope.escapeNull(value.firstname).toUpperCase()).indexOf($scope.textInQueryBox.toUpperCase()) >= 0 || 
		              ($scope.escapeNull(value.lastname).toUpperCase()).indexOf($scope.textInQueryBox.toUpperCase()) >= 0 || 
		              ($scope.escapeNull(value.group).toUpperCase()).indexOf($scope.textInQueryBox.toUpperCase()) >= 0 ||
		              ($scope.escapeNull(value.room).toString()).indexOf($scope.textInQueryBox) >= 0 || 
		              ($scope.escapeNull(value.confirmation).toString()).indexOf($scope.textInQueryBox) >= 0 )
		              {
		                 $scope.results.reservations[i].is_row_visible = true;
		                 totalCountOfFound++;
		              }
		          else {
		            $scope.results.reservations[i].is_row_visible = false;
		          }  
		        }
		        if(totalCountOfFound == 0){
		        	 var dataDict = {'query': $scope.textInQueryBox.trim()};
		        $scope.invokeApi(RVSearchSrv.fetch, dataDict, searchSuccessReservations, failureCallBackofDataFetch);
		        }
		      }
		    else{
		        var dataDict = {'query': $scope.textInQueryBox.trim()};
		        $scope.invokeApi(RVSearchSrv.fetch, dataDict, searchSuccessReservations, failureCallBackofDataFetch);         
		    }
	      	// we have changed data, so we are refreshing the scrollerbar
	      	$scope.refreshScroller('res_search_scroller');                
	    }
	}; //end of displayFilteredResults
	
	//Toggle between Reservations , Cards
	$scope.toggleClicked = function(flag){
		$scope.isReservationActive = flag;
	};
	
}]);