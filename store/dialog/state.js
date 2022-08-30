const state = () => ({
  regIsShown: false,
  regMsgIsShown: false,
  loginIsShown: false,
  bookingWarning: false,
  buyerForm: {
    isShown: false,
    payload: {
      saleId: '',
      productId: '',
      buyerName: '',
      buyerEmail: '',
      buyerPhone: {},
    }
  },
  deleteUserWarning: false,
});

export default state;
