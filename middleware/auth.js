// If user not auth. then redirect to main page.
export default function(context) {
  if (!context.store.getters['user/isAuth']) {
    context.redirect('/');
  }
}
