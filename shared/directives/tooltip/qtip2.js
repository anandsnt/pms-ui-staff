angular.module('qtip2', [])
  .directive('qtip', function($compile) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var my = attrs.my || 'bottom center',
          at = attrs.at || 'top center',
          qtipClass = attrs.class || 'qtip',
          content

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
                    $.ajax({
                        url: api.elements.target.attr('content') // Use href attribute as URL
                    })
                    .then(function(content) {
                        // Set the tooltip content upon successful retrieval
                        api.set('content.text', $compile(content)(scope));
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
          style: 'tooltip'
        })
      }
    }
  })