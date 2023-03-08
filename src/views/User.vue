<template>
  <div id="user" class="app">
    <div class="divHead">
      <div class="divTitle">
        <i class="el-icon-arrow-left" @click="goBack"></i>个人中心
      </div>
      <div class="divUser">
        <img src="../assets/images/headPage.png"/>
        <div class="desc">
          <div class="divPhone">{{ userPhone }}</div>
        </div>
      </div>
    </div>
    <div class="divContent">
      <div class="divLinks">
        <div class="item" @click="toAddressPage">
          <img src="../assets/images/locations.png"/>
          <span>地址管理</span>
          <i class="el-icon-arrow-right"></i>
        </div>
        <div class="divSplit"></div>
        <div class="item" @click="toOrderPage">
          <img src="../assets/images/orders.png"/>
          <span>历史订单</span>
          <i class="el-icon-arrow-right"></i>
        </div>
      </div>
      <div class="divOrders" v-if="order[0]">
        <div class="title">最新订单</div>
        <div class="timeStatus">
          <span>{{ order[0].orderTime }}</span>
          <span>{{ getStatus(order[0].status) }}</span>
          <!-- <span>正在派送</span> -->
        </div>
        <div class="dishList">
          <div v-for="(item,index) in order[0].orderDetails" :key="index" class="item">
            <span>{{ item.name }}</span>
            <span>x{{ item.number }}</span>
          </div>
        </div>
        <div class="result">
          <span>共{{ order[0].sumNum }} 件商品,实付</span>
          <span class="price">￥{{ order[0].amount }}</span>
        </div>
      </div>
      <div class="quitLogin" @click="toPageLogin">
        退出登录
      </div>
    </div>
  </div>
</template>

<script>
import OrderApi from "@/api/order";
import LoginApi from "@/api/login";

export default {
  name: "MyUser",
  data() {
    return {
      form: {
        phone: '',
        code: ''
      },
      msgFlag: false,
      order: [{
        orderTime: '',//下单时间
        status: undefined,//订单状态 1已结账，2未结账，3已退单，4已完成，5已取消
        orderDetails: [{
          name: '',//菜品名称
          number: undefined,//数量
        }],//明细
        amount: undefined,//实收金额
        sumNum: 0,//菜品总数
      }],
    }
  },
  computed: {},
  created() {
    this.userPhone = sessionStorage.getItem("userPhone")
    this.initData()
  },
  mounted() {
  },
  methods: {
    goBack() {
      this.$router.push('/index')
    },
    toAddressPage() {
      this.$store.state.beforeLayout = 'user'
      this.$router.push('/address')
    },
    toOrderPage() {
      // window.requestAnimationFrame(()=>{
      //   window.location.href = '/front/page/order.html'
      // })
      this.$router.push('/order')
    },
    initData() {
      this.getLatestOrder()
    },
    async getLatestOrder() {
      const params = {
        page: 1,
        pageSize: 1
      }
      const res = await OrderApi.orderPagingApi(params)
      if (res.data.code === 1) {
        this.order = res.data.data.records
        if (this.order && this.order[0].orderDetails) {
          let number = 0
          this.order[0].orderDetails.forEach(item => {
            number += item.number
          })
          this.order[0].sumNum = number
        }
      } else {
        this.$notify({type: 'warning', message: res.data.msg});
      }
    },
    getStatus(status) {
      let str = ''
      switch (status) {
        case 1:
          str = '待付款'
          break;
        case 2:
          str = '正在派送'
          break;
        case 3:
          str = '已派送'
          break;
        case 4:
          str = '已完成'
          break;
        case 5:
          str = '已取消'
          break;

      }
      return str
    },
    async addOrderAgain() {
      const res = await OrderApi.orderAgainApi({id: this.order[0].id})
      if (res.data.code === 1) {
        // window.requestAnimationFrame(()=>{
        //   window.location.href = '/front/index.html'
        // })
        this.$router.push('/index')
      } else {
        this.$notify({type: 'warning', message: res.data.msg});
      }
    },
    async toPageLogin() {
      const res = await LoginApi.loginoutApi()
      if (res.data.code === 1) {
        // window.requestAnimationFrame(()=>{
        //   window.location.href = '/front/page/login.html'
        // })
        this.$router.push('/')
      } else {
        this.$notify({type: 'warning', message: res.data.msg});
      }
    }
  }
}
</script>

