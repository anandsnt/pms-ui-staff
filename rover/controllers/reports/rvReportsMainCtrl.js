sntRover.controller('RVReportsMainCtrl', [
	'$rootScope',
	'$scope',
	'reportsResponse',
	'RVreportsSrv',
	'$filter',
	'activeUserList',
	function($rootScope, $scope, reportsResponse, RVreportsSrv, $filter, activeUserList) {

		BaseCtrl.call(this, $scope);

		// set a back button, by default keep hidden
		$rootScope.setPrevState = {
		    hide: true,
		    title: $filter('translate')('REPORTS'),
		    callback: 'goBackReportList',
		    scope: $scope,

		    // since there is no state change we must declare this explicitly
		    // else there can be errors in future animations
		    noStateChange: true
		};

		var listTitle = $filter('translate')('STATS_&_REPORTS_TITLE');
		$scope.setTitle( listTitle );
		$scope.heading = listTitle;
		$scope.$emit("updateRoverLeftMenu", "reports");

		$scope.reportList = reportsResponse.results;
		$scope.reportCount = reportsResponse.total_count;
		$scope.activeUserList = activeUserList;

		$scope.showReportDetails = false;

		// lets fix the results per page to, user can't edit this for now
		// 25 is the current number set by backend server
		$scope.resultsPerPage = 25;

		$scope.goBackReportList = function() {
			$rootScope.setPrevState.hide = true;
			$scope.showReportDetails = false;
			$scope.heading = listTitle;
		};



		/**
        * inorder to refresh after list rendering
        */
        $scope.$on("NG_REPEAT_COMPLETED_RENDERING", function(event){            
            $scope.refreshScroller( 'report-list-scroll');
        });

		var datePickerCommon = {
			dateFormat     : $rootScope.jqDateFormat,
			numberOfMonths : 1,
			changeYear     : true,
			changeMonth    : true,
			beforeShow     : function(input, inst) {
				$('#ui-datepicker-div');
				$('<div id="ui-datepicker-overlay">').insertAfter('#ui-datepicker-div');
			},
			onClose        : function(value) {
				$('#ui-datepicker-div');
				$('#ui-datepicker-overlay').remove();
				$scope.showRemoveDateBtn();
			}
		};

		$scope.fromDateOptions = angular.extend({
			maxDate  : $filter('date')($rootScope.businessDate, $rootScope.dateFormat),
			onSelect : function(value) { $scope.untilDateOptions.minDate = value; }
		}, datePickerCommon);
		$scope.untilDateOptions = angular.extend({
			maxDate  : $filter('date')($rootScope.businessDate, $rootScope.dateFormat),
			onSelect : function(value) { $scope.fromDateOptions.maxDate = value; }
		}, datePickerCommon);

		$scope.fromDateOptionsNoLimit  = angular.extend({}, datePickerCommon);
		$scope.untilDateOptionsNoLimit = angular.extend({}, datePickerCommon);




		$scope.showRemoveDateBtn = function() {
			var cancellationReport = _.find($scope.reportList, function(item) {
			    return item.title == 'Cancelation & No Show';
			});

			if ( !!cancellationReport['fromDate'] && !!cancellationReport['untilDate'] && (!!cancellationReport['fromCancelDate'] || !!cancellationReport['untilCancelDate']) ) {
			    cancellationReport['showRemove'] = true;
			};

			if ( !!cancellationReport['fromCancelDate'] && !!cancellationReport['untilCancelDate'] && (!!cancellationReport['fromDate'] || !!cancellationReport['untilDate']) ) {
			    cancellationReport['showRemove'] = true;
			};
		};

		$scope.clearDateFromFilter = function(list, key1, key2) {
			if ( list.hasOwnProperty(key1) && list.hasOwnProperty(key2) ) {
				list[key1] = undefined;
				list[key2] = undefined;
				list['showRemove'] = false;
			};
		};




		// auto correct the CICO value;
		var getProperCICOVal = function(type) {
			var chosenReport = RVreportsSrv.getChoosenReport();

		    // only do this for this report
		    // I know this is ugly :(
		    if ( chosenReport.title !== 'Check In / Check Out' ) {
		        return;
		    };

		    // if user has not chosen anything
		    // both 'checked_in' & 'checked_out' must be true
		    if ( !chosenReport.chosenCico ) {
		        chosenReport.chosenCico = 'BOTH'
		        return true;
		    };

		    // for 'checked_in'
		    if (type === 'checked_in') {
		        return chosenReport.chosenCico === 'IN' || chosenReport.chosenCico === 'BOTH';
		    };

		    // for 'checked_out'
		    if (type === 'checked_out') {
		        return chosenReport.chosenCico === 'OUT' || chosenReport.chosenCico === 'BOTH';
		    };
		};

		var chosenList = [
            'chosenIncludeNotes',
            'chosenIncludeCancelled',
            'chosenIncludeVip',
            'chosenIncludeNoShow',
            'chosenIncludeRoverUsers',
            'chosenIncludeZestUsers',
            'chosenIncludeZestWebUsers'
        ];

        var hasList = [
            'hasIncludeNotes',
            'hasIncludeCancelled',
            'hasIncludeVip',
            'hasIncludeNoShow',
            'hasIncludeRoverUsers',
            'hasIncludeZestUsers',
            'hasIncludeZestWebUsers'
        ];

		// common faux select method
		$scope.fauxSelectClicked = function(e, item) {
			// if clicked outside, close the open dropdowns
			if ( !e ) {
				_.each($scope.reportList, function(item) {
					item.fauxSelectOpen = false;
				});
				return;
			};

			if ( !item ) {
				return;
			};

			e.stopPropagation();
			item.fauxSelectOpen = item.fauxSelectOpen ? false : true;

			//$scope.fauxOptionClicked(e, item);
		};

		$scope.fauxOptionClicked = function(e, item) {
			e.stopPropagation();

			var selectCount = 0,
				maxCount    = 0,
				eachTitle   = '';

			item.fauxTitle = '';
			for (var i = 0, j = chosenList.length; i < j; i++) {
				if ( item.hasOwnProperty(chosenList[i]) ) {
					maxCount++;
					if ( item[chosenList[i]] == true ) {
						selectCount++;
						eachTitle = item[hasList[i]].description;
					};
				};
			};

			if ( selectCount == 0 ) {
				item.fauxTitle = 'Select';
			} else if ( selectCount == 1 ) {
				item.fauxTitle = eachTitle;
			} else if ( selectCount > 1 ) {
				item.fauxTitle = selectCount + ' Selected';
			};
		};

		$scope.showFauxSelect = function(item) {
            if ( !item ) {
            	return false;
            };

            return _.find(hasList, function(has) { return item.hasOwnProperty(has) }) ? true : false;
        };

		// generate reports
		$scope.genReport = function(changeView, loadPage, resultPerPageOverride) {
			var chosenReport = RVreportsSrv.getChoosenReport(),
				changeView   = typeof changeView === 'boolean' ? changeView : true,
				page         = !!loadPage ? loadPage : 1;
				
		    // create basic param
		    var params = {
		    	id       : chosenReport.id,
		    	page     : page,
		    	per_page : resultPerPageOverride || $scope.resultsPerPage
		    };

		    var key = '';

		    // include dates
			if ( chosenReport.hasDateFilter ) {
				params['from_date'] = $filter( 'date' )( chosenReport.fromDate, 'yyyy/MM/dd' );
				params['to_date']   = $filter( 'date' )( chosenReport.untilDate, 'yyyy/MM/dd' );
			};

			// include cancel dates
			if ( chosenReport.hasCancelDateFilter ) {
				params['cancel_from_date'] = $filter( 'date' )( chosenReport.fromCancelDate, 'yyyy/MM/dd' );
				params['cancel_to_date']   = $filter( 'date' )( chosenReport.untilCancelDate, 'yyyy/MM/dd' );	
			};

			// include times
			if ( chosenReport.hasTimeFilter ) {
				params['from_time'] = chosenReport.fromTime || '';
				params['to_time']   = chosenReport.untilTime || '';
			};

			// include CICO filter 
			if ( !!chosenReport.hasCicoFilter ) {
				params['checked_in']  = getProperCICOVal( 'checked_in' );
				params['checked_out'] = getProperCICOVal( 'checked_out' );
			};

			// include user ids
			if ( chosenReport.hasUserFilter && chosenReport.chosenUsers && chosenReport.chosenUsers.length ) {
				params['user_ids'] = chosenReport.chosenUsers;
			};

			// include sort bys
			if ( chosenReport.sortByOptions ) {
				if ( !!chosenReport.chosenSortBy ) {
					params['sort_field'] = chosenReport.chosenSortBy;
				};

				var _chosenSortBy = _.find(chosenReport.sortByOptions, function(item) {
					return item.value == chosenReport.chosenSortBy;
				});

				if ( !!_chosenSortBy && typeof _chosenSortBy.sortDir == 'boolean' ) {
					params['sort_dir'] = _chosenSortBy.sortDir;
				};
			};

			// include notes
			if ( !!chosenReport.hasIncludeNotes ) {
				key = chosenReport.hasIncludeNotes.value.toLowerCase();
				params[key] = chosenReport.chosenIncludeNotes;
			};

			// include user ids
			if ( chosenReport.hasIncludeVip ) {
				key = chosenReport.hasIncludeVip.value.toLowerCase();
				params[key] = chosenReport.chosenIncludeVip;
			};

			// include cancelled
			if ( chosenReport.hasIncludeCancelled ) {
				key = chosenReport.hasIncludeCancelled.value.toLowerCase();
				params[key] = chosenReport.chosenIncludeCancelled;
			};

			// include no show
			if ( chosenReport.hasIncludeNoShow ) {
				key = chosenReport.hasIncludeNoShow.value.toLowerCase();
				params[key] = chosenReport.chosenIncludeNoShow;
			};

			// include rover users
			if ( chosenReport.hasIncludeRoverUsers ) {
				key = chosenReport.hasIncludeRoverUsers.value.toLowerCase();
				params[key] = chosenReport.chosenIncludeRoverUsers;
			};

			// include zest users
			if ( chosenReport.hasIncludeZestUsers ) {
				key = chosenReport.hasIncludeZestUsers.value.toLowerCase();
				params[key] = chosenReport.chosenIncludeZestUsers;
			};

			// include zest web users
			if ( chosenReport.hasIncludeZestWebUsers ) {
				key = chosenReport.hasIncludeZestWebUsers.value.toLowerCase();
				params[key] = chosenReport.chosenIncludeZestWebUsers;
			};


		    var callback = function(response) {
		    	if ( changeView ) {
		    		$rootScope.setPrevState.hide = false;
		    		$scope.showReportDetails = true;
		    	};

		    	// fill in data into seperate props
		    	$scope.totals = response.totals;
		    	$scope.headers = response.headers;
		    	$scope.subHeaders = response.sub_headers;
		    	$scope.results = response.results;
		    	$scope.resultsTotalRow = response.results_total_row;

		    	// track the total count
		    	$scope.totalCount = response.total_count;
		    	$scope.currCount = response.results.length;

		    	$scope.$emit( 'hideLoader' );

		    	if ( !changeView && !loadPage ) {
		    		$rootScope.$emit( 'report.updated' );
		    	} else if ( !!loadPage && !resultPerPageOverride ) {
		    		$rootScope.$emit( 'report.page.changed' );
		    	} else if ( !!resultPerPageOverride ) {
		    		$rootScope.$emit( 'report.printing' );
		    	} else {
		    		$rootScope.$emit( 'report.submit' );
		    	}
		    };

           	$scope.invokeApi(RVreportsSrv.fetchReportDetails, params, callback);
		};




		


		var autoCompleteSelectHandler = function(event, ui) {
		    if (ui.item.type === 'COMPANY') {
		        $scope.reservationData.company.id = ui.item.id;
		        $scope.reservationData.company.name = ui.item.label;
		        $scope.reservationData.company.corporateid = ui.item.corporateid;
		    } else {
		        $scope.reservationData.travelAgent.id = ui.item.id;
		        $scope.reservationData.travelAgent.name = ui.item.label;
		        $scope.reservationData.travelAgent.iataNumber = ui.item.iataNumber;
		    };

		    // DO NOT return false;
		};






		var activeUserAutoCompleteObj = [];
		_.each($scope.activeUserList, function(user) {
			activeUserAutoCompleteObj.push({
				label: user.email,
				value: user.id
			});
		});

		function split( val ) {
			return val.split( /,\s*/ );
		}
		function extractLast( term ) {
			return split( term ).pop();
		}

		var thisReport;
		$scope.returnItem = function(item) {
			thisReport = item;
		};

		$scope.autoCompleteOptions = {

			delay: 0,
			position: {
			    my: 'left bottom',
			    at: 'left top',
			    collision: 'flip'
			},
			source: function( request, response ) {
				// delegate back to autocomplete, but extract the last term
				response( $.ui.autocomplete.filter(activeUserAutoCompleteObj, extractLast(request.term)) );
			},
			select: function( event, ui ) {
				var uiValue  = split( this.value );
				uiValue.pop();
				uiValue.push( ui.item.label );
				uiValue.push( "" );

				this.value = uiValue.join( ", " );
				setTimeout(function() {
					$scope.$apply(function() {
						thisReport.uiChosenUsers = uiValue.join( ", " );
					});
				}.bind(this), 100);
				return false;
	        },
	        close: function( event, ui ) {
				var uiValues = split( this.value );
				var modelVal = [];

				_.each(activeUserAutoCompleteObj, function(user) {
					var match = _.find(uiValues, function(email) {
						return email == user.label;
					});

					if ( !!match ) {
						modelVal.push( user.value );
					};
				});

				setTimeout(function() {
					$scope.$apply(function() {
						thisReport.chosenUsers = modelVal;
					});
				}.bind(this), 100);
	        },
	        focus: function( event, ui ) {
	        	return false;
	        }

		};

	}
]);