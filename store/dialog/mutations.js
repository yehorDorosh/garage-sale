const mutations = {
  setRegIsShown(state, payload) {
    state.regIsShown = payload;
  },
  setRegMsgIsShown(state, payload) {
    state.regMsgIsShown = payload;
  },
  setLoginIsShown(state, payload) {
    state.loginIsShown = payload;
  },
  setBookingWarning(state, payload) {
    state.bookingWarning = payload;
  },
  setBuyerFormIsShown(state, payload) {
    state.buyerForm.isShown = payload;
  },
  setBuyerFormData(state, payload) {
    state.buyerForm.payload = payload;
  },
};

export default mutations;
