<style scoped>
    .btn-bottom-div {
        position: absolute;
        width: 100%;
        bottom: 100px;
    }

    .toast-tips-fa {
      font-size: 10px;
    }

    .spin-icon-load {
        animation: ani-spin 1s linear infinite;
    }

    @keyframes ani-spin {
        from {
            transform: rotate(0deg);
        }
        50% {
            transform: rotate(180deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
</style>
<template>
  <div>
    <mt-field placeholder="未命名清单" v-model="title"></mt-field>

    <div class="weui-cells weui-cells_checkbox">
      <label v-for="(item,index) in lists" class="weui-cell weui-check__label" v-bind:for=" 's' + index ">
        <div class="weui-cell__hd">
          <input type="checkbox" v-model="item.status" class="weui-check" name="checkbox"
                 v-bind:id=" 's' + index ">
          <i class="weui-icon-checked"></i>
        </div>
        <div class="weui-cell__bd">
          <input class="weui-input" type="text" v-model="item.title" placeholder="请输入待办说明"/>
        </div>
      </label>
      <a href="javascript:void(0);" v-on:click="add" class="weui-cell weui-cell_link">
        <div class="weui-cell__bd">
          <i class="fa fa-plus"></i>
          添加更多
        </div>
      </a>
    </div>

    <div class="btn-bottom-div weui-cells">
      <div v-show="id" class="weui-btn-area">
        <a class="weui-btn weui-btn_warn" v-bind:class="{ 'weui-btn_disabled' : del_submitting}"
           href="javascript:" v-on:click="del">
          <i v-show="del_submitting" class="weui-loading"></i>
          <span v-show="del_submitting">删除中...</span>
          <span v-show="!del_submitting">删除</span>
        </a>
      </div>
      <div class="weui-btn-area">
        <a class="weui-btn weui-btn_primary" v-bind:class="{ 'weui-btn_disabled' : submitting}"
           href="javascript:" v-on:click="save">
          <i v-show="submitting" class="weui-loading"></i>
          <span v-show="submitting">保存中...</span>
          <span v-show="!submitting">保存</span>
        </a>
      </div>
    </div>

  </div>
</template>

<script>
  import * as funs from '../../include/common.js'
  import $ from "jquery"

  const API_ROOT = process.env.API_ROOT

  export default {
    name: 'new-item',
    data() {
      return {
        value: [],
        spinShow: false,
        submitting: false,
        del_submitting: false,
        id: 0,
        title: '',
        lists: []
      }
    },
    created: function () {
      if (!funs.isNull(this.$route.params) && !funs.isNull(this.$route.params.id)) {
        this.spinShow = true
        let id = this.$route.params.id
        this.id = id
        this.getTodoItemDetails(id)
      }
    },
    methods: {
      add: function () {
        let tmp = {'status': false, 'title': ''}
        this.lists.push(tmp)
      },
      save: function () {
        let data = {
          'title': this.title,
          'lists': this.lists
        }
        // 判断是否重复提交
        if (this.submitting) {
          return
        }
        // 更改操作状态
        this.submitting = true
        // 发起异步跨域请求
        if (this.id > 0) {
          var url = API_ROOT + '/todo/addTodoItem/' + this.id
        } else {
          var url = API_ROOT + '/todo/addTodoItem'
        }
        let _this = this
        this.$http.post(url, data, {emulateJSON: true})
          .then((response) => {
            let jsonRes = response.data
            if (jsonRes.state == 1) {
              this.submitting = true
              if (funs.isNull(_this.id)) {
                this.$router.push('/')
              }
              this.$toast('成功保存待办事项')
            } else {
              this.$toast('保存失败');
            }
            this.submitting = false
          })
          .catch(function (response) {
            console.log(response)
            this.$toast('接口请求失败，保存失败');
            this.submitting = false
          })
      },
      del: function () {
        // 判断是否重复提交
        if (this.del_submitting) {
          return
        }
        // 更改操作状态
        this.del_submitting = true
        // 发起异步跨域请求
        var url = API_ROOT + '/todo/delete/' + this.id
        this.$http.post(url, {}, {emulateJSON: true})
          .then((response) => {
            let jsonRes = response.data
            if (jsonRes.state == 1) {
              this.$toast('成功删除待办事项');
              this.$router.push('/')
            } else {
              this.$toast('删除失败');
            }
            this.del_submitting = false
          })
          .catch(function (response) {
            console.log(response)
            this.$toast('接口请求失败，删除失败');
            this.del_submitting = false
          })
      },
      getTodoItemDetails: function (id) {
        this.$indicator.open({
          text: '拼命加载...',
          spinnerType: 'fading-circle'
        });
        this.$http.get(API_ROOT + '/todo/getTodoItemDetails/' + id)
          .then((response) => {
            let jsonRes = response.data
            if (jsonRes.state == 1) {
              this.$indicator.close();
              this.title = jsonRes.data.title
              this.lists = jsonRes.data.related_details
              // 字符串转化数字
              var _this = this
              $.each(_this.lists, function (index, item) {
                _this.lists[index]['status'] = parseInt(item.status)
              })
              this.spinShow = false
            } else {
              this.$toast(jsonRes.msg);
            }
          })
          .catch((response) => {
            console.log(response)
            this.$toast('获取数据失败');
          })
      }
    }
  }
</script>
