const { createClass, PropTypes } = React;
const { findDOMNode } = ReactDOM;

const NightlyDiaryAvailableRoomListComponent = createClass({
    getStyles() {
        let nightDuration = NIGHTLY_DIARY_CONST.RESERVATION_ROW_WIDTH / this.props.state.numberOfDays;
        let diaryInitialDayOfDateGrid = this.props.state.diaryInitialDayOfDateGrid;
        let diaryInitialDate = tzIndependentDate(diaryInitialDayOfDateGrid);
        let avialableRoomStartDate = tzIndependentDate(this.props.date);

        let oneDay = 24 * 60 * 60 * 1000;
        let diffBtwInitialAndStartDate = avialableRoomStartDate.getTime() - diaryInitialDate.getTime();
        let noOfDaysBtwInitialAndArrivalDate = Math.abs((diffBtwInitialAndStartDate) / (oneDay));

        let avialableRoomPosition = 0;

        if (noOfDaysBtwInitialAndArrivalDate > 0) {
            avialableRoomPosition = noOfDaysBtwInitialAndArrivalDate * nightDuration;
        }
        if (noOfDaysBtwInitialAndArrivalDate >= 0) {
            if (this.props.state.numberOfDays === NIGHTLY_DIARY_CONST.DAYS_7) {
                avialableRoomPosition = avialableRoomPosition + NIGHTLY_DIARY_CONST.DAYS_POSITION_ADD_7;
            } else if (this.props.state.numberOfDays === NIGHTLY_DIARY_CONST.DAYS_21) {
                avialableRoomPosition = avialableRoomPosition + NIGHTLY_DIARY_CONST.DAYS_POSITION_ADD_21;
            }
        }
        avialableRoomPosition = avialableRoomPosition + 'px';
        const style = {
            width: nightDuration + 'px',
            transform: 'translateX(' + avialableRoomPosition + ')',
            display: 'block'
        };

        return style;
    },
    render() {
        return (
            <div style={this.getStyles()} className="reservation unassigned">
                <div className="reservation-data">
                    ASSIGN
                    <span className="name">100</span>
                </div>
            </div>
        );
    }
});
