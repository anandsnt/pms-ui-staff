sntRover.controller('RateMgrOccupancyGraphCtrl', ['$scope',
    function ($scope) {
        graph_data = [{
            "name": "Actual",
            "data": [[Date.UTC(2014, 3, 22), 30], [Date.UTC(2014, 3, 23), 40], [Date.UTC(2014, 3, 24), 70]],
            "color": "blue"
        }, {
            "name": "Target",
            "data": [[Date.UTC(2014, 3, 22), 60], [Date.UTC(2014, 3, 23), 50], [Date.UTC(2014, 3, 24), 60]],
            "color": "black"
        }]
        $scope.highchartsNG = {
            options: {
                chart: {
                    type: 'line',
                    className: "rateMgrOccGraph",
                    plotBackgroundColor: '#e0e0e0'
                },
                legend: {
                    rtl: true,
                    layout: 'vertical',
                    align: 'left',
                    verticalAlign: 'top',
                    borderWidth: 0
                },
                tooltip: {
                    formatter: function () {
                        return 'Actual <b>' + this.x + '</b>' + '<br/>Off Target <b>' + this.y + '</b>';
                    }
                },
                xAxis: {
                    gridLineWidth: 10,
                    gridLineColor: '#f0f0f0',
                    opposite: true,
                    tickPosition: 'inside',
                    type: 'datetime',
                    minTickInterval: 24 * 3600 * 1000,
                    dateTimeLabelFormats:{
                        day: '%A <br/> %B %d'
                    }
                },
                plotOptions: {
                    series: {
                        showCheckbox: true,
                        selected: true
                    }
                },
            },
            series: graph_data
        }
    }
]);