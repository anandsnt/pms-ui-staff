const RateManagerGridRightSideHierarchyHeaderCellComponent = ({onTdClick, restrictionSummary, dateList}) => (
    <tr>
        {
            restrictionSummary[0].restrictionList.map((eachDayRestrictions, colIndex) => 
                <td onClick={(e) => onTdClick(e, rowIndex, colIndex)} key={'key-' + colIndex} className='cell'>
                    <div className={'cell-container ' + (dateList[colIndex].isWeekEnd ? 'weekend_day': '')}>
                        <div className={'cell-content ' + (dateList[colIndex].isPastDate ? 'isHistory-cell-content': '')}>
                            {eachDayRestrictions.map((restriction, restrictionIndex) =>
                                <RateManagerRestrictionIconComponent
                                    key={'key-' + restrictionIndex}
                                    className={'' + restriction.className}
                                    text={restriction.days}/>
                            )}
                        </div>
                    </div>
                </td>
            )
        }
    </tr>
);