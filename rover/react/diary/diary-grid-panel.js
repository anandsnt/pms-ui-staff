var GridPanel = React.createClass({
	render: function() {
		var props = this.props;

		return React.DOM.div({
			className: 'diary-grid' 
		}, 
		Grid({
			viewport: 			props.viewport,
			display: 			props.display,
			filter: 			props.filter,
			edit:               props.edit,
			iscroll: 			props.iscroll,
			data: 				props.data,
			angular_evt: 		props.angular_evt,
			currentResizeItem:  props.currentResizeItem,
			currentResizeItemRow: props.currentResizeItemRow,
			__onGridScroll: 	props.__onGridScroll,
			__onDragStart: 		props.__onDragStart,
			__onDragStop: 		props.__onDragStop	
		}));
	}
});