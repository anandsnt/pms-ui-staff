sntRover.controller('RateMgrOccupancyGraphCtrl', ['$scope',
    function ($scope) {
        graph_data = [{
            "name": "Actual",
            "data": [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
            "color": "blue"
        }, {
            "name": "Target",
            "data": [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5],
            "color": "black"
        }]
        $scope.highchartsNG = {
            options: {
                chart: {
                    type: 'line',
                    plotBackgroundColor: '#e0e0e0'
                },
                legend: {
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
                    opposite: true
                }
            },
            series: graph_data,
            title: {
                text: 'Sample Chart'
            },
            loading: false
        }
    }
]);