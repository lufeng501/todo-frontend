import Vue from 'vue'
import Router from 'vue-router'

import v2_layout from '../modules_v2/layout/index'
import v2_index_home from '../modules_v2/index/home'
import v2_index_new_item from '../modules_v2/index/new_item'
import v2_index_edit_item from '../modules_v2/index/edit_item'
import v2_index_report from '../modules_v2/index/report'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: v2_layout,
      children: [
        {
          path: '/',
          component: v2_index_home
        },
        {
          path: '/new',
          component: v2_index_new_item
        },
        {
          path: '/edit/:id',
          component: v2_index_edit_item
        },
        {
          path: '/report',
          component: v2_index_report
        },
      ]
    }
  ]
})
