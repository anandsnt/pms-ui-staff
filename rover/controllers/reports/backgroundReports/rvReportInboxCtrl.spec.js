describe("RVReportsInboxCtrl", function() {			
	var $scope,
		    $q,
		    $controller,		    
		    RVReportsInboxSrv,
		    $rootScope,
		    sntActivity,
		    generatedResponse = {
		    	'results': [
		    		{
		    			"id": 38,
		    			"hotel_id":80,
		    			"report_id": 63,
		    			"user_id": 2803,
		    			"filters": {
		    				"from_date": "2017/11/21",
		    				"to_date": "2017/11/21",
		    				"sort_field": 'ACCOUNT_NAME'
		    			},
		    			"status": {
		    				"value": "IN_PROGRESS"
		    			}
		    		},
		    		{
		    			"id": 37,
		    			"hotel_id":80,
		    			"report_id": 12,
		    			"user_id": 2803,
		    			"filters": {
		    				"from_date": "2017/11/21",
		    				"to_date": "2017/11/21"
		    			},
		    			"status": {
		    				"value": "REQUESTED"
		    			}
		    		}
		    	],
		    	"total_count": 2
		    };



	describe("Generated Report list", function() {
		var reportInboxCtrl,
			$filter;

		var getDummyPromise = function() {
				var deferred = $q.defer();

	            deferred.resolve(generatedResponse);
	            return deferred.promise;
			};

		beforeEach(function() {
            module('sntRover'); 

            inject(function(_$controller_, _RVReportsInboxSrv_, _$rootScope_, _$q_, _sntActivity_, _$filter_) {
	                RVReportsInboxSrv = _RVReportsInboxSrv_;
	                $rootScope = _$rootScope_;
	                $scope = $rootScope.$new();
	                $q = _$q_;  
	                $controller = _$controller_; 
	                sntActivity =  _sntActivity_;            
	                $filter = _$filter_;
            	});
            $scope.reportList = [
	        		{
	        			"id": 63,
	        			"title": "A/R Aging"
	        		},
	        		{
	        			"id": 12,
	        			"title": "Occupancy & Revenue Summary"
	        		}
        	];

    		reportInboxCtrl = $controller('RVReportsInboxCtrl', {
            	$scope: $scope,
            	generatedReportsList: generatedResponse
            });   
            

        });

        it('fetch generated reports', function() {         		         	

            	spyOn(RVReportsInboxSrv, 'fetchReportInbox').and.callFake(function () {
		            var deferred = $q.defer();

		            deferred.resolve(generatedResponse);
		            return deferred.promise;
        		});        		
            	
            	
            	reportInboxCtrl.fetchGeneratedReports(1);

            	$rootScope.$apply();
            	
            	expect($scope.reportInboxData.generatedReports[0].name).toEqual("A/R Aging");

        });

        it("create drop dowm data for date filter",  function() {
        	$rootScope.businessDate = "2017-11-22";
        	let data = reportInboxCtrl.createDateDropdownData();

        	expect(data[1].value).toEqual("2017-11-21");
        });

        it("get color code for report status", function() {
        	var color = $scope.getColorCodeForReportStatus(generatedResponse.results[0]);

        	expect(color).toEqual("blue");
        });

        it('show report details', function() {
        	$scope.showReportDetails(generatedResponse.results[0]);
        	$rootScope.$apply();        	
        	expect(generatedResponse.results[0].filterDetails['Sort By']).toEqual('ACCOUNT NAME');
        });  

	});

});