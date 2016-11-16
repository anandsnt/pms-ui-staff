const paginationDataReducer = (state = [], action) => {
  switch (action.type) {
    case 'DIARY_VIEW_CHANGED':
        return action.paginationData;
    default:
        return state.paginationData;
  }
};