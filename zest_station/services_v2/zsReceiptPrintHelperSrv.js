sntZestStation.service('zsReceiptPrintHelperSrv', [
    '$translate',
    '$filter',
    '$log',
    function($translate, $filter, $log) {

        var returnValidString = function(value, addNewLine) {
            if (value) {
                return addNewLine ? value + "\n" : value;
            } else {
                return '';
            }
        };

        var addExtraCharactersForDescripton = function(str, length) {
            str = str ? str : '';
            // we need to keep the character length same.
            // For smaller texts with length < 12  (length - 2) show full and then add ' ' afterwards
            // For larger texts with length >= 12 (length - 2) delete last two characters and add '.'
            if (str.length < length - 2) {
                while (str.length < length) {
                    str = str + ' ';
                }
            } else {
                str = str.substring(0, length - 2);
                while (str.length < length) {
                    str = str + '.';
                }
            }

            return str;
        };

        var prepandSpaceForAmount = function(str, length, zestStationData) {
            // To keep the string length equal, prepand ' '
            str = str ? zestStationData.currency + str : '';
            while (str.length < length) {
                str = ' ' + str;
            }
            return str;
        };

        var addTextToReceiptArray = function(array, text) {
            array.push({
                "type": "text",
                "data": text
            });
        };

        var addLinetoReceiptArray = function(array, noOfLines) {
            array.push({
                "type": "line",
                "data": noOfLines
            });
        };

        this.printerErrorCodeMappings = {
            "SUCCESS": "Print Success",
            "ERR_PARAM": "A",
            "ERR_CONNECT": "B",
            "ERR_TIMEOUT": "C",
            "ERR_MEMORY": "D",
            "ERR_ILLEGAL": "E",
            "ERR_PROCESSING": "F",
            "ERR_NOT_FOUND": "G",
            "ERR_IN_USE": "H",
            "ERR_TYPE_INVALID": "I",
            "ERR_DISCONNECT": "J",
            "ERR_ALREADY_OPENED": "K",
            "ERR_ALREADY_USED": "L",
            "ERR_BOX_COUNT_OVER": "M",
            "ERR_BOXT_CLIENT_OVER": "N",
            "ERR_UNSUPPORTED": "O",
            "ERR_FAILURE": "P"
        };


        this.setUpStringForReceiptBill = function(printData, zestStationData) {
            var fullString = ""; // for debugging
            var receiptPrinterParams = {
                'receipt': []
            };

            //  --------------------------------- HOTEL LOGO IMAGE --------------------------- //

            receiptPrinterParams.receipt.push({
                "type": "image",
                "data": returnValidString(zestStationData.hotel_template_logo)
            });
            addLinetoReceiptArray(receiptPrinterParams.receipt, "2");

            //  --------------------------------- HOTEL ADDRESS --------------------------- //

            var hotelAddressComponent = returnValidString(printData.hotel_address).split("<br>");
            var hotelAddressString = "";

            _.each(hotelAddressComponent, function(component) {
                hotelAddressString = component + "\n";
            });
            if (hotelAddressString) {
                addTextToReceiptArray(receiptPrinterParams.receipt, hotelAddressString);
            }
            fullString = fullString + hotelAddressString;
            addLinetoReceiptArray(receiptPrinterParams.receipt, "2");
            fullString = fullString + "\n\n";

            //  --------------------------------- INVOICE HEADER --------------------------- //

            receiptPrinterParams.receipt.push({
                "type": "text",
                "data": $filter('translate')('INVOICE_HEADER'),
                "attributes": {
                    "text_size": "2"
                }
            });

            fullString = fullString + $filter('translate')('INVOICE_HEADER');
            addLinetoReceiptArray(receiptPrinterParams.receipt, "2");
            fullString = fullString + "\n\n";

            //  --------------------------------- GUEST ADDRESS --------------------------- //

            var guestAddress = returnValidString(printData.guest_details.first_name) + " " + returnValidString(printData.guest_details.last_name) + "\n" +
                returnValidString(printData.guest_details.street + " " + printData.guest_details.street2, true) +
                returnValidString(printData.guest_details.city, true) +
                returnValidString(printData.guest_details.state, true) +
                returnValidString(printData.guest_details.postal_code, true) +
                returnValidString(printData.guest_details.country_name);

            addTextToReceiptArray(receiptPrinterParams.receipt, guestAddress);

            fullString = fullString + guestAddress;
            addLinetoReceiptArray(receiptPrinterParams.receipt, "2");
            fullString = fullString + "\n\n";

            //  --------------------------------- ROOM INFO --------------------------- //

            var roomInfoText = $filter('translate')('INVOICE_ROOM') + ": " + returnValidString(printData.room_number, true) +
                $filter('translate')('INVOICE_ARRIVAL') + ": " + returnValidString(printData.arrival_date, true) +
                $filter('translate')('INVOICE_DEPARTURE') + ": " + returnValidString(printData.departure_date, true) +
                $filter('translate')('GUESTS') + ": " + returnValidString(printData.no_of_guests);

            addTextToReceiptArray(receiptPrinterParams.receipt, roomInfoText);
            fullString = fullString + roomInfoText;

            var headerText = "\n------------------------------------------------\n"+
                            "Dep date"+ "   " + "Charge desc"+"     "+"Credit amt"+" "+"Charge amt"+
                            "\n------------------------------------------------\n";

            addTextToReceiptArray(receiptPrinterParams.receipt, headerText);
            fullString = fullString + headerText;

            //  --------------------------------- CHARGE DETAILS --------------------------- //

            var chargeDetailsString = "";

            _.each(printData.charge_details_list, function(chargeDetail) {
                chargeDetailsString = chargeDetailsString + "\n" +
                    chargeDetail.date + " " +
                    addExtraCharactersForDescripton(chargeDetail.description, 14) +
                    " " + prepandSpaceForAmount('', 9, zestStationData) +
                    "  " + prepandSpaceForAmount(chargeDetail.amount, 9, zestStationData);
            });
            addTextToReceiptArray(receiptPrinterParams.receipt, chargeDetailsString);
            fullString = fullString + chargeDetailsString;

            //  --------------------------------- CREDIT DETAILS --------------------------- //

            var creditDetailsString = "";

            _.each(printData.credit_details_list, function(creditDetail) {
                creditDetailsString = creditDetailsString + "\n" +
                    creditDetail.date + " " +
                    addExtraCharactersForDescripton(creditDetail.description, 14) +
                    " " + prepandSpaceForAmount(creditDetail.amount, 9, zestStationData) +
                    "  " + prepandSpaceForAmount('', 9, zestStationData);
            });
            addTextToReceiptArray(receiptPrinterParams.receipt, creditDetailsString);
            fullString = fullString + creditDetailsString;

            var seperatorText = "\n------------------------------------------------\n";

            addTextToReceiptArray(receiptPrinterParams.receipt, seperatorText);
            fullString = fullString + seperatorText;

            //  --------------------------------- TOTAL BALANCE --------------------------- //

            var totalBalanceText = "\n" + $filter('translate')('INVOICE_TOTAL_BAL') + ": " + zestStationData.currency + printData.balance + "\n";

            addTextToReceiptArray(receiptPrinterParams.receipt, totalBalanceText);
            fullString = fullString + totalBalanceText;
            $log.info(JSON.stringify(receiptPrinterParams));
            $log.info(fullString);

            return receiptPrinterParams;
        };

        this.setUpStringForReceiptRegCard = function(printRegCardData, zestStationData) {
            var fullString = ""; // for debugging
            var receiptPrinterParams = {
                'receipt': []
            };

            //  --------------------------------- HOTEL IMAGE --------------------------- //

            receiptPrinterParams.receipt.push({
                "type": "image",
                "data": returnValidString(zestStationData.hotel_template_logo)
            });
            addLinetoReceiptArray(receiptPrinterParams.receipt, "2");
            fullString = fullString + returnValidString(zestStationData.hotel_template_logo) + "\n\n";

            //  --------------------------------- ROOM NUMBER --------------------------- //

            addTextToReceiptArray(receiptPrinterParams.receipt, $filter('translate')('REGISTRATION_READY_PRINT_ROOM_NO'));
            addLinetoReceiptArray(receiptPrinterParams.receipt, "2");
            receiptPrinterParams.receipt.push({
                "type": "text",
                "data": printRegCardData.room_number,
                "attributes": {
                    "text_size": "2"
                }
            });
            addLinetoReceiptArray(receiptPrinterParams.receipt, "2");
            fullString = fullString + $filter('translate')('REGISTRATION_READY_PRINT_ROOM_NO') + "\n\n" + printRegCardData.room_number + "\n\n";

            //  -------------------------------- DEP DATE -------------------------------//

            var depDateString;

            if (zestStationData.isHourlyRateOn) {
                depDateString = $filter('translate')('REGISTRATION_READY_PRINT_DEPART_DATE') + printRegCardData.dep_date + '@' + printRegCardData.departure_time;
            } else {
                depDateString = $filter('translate')('REGISTRATION_READY_PRINT_DEPART_DATE') + printRegCardData.dep_date;
            }
            addTextToReceiptArray(receiptPrinterParams.receipt, depDateString);
            addLinetoReceiptArray(receiptPrinterParams.receipt, "2");
            fullString = fullString + depDateString + "\n\n";

            //--------------------------------- REG TEXT --------------------------------//

            addTextToReceiptArray(receiptPrinterParams.receipt, $filter('translate')('REGISTRATION_READY_PRINT_MSG_1'));
            addLinetoReceiptArray(receiptPrinterParams.receipt, "2");
            fullString = fullString + $filter('translate')('REGISTRATION_READY_PRINT_MSG_1') + "\n\n";

            //--------------------------------- FOOTER TEXT --------------------------------//

            addTextToReceiptArray(receiptPrinterParams.receipt, $filter('translate')('REGISTRATION_READY_PRINT_FOOTER'));
            addLinetoReceiptArray(receiptPrinterParams.receipt, "2");
            fullString = fullString + $filter('translate')('REGISTRATION_READY_PRINT_FOOTER') + "\n";
            $log.info(JSON.stringify(receiptPrinterParams));
            $log.info(fullString);

            return receiptPrinterParams;

        };

        this.setUpOwsMessageForReceiptPrinter = function(owsMsg, zestStationData) {
            var fullString = ""; // for debugging
            var receiptPrinterParams = {
                'receipt': []
            };

            //  --------------------------------- HOTEL IMAGE --------------------------- //

            receiptPrinterParams.receipt.push({
                "type": "image",
                "data": returnValidString(zestStationData.hotel_template_logo)
            });
            addLinetoReceiptArray(receiptPrinterParams.receipt, "2");
            fullString = fullString + returnValidString(zestStationData.hotel_template_logo) + "\n\n";

            //  --------------------------------- ROOM NUMBER --------------------------- //

            addTextToReceiptArray(receiptPrinterParams.receipt, owsMsg);
            addLinetoReceiptArray(receiptPrinterParams.receipt, "2");
            fullString = fullString + owsMsg;
            fullString = fullString + "\n\n";

            $log.info(JSON.stringify(receiptPrinterParams));
            $log.info(fullString);

            return receiptPrinterParams;
        };
    }
]);