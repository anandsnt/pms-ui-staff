var DPthCell = function(props) {
    return React.DOM.th({
        className: props.className,
        colSpan: props.colspan,
        style: {'whiteSpace': 'nowrap'}
    }, props.data);
};

DPthCell.propTypes = {
    className: React.PropTypes.string.isRequired,
    colspan: React.PropTypes.any.isRequired,
    data: React.PropTypes.any
};
DPthCell.defaultProps = {
    className: '',
    colspan: 1,
    data: 'NA'
};

var DPHeadPanel = function (props) {
    var topRow,
        botRow;

    var topRowCells = props.headerTop.map(function (item, i) {
        return React.createElement( DPthCell, {
            colspan: props.colspanArray ? props.colspanArray[i] : props.colspan,
            data: item.name
        });
    });

    var botRowCells = props.headerBot.map(function (item) {
        return React.createElement( DPthCell, {
            className: item.cls,
            data: item.name
        });
    });

    topRow = React.DOM.tr({}, topRowCells);
    botRow = React.DOM.tr(
        {
            'className': 'bottom-row'
        },
        botRowCells
    );

    return React.DOM.thead({}, topRow, botRow);
};

var DPtdCell = function(props) {
    var tag;

    if ( props.isLastRow || props.isBold ) {
        tag = 'strong';
    } else if ( props.isAvail ) {
        tag = 'em';
    } else if ( props.isRev ) {
        tag = 'span';
    }

    return React.DOM.td(
        {
            className: props.className
        },
        React.DOM[tag]({}, props.data)
    );
};
DPtdCell.propTypes = {
    isLastRow: React.PropTypes.bool,
    isBold: React.PropTypes.bool,
    isAvail: React.PropTypes.bool,
    isRev: React.PropTypes.bool,
    data: React.PropTypes.any,
    className: React.PropTypes.string
};
DPtdCell.defaultProps = {
    isRev: true,
    data: '0',
    className: ''
};

var DPBodyRow = function (props) {
    var cells = props.rowData.map(function (item) {
        return React.createElement(
            DPtdCell,
            {
                isLastRow: props.isLastRow,
                isAvail: item.isAvail,
                isRev: item.isRev,
                className: item.cls,
                data: item.value,
                isBold: item.isRateType
            }
        );
    });

    return React.DOM.tr({}, cells);
};

var DPBodyPanel = function (props) {
    var lastIndex = props.reportData.length - 1;

    var rows = props.reportData.map(function (item, i) {
        return React.createElement(
            DPBodyRow,
            {
                rowData: item,
                isLastRow: props.isLastRowSum && lastIndex === i
            }
        );
    });

    return React.DOM.tbody({}, rows);
};

var DPContent = React.createClass({
    componentDidMount: function() {
        document.getElementById('daily-production-render').style.width = this.props.rightPaneWidth;
    },

    componentDidUpdate: function() {
        document.getElementById('daily-production-render').style.width = this.props.rightPaneWidth;
    },

    render: function() {
        return React.DOM.table(
            {
                className: 'statistics-reports',
                style: { tableLayout: 'auto' }
            },
            React.createElement(
                DPHeadPanel,
                {
                    colspan: this.props.colspan,
                    headerTop: this.props.headerTop,
                    headerBot: this.props.headerBot,
                    colspanArray: this.props.colspanArray
                }
            ),
            React.createElement(
                DPBodyPanel,
                {
                    reportData: this.props.reportData,
                    isLastRowSum: this.props.isLastRowSum
                }
            )
        );
    }
});
