<style scoped>
  .tab-div {
    padding: 10px;
    font-size: 12px;
  }
</style>
<template>
    <div id="wrapper">
      <div class="page tabbar js_show" style="max-width: 650px;margin: auto">
        <mt-header fixed style="font-size: 24px; height: 60px" title="工作使我骄傲"></mt-header>
        <div style="margin-top: 60px">
          <router-view></router-view>
        </div>
        <mt-tabbar fixed v-model="selected">
          <mt-tab-item id="/">
            <div class="tab-div" @click="skip('/')">
              <i class="fa fa-bars"></i>
              清单
            </div>
          </mt-tab-item>
          <mt-tab-item id="/new">
            <div class="tab-div" @click="skip('/new')">
              <i class="fa fa-plus"></i>
              添加
            </div>
          </mt-tab-item>
          <mt-tab-item id="/report">
            <div class="tab-div" @click="skip('/report')">
              <i class="fa fa-bar-chart"></i>
              报表
            </div>
          </mt-tab-item>
        </mt-tabbar>
      </div>
    </div>
</template>

<script>

  import 'iview/dist/styles/iview.css'
  import 'weui/dist/style/weui.min.css'
  import '../../assets/css/layout.css'

  export default {
    name: 'wrapper',
    data() {
      return {
        selected : ""
      }
    },
    created() {
      let route = this.$route.path
      if (route.indexOf('edit') == 1) {
        console.log(route)
        this.selected = ""
      } else {
        this.selected = route
      }
    },
    methods: {
      skip : function (url) {
        this.$router.push(url)
      }
    }
  }
</script>

<style>
</style>
