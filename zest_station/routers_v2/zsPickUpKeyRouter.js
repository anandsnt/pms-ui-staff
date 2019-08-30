sntZestStation.config(['$stateProvider',
    function($stateProvider) {
        // checkin reservation search
        $stateProvider.state('zest_station.qrPickupKey', {
            url: '/qrPickupKey',
            templateUrl: '/assets/partials_v2/pickupKey/zsQRPickupKey.html',
            controller: 'zsQrPickupKeyCtrl',
            jumper: true,
            section: 'Pickup',
            label: 'Pickup Keys - QR Code',
            icon: 'pickup_keys.png'
        });

        // pickup key dispense
        $stateProvider.state('zest_station.pickUpKeyDispense', {
            url: '/pickUpKeyDispense',
            params: {
                reservation_id: '',
                room_no: '',
                first_name: '',
                isQuickJump: '',
                quickJumpMode: ''
            },
            templateUrl: '/assets/partials_v2/pickupKey/zsPickupKeyDispense.html',
            controller: 'zsPickupKeyDispenseCtrl',
            jumper: true,
            section: 'Pickup',
            label: 'Pickup Keys',
            // Views With modes only show modes + mode descriptions
            modes: [{
                'name': 'DISPENSE_KEY_MODE',
                'label': 'Select How Many Keys',
                'description': 'Select how many keys to create',
                'icon': 'pickup_keys.png'
            }, {
                'name': 'SOLO_KEY_CREATION_IN_PROGRESS_MODE',
                'label': 'Key 1 Dispense In-Progress',
                'description': 'User Selected [1] key and it is in-progress',
                'icon': 'pickup_solo_progress.png'
            }, {
                'name': 'KEY_CREATION_SUCCESS_MODE',
                'label': 'Key 1 of 1 Success & Key 2 of 2 Success',
                'description': 'Completed Pickup Key(s), final screen in pickup key flow, common screen',
                'icon': 'pickup_one_of_one_success.png'
            }, {
                'name': 'KEY_ONE_CREATION_IN_PROGRESS_MODE',
                'label': 'Key 1 of 2 In-Progress',
                'description': 'User Selected [2] keys and #[1] is in-progress',
                'icon': 'pickup_two_key_one_progress.png'
            }, {
                'name': 'KEY_ONE_CREATION_SUCCESS_MODE',
                'label': 'Key 1 of 2 Success',
                'description': 'Ready to make key [2], [press ready] or auto-start',
                'icon': 'pickup_two_key_one_success.png'
            }, {
                'name': 'DISPENSE_KEY_FAILURE_MODE',
                'label': 'Key Failed to Create or Dispense',
                'description': 'When Failure occurs in the key creation or dispense process',
                'icon': 'pickup_dispense_key_fail.png'
            }, {
                'name': 'KEY_ONE_SUCCESS_KEY_TWO_FAILED',
                'label': 'Retry Failed Key 2',
                'description': 'When Key 1 succeds but key 2 failed, user re-tries',
                'icon': 'pickup_dispense_key_two_fail_retry.png'
            }]

        });

        // pickup key reg card print
        $stateProvider.state('zest_station.pickUpKeyDispenseRegistrationCardPrint', {
            url: '/pickUpKeyDispenseRegistrationCardPrint',
            params: {
                reservation_id: '',
                key_created: ''
            },
            templateUrl: '/assets/partials_v2/pickupKey/zsPickupKeyRegistartionCardPrint.html',
            controller: 'zsPickupKeyRegistartionCardPrintCtrl',
            jumper: true,
            section: 'Pickup',
            icon: 'pickup_final.png',
            label: 'Pickup Registration Print'
        });
    }
]);
