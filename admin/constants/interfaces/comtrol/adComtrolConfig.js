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
        {id: 0, value: 'PMS'},
        {id: 1, value: 'PBX'},
        {id: 2, value: 'Call Accounting'},
        {id: 3, value: 'In-Room Movies'},
        {id: 4, value: 'Keyless Entry'},
        {id: 5, value: 'Internet Access'},
        {id: 6, value: 'Interactive Gaming'},
        {id: 7, value: 'In-Room Safe'},
        {id: 8, value: 'Point of Sale'},
        {id: 9, value: 'Minibar'},
        {id: 10, value: 'Voice Mail'}
    ]
})));