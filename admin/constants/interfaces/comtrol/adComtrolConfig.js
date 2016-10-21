angular.module('admin').constant("COMTROL_REF", Object.freeze(Object.seal({
    PHONE_CALL_TYPES: [
        {code: 'O', value: 'Operator-assisted'},
        {code: 'M', value: 'Metered Pulses (SMDR)'},
        {code: 'L', value: 'Local'},
        {code: 'I', value: 'Information'},
        {code: 'F', value: "Foreign (Int'l)"},
        {code: 'C', value: 'Credit Card'},
        {code: 'D', value: 'Long Distance'}
    ],
    FOLIO_POSTING_TRANSACTION_CODE: [
        {id: 0, value: 'PMS', code: 'pms'},
        {id: 1, value: 'PBX', code: 'pbx'},
        {id: 2, value: 'Call Accounting', code: 'call_accounting'},
        {id: 3, value: 'In-Room Movies', code: 'in_room_movies'},
        {id: 4, value: 'Keyless Entry', code: 'keyless_entry'},
        {id: 5, value: 'Internet Access', code: 'internet_access'},
        {id: 6, value: 'Interactive Gaming', code: 'interactive_gaming'},
        {id: 7, value: 'In-Room Safe', code: 'in_room_safe'},
        {id: 8, value: 'Point of Sale', code: 'point_of_sale'},
        {id: 9, value: 'Minibar', code: 'minibar'},
        {id: 10, value: 'Voice Mail', code: 'voice_mail'}
    ]
})));