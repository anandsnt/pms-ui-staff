// function to add zeros(0) infront of a number, like 09 for 9 or 007 for 7
function getLengthChangedNumber(lengthWanted, number){

    if(typeof number === 'number')
        number = number.toString();

    var numberOfZerosToAppend = lengthWanted - number.length;
    //if numberOfZerosToAppend is zero or less, nothing to do
    if(numberOfZerosToAppend <= 0) {
        return number;
    }
    var zeros = "";
    for(var i = 1; i <= numberOfZerosToAppend; i++){
        zeros += "0";
    }
    return (zeros + number);
}

admin.directive('numberlisting', function() {

    return {
    	restrict: 'AE',
      	scope: {
            start: '@start',
	        stop : '@stop',
            step: '@step',
            minLength: '@minLength'
	    },

        controller: function($scope){
            $scope.numbers = [];
        },
    	link: function(scope, elem, attrs){
            scope.numbers = [];
            for (var i = parseInt(scope.start); i <= parseInt(scope.stop); i+=parseInt(scope.step)){
                number = getLengthChangedNumber(parseInt(scope.minLength), i);
                scope.numbers.push(number);
            }
        },
        template: "<select><option ng-repeat='item in numbers'>{{item}}</option></select>"


    };

});