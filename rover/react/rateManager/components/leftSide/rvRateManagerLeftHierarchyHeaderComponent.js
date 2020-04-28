
const RateManagerLeftHierarchyHeaderComponent = ({activeRestrictions}) => (
    <div className="pinnedLeft-select-container">
        {
            activeRestrictions.map((restrictionName) => 
                <div className='pinnedLeft-select last'>
                    <span className="name">{restrictionName}</span>
                </div>
            )
        }
    </div>
);