
const { createClass } = React;

const NightlyDiaryAvailableRoomListComponent = createClass({
    hideBookButton() {
        let currentBusinessDate = tzIndependentDate(this.props.state.currentBusinessDate);
        let avialableRoomStartDate = tzIndependentDate(this.props.date);
        let diff = avialableRoomStartDate.getTime() - currentBusinessDate.getTime();
        let isHideBookButton = false;

        if (diff < 0) {
            isHideBookButton = true;
        }
        return isHideBookButton;
    },
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
        let width = nightDuration;

        if (this.props.state.numberOfDays === NIGHTLY_DIARY_CONST.DAYS_7) {
            width = width - NIGHTLY_DIARY_CONST.PADDING;
        } 
        else if (this.props.state.numberOfDays === NIGHTLY_DIARY_CONST.DAYS_21) {
            width = width - NIGHTLY_DIARY_CONST.PADDING;
        }
        const style = {
            width: width + 'px',
            transform: 'translateX(' + avialableRoomPosition + ')'
        };

        return style;
    },
    render() {
        const isHideBookButton = this.hideBookButton();

        return ( !isHideBookButton && (
                    <div style={this.getStyles()}
                        className="reservation unassigned"
                        onClick={() => this.props.clickedBookRoom(this.props.room.id, this.props.date, this.props.state.roomsList)}
                    >
                        <div className="reservation-data">
                            <span className="name">BOOK</span>
                        </div>
                    </div>
                )
                );
    }
});
