sntRover.controller('companyCardContractsCtrl',['$scope','RVCompanyCardSrv', '$stateParams','ngDialog','dateFilter', function($scope, RVCompanyCardSrv, $stateParams, ngDialog, dateFilter){
	BaseCtrl.call(this, $scope);
    $scope.highchartsNG = {};
	$scope.contractList = {};
	$scope.contractData = {};
	$scope.addData = {};
	$scope.contractList.contractSelected = "";
	$scope.contractList.current_contracts = [];
	$scope.contractList.isAddMode = false;
	$scope.errorMessage = "";
	var contractInfo = {};
	var ratesList = [];
	
	/* Items related to ScrollBars 
	 * 1. When the tab is activated, refresh scroll.
	 * 2. Scroll is actually on a sub-scope created by ng-include. 
	 *    So ng-iscroll will create the ,myScroll Array there, if not defined here.
	 */
	$scope.$on("ContactTabActivated", function(){
		setTimeout(function(){refreshScroller();}, 500);
	});
	
	$scope.$parent.myScroll =[];
	
	$scope.$parent.myScrollOptions = {		
	    'companyCardContractsCtrl': {
	    	scrollbars: true,
	    	scrollY: true,
	        snap: false,
	        hideScrollbar: false
	    }
	};
	
  	var refreshScroller = function(){    
	   //Refresh only if this DOM is visible.
	   if($scope.currentSelectedTab ==='cc-contracts'){
	   		$scope.$parent.myScroll['companyCardContractsCtrl'].refresh();
	   }
  	};
  	
  	/**** Scroll related code ends here. ****/
	
	
	   clientWidth = $(window).width();
        clientHeight = $(window).height();
       var drawGraph = function(){
        console.log('reached::drawGraph');
            $scope.highchartsNG = {
                options: {
                    chart: {
                        type: 'area',
                        className: "rateMgrOccGraph",
                        width : $(".cards-content").width() - 150,
                        backgroundColor : null,
                        zoomType: 'x',
                        height: 400,
                        marginTop: 50
                    },
                    tooltip: {
                        shared: true,
                        formatter: function() {                    	   
                    	    	return 'ACTUAL <b>' + (( typeof this.points[0].y == 'undefined' ) ? '0' : this.points[0].y ) + '%</b>' + '<br/>CONTRACTED <b>' +  (( typeof this.points[1] == 'undefined' ) ? '0' : this.points[1].y ) + '%</b>';
                        }
                    },
                    legend: { 
                        enabled:true,
                        align: 'right',
            			verticalAlign: 'top',
            			x: 0,
            			y: 0,
            			floating:true
                    },
                    plotOptions:{
                    	series: {
                        fillOpacity: 0.1
                    	}
                    },
                    xAxis: { 
                    	minRange: 11,
                    	min:0,
                    	categories: $scope.categories,
                        tickWidth:0,                        
                        labels: { 
                            style: {                        		
                        		'textAlign' : 'center',
                        		'display':'block',                        		
                            	'color': '#868788',
                            	'fontWeight': 'bold'
                            },
                            useHTML: true
                        },
                    },
                    yAxis: {                    	                    	
                    	style: {
                    		color: 'red'
                    	},
                    	useHTML : true,
                    	labels: {                           
                            style: {
                            	color: '#868788',
                            	fontWeight: 'bold'
                            }
                        },
                        floor: 0,
                        ceiling: 100,
                        tickInterval:10,
                        title: {
                            text: ''
                        }
                    },
                    title:{
                        text:''
                    }
                },
                series: $scope.graphData                
            }
        }
	
	var fetchContractsDetailsSuccessCallback = function(data){
    	$scope.contractData = data;
    	$scope.contractData.rates = [];
    	$scope.contractData.rates = ratesList;
    	$scope.errorMessage = "";
    	contractInfo = {};
    	$scope.contractData.contract_name ="";
    	if(typeof $stateParams.type !== 'undefined' && $stateParams.type !== ""){
			$scope.contractData.account_type = $stateParams.type;
		}
    	contractInfo = JSON.parse(JSON.stringify($scope.contractData));
    	$scope.graphData = manipulateGraphData(data.occupancy);
    	$scope.$emit('hideLoader');
    	drawGraph();    	
    	// Disable contracts on selecting history
    	$scope.isHistorySelected = false ;
    	angular.forEach($scope.contractList.history_contracts,function(item, index) {
    		if(item.id == $scope.contractList.contractSelected){
    			$scope.isHistorySelected = true ;
    		}
       	});
       	
       	setTimeout(function(){refreshScroller();}, 500);
    };
  	var fetchFailureCallback = function(data){
        $scope.$emit('hideLoader');
        $scope.errorMessage = data;
    };    
  	    
    var fetchContractsListSuccessCallback = function(data){
    	$scope.contractList = data;
    	$scope.contractList.contractSelected = data.contract_selected;
    	if($scope.contractList.contractSelected){
    		$scope.invokeApi(RVCompanyCardSrv.fetchContractsDetails,{"account_id":$stateParams.id,"contract_id":$scope.contractList.contractSelected},fetchContractsDetailsSuccessCallback,fetchFailureCallback);  
    	}
    	$scope.errorMessage = "";
    };
    var fetchContractsDetailsFailureCallback = function(data){
        $scope.$emit('hideLoader');
        $scope.errorMessage = data;
    };
	
	
  	var manipulateGraphData = function(data){
        var graphData = [];
        var contracted = [];
        var actual = [];
        $scope.categories = [];
        angular.forEach(data, function(item){
            itemDate = item.month + " " + item.year;
            $scope.categories.push(itemDate);
            //contracted.push([itemDate, Math.floor((Math.random() * 100) + 1)]); // TODO :: Remove this line and uncomment below line
            contracted.push([itemDate, item.contracted_occupancy]);
            // actual.push([itemDate, Math.floor((Math.random() * 100) + 1)]); // TODO :: Remove this line and uncomment below line
            actual.push([itemDate,item.actual_occupancy]);
        });
        graphData = [{
            "name": "ACTUAL",
            "data": actual,
            "color": "rgba(247,153,27,0.9)",
            "marker":{
        		symbol: 'circle',
        		radius:5
        	}
        },{
            "name": "CONTRACTED",
            "data": contracted,
            "color": "rgba(130,195,223,0.9)",
            "marker":{
        		symbol: 'triangle',
        		radius:0
        	}
        }]
        return graphData
    }
    
    // Fetch data for rates
    var fetchRatesSuccessCallback = function(data){
    	ratesList = data.contract_rates;
    	
    	$scope.contractData.rates = [];
    	$scope.contractData.rates = ratesList;
    	
    	$scope.addData.rates = [];
		$scope.addData.rates = ratesList;
		$scope.errorMessage = "";
    };
    $scope.invokeApi(RVCompanyCardSrv.fetchRates,{},fetchRatesSuccessCallback,fetchFailureCallback);  
    
  	if($stateParams.id !="add"){
		$scope.invokeApi(RVCompanyCardSrv.fetchContractsList,{"account_id":$stateParams.id},fetchContractsListSuccessCallback,fetchFailureCallback);  
	}
	else{
		$scope.contractList.isAddMode = true;
		$scope.$emit('hideLoader');
	}
	/*
    * Function to handle data change in 'Contract List'.
    */
   	$scope.$watch('contractList.contractSelected', function() {
   		if($stateParams.id == "add"){
	    	var account_id = $scope.contactInformation.id;
	    }
	    else{
	    	var account_id = $stateParams.id;
	    }
       if($scope.contractList.contractSelected){
   			$scope.invokeApi(RVCompanyCardSrv.fetchContractsDetails,{"account_id":account_id,"contract_id":$scope.contractList.contractSelected},fetchContractsDetailsSuccessCallback,fetchContractsDetailsFailureCallback);
	   		angular.forEach($scope.contractList.history_contracts,function(item, index) {
	    		if(item.id == $scope.contractList.contractSelected){
	    			$scope.isHistorySelected = true ;
	    		}
	       	});
       }
       
   	});
   	
   	// To popup contract start date
	$scope.contractStart = function(){
		ngDialog.open({
			 template: '/assets/partials/companyCard/rvCompanyCardContractsCalendar.html',
			 controller: 'contractStartCalendarCtrl',
			 className: 'ngdialog-theme-default calendar-single1',
			 scope: $scope
		});
	};
	// To popup contract end date
	$scope.contractEnd = function(){
		ngDialog.open({
			 template: '/assets/partials/companyCard/rvCompanyCardContractsCalendar.html',
			 controller: 'contractEndCalendarCtrl',
			 className: 'ngdialog-theme-default calendar-single1',
			 scope: $scope
		});
	};
	// To handle click on nights button
	$scope.clickedContractedNights = function(){
		/*
		 * On AddMode : save new contract before showing Nights popup.
		*/
		if($scope.contractList.isAddMode){
			var data = dclone($scope.addData,['occupancy','statistics','rates','total_contracted_nights']);
		
			var saveContractSuccessCallback = function(data){
				$scope.errorMessage = "";
		    	$scope.$emit('hideLoader');
		    	var dataNew = {"id":data.id,"contract_name":$scope.addData.contract_name};
		    	$scope.contractList.current_contracts.push(dataNew);
		    	$scope.addData.contract_name = "";
		    	$scope.contractList.isAddMode = false;
		    	$scope.contractList.contractSelected = data.id;
		    	
		    	setTimeout(function(){
			    	ngDialog.open({
						 template: '/assets/partials/companyCard/rvContractedNightsPopup.html',
						 controller: 'contractedNightsCtrl',
						 className: 'ngdialog-theme-default1 calendar-single1',
						 scope: $scope
					});
				}, 500);
				
		    };
		  	var saveContractFailureCallback = function(data){
		        $scope.$emit('hideLoader');
		        $scope.errorMessage = data;
		    }; 
		    
		    if($stateParams.id == "add"){
	    		var account_id = $scope.contactInformation.id;
		    }
		    else{
		    	var account_id = $stateParams.id;
		    }
		    if(account_id){
				$scope.invokeApi(RVCompanyCardSrv.addNewContract,{ "account_id": account_id, "postData": data }, saveContractSuccessCallback, saveContractFailureCallback);  
			}
		}
		else{
			// Nights popup enabled only when contract is selected.
			if($scope.contractList.contractSelected){
				ngDialog.open({
					 template: '/assets/partials/companyCard/rvContractedNightsPopup.html',
					 controller: 'contractedNightsCtrl',
					 className: 'ngdialog-theme-default1 calendar-single1',
					 scope: $scope
				});
			}
		}
	};
	
	$scope.AddNewButtonClicked = function(){
		//Setup data for Add mode
		$scope.contractList.isAddMode = true;
		$scope.addData.occupancy = [];
		$scope.addData.begin_date = dateFilter(new Date(), 'yyyy-MM-dd');
		$scope.addData.rate_value = 0;
		var myDate = new Date();
		myDate.setDate(myDate.getDate() + 1);
	    $scope.addData.end_date = dateFilter(myDate, 'yyyy-MM-dd'); 
	     		
		$scope.addData.is_fixed_rate = false;
		$scope.addData.is_rate_shown_on_guest_bill = false;
		if(typeof $stateParams.type !== 'undefined' && $stateParams.type !== ""){
			$scope.addData.account_type = $stateParams.type;
		}
	};
	// Cancel Add New mode
	$scope.CancelAddNewContract =  function(){
		$scope.contractList.isAddMode = false;
		$scope.addData.contract_name = "";
		$scope.errorMessage = "";
	};
	
	/*
	 * To add new contracts
	*/
	$scope.AddNewContract = function(){
		
		var data = dclone($scope.addData,['occupancy','statistics','rates','total_contracted_nights']);
		
		var saveContractSuccessCallback = function(data){
	    	$scope.$emit('hideLoader');
	    	$scope.errorMessage = "";
	    	var dataNew = {"id":data.id,"contract_name":$scope.addData.contract_name};
	    	$scope.contractList.current_contracts.push(dataNew);
	    	$scope.contractList.contractSelected = data.id;
	    	$scope.addData.contract_name = "";
		    $scope.contractList.isAddMode = false;
	    };
	  	var saveContractFailureCallback = function(data){
	        $scope.$emit('hideLoader');
	        $scope.errorMessage = data;
	    }; 
	    
	    console.log("$scope.contactInformation.id ="+$scope.contactInformation.id);
	    console.log("$stateParams.id ="+$stateParams.id);
	    if($stateParams.id == "add"){
	    	var account_id = $scope.contactInformation.id;
	    }
	    else{
	    	var account_id = $stateParams.id;
	    }
	    if(account_id){
			$scope.invokeApi(RVCompanyCardSrv.addNewContract,{ "account_id": account_id, "postData": data }, saveContractSuccessCallback, saveContractFailureCallback);  
		}
	};
	
	/**
	* function used to save the contract data, it will save only if there is any
	* change found in the present contract info.
	*/
	$scope.updateContract= function(){
	    var saveContractSuccessCallback = function(data){
	        $scope.$emit('hideLoader');
	        $scope.errorMessage = "";
	    };
	    var saveContractFailureCallback = function(data){
	        $scope.$emit('hideLoader');
	        $scope.errorMessage = data;
	    	$scope.$parent.currentSelectedTab = 'cc-contracts';
	    };
	   
		/**
	  	* change date format for API call 
	  	*/
	    var dataToUpdate =  JSON.parse(JSON.stringify($scope.contractData));
	    var dataUpdated = false;
	    if(angular.equals(dataToUpdate, contractInfo)) {
				dataUpdated = true;
		}
		else{
			contractInfo = dataToUpdate;
		}
	    if(!dataUpdated){
	    	var data = dclone($scope.contractData,['occupancy','statistics','rates','total_contracted_nights']);
	    	if($stateParams.id == "add"){
		    	var account_id = $scope.contactInformation.id;
		    }
		    else{
		    	var account_id = $stateParams.id;
		    }
	    	if($scope.contractList.contractSelected){
	    		$scope.invokeApi(RVCompanyCardSrv.updateContract,{ "account_id": account_id, "contract_id": $scope.contractList.contractSelected, "postData": data}, saveContractSuccessCallback, saveContractFailureCallback);
			}
		}
	};
	/**
	* recieving function for save contract with data
	*/
	$scope.$on('saveContract',function(event){
		event.preventDefault();
		//event.stopPropagation();
	 	$scope.updateContract();
	});
	/**
	* function for close activity indicator.
	*/
	$scope.closeActivityIndication = function(){
		$scope.$emit('hideLoader');
	};
	/*
	 * To Update graph
	 */
	$scope.updateGraph = function(){
		$scope.graphData = manipulateGraphData($scope.contractData.occupancy);
    	drawGraph();    	
	};
                
}]);