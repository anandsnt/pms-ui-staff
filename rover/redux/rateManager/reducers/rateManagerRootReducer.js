const rateManagerRootReducer = (state, action) => {
  switch (action.type) {
    case 'RATE_VIEW_CHANGED':
      return Object.assign({}, state, {'mode': 'RATE_VIEW'});
  }
  return state;
};
