sntRover.controller('RateMgrOccupancyGraphCtrl', ['$q', '$scope', 'RateMgrOccupancyGraphSrv', 'ngDialog', 'dateFilter',
    function($q, $scope, RateMgrOccupancyGraphSrv, ngDialog, dateFilter) {
        $scope.$parent.myScrollOptions = {
            RateMgrOccupancyGraphCtrl: {
                scrollX: true,
                scrollY: false,
                scrollbars: true,
                interactiveScrollbars: false,
                momentum:false,
                mouseWheel: true,
                click: true
            }
        };

        BaseCtrl.call(this, $scope);
        $scope.targetData = [];
        $scope.weekCommonTargets = [];
        $scope.highchartsNG = {
            title: {
                text: '',
                enabled: false
            },
            options: {
                chart: { },
                xAxis: { },
                yAxis: { },
                legend: { },
                plotOptions: { }
            }
        };
        $scope.seriesActualVisible = true;
        $scope.seriesTargetVisible = true;

        //INIT GRAPH DIMENSIONS AND SPATIAL PROPERTIES
        (function() {
            var height = $(window).height() - 80,
                width = $(window).width() - 265;

            $scope.graphDimensions = {
                containerWidth: width,
                containerHeight: height,
                width: $scope.uiOptions.tableWidth - 280,
                height: $scope.uiOptions.tableHeight,
                interval: {
                    width: $scope.uiOptions.columnWidth
                }
            };
        })();

        toolTipLookUp = $scope.toolTipLookUp = Object.create(null);

        $scope.legendToggled = function(legendName) {
            var chart = $('#occGraphContainer').highcharts();

            if (legendName === 'actual') {
                $scope.seriesActualVisible = !$scope.seriesActualVisible;
                if ($scope.seriesActualVisible) {
                    chart.series[0].show();
                } else {
                    chart.series[0].hide();
                }
            } else {
                $scope.seriesTargetVisible = !$scope.seriesTargetVisible;
                if ($scope.seriesTargetVisible) {
                    chart.series[1].show();
                } else {
                    chart.series[1].hide();
                }
            }
        };

        function generateSeries(data) {
            var categories = [],
                actualData = [],
                targetData = [], start;

            toolTipLookUp = {};

            angular.forEach(data.results, function(item, index) {
                var valueActual, valueTarget, actual;

                itemDate = Date.parse(item.date); //parse string datetime value to locale ms

                if(index === 0) {
                    start = itemDate;
                }

                toolTipLookUp[itemDate] = Object.create(null); //lookup hash

                categories.push(dateFilter(itemDate, "EEEE") + "<br>" + dateFilter(itemDate, "MMMM dd"));

                // NOTE :: Check if replaced harcoded 10 with item.actual
                

                if(item.actual === null){
                   actual = 0;
                }
                else{
                    actual = (item.actual % 1 === 0) ? item.actual : Math.round(item.actual);
                }
                actualData.push(parseInt(actual));
                toolTipLookUp[itemDate].actual = valueActual;

                // NOTE :: Check if replaced harcoded 10 with item.target
                
                targetData.push(item.target || 0);
                toolTipLookUp[itemDate].target = valueTarget;
            });

            return {
                series: [{
                        name: 'Actual',
                        data: actualData,
                        pointStart: start,
                        pointInterval: 86400000,
                        color: 'rgba(247,153,27,0.9)',
                        marker: {
                            symbol: 'circle',
                            radius: 5
                        }
                    },
                    {
                        name: 'Target',
                        data: targetData,
                        pointStart: start,
                        pointInterval: 86400000,
                        color: 'rgba(130,195,223,0.9)',
                        marker: {
                            symbol: 'triangle',
                            radius: 5
                        }
                }]
            };
        }

        function manipulateTargetData(data) {
            var targetData = [],
                targetItem = {};

            angular.forEach(data.results, function(item) {
                itemDate = tzIndependentDate(item.date).getTime();
                target_value = item.target;
                targetItem = {
                        "date": itemDate,
                        "value": target_value,
                        "is_editable": true
                };
                targetData.push(targetItem);
            });

            targetData = appendRemainingWeekDays(targetData);

            var formattedTargetData = [],
                targetWeeklyItem = [];

            for (var i = 0; i <= targetData.length; i++) {
                item = targetData[i];

                if (i % 7 === 0 && i !== 0) {
                    formattedTargetData.push(targetWeeklyItem);
                    targetWeeklyItem = [];
                    targetWeeklyItem.push(item);
                } else {
                    targetWeeklyItem.push(item);
                }
            }

            $scope.weekCommonTargets = [];

            for (var i = 0; i <= formattedTargetData.length; i++) {
                $scope.weekCommonTargets.push('');
            }

            return formattedTargetData;
        }

        function appendRemainingWeekDays(targetData) {
            var itemDate, i, j,
                remainingStartWeekDays = [],
                remainingEndWeekDays = [];

            from_date   = tzIndependentDate(targetData[0].date);
            to_date     = tzIndependentDate(targetData[targetData.length - 1].date);

            // append missing week days before from date
            if (from_date.getDay() !== 0) {
                limit = from_date.getDay();

                for (i = limit; i > 0; i--) {
                    itemDate = angular.copy(from_date);

                    itemDate.setDate(from_date.getDate() - i);

                    remainingStartWeekDays.push({
                            "date": itemDate.getTime(),
                            "value": null,
                            "is_editable": false
                    });
                }
            }

            // append missing week days after to date
            if (to_date.getDay() !== 6) {
                limit = 6 - to_date.getDay();

                for (j = 1; j <= limit; j++) {
                    itemDate = angular.copy(to_date);

                    itemDate.setDate(to_date.getDate() + j);

                    remainingEndWeekDays.push({
                            "date": itemDate.getTime(),
                            "value": null,
                            "is_editable": false
                    });
                }

            }

            targetData = remainingStartWeekDays.concat(targetData, remainingEndWeekDays);

            return targetData;
        }

        $scope.showSetTargetDialog = function() {
            ngDialog.open({
                    template: '/assets/partials/rateManager/setTargetPopover.html',
                    className: 'ngdialog-theme-default settarget',
                    closeByDocument: true,
                    scope: $scope
            });
        };

        $scope.copyTargetToAllWeekDays = function(index) {
            angular.forEach($scope.targetData[index], function(item, key) {
                if (item.hasOwnProperty("value") && item.is_editable) {
                    item.value = $scope.weekCommonTargets[index];
                }
            });
        };

        $scope.setTargets = function() {
            var params = {},
                dates = [],
                weekDate = "",
                formatted_date = "";

            angular.forEach($scope.targetData, function(week) {
                angular.forEach(week, function(weekDays) {
                    if (weekDays.value !== null) {

                        weekDate = new Date(weekDays.date);
                        formatted_date = weekDate.getFullYear() + '-' + (weekDate.getMonth() + 1) + '-' + weekDate.getDate();

                        dates.push({
                            "date": formatted_date,
                            "target": weekDays.value
                        });
                    }
                });
            });

            params = {
                    "dates": dates
            };

            var setTargetsSuccess = function(data) {
                ngDialog.close();
                $scope.fetchGraphData();
                $scope.$emit('hideLoader');
            };

            $scope.invokeApi(RateMgrOccupancyGraphSrv.setTargets, params, setTargetsSuccess);
        };

        $scope.cancelClicked = function() {
            ngDialog.close();
        };

        function findLimit(collection, childCollParam, valueParam, findMax) {
            var curLimit = -1, curVal, records, record;

            records = collection[childCollParam];

            for(var i = 0, len = records.length; i < len; i++) {
                record = records[i][valueParam];

                curVal = (record === null || !record || isNaN(record)) ? 0 : record;

                curLimit = (curLimit < curVal ? (findMax ? curVal : curLimit) : (findMax ? curLimit : curVal));
            }

            return curLimit;
        }

        $scope.fetchGraphData = function(params) {
            return $scope.invokeApi(RateMgrOccupancyGraphSrv.fetch,
                                    {
                                        from_date: $scope.currentFilterData.begin_date,
                                        to_date: $scope.currentFilterData.end_date
                                    },
                                    function() {
                                        $scope.$emit('hideLoader');

                                        return Array.prototype.slice.call(arguments).shift();
                                    })
            .then(function() {
                var args = Array.prototype.slice.call(arguments),
                    data = args.shift(),
                    graphDim;

                (function() {
                    var container = $('.occgraph-outer'),
                        viewport = Object.create(null),
                        maxActual, maxTarget,
                        findMax = findLimit.bind(null, data, 'results'),
                        max;

                    maxActual = findMax('actual', true);
                    maxTarget = findMax('target', true);

                    max = ((maxActual > maxTarget) ? maxActual : maxTarget);

                    if(max <= 0) {
                        max = 100;
                    }

                    if(container.length > 0) {
                        viewport = container[0].getBoundingClientRect();
                    }

                    $scope.graphDimensions = {
                        containerWidth: viewport.width,
                        containerHeight: viewport.height + 50,
                        width: $scope.uiOptions.tableWidth - 280,
                        height: $scope.uiOptions.tableHeight,
                        interval: {
                            width: $scope.uiOptions.columnWidth
                        },
                        // CICO-11038: Max value set to 90 as it will show up 100 in highchart!!
                        yAxis: {
                            max: 90,
                            min: 0
                        }
                    };

                    graphDim = $scope.graphDimensions;
                })();

                $scope.highchartsNG = {
                    options: {
                        chart: {
                            type: 'area',
                            className: 'rateMgrOccGraph',
                            backgroundColor: 'rgba(0,0,0,0.05)',
                            width: graphDim.width,
                            height: graphDim.height,
                            title: {
                                enabled: false,
                                text: ''
                            }
                        },
                        xAxis: {
                            title: { enabled: false },
                            tickLength: 2,
                            tickPosition: 'outside',
                            opposite: true,
                            type: 'datetime',
                            dateTimeLabelFormats: {
                                day: '%A <br/>%B %e'
                            },
                            gridLineWidth: 5,
                            gridLineColor: '#FCFCFC',
                            minTickInterval: 86400000,
                            labels: {
                                x: 0,
                                y: -50,
                                style: {
                                    class: 'uppercase-label',
                                    display: 'block',
                                    textAlign: 'center',
                                    textTransform: 'uppercase',
                                    color: '#666', //#fcfcfc',
                                    height: '60px',
                                    lineHeight: 'normal',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    boxSizing: 'border-box'
                                },
                                useHTML: true
                            }
                        },
                        yAxis: {
                            title: { enabled: false },
                            tickWidth: 2,
                            tickInterval: graphDim.yAxis.step,
                            minTickInterval: graphDim.yAxis.step,
                            gridLineColor: '#bbb',
                            tickPosition: 'outside',
                            showLastLabel: true,
                            showFirstLabel: false,
                            labels: {
                                align: 'left',
                                x: -10,
                                y: -2,
                                style: {
                                    color: '#868788',
                                    fontWeight: 'bold'
                                },
                                useHTML: true
                            },
                            min: 0,
                            max: graphDim.yAxis.max + graphDim.yAxis.max / 10,
                            minRange: graphDim.yAxis.step
                        },
                        legend: {
                            enabled: false
                        },
                        plotOptions: {
                            series: {
                                fillOpacity: 0.5
                            }
                        },
                        title: {
                            enabled: false,
                            text: ''
                        },
                        tooltip: {
                            shadow: false,
                            useHTML: true,
                            percentageDecimals: 2,
                            backgroundColor: "rgba(255,255,255,1)"
                        }
                    }
                };

                _.extend($scope.highchartsNG, generateSeries(data));

                $scope.targetData = manipulateTargetData(data);

                $scope.$emit('computeColumWidth');
            });
        };

        function resize() {
            $scope.graphDimensions.containerWidth = $(window).width() - 265;
            $scope.graphDimensions.containerHeight = $(window).height() - 80;
            $scope.graphDimensions.width = $scope.uiOptions.tableWidth - 280;
            $scope.graphDimensions.height = $scope.uiOptions.tableHeight;
            $scope.graphDimensions.interval = $scope.uiOptions.columnWidth;

            if($scope.highchartsNG && $scope.highchartsNG.options && $scope.highchartsNG.options.chart) {
                $scope.highchartsNG.options.chart.width = $scope.graphDimensions.width;
                $scope.highchartsNG.options.chart.height = $scope.graphDimensions.height;
            }

            if(!$scope.myScroll || !$scope.myScroll.RateMgrOccupancyGraphCtrl) {
                $scope.$parent.myScroll = {};
                $scope.myScroll = {};
                $scope.setScroller('RateMgrOccupancyGraphCtrl', { scrollX: true, scrollY: false, scrollbars: true, interactiveScrollbars: false, momentum: false });

                try {
                    $scope.myScroll.RateMgrOccupancyGraphCtrl = new IScroll('#occ-graph', $scope.$parent.myScrollOptions.RateMgrOccupancyGraphCtrl);
                }catch(e) {

                }
            }

            setTimeout(function() {
                $scope.myScroll.RateMgrOccupancyGraphCtrl.refresh();
            }, 1000);
        }

        $scope.$watch('uiOptions', _.throttle(resize, 200, { leading: true, trailing: true }), true);

        $scope.$on("updateOccupancyGraph", function() {
            $scope.fetchGraphData();
        });

        $scope.fetchGraphData();
    }
]);