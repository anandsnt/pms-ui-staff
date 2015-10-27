React.initializeTouchEvents(true);

var DPthCell = React.createClass({
	render: function() {
		return React.DOM.th({
			'className' : this.props.className,
			'colSpan'   : this.props.colspan
		}, this.props.data);
	}
});

var DPHeadPanel = React.createClass({
	render: function() {
		var i, j;

		var topRow,
			botRow;

		var topRowCells = [],
			botRowCells = [];

		for(i = 0, j = this.props.headerTop.length; i < j; i++) {
			topRowCells.push(
				DPthCell({
					'colspan' : this.props.colspan,
					'data'    : this.props.headerTop[i]
				})
			);
		};

		topRow = React.DOM.tr({}, topRowCells);

		for(i = 0, j = this.props.headerBot.length; i < j; i++) {
			botRowCells.push(
					DPthCell({
					'className' : this.props.headerBot[i]['cls'],
					'data'      : this.props.headerBot[i]['name']
				})
			);
		};

		botRow = React.DOM.tr({
				'className': 'bottom-row'
			}, botRowCells
		);

		return React.DOM.thead({}, topRow, botRow);
	}
});

var DPtdCell = React.createClass({
	render: function() {
		var tag;

		if ( this.props.isLastRow ) {
			tag = 'strong';
		} else if ( this.props.isAvail ) {
			tag = 'em';
		} else if ( this.props.isRev ) {
			tag = 'span'
		};

		return React.DOM.td({
				'className' : this.props.className
			},
			React.DOM[tag]({}, this.props.data)
		);
	}
});

var DPBodyRow = React.createClass({
	render: function() {
		var cells = [];

		var i, j;

		for(i = 0, j = this.props.rowData.length; i < j; i++) {
			cells.push(
				DPtdCell({
					'isLastRow' : this.props.isLastRow,
					'isAvail'   : this.props.rowData[i]['isAvail'],
					'isRev'     : this.props.rowData[i]['isRev'],
					'className' : this.props.rowData[i]['cls'],
					'data'      : this.props.rowData[i]['value']
				})
			);
		};

		return React.DOM.tr({}, cells);
	}
});

var DPBodyPanel = React.createClass({
	render: function() {
		var rows = [];

		var i, j;

		for(i = 0, j = this.props.reportData.length; i < j; i++) {
			rows.push(
				DPBodyRow({
					'rowData'   : this.props.reportData[i],
					'isLastRow' : 1 == j - i
				})
			);
		};

		return React.DOM.tbody({}, rows);
	}
});

var DPContent = React.createClass({
	render: function() {
		return React.DOM.table({
				'className' : 'statistics-reports',
			},
			DPHeadPanel({
				'colspan'    : this.props.colspan,
				'headerTop'  : this.props.headerTop,
				'headerBot'  : this.props.headerBot
			}),
			DPBodyPanel({
				'reportData' : this.props.reportData
			})
		);
	},

	componentDidMount: function() {
		document.getElementById('daily-production-render').style.width = this.props.rightPaneWidth;
	}
});