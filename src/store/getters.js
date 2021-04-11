const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  permission_routes: state => state.permission.routes,
  menuList: state => state.permission.menuList,
  name: state => state.user.name,
  openId: state => state.user.openId
}
export default getters
