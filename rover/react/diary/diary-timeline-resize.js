var Resizable = React.createClass({
	render: function() {
		var handle_width_ms = this.props.handle_width * this.props.display.px_per_ms,
			props = this.props,
			self = this;

		return React.DOM.div({
			className: 'stay-range',
			style: {
				display: (props.edit.active) ? 'block' : 'none'
			}
		},
		TimelineResizeGrip({
			key: 				  'resize-left-00',
			display: 			  props.display,
			iscroll: 			  props.iscroll,
			itemProp: 			 'left',
			__onResizeCommand:    props.__onResizeCommand,
			__onResizeStart:      props.__onResizeStart,
			__onResizeEnd:        props.__onResizeEnd,
			currentResizeItem:    props.currentResizeItem,
			currentResizeItemRow: props.currentResizeItemRow
		}),
		TimelineResizeGrip({
			key: 				  'resize-right-01',
			display: 			  props.display,
			iscroll: 			  props.iscroll,
			itemProp: 			  'right',
			__onResizeCommand:    props.__onResizeCommand,
			__onResizeStart:      props.__onResizeStart,
			__onResizeEnd:        props.__onResizeEnd,
			currentResizeItem:    props.currentResizeItem,
			currentResizeItemRow: props.currentResizeItemRow			
		}));
	}
});