<style scoped>
  .divHead {
    width: 100%;
    height: 164px;
    opacity: 1;
    background: rgb(7, 193, 96);
    box-sizing: border-box;
    padding-left: 12px;
    padding-right: 12px;
  }
  
  .divHead .divTitle {
    height: 25px;
    opacity: 1;
    font-size: 18px;
    font-weight: 500;
    text-align: center;
    color: #333333;
    line-height: 25px;
    letter-spacing: 0;
    padding-top: 50px;
    margin-bottom: 18px;
    position: relative;
  }
  
  .divHead .divTitle i {
    position: absolute;
    left: 0;
    margin-top: 5px;
  }
  
  .divHead .divUser {
    display: flex;
  }
  
  .divHead .divUser > img {
    width: 58px;
    height: 58px;
    border-radius: 50%;
    margin-right: 16px;
  }
  
  .divHead .divUser .desc {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .divHead .divUser .desc .divName {
    opacity: 1;
    font-size: 16px;
    font-weight: 500;
    text-align: left;
    color: #333333;
    margin-right: 6px;
    margin-bottom: 5px;
    display: flex;
    align-items: center;
  }
  
  .divHead .divUser .desc .divName img {
    width: 16px;
    height: 16px;
    opacity: 1;
    margin-left: 6px;
  }
  
  .divHead .divUser .desc .divPhone {
    font-size: 14px;
    font-weight: 400;
    text-align: left;
    color: #333333;
  }
  
  .divContent {
    height: calc(100% - 174px);
    overflow-y: auto;
  }
  
  .divLinks {
    height: 104px;
    opacity: 1;
    background: #ffffff;
    border-radius: 6px;
    padding-left: 17px;
    padding-right: 11px;
    margin: 10px;
  }
  
  .divLinks .item {
    height: 51px;
    line-height: 51px;
    position: relative;
    display: flex;
    align-items: center;
  }
  
  .divLinks .divSplit {
    height: 1px;
    opacity: 1;
    background-color: #ebebeb;
    border: 0;
  }
  
  .divLinks .item img {
    width: 18px;
    height: 18px;
    margin-right: 5px;
  }
  
  .divLinks .item i {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translate(0, -50%);
  }
  
  .divOrders {
    margin: 0 10px 10px 10px;
    background: #ffffff;
    border-radius: 6px;
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 17px;
  }
  
  .divOrders .title {
    height: 60px;
    line-height: 60px;
    opacity: 1;
    font-size: 16px;
    font-weight: 500;
    text-align: left;
    color: #333333;
    letter-spacing: 0;
    border-bottom: 2px solid #efefef;
  }
  
  .divOrders .timeStatus {
    height: 46px;
    font-size: 14px;
    font-weight: 400;
    text-align: left;
    color: #666666;
    line-height: 20px;
    letter-spacing: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px dashed #efefef;
  }
  
  .divOrders .timeStatus span:first-child {
    color: #333333;
  }
  
  .divOrders .dishList {
    padding-top: 10px;
    padding-bottom: 11px;
  }
  
  .divOrders .dishList .item {
    padding-top: 5px;
    padding-bottom: 5px;
    display: flex;
    justify-content: space-between;
    height: 20px;
    opacity: 1;
    font-size: 14px;
    font-weight: 400;
    text-align: left;
    color: #666666;
    line-height: 20px;
    letter-spacing: 0;
  }
  
  .divOrders .result {
    display: flex;
    justify-content: flex-end;
    height: 20px;
    opacity: 1;
    font-size: 14px;
    font-weight: 400;
    text-align: left;
    color: #666666;
    line-height: 20px;
  }
  
  .divOrders .result .price {
    color: black;
  }
  
  .divOrders .btn {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
  
  .divOrders .btn .btnAgain {
    width: 124px;
    height: 36px;
    opacity: 1;
    border: 1px solid #e5e4e4;
    border-radius: 19px;
    font-size: 14px;
    font-weight: 500;
    text-align: center;
    color: #333333;
    line-height: 36px;
    letter-spacing: 0;
    position: relative;
  }
  
  .quitLogin {
    margin: 0 10px 10px 10px;
    height: 50px;
    opacity: 1;
    background: #ffffff;
    border-radius: 6px;
    font-size: 15px;
    font-weight: 500;
    text-align: center;
    color: #333333;
    line-height: 50px;
  }

</style>