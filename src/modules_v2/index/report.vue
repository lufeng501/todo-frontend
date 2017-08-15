<style scoped>
</style>
<template>
    <div id="index_report">

      <mt-cell class="todo-cell-wrapper">
        <span slot="title" @click="selectDateTime('start_date')">
          <i class="fa fa-calendar"></i>
          <span>开始时间：</span>
          <span v-text="conditions.start_date"></span>
        </span>
        <div @click="selectDateTime('start_date')">
          <span>点击选择</span>
          <i class="fa fa-angle-right"></i>
        </div>
      </mt-cell>

      <mt-cell class="todo-cell-wrapper">
        <span slot="title" @click="selectDateTime('end_date')">
          <i class="fa fa-calendar"></i>
          <span>结束时间：</span>
          <span v-text="conditions.end_date"></span>
        </span>
        <div @click="selectDateTime('end_date')">
          <span>点击选择</span>
          <i class="fa fa-angle-right"></i>
        </div>
      </mt-cell>

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

      <!--时间选择器-->
      <mt-datetime-picker
        v-model="pickerVisible"
        ref="picker"
        type="date"
        @confirm="handleConfirm">
      </mt-datetime-picker>
    </div>
</template>
<script>

  const API_ROOT = process.env.API_ROOT

  import moment from "moment"

  export default {
    name: 'index_report',
    data () {
      return {
        activeDate: '',
        pickerVisible: moment().format('YYYY-MM-DD'),
        spinShow: true,
        modal: false,
        conditions: {
          start_date: moment().subtract(1, 'months').format('YYYY-MM-DD'),
          end_date: moment().format('YYYY-MM-DD'),
          item_type: 1,
          order_type: 1
        },
        lists: [],
      }
    },
    created() {
      this.getLists()
    },
    methods: {
      selectDateTime(activeDate) {
        if (activeDate == 'start_date') {
          this.activeDate = 'start_date'
          this.pickerVisible = this.conditions.start_date
        }
        if (activeDate == 'end_date') {
          this.activeDate = 'end_date'
          this.pickerVisible = this.conditions.end_date
        }
        this.$refs.picker.open();
      },
      handleConfirm(date) {
        if (this.activeDate == 'start_date') {
          this.conditions.start_date = moment(date.valueOf()).format('YYYY-MM-DD')
        }
        if (this.activeDate == 'end_date') {
          this.conditions.end_date = moment(date.valueOf()).format('YYYY-MM-DD')
        }
        this.getLists()
      },
      getLists() {
        this.$indicator.open({
          text: '拼命加载...',
          spinnerType: 'fading-circle'
        });
        let params = this.conditions
        // 获取待办事项
        this.spinShow = true
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
