;(function(angular){
  var indexOf = [].indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (i in this && this[i] === item) return i;
    }
    return -1;
  };

  angular.module('pickadate.utils', [])
    .factory('pickadateUtils', ['dateFilter', function(dateFilter) {
      return {
        isDate: function(obj) {
          return Object.prototype.toString.call(obj) === '[object Date]';
        },

        stringToDate: function(dateString) {
          if (this.isDate(dateString)) return new Date(dateString);
          var dateParts = dateString.split('-'),
            year  = dateParts[0],
            month = dateParts[1],
            day   = dateParts[2];

          // set hour to 3am to easily avoid DST change
          return new Date(year, month - 1, day, 3);
        },

        dateRange: function(first, last, initial, format) {
          var date, i, _i, dates = [];

          if (!format) format = 'yyyy-MM-dd';

          for (i = _i = first; first <= last ? _i < last : _i > last; i = first <= last ? ++_i : --_i) {
            date = this.stringToDate(initial);
            date.setDate(date.getDate() + i);
            dates.push(dateFilter(date, format));
          }
          return dates;
        }
      };
    }]);

  angular.module('pickadate', ['pickadate.utils'])

    .directive('pickadate', ['$locale', 'pickadateUtils', 'dateFilter', function($locale, dateUtils, dateFilter) {
      return {
        require: 'ngModel',
        scope: {
          date: '=ngModel',
          minDate: '=',
          maxDate: '=',
          disabledDates: '=',
          isDateSelected: '='
        },
        templateUrl:'../../assets/directives/Calendar/adCalendar.html' ,
            link: function(scope, element, attrs, ngModel)  {
          var minDate       = scope.minDate && dateUtils.stringToDate(scope.minDate),
              maxDate       = scope.maxDate && dateUtils.stringToDate(scope.maxDate),
              disabledDates = scope.disabledDates || [],
         
          /*
          * check if month is present or next 
          */
   
          currentDate   = new Date(scope.date);
          scope.dayNames    = $locale.DATETIME_FORMATS['SHORTDAY'];
          scope.currentDate = currentDate;

          console.log( $locale );

          scope.render = function(initialDate) {
            initialDate = new Date(initialDate.getFullYear(), initialDate.getMonth(), 1, 3);

            var currentMonth    = initialDate.getMonth() + 1,
              dayCount          = new Date(initialDate.getFullYear(), initialDate.getMonth() + 1, 0, 3).getDate(),
              prevDates         = dateUtils.dateRange(-initialDate.getDay(), 0, initialDate),
              currentMonthDates = dateUtils.dateRange(0, dayCount, initialDate),
              lastDate          = dateUtils.stringToDate(currentMonthDates[currentMonthDates.length - 1]),
              nextMonthDates    = dateUtils.dateRange(1, 7 - lastDate.getDay(), lastDate),
              allDates          = prevDates.concat(currentMonthDates, nextMonthDates),
              dates             = [],
              today             = dateFilter(new Date(), 'yyyy-MM-dd');

            var nextMonthInitialDate = new Date(initialDate);
            nextMonthInitialDate.setMonth(currentMonth);

            scope.allowPrevMonth = !minDate || initialDate > minDate;
            scope.allowNextMonth = !maxDate || nextMonthInitialDate < maxDate;

            for (var i = 0; i < allDates.length; i++) {
              var className = "", date = allDates[i];

              if ( dateFilter(date, 'M') !== currentMonth.toString() ) {
                className = 'pickadate-disabled pickadate-outofrange-disabled';
              } else if (date < scope.minDate || date > scope.maxDate) {
                className = 'pickadate-disabled';
              } else if (indexOf.call(disabledDates, date) >= 0) {
                className = 'pickadate-disabled pickadate-unavailable';
              } else {
                className = 'pickadate-enabled';
              }

              if (date === today) {
                className += ' pickadate-today';
              }

              dates.push({date: date, className: className});
            }

            scope.dates = dates;
          };

       

          scope.setDate = function(dateObj) {
            
            if (isDateDisabled(dateObj)) return;
            ngModel.$setViewValue(dateObj.date);
          };

          scope.dateClicked = function(dateObj){
           
            if(dateObj.className != "pickadate-disabled"){
              scope.isDateSelected = true;
              scope.setDate(dateObj);
            }
          };

          ngModel.$render = function () {
            if ((date = ngModel.$modelValue) && (indexOf.call(disabledDates, date) === -1)) {
              scope.currentDate = currentDate = dateUtils.stringToDate(date);
            } else if (date) {
              // if the initial date set by the user is in the disabled dates list, unset it
              scope.setDate(undefined);
            }
            scope.render(currentDate);
          };

          /*
          * set up data to be displayed
          */
          scope.todayDate = dateFilter(new Date(), 'yyyy-MM-dd');
          scope.years = [];
          scope.yearSelected = currentDate.getFullYear();
          for(year=2014;year<=2100;year++){
            scope.years.push(year);
          };
          scope.weekDays = ['SU','MO','TU','WE','TH','FR','SA'];

          scope.months=[{'name':'January','value':'0'},
                        {'name':'February','value':'1'},
                        {'name':'March','value':'2'},
                        {'name':'April','value':'3'},
                        {'name':'May','value':'4'},
                        {'name':'June','value':'5'},
                        {'name':'July','value':'6'},
                        {'name':'August','value':'7'},
                        {'name':'September','value':'8'},
                        {'name':'October','value':'9'},
                        {'name':'November','value':'10'},
                        {'name':'December','value':'11'}]

          scope.monthSelected = {'name':'January','value':'0'};

          scope.changeMonth = function (offset,emit) {
            // If the current date is January 31th, setting the month to date.getMonth() + 1
            // sets the date to March the 3rd, since the date object adds 30 days to the current
            // date. Settings the date to the 2nd day of the month is a workaround to prevent this
            // behaviour
            currentDate.setDate(1);
            currentDate.setMonth(currentDate.getMonth() + offset);
            scope.render(currentDate);

            var year  = currentDate.getFullYear();
            scope.yearSelected =year;

            var month = currentDate.getMonth();
            scope.monthSelected = scope.months[month];

            if(scope.$$nextSibling && scope.$$nextSibling.date && emit != false){
                scope.$emit('fromDateChanged');
             }
          };

          /*
          * watch for any change in year
          */       

          scope.$watch('yearSelected',function(){
            currentDate.setDate(1);
            currentDate.setFullYear(scope.yearSelected);
            scope.render(currentDate);
            if(scope.$$nextSibling && scope.$$nextSibling.date){
                scope.$emit('fromDateChanged');
             }
          })
       
          /*
          * initial set up of month
          */ 
         
          var currentMonth = currentDate.getMonth(); 
          
          for(i=0;i<=scope.months.length-1;i++){
    
            if(scope.months[i].value== currentMonth)
              scope.monthSelected = scope.months[i]; 
          };
           /*
          * watch for any change in month
          */ 

          scope.$watch('monthSelected.value',function(){     
             currentDate.setDate(1);
             currentDate.setMonth(scope.monthSelected.value);
             scope.render(currentDate);
             if(scope.$$nextSibling && scope.$$nextSibling.date){
                scope.$emit('fromDateChanged');
             }
          });
          

          function isDateDisabled(dateObj) {
            return (/pickadate-disabled/.test(dateObj.className));
          }

        }
      };
    }]);
})(window.angular);