sntZestStation.controller('zsReceiptPrintHelperCtrl', [
    '$scope',
    '$sce',
    '$translate',
    '$filter',
    function($scope, $sce, $translate, $filter) {

        var returnValueIfValid = function(value, addNewLine) {
            if (value) {
                return value = addNewLine ? value + "\n" : value;
            } else {
                return '';
            }
        };

        var addExtraCharactersForDescripton = function(str, length) {
            str = str ? str : '';
            str = str.substring(0, length - 2);
            var my_string = str;
            while (my_string.length < length) {
                my_string = my_string + '.';
            }

            return my_string;
        };

        var prepandSpaceForAmount = function(str, length) {
            str = str ? str : '';
            if(str) {
                str = $scope.zestStationData.currency + str;
            }
            var my_string = str;
            while (my_string.length < length) {
                my_string = ' ' + my_string;
            }

            return my_string;
        };


        $scope.setUpStringForReceiptBill = function(printData, zestStationData) {
            var fullString = "";
            var receiptPrinterParams = {
                'receipt': []
            };
            // --------------------------------- HOTEL IMAGE --------------------------- //
            receiptPrinterParams.receipt.push({
                "type": "image",
                "data": returnValueIfValid(zestStationData.hotel_template_logo)
            });

            receiptPrinterParams.receipt.push({
                "type": "line",
                "data": "2"
            });

            // --------------------------------- HOTEL ADDRESS --------------------------- //
            var hotelAddressComponent = returnValueIfValid(printData.hotel_address).split("<br>");
            var hotelAddressString = "";

            _.each(hotelAddressComponent, function(component) {
                hotelAddressString = component + "\n";
            });

            if (hotelAddressString) {
                receiptPrinterParams.receipt.push({
                    "type": "text",
                    "data": hotelAddressString
                });
            }
            fullString = fullString + hotelAddressString;

            receiptPrinterParams.receipt.push({
                "type": "line",
                "data": "2"
            });

            fullString = fullString + "\n\n";

            // --------------------------------- INVOICE HEADER --------------------------- //
            receiptPrinterParams.receipt.push({
                "type": "text",
                "data": $filter('translate')('INVOICE_HEADER'),
                "attributes": {
                    "text_size": "2"
                }
            });

            fullString = fullString + $filter('translate')('INVOICE_HEADER');

            receiptPrinterParams.receipt.push({
                "type": "line",
                "data": "2"
            });

            fullString = fullString + "\n\n";

            // --------------------------------- GUEST ADDRESS --------------------------- //
            var guestAddress = returnValueIfValid(printData.guest_details.first_name) + " " + returnValueIfValid(printData.guest_details.last_name) + "\n" +
                returnValueIfValid(printData.guest_details.street + " "+ printData.guest_details.street2, true) +
                returnValueIfValid(printData.guest_details.city, true) +
                returnValueIfValid(printData.guest_details.state, true) +
                returnValueIfValid(printData.guest_details.postal_code, true) +
                returnValueIfValid(printData.guest_details.country_name);

            receiptPrinterParams.receipt.push({
                "type": "text",
                "data": guestAddress
            });

            fullString = fullString + guestAddress;

            receiptPrinterParams.receipt.push({
                "type": "line",
                "data": "2"
            });
            fullString = fullString + "\n\n";
            
            // --------------------------------- ROOM INFO --------------------------- //
            var roomInfoText = $filter('translate')('INVOICE_ROOM') + ": " + returnValueIfValid(printData.room_number, true) +
                $filter('translate')('INVOICE_ARRIVAL') + ": " + returnValueIfValid(printData.arrival_date, true) +
                $filter('translate')('INVOICE_DEPARTURE') + ": " + returnValueIfValid(printData.departure_date, true) +
                $filter('translate')('GUESTS') + ": " + returnValueIfValid(printData.no_of_guests);

            receiptPrinterParams.receipt.push({
                "type": "text",
                "data": roomInfoText
            });
            fullString = fullString + roomInfoText;

            var headerText = "\n------------------------------------------------\nDep date   Charge desc     Credit amt Charge amt\n------------------------------------------------\n"
            receiptPrinterParams.receipt.push({
                "type": "text",
                "data": headerText
            });

            fullString = fullString + headerText;

            // --------------------------------- CHARGE DETAILS --------------------------- //
            var chargeDetailsString = "";

            _.each(printData.charge_details_list, function(chargeDetail) {
                chargeDetailsString = chargeDetailsString + "\n" + chargeDetail.date + " " + addExtraCharactersForDescripton(chargeDetail.description, 14) + " " + prepandSpaceForAmount('', 9) + "  " + prepandSpaceForAmount(chargeDetail.amount, 9);
            });

            receiptPrinterParams.receipt.push({
                "type": "text",
                "data": chargeDetailsString
            });

            fullString = fullString + chargeDetailsString;

            // --------------------------------- CREDIT DETAILS --------------------------- //
            var i=0;
            var creditDetailsString = "";
            for (i = 0; i <= 40; i++) {
                printData.charge_details_list.push({
                    date: '10/10/2018',
                    'description': 'Desc',
                    'amount': '30'
                })
            }
            _.each(printData.charge_details_list, function(creditDetail) {
                creditDetailsString = creditDetailsString + "\n" + creditDetail.date + " " + addExtraCharactersForDescripton(creditDetail.description, 14) + " " + prepandSpaceForAmount(creditDetail.amount, 9) + "  " + prepandSpaceForAmount('', 9);
            });

            receiptPrinterParams.receipt.push({
                "type": "text",
                "data": creditDetailsString
            });

            fullString = fullString + creditDetailsString;

            var seperatorText = "\n------------------------------------------------\n";
            receiptPrinterParams.receipt.push({
                "type": "text",
                "data": seperatorText
            });

            fullString = fullString + seperatorText;

            // --------------------------------- TOTAL BALANCE --------------------------- //
            var totalBalanceText = "\n" + $filter('translate')('INVOICE_TOTAL_BAL') + ": " + zestStationData.currency + printData.balance + "\n";
            receiptPrinterParams.receipt.push({
                "type": "text",
                "data": totalBalanceText
            });

            fullString = fullString + totalBalanceText;

            console.log(JSON.stringify(receiptPrinterParams));
            console.log(fullString);

            return receiptPrinterParams;
        };
    }
]);