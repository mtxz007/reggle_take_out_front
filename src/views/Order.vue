<template>
  <div id="order" class="app">
    <div class="divHead">
      <div class="divTitle">
        <i class="el-icon-arrow-left" @click="goBack"></i>订单明细
      </div>
    </div>
    <div class="divBody" v-if="orderList.length > 0">
      <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="getList"
      >
        <van-cell v-for="(order,index) in orderList" :key="index" class="item">
          <div class="timeStatus">
            <span>{{ order.orderTime }}</span>
            <span>{{ getStatus(order.status) }}</span>
            <!-- <span>正在派送</span> -->
          </div>
          <div class="dishList">
            <div v-for="(item,index) in order.orderDetails" :key="index" class="item">
              <span>{{ item.name }}</span>
              <span>{{ item.number }}</span>
            </div>
          </div>
          <div class="result">
            <span>共{{ order.sumNum }} 件商品,实付</span><span class="price">￥{{ order.amount }}</span>
          </div>
        </van-cell>
      </van-list>
    </div>
    <div class="divNoData" v-else>
      <div class="divContainer">
        <img src="../assets/images/no_order.png"/>
        <div>暂无订单</div>
      </div>
    </div>
  </div>
</template>

<script>
  import OrderApi from "@/api/order";

  export default {
    name: "MyOrder",
    data(){
      return {
        paging:{
          page:1,
          pageSize:5
        },
        orderList:[],
        loading:false,
        finished:false
      }
    },
    computed:{},
    created(){
      this.initData()
    },
    mounted(){},
    methods:{
      goBack(){
        const url = document.referrer
        //表示是从订单页面跳转过来的
        if(url.includes('success')){
          // window.requestAnimationFrame(()=>{
          //   window.location.href= '/front/index.html'
          // })
          this.$router.push('/index')
        }else{
          // history.go(-1)
          this.$router.back()
        }
      },
      initData(){
        this.getList()
      },
      async getList(){
        if(this.finished){
          this.loading = false;
          return
        }
        const res = await OrderApi.orderPagingApi(this.paging)
        console.log('getList..',res)
        if(res.data.code === 1){
          this.orderList.push(...res.data.data.records)
          let records = res.data.data.records
          if(records && Array.isArray(records)){
            records.forEach(item=>{
              let number = 0
              item.orderDetails.forEach(ele=>{
                number += ele.number
              })
              item.sumNum = number
            })
          }
          this.loading = false;
          if(this.paging.page >= res.data.data.pages){
            this.finished = true;
          }
          this.paging.page = this.paging.page + 1
        }else{
          this.$notify({ type:'warning', message:res.data.msg});
        }
      },
      async addOrderAgain(order){
        const res = await OrderApi.orderAgainApi({id:order.id})
        if(res.data.code === 1){
          window.requestAnimationFrame(()=>{
            window.location.href= '/front/index.html'
          })
        }else{
          this.$notify({ type:'warning', message:res.data.msg});
        }
      },
      getStatus(status){
        let str = ''
        switch(status){
          case 1:
            str =  '待付款'
            break;
          case 2:
            str =  '正在制作'
            break;
          case 3:
            str =  '正在派送'
            break;
          case 4:
            str =  '已完成'
            break;
          case 5:
            str =  '已取消'
            break;
        }
        return str
      }
    }
  }
</script>

<style scoped>
   .divHead {
    width: 100%;
    height: 88px;
    opacity: 1;
    background: #333333;
    position: relative;
  }
  
   .divHead .divTitle {
    font-size: 18px;
    font-weight: 500;
    text-align: center;
    color: #ffffff;
    line-height: 25px;
    letter-spacing: 0;
    position: absolute;
    bottom: 13px;
    width: 100%;
  }
  
   .divHead .divTitle i {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translate(0, -50%);
  }
  
   .divBody {
    margin: 10px 12px 10px 12px;
    background: #ffffff;
    border-radius: 6px;
    padding-left: 10px;
    padding-right: 10px;
    height: calc(100% - 108px);
    overflow-y: auto;
  }
  
   .divBody .van-list .van-cell::after {
    border: 0;
  }
  
   .divBody .item .timeStatus {
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
    border-top: 1px solid #efefef;
  }
  
   .divBody .item .timeStatus span:first-child {
    color: #333333;
  }
  
   .divBody .item .dishList {
    padding-top: 10px;
    padding-bottom: 11px;
  }
  
   .divBody .item .dishList .item {
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
  
   .divBody .item .result {
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
  
   .divBody .item .result .price {
    color: #343434;
  }
  
   .divBody .item .btn {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 17px;
    margin-top: 20px;
  }
  
   .divBody .btn .btnAgain {
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
  
   .divNoData {
    width: 100%;
    height: calc(100% - 88px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
   .divNoData .divContainer img {
    width: 240px;
    height: 129px;
  }
  
   .divNoData .divContainer div {
    font-size: 24px;
    font-weight: 500;
    text-align: center;
    color: #333333;
    line-height: 33px;
    height: 33px;
    margin-top: 20px;
  }

</style>