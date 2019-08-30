const { createClass } = React;

const RateManagerHierarchyRestrictionsComponent = createClass({

    render() {
        return (
            <div className='select'>
            	<select>
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