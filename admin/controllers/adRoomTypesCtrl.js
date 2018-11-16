admin.controller('ADRoomTypesCtrl', ['$scope', '$rootScope', '$state', 'ADRoomTypesSrv', 'ngTableParams', '$filter', '$anchorScroll', '$timeout', '$location', function($scope, $rootScope, $state, ADRoomTypesSrv, ngTableParams, $filter, $anchorScroll, $timeout, $location) {

	var init = function() {
    	$scope.errorMessage = '';
    	BaseCtrl.call(this, $scope);
    	$scope.roomTypeData = {};
    	$scope.successMessage = "";
    	$scope.errorMessage = "";
    	$scope.is_image_deleted = false;
    	$scope.fileName = "Choose File....";
    	$scope.imageFileName = $scope.fileName;
    	if ($rootScope.isEnabledRoomTypeByRoomClass && !$rootScope.isStandAlone) {
    		$scope.getRoomClassList();
    	}
    	// To list room types
    	$scope.listRoomTypes();
        $scope.isAscendingByName = true;
        $scope.isAscendingByCode = true;
	};

   /*
    * To fetch list of room types
    */
	$scope.listRoomTypes = function() {
		var successCallbackFetch = function(data) {
			$scope.data = data;
			$scope.currentClickedElement = -1;

            /**
             *  For Overlay properties -
             *  Keeping sort by name in ASC order initially.
             */
            if ( !$rootScope.isStandAlone ) {
                /**
                 *  For StandAlone properties -
                 *  As per CICO-7161 : We need to handle Sort By Name + Sort By position via Drag and Drop.
                 *  thus removing the attribute for default sorting ( by name ).
                 */
                $scope.tableParams = new ngTableParams(
                    {
                        page: 1,        // show first page
                        count: 10000,   // count per page - Need to change when on pagination implemntation
                        sorting: {'name': 'asc'}
                    }, 
                    {
                        total: $scope.data.room_types.length, // length of data
                        getData: function($defer, params) {
                            // use build-in angular filter
                            var orderedData = params.sorting() ?
                                                $filter('orderBy')($scope.data.room_types, params.orderBy()) :
                                                $scope.data.room_types;

                            $scope.orderedData =  orderedData;

                            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        }
                    }
                );
            }
		},
        options = {
            params: {},
            successCallBack: successCallbackFetch
        };

		$scope.callAPI(ADRoomTypesSrv.fetch, options);
	};
	 /*
    * To fetch list of room classes
    */
	$scope.getRoomClassList = function() {
		var successCallbackFetch = function(data) {
			$scope.roomClasses = data;
		};

		$scope.invokeApi(ADRoomTypesSrv.fetchRoomClasses, {}, successCallbackFetch);
	};

   /*
    * To render edit room types screen
    * @param {index} index of selected room type
    * @param {id} id of the room type
    */
    $scope.editRoomTypeDetails = function(index, id) {
        $scope.isAddMode = false;
        $scope.fetchAvailableRoomTypesForSuite(index, id);
    };
	$scope.editRoomTypes = function(index, id)	{
        $scope.departmentData = {};
		$scope.currentClickedElement = index;
		$scope.roomTypeData = {};
	 	var successCallbackRender = function(data) {
	 		$scope.$emit('hideLoader');

	 		$scope.roomTypeData = data;
	 		if ($scope.roomTypeData.is_pseudo_room_type === "true" || $scope.roomTypeData.is_pseudo_room_type === true) {
	 			$scope.roomTypeData.is_pseudo_room_type = true;
	 		}
	 		else {
	 			$scope.roomTypeData.is_pseudo_room_type = false;
	 		}
	 		if ($scope.roomTypeData.is_suite === "true" || $scope.roomTypeData.is_suite === true) {
	 			$scope.roomTypeData.is_suite = true;
	 		}
	 		else {
	 			$scope.roomTypeData.is_suite = false;
	 		}
            var blockedRoomsCountObj;

            _.each($scope.availableRoomTypes, function(value, key) {
                blockedRoomsCountObj = _.find($scope.roomTypeData.component_room_types, {'component_room_type_id': value.id});
                value.blocked_rooms_count = (blockedRoomsCountObj !== undefined) ? blockedRoomsCountObj.rooms_count : 0;

                if (blockedRoomsCountObj) {
                    value.isComponentUpArrowEnabled = (blockedRoomsCountObj.rooms_count !== value.rooms_count) ? true : false;
                    value.isComponentDownArrowEnabled = (blockedRoomsCountObj.rooms_count > 0) ? true : false;
                }
            });
	 	};
	 	var data = {"id": id };

	 	$scope.invokeApi(ADRoomTypesSrv.getRoomTypeDetails, data, successCallbackRender);
	};

   /*
    * To get the template of edit screen
    * @param {int} index of the selected room type
    * @param {string} id of the room type
    */
	$scope.getTemplateUrl = function(index, id) {
		if (typeof index === "undefined" || typeof id === "undefined") {
			return "";
		}
		if ($scope.currentClickedElement === index) {
			 	return "/assets/partials/roomTypes/adRoomTypesDetails.html";
		}
	};
  /*
   * To save/update room type details
   */
   $scope.saveRoomTypes = function() {

		var unwantedKeys = [];

		if ($scope.roomTypeData.image_of_room_type.indexOf("data:") !== -1) {
			unwantedKeys = ["is_image_deleted"];
		} else {
			$scope.roomTypeData.is_image_deleted = $scope.is_image_deleted;
			unwantedKeys = ["image_of_room_type"];
		}
        if ($scope.roomTypeData.is_suite) {
            $scope.roomTypeData.component_room_types = _.reject($scope.availableRoomTypes, {"blocked_rooms_count": 0});
        }
        // CICO-47917 : Removing component_room_types while Overlay Hotels
        if ( !$rootScope.isStandAlone ) {
        	unwantedKeys.push('component_room_types');
        }
		var data = dclone($scope.roomTypeData, unwantedKeys);

    	var editSuccessCallbackSave = function(data) {
    		$scope.$emit('hideLoader');
    		$scope.is_image_deleted = false;
    		// Since the list is ordered. Update the ordered data
    		$scope.orderedData[parseInt($scope.currentClickedElement)].name = $scope.roomTypeData.room_type_name;
    		$scope.orderedData[parseInt($scope.currentClickedElement)].code = $scope.roomTypeData.room_type_code;
    		$scope.currentClickedElement = -1;
    	};
    	var addSuccessCallbackSave = function(data) {
    		$scope.$emit('hideLoader');
    		$scope.isAddMode = false;
    		$scope.is_image_deleted = false;
            if ( !$rootScope.isStandAlone ) {
    		    $scope.data.room_types.push({'name': $scope.roomTypeData.room_type_name, 'code': $scope.roomTypeData.room_type_code, 'id': data.id, 'sequence_number': data.sequence_number });
                $scope.tableParams.reload();
            }
            else {
                $scope.listRoomTypes();
            }
    	};

    	if ($scope.isAddMode) {
            if ( $rootScope.isStandAlone ) {
                data.sequence_number = $scope.data.room_types.length + 1;
            }
    		$scope.invokeApi(ADRoomTypesSrv.createRoomType, data, addSuccessCallbackSave);
    	}
      	else {
    	    $scope.invokeApi(ADRoomTypesSrv.updateRoomTypes, data, editSuccessCallbackSave);
    	}
    };
   /* Handle click
    of image delete*/

    $scope.deleteRoomImage = function() {
    	$scope.roomTypeData.image_of_room_type = "";
    	$scope.is_image_deleted = true;
    };

	$scope.clickCancel = function() {
		if ($scope.isAddMode) {
			$scope.isAddMode = false;
			$scope.fileName = "";
			$scope.imageFileName = $scope.fileName;
        }
		else {
		    $scope.currentClickedElement = -1;
		}
	};
   /*
    * To import form pms
    *
    */
	$scope.importFromPms = function(event) {
		event.stopPropagation();
        var successCallbackImport = function() {
		    $scope.$emit('hideLoader');
	 		$scope.successMessage = $filter('translate')('ROOM_IMPORT_IN_PROGESS');
	 		$timeout(function() {
		        $scope.successMessage = '';
		    }, 10000);
	 	};

		$scope.invokeApi(ADRoomTypesSrv.importFromPms, '', successCallbackImport);
	};

    $scope.fetchAvailableRoomTypesForSuite = function(index, id) {
        var successCallbackGetAvailableRoomTypesForSuite = function(data) {
            $scope.$emit('hideLoader');
            $scope.availableRoomTypes = data.data;
            _.each($scope.availableRoomTypes, function(value, key) {
                value.blocked_rooms_count = 0;
                value.isComponentUpArrowEnabled = true;
                value.isComponentDownArrowEnabled = false;
            });
            if (!$scope.isAddMode) {
                $scope.editRoomTypes(index, id);
            }
        };

        $scope.invokeApi(ADRoomTypesSrv.fetchRoomTypesAvailableForSuite, '', successCallbackGetAvailableRoomTypesForSuite);
    };

  /*
    * To add new room type
    *
    */
	$scope.addNewRoomType = function() {
		$scope.currentClickedElement = -1;
		$scope.isAddMode = $scope.isAddMode ? false : true;
		$scope.fileName = "Choose File....";
		$scope.imageFileName = $scope.fileName;

		// reset data
		$scope.roomTypeData = {
			"room_type_id": "",
			"room_type_code": "",
			"room_type_name": "",
			"snt_description": "",
			"max_occupancy": "",
			"is_pseudo_room_type": "",
			"is_suite": "",
			"image_of_room_type": "",
			"is_room_type_ows_request_per_status_type": false,
			"room_class_id": "",
			"is_image_deleted": "",
            "is_available_for_day_use": false
		};
		$timeout(function() {
            $location.hash('new-form-holder');
            $anchorScroll();
    	});
        $scope.fetchAvailableRoomTypesForSuite();
	};
    /**
     *  Sort By Name - UI filter - ngTable for overlay Hotels
     */
	$scope.sortByName = function() {
		if ($scope.currentClickedElement === -1) {
            $scope.tableParams.sorting({'name': $scope.tableParams.isSortBy('name', 'asc') ? 'desc' : 'asc'});
		}
	};
    /**
     *  Sort By Code - ngTable -for overlay hotels.
     *  UI filter
     */
	$scope.sortByCode = function() {
		if ($scope.currentClickedElement === -1) {
            $scope.tableParams.sorting({'code': $scope.tableParams.isSortBy('code', 'asc') ? 'desc' : 'asc'});
        }
	};

	$scope.deleteRoomTypes = function( roomtype_id ) {
		var successCallBack = function() {
            if ( !$rootScope.isStandAlone ) {
			    // actualIndex holds the index of clicked element in $scope.data.room_types
                var actualIndex = $scope.data.room_types.map(function(x) {
                    return x.id;
                }).indexOf(roomtype_id);

      		    $scope.data.room_types.splice(actualIndex, 1);
			    $scope.tableParams.page(1);
			    $scope.tableParams.reload();
            }
            else {
                // Reload list for StandAlone properties..
                $scope.listRoomTypes();
            }
		};
        
        var options = {
            params: {
                'roomtype_id': roomtype_id
            },
            successCallBack: successCallBack
        };

	   $scope.callAPI(ADRoomTypesSrv.deleteRoomTypes, options);
	};

    $scope.incrementBlockedRoomTypesCount = function(roomTypeId) {
        var clickedBlockRoomType = _.findWhere($scope.availableRoomTypes, {id: roomTypeId});

        if (clickedBlockRoomType.blocked_rooms_count < clickedBlockRoomType.rooms_count) {
            clickedBlockRoomType.isComponentDownArrowEnabled = true;
            clickedBlockRoomType.blocked_rooms_count = clickedBlockRoomType.blocked_rooms_count + 1;
            if (clickedBlockRoomType.blocked_rooms_count == clickedBlockRoomType.rooms_count) {
                clickedBlockRoomType.isComponentUpArrowEnabled = false;
            }
        }
    };

    $scope.decrementBlockedRoomTypesCount = function(roomTypeId) {
        var clickedBlockRoomType = _.findWhere($scope.availableRoomTypes, {id: roomTypeId});

        if (clickedBlockRoomType.blocked_rooms_count > 0) {
            clickedBlockRoomType.isComponentUpArrowEnabled = true;
            clickedBlockRoomType.blocked_rooms_count = clickedBlockRoomType.blocked_rooms_count - 1;
            if (clickedBlockRoomType.blocked_rooms_count == 0) {
                clickedBlockRoomType.isComponentDownArrowEnabled = false;
            }
        }
    };

    $scope.changeInBlockedRoomCount = function(roomTypeId) {
        var clickedBlockRoomType = _.findWhere($scope.availableRoomTypes, {id: roomTypeId});

        clickedBlockRoomType.isComponentUpArrowEnabled = true;
        clickedBlockRoomType.isComponentDownArrowEnabled = false;
        if (clickedBlockRoomType.blocked_rooms_count == clickedBlockRoomType.rooms_count)
        {
            clickedBlockRoomType.isComponentUpArrowEnabled = false;
        }
        if (clickedBlockRoomType.blocked_rooms_count > 0)
        {
            clickedBlockRoomType.isComponentDownArrowEnabled = true;
        }
    };

    /*
     *  Save Sorted list with API call
     *  @param {string} [ room type id - to save by position via Drag and Drop ]
     *  @param {number} [ position value - to save by position via Drag and Drop ]
     *  @param {Boolean | Undefined} [ SortByName flag - to save by sorting order via Name Sort click ]
     */
    var saveSortedList = function(id, position, isSortByName ) {
        var options = {
            params: {}
        },
        successCallBackOfSort = function() {
            $scope.listRoomTypes();
            $scope.isAscendingByName = !$scope.isAscendingByName;
        };

        if ( isSortByName ) {
            // Only for Standalone Hotels : Save the sort order
            // sortByValue set true only for Standalone.
            options.params.sort_dir = $scope.isAscendingByName;
            options.successCallBack = successCallBackOfSort;
        }
        else {
            options.params.room_type_id = id;
            options.params.sequence_number = position;
            options.successCallBack = $scope.listRoomTypes;
        }

        $scope.callAPI(ADRoomTypesSrv.saveComponentOrder, options);
    };

    // save new order
    var saveNewPosition = function(id, position) {
        _.isUndefined(position) ? "" : saveSortedList(id, position + 1);
    };

    // to fix shrinking of width
    var fixHelper = function(e, ui) {
        ui.children().each(function() {
            $(this).width($(this).width());
        });
        return ui;
    };

    // Sorting by postions logic for Drag and Drop.
    $scope.sortableOptions = {
        helper: fixHelper,
        start: function() {
            $timeout(function() {
                $scope.currentClickedElement = -1;
            }, 1000);
        },
        stop: function(e, ui) {
            if (ui.item.sortable.dropindex !== ui.item.sortable.index && ui.item.sortable.dropindex !== null) {
                saveNewPosition(ui.item.sortable.model.id, ui.item.sortable.dropindex, ui.item.sortable.index);
            }
        }
    };
    // Sort by code for standalone property
    $scope.sortByCodeStandAlone = function() {
        if ($scope.currentClickedElement === -1) {
            if ( $scope.isAscendingByCode ) {
                $scope.data.room_types = _.sortBy($scope.data.room_types, 'code');
            }
            else {
                $scope.data.room_types = _.sortBy($scope.data.room_types, 'code').reverse();
            }
            $scope.isAscendingByCode = !$scope.isAscendingByCode;
        }
    };
    // Sort by Name for standalone property
    $scope.sortByNameStandAlone = function() {
        if ($scope.currentClickedElement === -1) {
            saveSortedList( null, null, true );
        }
    };

	init();

}]);
