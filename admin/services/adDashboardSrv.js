admin.service('ADDashboardSrv',['$http', '$q', function($http, $q){

	var _this = this;

	this.fetch = function(){
		this.data = {"menus":[
							{
								"menu_id":1,
								"menu_name":"Hotel & Staff",
								"header_name":"Hotel & Staff setup",
								"components":[
									{
										"id":1,
										"name":"Hotel Details",
										"state": "admin.hoteldetails",
										"action_path":"/admin/hotels/1/",
										"is_group":false,
										"icon_class":"icon-hotel",
										"sub_components":[],
										"is_bookmarked":false
									},
					                {
					                    "id": 2,
					                    "name": "User Setup",
					                    "action_path": "/admin/users",
					                    "is_group": false,
					                    "icon_class": "icon-user",
					                    "sub_components": [],
					                    "is_bookmarked": false,
					                    "state":"admin.users"
					                },
					                {
					                    "id": 3,
					                    "name": "Departments",
					                    "action_path": "/admin/departments",
					                    "is_group": false,
					                    "icon_class": "icon-admin-menu icon-departments",
					                    "sub_components": [],
					                    "is_bookmarked": false,
					                    "state":"admin.hoteldetails"
					                }
								]
							},

					        {
					            "menu_id": 2,
					            "menu_name": "Zest",
					            "header_name": "Zest setup",
					            "components": [
					                {
					                    "id": 4,
					                    "name": "Hotel Announcements",
					                    "action_path": "/admin/hotel/get_announcements_settings",
					                    "is_group": false,
					                    "icon_class": "icon-admin-menu icon-announcement",
					                    "sub_components": [],
					                    "is_bookmarked": false,
					                    "state":"admin.hoteldetails"
					                },
					                {
					                    "id": 5,
					                    "name": "Social Lobby",
					                    "action_path": "/admin/hotel/get_social_lobby_settings",
					                    "is_group": false,
					                    "icon_class": "icon-admin-menu icon-lobby",
					                    "sub_components": [],
					                    "is_bookmarked": false,
					                    "state":"admin.hoteldetails"
					                },
					                {
					                    "id": 6,
					                    "name": "Guest Reviews",
					                    "action_path": "/admin/get_review_settings",
					                    "is_group": false,
					                    "icon_class": "icon-admin-menu icon-reviews",
					                    "sub_components": [],
					                    "is_bookmarked": false,
					                    "state":"admin.hoteldetails"
					                },
					                {
					                    "id": 7,
					                    "name": "Messages",
					                    "action_path": "#",
					                    "is_group": false,
					                    "icon_class": "icon-admin-menu icon-messages",
					                    "sub_components": [],
					                    "is_bookmarked": false,
					                    "state":"admin.hoteldetails"
					                },
					                {
					                    "id": 8,
					                    "name": "Check In",
					                    "action_path": "/admin/checkin_setups/list_setup",
					                    "is_group": false,
					                    "icon_class": "icon-admin-menu icon-check-in",
					                    "sub_components": [],
					                    "is_bookmarked": false,
					                    "state":"admin.hoteldetails"
					                },
					                {
					                    "id": 9,
					                    "name": "Check Out",
					                    "action_path": "/admin/get_checkout_settings",
					                    "is_group": false,
					                    "icon_class": "icon-admin-menu icon-check-out",
					                    "sub_components": [],
					                    "is_bookmarked": false,
					                    "state":"admin.hoteldetails"
					                },
					                {
					                    "id": 10,
					                    "name": "My Account",
					                    "action_path": "#",
					                    "is_group": false,
					                    "icon_class": "icon-admin-menu icon-profile",
					                    "sub_components": [],
					                    "is_bookmarked": false,
					                    "state":"admin.hoteldetails"
					                }
					            ]
					        },
					        {
					            "menu_id": 3,
					            "menu_name": "Promos & Upsell",
					            "header_name": "Promos & Upsell setup",
					            "components": [
					                {
					                    "id": 11,
					                    "name": "Upsell Rooms",
					                    "action_path": "/admin/room_upsells/room_upsell_options",
					                    "is_group": false,
					                    "icon_class": "icon-admin-menu icon-upsell-rooms",
					                    "sub_components": [],
					                    "is_bookmarked": false,
					                    "state":"admin.hoteldetails"
					                },
					                {
					                    "id": 12,
					                    "name": "Upsell Late Checkout",
					                    "action_path": "/admin/hotel/get_late_checkout_setup",
					                    "is_group": false,
					                    "icon_class": "icon-admin-menu icon-upsell-checkout",
					                    "sub_components": [],
					                    "is_bookmarked": false,
					                    "state":"admin.hoteldetails"
					                }
					            ]
					        },
					        {
					            "menu_id": 4,
					            "menu_name": "Guest Cards",
					            "header_name": "Guest Cards setup",
					            "components": [
					                {
					                    "id": 13,
					                    "name": "Likes",
					                    "action_path": "/admin/hotel_likes/get_hotel_likes",
					                    "is_group": false,
					                    "icon_class": "icon-admin-menu icon-likes",
					                    "sub_components": [],
					                    "is_bookmarked": false,
					                    "state":"admin.hoteldetails"
					                },
					                {
					                    "id": 14,
					                    "name": "Frequent Flyer Program",
					                    "action_path": "/admin/hotel/list_ffps",
					                    "is_group": false,
					                    "icon_class": "icon-admin-menu icon-ffp",
					                    "sub_components": [],
					                    "is_bookmarked": false,
					                    "state":"admin.hoteldetails"
					                },
					                {
					                    "id": 15,
					                    "name": "Hotel Loyalty Program",
					                    "action_path": "/admin/hotel/list_hlps",
					                    "is_group": false,
					                    "icon_class": "icon-admin-menu icon-loyalty",
					                    "sub_components": [],
					                    "is_bookmarked": false,
					                    "state":"admin.hoteldetails"
					                }
					            ]
					        },
        {
            "menu_id": 5,
            "menu_name": "Rooms",
            "header_name": "Rooms setup",
            "components": [
                {
                    "id": 16,
                    "name": "Room types",
                    "action_path": "/admin/room_types",
                    "is_group": false,
                    "icon_class": "icon-admin-menu icon-room-types",
                    "sub_components": [],
                    "is_bookmarked": false,
                    "state":"admin.hoteldetails"
                },
                {
                    "id": 17,
                    "name": "Rooms",
                    "action_path": "/admin/hotel_rooms",
                    "is_group": false,
                    "icon_class": "icon-room",
                    "sub_components": [],
                    "is_bookmarked": false,
                    "state":"admin.hoteldetails"
                },
                {
                    "id": 18,
                    "name": "Room Key Delivery",
                    "action_path": "/admin/get_room_key_delivery_settings",
                    "is_group": false,
                    "icon_class": " icon-admin-menu icon-key",
                    "sub_components": [],
                    "is_bookmarked": false,
                    "state":"admin.hoteldetails"
                }
            ]
        },
        {
            "menu_id": 6,
            "menu_name": "Financials",
            "header_name": "Financials setup",
            "components": [
                {
                    "id": 19,
                    "name": "Charge Groups",
                    "action_path": "/admin/charge_groups",
                    "is_group": false,
                    "icon_class": "icon-charge-group",
                    "sub_components": [],
                    "is_bookmarked": false,
                    "state":"admin.hoteldetails"
                },
                {
                    "id": 20,
                    "name": "Payment methods",
                    "action_path": "/admin/hotel_payment_types",
                    "is_group": false,
                    "icon_class": "icon-admin-menu icon-payment",
                    "sub_components": [],
                    "is_bookmarked": false,
                    "state":"admin.hoteldetails"
                },
                {
                    "id": 21,
                    "name": "Charge Codes",
                    "action_path": "/admin/charge_codes/list",
                    "is_group": false,
                    "icon_class": "icon-charge-code",
                    "sub_components": [],
                    "is_bookmarked": false,
                    "state":"admin.hoteldetails"
                },
                {
                    "id": 22,
                    "name": "Items",
                    "action_path": "/admin/items/get_items",
                    "is_group": false,
                    "icon_class": "icon-charge",
                    "sub_components": [],
                    "is_bookmarked": false,
                    "state":"admin.hoteldetails"
                }
            ]
        },
        {
            "menu_id": 7,
            "menu_name": "Rates",
            "header_name": "Rates setup",
            "components": [
                {
                    "id": 23,
                    "name": "Rates",
                    "action_path": "/admin/rates",
                    "is_group": false,
                    "icon_class": "icon-admin-menu icon-rate",
                    "sub_components": [],
                    "is_bookmarked": false,
                    "state":"admin.hoteldetails"
                },
                {
                    "id": 24,
                    "name": "Rate Types",
                    "action_path": "/admin/hotel_rate_types",
                    "is_group": false,
                    "icon_class": "icon-admin-menu icon-rate-types",
                    "sub_components": [],
                    "is_bookmarked": false,
                    "state":"admin.hoteldetails"
                }
            ]
        },
        {
            "menu_id": 8,
            "menu_name": "Reservations",
            "header_name": "Reservations setup",
            "components": []
        },
        {
            "menu_id": 9,
            "menu_name": "Interfaces",
            "header_name": "Interfaces setup",
            "components": [
                {
                    "id": 25,
                    "name": "External Mappings",
                    "action_path": "#",
                    "is_group": false,
                    "icon_class": "icon-admin-menu icon-external",
                    "sub_components": [],
                    "is_bookmarked": false,
                    "state":"admin.hoteldetails"
                },
                {
                    "id": 61,
                    "name": "Interface Mappings",
                    "action_path": "/admin/interface_mapping",
                    "is_group": false,
                    "icon_class": "icon-admin-menu icon-external",
                    "sub_components": [],
                    "is_bookmarked": true,
                    "state":"admin.interfaceMapping"
                },
                {
                    "id": 26,
                    "name": "External PMS Web Services",
                    "action_path": "/admin/get_pms_connection_config",
                    "is_group": false,
                    "icon_class": "icon-pms",
                    "sub_components": [],
                    "is_bookmarked": false,
                    "state":"admin.hoteldetails"
                }
            ]
        }
						]
					};
		return this.data;
	};

	this.fetchSNT = function(){
		this.data = {"menus":[
							{
								"menu_id":1,
								"menu_name":"Hotels",
								"header_name":"Hotels",
								"components":[
									{
										"id":1,
										"name":"Hotels",
										"state": "admin.hoteldetails",
										"action_path":"/admin/hotels/1/",
										"is_group":false,
										"icon_class":"icon-hotel",
										"sub_components":[],
										"is_bookmarked":false
									},
					                {
					                    "id": 2,
					                    "name": "Chains",
					                    "action_path": "/admin/users",
					                    "is_group": false,
					                    "icon_class": "icon-user",
					                    "sub_components": [],
					                    "is_bookmarked": false,
					                    "state":"admin.hoteldetails"
					                },
					                {
					                    "id": 3,
					                    "name": "Brands",
					                    "action_path": "/admin/departments",
					                    "is_group": false,
					                    "icon_class": "icon-admin-menu icon-departments",
					                    "sub_components": [],
					                    "is_bookmarked": false,
					                    "state":"admin.hoteldetails"
					                }
								]
							},
							{
								"menu_id":2,
								"menu_name":"Dashboard",
								"header_name":"Dashboard",
								"components":[]
							},
							{
								"menu_id":4,
								"menu_name":"Configuration",
								"header_name":"Configuration",
								"components":[]
							}
						]
					};
		return this.data;
	};
}]);