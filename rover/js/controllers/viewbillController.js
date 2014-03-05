sntRover.controller('viewbillController',['$scope', function($scope){
	
	$scope.status = true;
	$scope.status1 = false;
	
	$scope.dates= [
	                {
	                    "date": "2013-03-12",
	                    "amount": "149",
	                    "rate_name": "Best Available Rate",
	                    "rate_description": "This is the best rate for the season",
	                    "room_type_name": "Superior Double King Deluxe",
	                    "room_type_description": ""
	                },
	                {
	                    "date": "2013-03-13",
	                    "amount": "249",
	                    "rate_name": "Best Available Rate",
	                    "rate_description": "This is the best rate for the season",
	                    "room_type_name": "Superior Double King Deluxe",
	                    "room_type_description": ""
	                }];
	                
	   
	$scope.clicked = function(index){
		
		$scope.selecteIndex = index;
	}
	
	$scope.header_data = {
		"firstname" : " Jos",
		"lastname":"Schaap",
		"late_checkout": "10",
		"date":"feb 24, 2014"
	};
	$scope.data = {
	    "reservation_status": "CHECKING_IN",
	    "room_number": "234",
	    "room_status": "ready",
	    "room_type": "SUDK",
	    "number_of_nights": "3",
	    "checkin_date": "2013-03-12",
	    "checkout_date": "2013-03-15",
	    "currency_code": "USD",
	    "bills": [
	        {
	            "bill_number": "1",
	            "total_amount": "662",
	            "days": [
	                {
	                    "date": "2013-03-12",
	                    "amount": "149",
	                    "rate_name": "Best Available Rate",
	                    "rate_description": "This is the best rate for the season",
	                    "room_type_name": "Superior Double King Deluxe",
	                    "room_type_description": ""
	                },
	                {
	                    "date": "2013-03-13",
	                    "amount": "249",
	                    "rate_name": "Best Available Rate",
	                    "rate_description": "This is the best rate for the season",
	                    "room_type_name": "Superior Double King Deluxe",
	                    "room_type_description": ""
	                },
	                {
	                    "date": "2013-03-14",
	                    "amount": "249",
	                    "rate_name": "Best Available Rate",
	                    "rate_description": "This is the best rate for the season",
	                    "room_type_name": "Superior Double King Deluxe",
	                    "room_type_description": ""
	                },
	                {
	                    "date": "2013-03-15",
	                    "amount": "",
	                    "rate_name": "",
	                    "rate_description": "",
	                    "room_type_name": "Superior Double King Deluxe",
	                    "room_type_description": ""
	                }
	            ],
	            "addons": [
	                {
	                    "title": "Packages",
	                    "package_type": "MULTI/INCL",
	                    "amount": "30",
	                    "expense_details": [
	                        {
	                            "is_inclusive": "true",
	                            "price": "10",
	                            "package": "parking"
	                        },
	                        {
	                            "is_inclusive": "false",
	                            "price": "50",
	                            "package": "golf"
	                        }
	                    ]
	                }
	            ],
	            "group_items": [
	                {
	                    "title": "Parking",
	                    "amount": "100",
	                    "expense_details": [
	                        {
	                            "expense": "50",
	                            "location": "Hotel parking",
	                            "date": "09-03-2013"
	                        },
	                        {
	                            "expense": "50",
	                            "location": "Hotel parking",
	                            "date": "10-03-2013"
	                        }
	                    ]
	                },
	                {
	                    "title": "BAR",
	                    "amount": "50",
	                    "expense_details": [
	                        {
	                            "expense": "25",
	                            "location": "Hotel Bar",
	                            "date": "09-03-2013"
	                        },
	                        {
	                            "expense": "25",
	                            "location": "Hotel Bar",
	                            "date": "10-03-2013"
	                        }
	                    ]
	                }
	            ],
	            "total_fees": [
	                {
	                    "total_amount": "662",
	                    "balance_amount": "662",
	                    "fees_date": "10-03-2013",
	                    "fees_details": [
	                        {
	                            "type": "ROOM",
	                            "date": "09-03-2013",
	                            "description": [
	                                {
	                                    "fees_desc": "Guestroom: BestRateAvailable",
	                                    "fees_amount": "149.98"
	                                },
	                                {
	                                    "fees_desc": "Guestroom: BestRateAvailable",
	                                    "fees_amount": "149.98"
	                                }
	                            ],
	                            "credits": []
	                        },
	                        {
	                            "type": "ROOM",
	                            "date": "09-03-2013",
	                            "description": [
	                                {
	                                    "fees_desc": "Guestroom: BestRateAvailable",
	                                    "fees_amount": "149.98"
	                                },
	                                {
	                                    "fees_desc": "MDsalesTax",
	                                    "fees_amount": "12.98"
	                                }
	                            ],
	                            "credits": []
	                        },
	                        {
	                            "type": "PARKING",
	                            "date": "09-03-2013",
	                            "description": [],
	                            "credits": []
	                        }
	                    ]
	                }
	            ]
	        }]
		};
}]);