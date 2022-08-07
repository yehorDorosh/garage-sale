const getters = {
  getRegIsShown(state) {
    return state.regIsShown;
  },
  getRegMsgIsShown(state) {
    return state.regMsgIsShown;
  },
  getLoginIsShown(state) {
    return state.loginIsShown;
  },
  getBookingWarning(state) {
    return state.bookingWarning;
  },
  getBuyerFormIsShown(state) {
    return state.buyerForm.isShown;
  },
  getBuyerFormData(state) {
    return state.buyerForm.payload;
  },
  getDeleteUserWarning(state) {
    return state.deleteUserWarning;
  },
};

export default getters;
