export default function(context) {
  context.store.dispatch('user/checkAuth');
}
