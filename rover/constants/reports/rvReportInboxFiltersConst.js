/**
 * Angular constant containing the mapping between the filter param in api req/res
 * and the corresponding display value in report inbox details section
 */
angular.module('reportsModule')
    .constant('RVReportInboxFilterLabelConst', {
    	'from_date': 'Date Range (From)',
        'to_date': 'Date Range (To)',
        'cancel_from_date': 'Cancel From Date',
        'cancel_to_date': 'Cancel To Date',
        'arrival_from_date': 'Arrival From Date',
        'arrival_to_date': 'Arrival To Date',
        'group_from_date': 'Group Start Date',
        'group_to_date': 'Group End Date',
        'deposit_from_date': 'Deposit From Date',
        'deposit_to_date': 'Deposit To Date',
        'paid_from_date': 'Paid From Date',
        'paid_to_date': 'Paid To Date',
        'create_from_date': 'Create From Date',
        'create_to_date': 'Create To Date',
        'date': 'Date',
        'from_time': 'From Time',
        'to_time': 'To Time',
        'rate_ids': 'Rates',
        'assigned_departments': 'Departments',
        'include_guarantee_type': 'Guarantee Types',
        'market_ids': 'Markets',
        'segment_ids': 'Segments',
        'source_ids': 'Sources',
        'booking_origin_ids': 'Origin(s)',
        'hold_status_ids': 'Hold Status',
        'status_ids': 'Reservation Status',
        'room_type_ids': 'Room Types',
        'restriction_ids': 'Restrictions',
        'urls': 'URLS',
        'campaign_types': 'Campaign Types',
        'status': 'Completion Status',
        'age_buckets': 'Aging Balance',
        'account_ids': 'Accounts',
        'travel_agent_ids': 'Travel Agents',
        'floor': 'Floors',

        'sort_field': 'Sort By',
        'sort_dir': 'Sort Order',

        'OPTIONS': 'Option(s)',
        "deposit_due": "Deposit Due",
        "deposit_paid": "Deposit Paid",
        "deposit_past": "Deposit Past",
        "include_canceled": "Include Canceled",
        "include_market": "Include Market",
        "include_no_show": "Include No Show",
        "include_tax": "Include Tax",
        "show_adjustments": "Show Adjustments",
        "DISPLAY": "Display(s)",
        "include_origin": "Include Origin",
        "include_segment": "Include Segment",
        "include_source": "Include Source",
        "age_buckets": "Aging Balance",
        "account_ids": "Account Name(s)",
        "0to30": "0-30 DAYS",
        "31to60": "0-30 DAYS",
        "61to90": "0-30 DAYS",
        "91to120": "0-30 DAYS",
        "120plus": "0-30 DAYS",

        "actions_by": "Show",
        "origin": "Origin(s)",
        "urls": "URL(s)",
        "addon_group_ids": "Add-on Group(s)",
        "addon_ids": "Add-on(s)",
        "group_field": "Group By",
        "include_companycard_ta_group": "Company/TA/Group",
        "due_in_arrivals": "DUE IN ARRIVALS",
        "include_actions": "INCLUDE ACTIONS",
        "checked_in": "CHECKED IN",
        "checked_out": "CHECKED OUT",
        "CHECK IN/ CHECK OUT": "CHECK IN/ CHECK OUT",
        "SHOW": "SHOW",
        "show_company": "SHOW COMPANY",
        "show_travel_agent": "SHOW TRAVEL AGENTS",
        "min_revenue": "MIN REVENUE",
        "min_room_nights": "MIN NIGHTS",
        "include_ledger_data": "Include Ledger Data",
        "exceeded_only": "Exceeded Only",
        "include_due_out": "Include Due Out",
        "include_inhouse": "Include Inhouse",
        "rate_type_ids": "Rate Types",
        "charge_code_ids": "Charge Code(s)",
        "charge_group_ids": "Charge Group(s)",
        "due_out_departures": "Due Out Departures",
        "include_guest_notes": "Include Guest Notes",
        "include_reservation_notes": "Include Reservation Notes",
        "show_guests": "Show Guests",
        "vip_only": "Vip Only",
        "GUEST/ACCOUNT": "Guest/Account",
        "user_ids": "Employees",
        "exclude_non_gtd": " Exclude Non-Guaranteed",
        "include_group": "Group",
        "restricted_post_only": "Restricted Post Only",
        "rover": "Rover",
        "zest": "Zest",
        "zest_web": "Zest Web",
        "include_last_year": "Include Last Year",
        "include_variance": "Include Variance",
        "include_both": "Include Both",
        "include_new": "Include New",
        "show_rate_adjustments_only": "Show Rate Adjustments Only",
        "ooo": "OOO",
        "oos": "OOS",
        "min_number_of_days_not_occupied": "Min No of Days Not Occupied",
        "year": "Year",
        "COMPANY/TRAVEL_AGENT": "Company/Travel Agent",
        "exclude_tax": "Exclude Tax",
        "show_deleted_charges": "Show Deleted Charges",
        "account": "Account",
        "guest": "Guest",
        "include_cancelled": "Include Cancelled",
        "show_room_revenue": "Show Room Revenue",
        "with_vat_number": "With Vat Number",
        "without_vat_number": "Without Vat Number",
        "include_companycard_ta": "Include CC/TA"
        
    });