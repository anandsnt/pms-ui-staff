angular.module('reportsModule')
    .constant('RVReportParamsConst', {
        'FROM_DATE': 'from_date',
        'TO_DATE': 'to_date',
        'CANCEL_FROM_DATE': 'cancel_from_date',
        'CANCEL_TO_DATE': 'cancel_to_date',
        'ARRIVAL_FROM_DATE': 'arrival_from_date',
        'ARRIVAL_TO_DATE': 'arrival_to_date',
        'GROUP_START_DATE': 'group_from_date',
        'GROUP_END_DATE': 'group_to_date',
        'DEPOSIT_FROM_DATE': 'deposit_from_date',
        'DEPOSIT_TO_DATE': 'deposit_to_date',
        'PAID_FROM_DATE': 'paid_from_date',
        'PAID_TO_DATE': 'paid_to_date',
        'CREATE_FROM_DATE': 'create_from_date',
        'CREATE_TO_DATE': 'create_to_date',
        'ADJUSTMENT_FROM_DATE': 'adjustment_from_date',
        'ADJUSTMENT_TO_DATE': 'adjustment_to_date',
        'SINGLE_DATE': 'date',

        'FROM_TIME': 'from_time',
        'TO_TIME': 'to_time',
        'SELECTED_LANGUAGE': 'locale',
        'SORT_FIELD': 'sort_field',
        'SORT_DIR': 'sort_dir',

        'GROUP_BY_DATE': 'group_by_date',
        'GROUP_BY_USER': 'group_by_user',
        'GROUP_BY_GROUP_NAME': 'group_by_group_name',
        'ADDON_GROUP_BY': 'group_field',
        'CHARGE_TYPE': 'group_by_charge_type',

        'USER_IDS': 'user_ids',
        'MARKET_IDS': 'market_ids',
        'SEGMENT_IDS': 'segment_ids',
        'SOURCE_IDS': 'source_ids',
        'BOOKING_ORIGIN_IDS': 'booking_origin_ids',
        'INCLUDE_GUARANTEE_TYPE': 'include_guarantee_type',
        'CHARGE_GROUP_IDS': 'charge_group_ids',
        'CHARGE_CODE_IDS': 'charge_code_ids',
        'HOLD_STATUS_IDS': 'hold_status_ids',
        'ADDONS_GROUPS_IDS': 'addon_group_ids',
        'ADDONS_IDS': 'addon_ids',
        'RESERVATION_STATUS': 'status_ids',
        'RESERVATION_ADDONS': 'addon_ids',
        'RATE_IDS': 'rate_ids',
        'RATE_TYPE_IDS': 'rate_type_ids',
        'RESTRICTION_IDS': 'restriction_ids',
        'ROOM_TYPE_IDS': 'room_type_ids',
        'RATE_ID': 'rate_id',
        'ORIGIN_VALUES': 'origin',
        'ORIGIN_URLS': 'urls',
        'CAMPAIGN_TYPES': 'campaign_types',
        'FLOOR': 'floor',
        'ASSIGNED_DEPARTMENTS': 'assigned_departments',
        'COMPLETION_STATUS': 'status',
        'AGING_BALANCE': 'age_buckets',
        'ACCOUNT_SEARCH': 'account_ids',
        "SHOW_ACTIONABLES": "actions_by",
        "TRAVEL_AGENTS": "travel_agent_ids",
        "TRAVEL_AGENTS_PER_PAGE_COUNT": 25,
        "RECEIPTS_PER_PAGE_COUNT": 25,
        "RESERVATION_STATUS_ARRAY": "status_ids[]",
        "VAT_YEAR": "year",
        "WITH_VAT_NUMBER": "with_vat_number",
        "WITHOUT_VAT_NUMBER": "without_vat_number",
        "DEPOSIT_DUE": "deposit_due",
        "DEPOSIT_PAID": "deposit_paid",
        "DEPOSIT_PAST": "deposit_past",
        "INCLUDE_CANCELED": "include_canceled",
        "INCLUDE_NO_SHOW": "include_no_show",
        "INCLUDE_TAX": "include_tax",
        'SHOW_DELETED_CHARGES': 'show_deleted_charges',
        "SHOW_ADJUSTMENTS": "show_adjustments",
        "INCLUDE_MARKET": "include_market",
        "INCLUDE_ORIGIN": "include_origin",
        "INCLUDE_SEGMENT": "include_segment",
        "INCLUDE_SOURCE": "include_source",
        "SHOW_ROOM_REVENUE": "show_room_revenue",
        "INCLUDE_ACTIONS": "include_actions",
        "INCLUDE_GUEST_NOTES": "include_guest_notes",
        "INCLUDE_RESERVATION_NOTES": "include_reservation_notes",
        "INCLUDE_COMPANYCARD_TA_GROUP": "include_companycard_ta_group",
        "DUE_IN_ARRIVALS": "due_in_arrivals",
        "CHECKED_IN": "checked_in",
        "CHECKED_OUT": "checked_out",
        "SHOW_TRAVEL_AGENT": "show_travel_agent",
        "SHOW_COMPANY": "show_company",
        "MIN_REVENUE": "min_revenue",
        "MIN_NIGHTS": "min_room_nights",
        "INCLUDE_LEDGER_DATA": "include_ledger_data",
        "EXCEEDED_ONLY": "exceeded_only",
        "INCLUDE_DUE_OUT": "include_due_out",
        "INCLUDE_INHOUSE": "include_inhouse",
        "SHOW_GUESTS": "show_guests",
        "VIP_ONLY": "vip_only",
        "ACCOUNT": "account",
        "GUEST": "guest",
        "EXCLUDE_NON_GTD": "exclude_non_gtd",
        "INCLUDE_GROUP": "include_group",
        "RESTRICTED_POST_ONLY": "restricted_post_only",
        "ROVER": "rover",
        "ZEST": "zest",
        "ZEST_WEB": "zest_web",
        "INCLUDE_LAST_YEAR": "include_last_year",
        "INCLUDE_VARIANCE": "include_variance",
        "INCLUDE_BOTH": "include_both",
        "INCLUDE_NEW": "include_new",
        "SHOW_RATE_ADJUSTMENTS_ONLY": "show_rate_adjustments_only",
        "OOO": "ooo",
        "OOS": "oos",
        "MIN_NO_OF_DAYS_NOT_OCCUPIED": "min_number_of_days_not_occupied",
        "EXCLUDE_TAX": "exclude_tax",
        "DUE_OUT_DEPARTURES": "due_out_departures",
        "INCLUDE_CANCELLED": "include_cancelled",
        "ENTITY_TYPE": 'entity_type',
        "INCLUDE_COMPANYCARD_TA": "include_companycard_ta",
        "NO_NATIONALITY": "no_nationality",
        "GROUP_COMPANY_TA_CARD": "group_company_ta_card",
        "GROUP_CODE": "group_code",
        "TAX_EXEMPT_TYPE": "tax_exempt_type_ids",
        "TA_CC_CARD": "ta_cc_card",
        "SHOW_VAT_WITH_RATES": "show_vat_with_rates",
        "COUNTRY": "country_ids",
        "INCLUDE_LONG_STAYS": "include_long_stays",
        "INCLUDE_DAYUSE": "include_day_use",
        "SHOW_UPSELL_ONLY": 'show_upsell_only',
        "ENTITY_NAME": "entity_name",
        "WORK_TYPE": "work_type_ids",
        "FRONT_OFFICE_STATUS": "fo_status_ids",
        "HOUSEKEEPING_STATUS": "hk_status_ids",
        "HK_RESERVATION_STATUSES": "hk_reservation_statuses",
        "HK_FRONT_OFFICE_STATUSES": "hk_fo_statuses",
        "TAX_RECEIPT_TYPE_VALUES": "tax_receipt_type_values"
    });
