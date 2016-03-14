const {connect} = ReactRedux;
const {createClass} = React;

const mapStateToProps = (state) => {
	return state;
}

function mapDispatchToProps(dispatch) {
    return {
        actions: Redux.bindActionCreators(rateManagerActions, dispatch)
    }
}

let RateManagerRootComponent = createClass({
    render() {
	  return (
		    <div className='calendar'>
				{this.props.mode === 'NOT_CONFIGURED' ? <RateManagerNotConfigured/> : <RateManagerCalendarViewRoot/>}
			</div>
		)
	}
});

const RateManagerRoot = connect(mapStateToProps, mapDispatchToProps)(RateManagerRootComponent);
