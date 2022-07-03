export default function(context) {
  if (!context.store.getters['user/isAuth']) {
    context.redirect('/');
  }
}
