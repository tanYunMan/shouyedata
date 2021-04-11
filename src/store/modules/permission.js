import { menu1, menu2, constantRoutes } from '@/router'
import router from '@/router'
import utils from '@/utils/public'
import { getDatas } from '@/api/price/price-1/common'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (tmp.children) {
      tmp.children = filterAsyncRoutes(tmp.children)
    }
    res.push(tmp)
  })
  return res
}

const state = {
  routes: [],
  menuList: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
}

const actions = {
  generateRoutes({ commit }) {
    return new Promise(resolve => {
      let accessedRoutes
      if(sessionStorage.getItem('menuType') == 2) {
        accessedRoutes = filterAsyncRoutes(menu2)
      }else {
        accessedRoutes = filterAsyncRoutes(menu1)
      }
      commit('SET_ROUTES', accessedRoutes)
      router.addRoutes(accessedRoutes)
      getMenu()
      // utils.methods.getUserTree()
      resolve(accessedRoutes)
    })
  },
}

async function getMenu() {
  const res = await getDatas({}, '/user/function/getUserTree')
  if (res.code == 1001) {
    let powerRoutes = res.body || []
    let arrayData = []
    for (let i = 0; i < powerRoutes.length; i++) {
      arrayData.push(powerRoutes[i].functionCode)
      for (let k = 0; k < powerRoutes[i].children.length; k++) {
        arrayData.push(powerRoutes[i].children[k].functionCode)
      }
    }

    let mainRoutes = state.routes
    for (let i = 0; i < mainRoutes.length; i++) {
      if (!mainRoutes[i].hidden) {
        let indexArr = arrayData.indexOf(mainRoutes[i].functionCode);
        if (indexArr == -1) {//判断一级目录是否存在
          mainRoutes[i].hidden = true
        } else {
          for (let is = 0; is < powerRoutes.length; is++) {
            if (mainRoutes[i].functionCode == powerRoutes[is].functionCode) {
              if (mainRoutes[i].meta) {
                mainRoutes[i].meta.title = powerRoutes[is].functionName
              }
              if (powerRoutes[is].functionCode == 's-home') {//单独处理哈首页
                mainRoutes[i].children[0].meta.title = powerRoutes[is].functionName
              }
            }
          }
        }
        let childrenData = mainRoutes[i].children
        for (let k = 0; k < childrenData.length; k++) {
          if (!childrenData[k].hidden) {
            let indexArrs = arrayData.indexOf(childrenData[k].functionCode);
            if (indexArrs == -1) {//判断一级目录是否存在
              childrenData[k].hidden = true
            } else {
              for (let ks = 0; ks < powerRoutes.length; ks++) {
                let powerRoutesChildren = powerRoutes[ks].children
                for (let ksc = 0; ksc < powerRoutesChildren.length; ksc++) {
                  if (childrenData[k].functionCode == powerRoutesChildren[ksc].functionCode) {
                    if (childrenData[k].meta) {
                      childrenData[k].meta.title = powerRoutesChildren[ksc].functionName
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    state.menuList = mainRoutes
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
