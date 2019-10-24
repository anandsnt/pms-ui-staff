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

        var addZeroes = function(num) {
            var value = Number(num);
            var res = num.split(".");

            if (res.length === 1 || (res[1].length < 3)) {
                value = value.toFixed(2);
            }
            return value;
        };

        var prepandSpaceForAmount = function(str, length, zestStationData, amountSign) {

            var amountWithSign = (amountSign === "-") ? Math.abs(str) * Math.sign(str) * -1 : str;
            var amountString = addZeroes(amountWithSign.toString());

            while (amountString.length < length) {
                amountString = ' ' + amountString;
            }
            if (amountSign === "-") {
                amountString = Math.sign(str) === -1 ? amountString + " R" : amountString + " CR";
            }
            return amountString;

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
                hotelAddressString = hotelAddressString + component + "\n";
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
            addLinetoReceiptArray(receiptPrinterParams.receipt, "3");
            fullString = fullString + "\n\n";

            //  --------------------------------- GUEST ADDRESS --------------------------- //
            var streetName;
            
            if (printData.guest_details.street && printData.guest_details.street2) {
                streetName = printData.guest_details.street + " " + printData.guest_details.street2;
            } else if (printData.guest_details.street && !printData.guest_details.street2) {
                streetName = printData.guest_details.street;
            } else if (!printData.guest_details.street && printData.guest_details.street2) {
                streetName = printData.guest_details.street2;
            } else {
                streetName = null;
            }

            var postalCode = printData.guest_details.postal_code ? $filter('translate')('POSTAL_OR_ZIP_CODE') + ' ' + printData.guest_details.postal_code : null;

            var guestAddress = returnValidString(printData.guest_details.first_name) + " " + returnValidString(printData.guest_details.last_name) + "\n" +
                returnValidString(streetName, true) +
                returnValidString(printData.guest_details.city, true) +
                returnValidString(printData.guest_details.state, true) +
                returnValidString(postalCode, true) +
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
                            "Date  "+"Charge desc.               "+"   "+"Amount("+zestStationData.currency +")"+
                            "\n------------------------------------------------\n";

            addTextToReceiptArray(receiptPrinterParams.receipt, headerText);
            fullString = fullString + headerText;

            //  --------------------------------- CHARGE & DETAILS --------------------------- //

            var fullDetailsString = "";

            _.each(printData.full_charge_details_list, function(chargeDetail) {
                var amountSign = chargeDetail.is_charge_details ? '+' : '-';
                
                fullDetailsString = fullDetailsString + "\n" +
                    chargeDetail.date_in_day_month + " " +
                    addExtraCharactersForDescripton(chargeDetail.description, 27) +
                    "  " + prepandSpaceForAmount(chargeDetail.amount, 10, zestStationData, amountSign);
            });

            fullDetailsString = fullDetailsString + "\n------------------------------------------------\n";
            addTextToReceiptArray(receiptPrinterParams.receipt, fullDetailsString);
            fullString = fullString + fullDetailsString;

            //  --------------------------------- TOTAL BALANCE --------------------------- //
            var balanceText = $filter('translate')('INVOICE_TOTAL_BAL') + " " + printData.balance;
            
            while (balanceText.length < 40) {
                balanceText = ' ' + balanceText;
            }
            var totalBalanceText = "*****" + balanceText;

            totalBalanceText = totalBalanceText + "\n------------------------------------------------\n";
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
            addLinetoReceiptArray(receiptPrinterParams.receipt, "3");
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