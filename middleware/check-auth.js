// Check that user is authenticated on client side via local storage. And get user data.
export default function(context) {
  context.store.dispatch('user/checkAuth');
}
