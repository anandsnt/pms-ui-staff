var Resizable = React.createClass({
	render: function() {
		var handle_width_ms = this.props.handle_width * this.props.display.px_per_ms,
			self = this;

		return React.DOM.div({
			className: 'stay-range',
			style: {
				display: (this.props.currentResizeItem) ? 'block' : 'none'
			}
		},
		TimelineResizeGrip({
			key: 'resize-left-00',
			display: this.props.display,
			data: this.props.data,
			iscroll: this.props.iscroll,
			itemProp: 'left',
			__onResizeCommand: self.props.__onResizeCommand,
			__onResizeStart: self.props.__onResizeLeftStart,
			__onResizeEnd: self.props.__onResizeLeftEnd,
			currentResizeItem: this.props.currentResizeItem,
			currentResizeItemRow: this.props.currentResizeItemRow
		}),
		TimelineResizeGrip({
			key: 'resize-right-00',
			display: this.props.display,
			data: this.props.data,
			iscroll: this.props.iscroll,
			itemProp: 'right',
			__onResizeCommand: self.props.__onResizeCommand,
			__onResizeStart: self.props.__onResizeRightStart,
			__onResizeEnd: self.props.__onResizeRightEnd,
			currentResizeItem: this.props.currentResizeItem,
			currentResizeItemRow: this.props.currentResizeItemRow			
		}));
	}
});