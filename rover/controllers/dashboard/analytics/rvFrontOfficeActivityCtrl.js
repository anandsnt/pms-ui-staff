angular.module('sntRover')
  .controller('rvFrontOfficeActivityCtrl', ['$scope', 'sntActivity', '$timeout', '$filter', 'rvAnalyticsHelperSrv',
    function($scope, sntActivity, $timeout, $filter, rvAnalyticsHelperSrv) {

      $scope.drawFrontOfficeActivity = function(chartData) {

        $scope.screenData.mainHeading = $filter('translate')(chartData.label);


        var cssClassMappings = {        
          "Early Check in": "bar bar-green bar-dark",
          "Checkin": "bar bar-green bar-light",
          "VIP checkin": "bar bar-green",

          "VIP checkout": "bar bar-red bar-dark",
          "Late checkout": "bar bar-red bar-light",
          "Checkout": "bar bar-red"
        };

        /////// debuging code
        // TO DELETE

        // _.each(chartData.todays_data, function(item) {
        //   item.earlyCheckin = item.earlyCheckin < 2 ? _.random(10, 100) : item.earlyCheckin;
        //   item.checkin = item.checkin < 2 ? _.random(10, 100) : item.checkin;
        //   item.vipCheckin = item.vipCheckin < 2 ? _.random(10, 100) : item.vipCheckin;
        //   item.vipCheckout = item.vipCheckout < 2 ? _.random(10, 100) : item.vipCheckout;
        //   item.checkout = item.checkout < 2 ? _.random(10, 100) : item.checkout;
        //   item.lateCheckout = item.lateCheckout < 2 ? _.random(10, 100) : item.lateCheckout;
        // });

        // _.each(chartData.yesterdays_data, function(item) {
        //   item.earlyCheckin = item.earlyCheckin < 2 ? _.random(10, 100) : item.earlyCheckin;
        //   item.checkin = item.checkin < 2 ? _.random(10, 100) : item.checkin;
        //   item.vipCheckin = item.vipCheckin < 2 ? _.random(10, 100) : item.vipCheckin;
        //   item.vipCheckout = item.vipCheckout < 2 ? _.random(10, 100) : item.vipCheckout;
        //   item.checkout = item.checkout < 2 ? _.random(10, 100) : item.checkout;
        //   item.lateCheckout = item.lateCheckout < 2 ? _.random(10, 100) : item.lateCheckout;
        // });

        //////

        console.log("\n\n\n\n\n\n\n\n\n");
        console.log(JSON.stringify(chartData.todays_data));
        console.log("\n\n\n\n\n\n\n\n\n");
        console.log(JSON.stringify(chartData.yesterdays_data));
        console.log("\n\n\n\n\n\n\n\n\n");

        /////// debuging code ends here

        var emptyElement = {
          "earlyCheckin": 0,
          "checkin": 0,
          "vipCheckin": 0,
          "vipCheckout": 0,
          "checkout": 0,
          "lateCheckout": 0,
          "time": ""
        };

        chartData.todays_data.unshift(emptyElement);
        chartData.yesterdays_data.unshift(emptyElement);

        var w = 1024,
          h = 500,
          padding = 40;

        var svg = d3.select("#analytics-chart")
          .append("svg")
          .attr('width', w)
          .attr('height', h);

        var chartKeys = ['earlyCheckin', 'checkin', 'vipCheckin', 'vipCheckout', 'checkout', 'lateCheckout'];
        var stack = d3.stack()
          .keys(chartKeys);


        var datasets = [d3.stack().keys(chartKeys)(chartData.todays_data),
          d3.stack().keys(chartKeys)(chartData.yesterdays_data)
        ];

        var num_groups = datasets.length;

        var xlabels = chartData.todays_data.map(function(d) {
          return d['time'];
        });
        var xscale = d3.scaleBand()
                       .domain(xlabels)
                       .range([padding, w - padding])
                       .paddingInner(0.5);

        var ydomain_min = d3.min(datasets.flat()
                          .map(function(row) {
                            return d3.min(row.map(function(d) {
                              return d[1];
                            }));
                          }));

        var ydomain_max = d3.max(datasets.flat().map(function(row) {
          return d3.max(row.map(function(d) {
            return d[1];
          }));
        }));

        var yscale = d3.scaleLinear().domain([0, ydomain_max]).range([h - padding, padding]);

        // var todaysColorMapping = d3.scaleOrdinal()
        //   .range(["#BBC9B0", "#97C16D", "#EACC2B", "#A18709", "#DE3938", "#AC2625"])
        //   .domain(chartKeys);

        // var yesterdaysColorMapping = d3.scaleOrdinal()
        //   .range(["#D5DDCE", "#DDE6D2", "#F4EBC6", "#F4F4F1", "#F2ECEC", "#F2EAE9"])
        //   .domain(chartKeys);

        var colorMapping = d3.scaleOrdinal()
          .range(["#569819", "#9BD472", "#6ED420", "#E42715", "#E53318", "#E58A75"])
          .domain(chartKeys);

        var xaxis = d3.axisBottom(xscale);
        var yaxis = d3.axisLeft(yscale);

        d3.range(num_groups).forEach(function(gnum) {
          svg.selectAll('g.group' + gnum)
            .data(datasets[gnum])
            .enter()
            .append('g')
            // .attr('fill', function(d) {
            //   return gnum === 0 ? todaysColorMapping(d.key) : yesterdaysColorMapping(d.key);
            // })
            .attr('fill', function(d) {
              return colorMapping(d.key);
            })
            .attr('fill-opacity', function(d) {
              return gnum === 0 ? 1 : 0.3;
            })
            .attr('class', 'group' + gnum)
            .selectAll('rect').data(function(d) {
              return d;
            }).enter()
            .append('rect')
            .attr('x', function(d, i) {
              var xOffset = xscale(xlabels[i]) + xscale.bandwidth() / 2 * gnum;

              return xOffset + gnum * 2; // xOffset + some margin
            })
            .style("margin-right", "10px")
            .attr('y', function(d) {
              return yscale(d[1]);
            })
            .attr('width', function() {
              return (xscale.bandwidth() / num_groups);
            })
            .attr('height', function(d) {
              return yscale(d[0]) - yscale(d[1]);
            });
        });
        svg.append('g')
          .attr('class', 'axis x')
          .attr('transform', 'translate(0,' + (h - padding) + ")")
          .call(xaxis);

        svg.append('g')
          .attr('class', 'axis y')
          .attr('transform', 'translate(' + padding + ",0)")
          .call(yaxis);

        var rightSideLegendDiv = d3.select("#right-side-legend");
        var rightSideLegendColor = d3.scaleOrdinal()
          .range(["#BBC9B0", "#97C16D", "#EACC2B", "#A18709", "#DE3938", "#AC2625"])
          .domain(["Early Check in", "VIP checkin", "Checkin", "VIP checkout", "Checkout", "Late checkout"]);


        var rightSideLegendEntries = rightSideLegendDiv.selectAll("dd")
          .data(rightSideLegendColor.domain().slice())
          .enter()
          .append("dd")
          .attr("class", "legend-item")
          .attr("id", function(item) {
            return "left-legend-" + item.toLowerCase();
          });

        rightSideLegendEntries.append("span")
          .attr("class", function(label) {
            return cssClassMappings[label];
          });

        rightSideLegendEntries.append("span")
          .attr("class", "bar-label")
          .html(function(label) {
            return label;
          });

        var legendMarginTop = h / 4 + "px";

        $('#right-side-legend').css({
          "margin-top": legendMarginTop
        });
      };
    }
  ]);