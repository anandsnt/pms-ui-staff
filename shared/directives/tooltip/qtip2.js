angular.module('qtip2', [])
  .directive('qtip', function($compile, $filter) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var my = attrs.my || 'bottom center',
          at = attrs.at || 'top center',
          qtipClass = attrs.class || 'qtip-tipsy',
          content,
          htmlString,
          category // variable to handle dynamic content tooltip( for eg: dateRange, rateType) - this should be passed as element attr

        // tooltipText = $compile($('#invoiceTooltipTemplate').html())(scope);
        if (attrs.title) {
          content = {
            'title': attrs.title,
            'text': attrs.content
          }
        } else {
          content = attrs.content
        }

        $(element).qtip({
          content: {
            text: function(event, api) {
              category = api.elements.target.attr('category');
              $.ajax({
                url: api.elements.target.attr('url') // Use href attribute as URL
              })
                .then(function(resultSet) {

                  switch (category) {
                    case 'dateRange':
                      htmlString = "<ul>";
                      angular.forEach(resultSet, function(result, index) {
                        var beginDate = $filter('date')(result.begin_date, "MMM dd, yyyy");
                        var endDate = $filter('date')(result.begin_date, "MMM dd, yyyy");
                        htmlString += "<li>" + beginDate + " to " + endDate + "</li>";
                      });
                      htmlString += "</ul>";
                      break;
                    case 'rateType':
                      htmlString = "<ul>";
                      content.title = resultSet.total_count + " " + content.title;
                      angular.forEach(resultSet.results, function(result, index) {
                        htmlString += "<li ng-click=editRatesClicked(" + result.id + "," + index + ")>" + result.name + "</li>";
                      });
                      htmlString += "</ul>";
                      break;
                  }
                  // Set the tooltip content upon successful retrieval
                  api.set('content.title', content.title);
                  api.set('content.text', $compile(htmlString)(scope));
                }, function(xhr, status, error) {
                  // Upon failure... set the tooltip content to error
                  api.set('content.text', status + ': ' + error);
                });

              return 'Loading...'; // Set some initial text
            }
          },
          position: {
            my: my,
            at: at,
            target: element
          },
          hide: {
            fixed: true,
            delay: 100
          },
          style: 'qtip-snt'
        })
      }
    }
  })