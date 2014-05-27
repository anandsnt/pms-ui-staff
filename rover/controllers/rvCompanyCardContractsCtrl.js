sntRover.controller('companyCardContractsCtrl',['$scope','RVCompanyCardSrv', '$stateParams','ngDialog','dateFilter', function($scope, RVCompanyCardSrv, $stateParams, ngDialog, dateFilter){
	BaseCtrl.call(this, $scope);
    $scope.highchartsNG = {};
	$scope.contractList = {};
	$scope.contractData = {};
	$scope.contractList.contractSelected = "";
	$scope.contractList.isAddMode = false;
	$scope.errorMessage = "";
	var contractInfo = {};
	
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
                    	categories: ['January','February','March','April','May','June','July','August','September','October','November','December'],//$scope.categories,
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
		$scope.contractData = {};
    	$scope.contractData = data;
    	contractInfo = {};
    	$scope.contractData.contract_name ="";
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
    };
    var fetchContractsDetailsFailureCallback = function(data){
        $scope.$emit('hideLoader');
        $scope.errorMessage = data;
    };
	
	/**
  	* function used for refreshing the scroller
  	*/
  	$scope.$parent.myScrollOptions = {		
	    'companyCardContractsCtrl': {
	    	scrollbars: true,
	    	scrollY: true,
	        snap: false,
	        hideScrollbar: false
	    }
	};
	/*
	$scope.$on('$viewContentLoaded', function() {
		setTimeout(function(){
			$scope.$parent.myScroll['companyCardContractsCtrl'].refresh();
			}, 
		3000);
		
     });*/
     
  	var refreshScroller = function(){
console.log("refreshScroller");
	    
	    //scroller options
	  /*  $scope.$parent.myScrollOptions = {
	    	'companyCardContractsCtrl': {
	        snap: false,
	        scrollbars: true,
	        bounce: true,
	        vScroll: true,
	        vScrollbar: true,
	        hideScrollbar: false
	       }
	    };*/
	    $scope.$parent.myScroll['companyCardContractsCtrl'].refresh();
  	};
  	
  	var manipulateGraphData = function(data){
        var graphData = [];
        var contracted = [];
        var actual = [];
        $scope.categories = [];
        angular.forEach(data, function(item){
            itemDate = item.month + " " + item.year;
            $scope.categories.push(itemDate);
            contracted.push([itemDate, Math.floor((Math.random() * 100) + 1)]); // TODO :: Remove this line and uncomment below line
            //contracted.push([itemDate, item.contracted_occupancy]);
            actual.push([itemDate, Math.floor((Math.random() * 100) + 1)]); // TODO :: Remove this line and uncomment below line
            //actual.push([itemDate,item.actual_occupancy]);
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
  	
	$scope.invokeApi(RVCompanyCardSrv.fetchContractsList,{"account_id":$stateParams.id},fetchContractsListSuccessCallback,fetchFailureCallback);  
	
	/*
    * Function to handle data change in 'Contract List'.
    */
   	$scope.clickContractSelected = function(contratct_id){
   		if(contratct_id){
   			$scope.invokeApi(RVCompanyCardSrv.fetchContractsDetails,{"account_id":$stateParams.id,"contract_id":contratct_id},fetchContractsDetailsSuccessCallback,fetchContractsDetailsFailureCallback);
	   		angular.forEach($scope.contractList.history_contracts,function(item, index) {
	    		if(item.id == contratct_id){
	    			$scope.isHistorySelected = true ;
	    		}
	       	});
       }
   	};
   
	$scope.contractStart = function(){
		ngDialog.open({
			 template: '/assets/partials/companyCard/rvCompanyCardContractsCalendar.html',
			 controller: 'contractStartCalendarCtrl',
			 className: 'ngdialog-theme-default calendar-single1',
			 scope: $scope
		});
	};
	
	$scope.contractEnd = function(){
		ngDialog.open({
			 template: '/assets/partials/companyCard/rvCompanyCardContractsCalendar.html',
			 controller: 'contractEndCalendarCtrl',
			 className: 'ngdialog-theme-default calendar-single1',
			 scope: $scope
		});
	};
	
	$scope.clickedContractedNights = function(){
		/*
		 * On AddMode : save new contract before showing Nights popup.
		*/
		if($scope.contractList.isAddMode){
			var data = dclone($scope.addData,['occupancy','statistics','rates','total_contracted_nights']);
		
			var saveContractSuccessCallback = function(data){
		    	$scope.$emit('hideLoader');
		    	var dataNew = {"id":data.id,"contract_name":$scope.addData.contract_name};
		    	$scope.contractList.current_contracts.push(dataNew);
		    	$scope.addData.contract_name = "";
		    	$scope.contractList.isAddMode = false;
		    	
		    	ngDialog.open({
					 template: '/assets/partials/companyCard/rvContractedNightsPopup.html',
					 controller: 'contractedNightsCtrl',
					 className: 'ngdialog-theme-default1 calendar-single1',
					 scope: $scope
				});
		    };
		  	var saveContractFailureCallback = function(data){
		        $scope.$emit('hideLoader');
		        $scope.errorMessage = data;
		    }; 
			$scope.invokeApi(RVCompanyCardSrv.addNewContract,{ "account_id":$stateParams.id, "postData":data}, saveContractSuccessCallback, saveContractFailureCallback);  
		}
		else{
			ngDialog.open({
				 template: '/assets/partials/companyCard/rvContractedNightsPopup.html',
				 controller: 'contractedNightsCtrl',
				 className: 'ngdialog-theme-default1 calendar-single1',
				 scope: $scope
			});
		}
	};
	
	$scope.AddNewButtonClicked = function(){
		$scope.contractList.isAddMode = true;
		$scope.addData = {};
		$scope.addData = dclone($scope.contractData,['statistics','total_contracted_nights']);
		$scope.addData.occupancy = [];
		$scope.addData.begin_date = dateFilter(new Date(), 'yyyy-MM-dd');;
		$scope.addData.end_date = dateFilter(new Date(), 'yyyy-MM-dd');;
	};
	$scope.CancelAddNewContract =  function(){
		$scope.contractList.isAddMode = false;
		$scope.addData.contract_name = "";
	};
	/*
	 * Add new contarcts
	*/
	$scope.AddNewContract = function(){
		
		var data = dclone($scope.addData,['occupancy','statistics','rates','total_contracted_nights']);
		
		var saveContractSuccessCallback = function(data){
	    	$scope.$emit('hideLoader');
	    	var dataNew = {"id":data.id,"contract_name":$scope.addData.contract_name};
	    	$scope.contractList.current_contracts.push(dataNew);
	    };
	  	var saveContractFailureCallback = function(data){
	        $scope.$emit('hideLoader');
	        $scope.errorMessage = data;
	    }; 
		$scope.invokeApi(RVCompanyCardSrv.addNewContract,{ "account_id":$stateParams.id, "postData":data}, saveContractSuccessCallback, saveContractFailureCallback);  
	};
	
	
	$scope.updateContract= function(){
	    var saveContractSuccessCallback = function(data){
	        $scope.$emit('hideLoader');
	    };
	    var saveContractFailureCallback = function(data){
	        $scope.$emit('hideLoader');
	        $scope.errorMessage = data;
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
	    	$scope.invokeApi(RVCompanyCardSrv.updateContract,{ "account_id": $stateParams.id, "contract_id": $scope.contractList.contractSelected, "postData": data}, saveContractSuccessCallback, saveContractFailureCallback);
		}
	};

	$scope.$on('saveContract',function(){
	 	$scope.updateContract();
	});
	
	$scope.closeActivityIndication = function(){
		$scope.$emit('hideLoader');
	};
	
                
}]);