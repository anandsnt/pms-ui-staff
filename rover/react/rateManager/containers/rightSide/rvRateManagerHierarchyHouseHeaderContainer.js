const {connect} = ReactRedux;

const mapStateToRateManagerHierarchyHouseHeaderContainerProps = () => {
    return {
        text: 'Vishnu'
    }
};

const RateManagerHierarchyHouseHeaderContainer = connect(
    mapStateToRateManagerHierarchyHouseHeaderContainerProps
)(RateManagerGridRightSideHierarchyHeaderCellComponent);
