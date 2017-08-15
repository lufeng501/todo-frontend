<style scoped>
</style>
<template>
    <div id="index_home">
      <mt-cell-swipe v-for="(item , index) in lists"
        :key="item"
        :title="item.title"
        :right="[
          {
          content: '编辑',
          style: { background: 'green', color: '#fff' },
          handler: () => edit(item.id)
          },
          {
          content: '删除',
          style: { background: 'red', color: '#fff' },
          handler: () => del(item.id)
          }
        ]">
        <i slot="icon" class="fa fa-location-arrow" style="color: green"></i>
        <a slot="title" v-bind:href="'#/edit/' + item.id ">
          <span v-text="item.title"></span>
        </a>
      </mt-cell-swipe>
    </div>
</template>
<script>

  const API_ROOT = process.env.API_ROOT

  export default {
    name: 'index_home',
    data () {
      return {
        conditions: {
          item_type: 2,
          order_type: 1
        },
        lists: [],
      }
    },
    created() {
      this.$indicator.open({
        text: '拼命加载...',
        spinnerType: 'fading-circle'
      });
      this.getLists()
    },
    methods: {
      getLists() {
        let params = this.conditions
        // 获取待办事项
        this.$http.get(API_ROOT + '/todo/getTodoLists', {params: params})
          .then((response) => {
            let jsonRes = response.data
            if (jsonRes.state == 1) {
              this.$indicator.close();
              this.lists = jsonRes.data
              this.spinShow = false
            } else {
            }
            this.submitting = false
          })
          .catch(function (response) {
            console.log(response)
          })
      },
      edit(id) {
        this.$router.push('/edit/' + id)
      },
      del(id) {
        // 发起异步跨域请求
        var url = API_ROOT + '/todo/delete/' + id
        this.$http.post(url, {}, {emulateJSON: true})
          .then((response) => {
            let jsonRes = response.data
            if (jsonRes.state == 1) {
              this.$toast('成功删除待办事项');
              this.getLists()
            } else {
              this.$toast('删除失败');
            }
          })
          .catch(function (response) {
            console.log(response)
            this.$toast('接口请求失败，删除失败');
          })
      }
    }
  }
</script>
<style>
</style>
