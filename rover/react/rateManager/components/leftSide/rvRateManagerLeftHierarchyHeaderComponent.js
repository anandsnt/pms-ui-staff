
const RateManagerLeftHierarchyHeaderComponent = ({activeRestrictions}) => (
    <div className="pinnedLeft-select-container">
        {
            activeRestrictions.map((restrictionName, index) =>
                <div className={'pinnedLeft-select' + ((index === activeRestrictions.length - 1) ? ' last' : '')}>
                    <span className="name">{restrictionName}</span>
                </div>
            )
        }
    </div>
);