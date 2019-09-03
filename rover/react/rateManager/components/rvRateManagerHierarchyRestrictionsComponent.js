const { createClass } = React;

const RateManagerHierarchyRestrictionsComponent = createClass({
	selectRestriction(event) {
		let value = event.target.value;

		this.props.changedHeirarchyRestriction(value);
	},
    render() {
        return (
            <div className='select'>
                <select onChange={() => this.selectRestriction(event)}>
                    {this.props.listValues.map(item => (
                        <option key={item.value} value={item.value}>
                            {item.name}
                        </option>
                    ))}
                </select>
			</div>
        );
    }
});