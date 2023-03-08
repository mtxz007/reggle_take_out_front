<template>
  <div id="address" class="app">
    <div class="divHead">
      <div class="divTitle">
        <i class="el-icon-arrow-left" @click="goBack"></i>地址管理
      </div>
    </div>
    <div class="divContent">
      <van-address-list
          v-model="chosenAddressId"
          :list="list"
          default-tag-text="默认"
          @add="toAddressCreatePage"
          @edit="toAddressEditPage"
          @select="selectAddress"
      >
        <default v-if="isLayout">
          <van-button type="primary" round block @click="selected">确认</van-button>
        </default>
      </van-address-list>
    </div>
  </div>
</template>

<script>
  import AddressApi from "@/api/address";

  export default {
    name: "AddRess",
    data(){
      return {
        addressList:[], //后端返回的
        list:[],        //实际需要的
        chosenAddressId:'',  //当前选中的id
        beforeLayout:'',  //判断是从user进入的还是下单界面进入的
        isLayout:false,   //判断是否显示确认按钮
      }
    },
    computed:{

    },
    created(){
      this.initData()
      this.beforeLayout = this.$store.state.beforeLayout
    },
    mounted(){
    },
    // watch:{
    //   '$route' (to, from) {
    //     if (from.path === '/user') {
    //       this.beforeLayout = 'user'
    //     } else if (from.path === '/add-order') {
    //       this.beforeLayout = 'addorder'
    //     } else {
    //       this.beforeLayout = ''
    //     }
    //   }
    // },
    methods:{
      goBack(){
        if (this.beforeLayout === 'user'){
          this.$router.push('/user')
        } else {
          this.$router.back()
        }
      },
      toAddressEditPage(item,index){
        // window.requestAnimationFrame(()=>{
        //   window.location.href= `/front/page/address-edit.html?id=${item.id}`
        // })
        console.log('修改的地址id：',this.list[index].id)
        this.$store.state.AddRessEditId = this.list[index].id
        this.$router.push('/address-edit')
      },
      toAddressCreatePage(){
        // window.requestAnimationFrame(()=>{
        //   window.location.href= '/front/page/address-edit.html'
        // })
        this.$store.state.AddRessEditId = undefined
        this.$router.push('/address-edit')
      },
      selectAddress(){
        if (this.beforeLayout === 'address') {
            this.isLayout = true
        }
      },
      async selected() {
        const res = await AddressApi.setDefaultAddressApi({id:this.chosenAddressId})
        if (res.data.code === 1) {
          this.$router.back();
        } else {
          this.$message.error(res.data.msg)
        }
      },
      async initData(){
        const res = await AddressApi.addressListApi()
        console.log('list..',res)
        if(res.data.code === 1){
          this.addressList = res.data.data
          /* 将需要的参数传给list */
          this.initList()
          this.initId()
        }else{
          this.$message.error(res.data.msg)
        }
      },
      initList(){
        this.list = this.addressList.map(item => {
          return {
            id: item.id,
            name: item.consignee,
            tel: item.phone,
            address: item.detail,
            isDefault: item.isDefault === 1
          };
        });
      },
      initId(){
        if (this.list.length > 0) {
          const chosenAddress = this.list.find(item => item.isDefault === true);
          if (chosenAddress) {
            this.chosenAddressId = chosenAddress.id;
          }
        }
      },
      // async setDefaultAddress(item){
      //   if(item.id){
      //     const res = await AddressApi.setDefaultAddressApi({id:item.id})
      //     console.log('setDefault:',res)
      //     if(res.data.code === 1){
      //       this.initData()
      //     }else{
      //       this.$message.error(res.data.msg)
      //     }
      //   }
      // },
      itemClick(item){
        const url = document.referrer
        //表示是从订单页面跳转过来的
        if(url.includes('order')){
          this.setDefaultAddress(item)
          // history.go(-1)
          this.$router.back()
        }
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
  
   .divContent {
    height: calc(100vh - 157px);
    overflow: auto;
  }
  
   .divContent .divItem > img {
    width: 16px;
    height: 16px;
    position: absolute;
    top: 40px;
    right: 24px;
  }
  
   .divContent .divItem .divDefault img {
    width: 16px;
    height: 16px;
    opacity: 1;
  }
  
   .divContent .divItem .divAddress span {
    width: 34px;
    height: 20px;
    opacity: 1;
    font-size: 12px;
    display: inline-block;
    text-align: center;
    margin-right: 4px;
    margin-bottom: 10px;
  }
  
   .divContent .divItem .divUserPhone span {
    height: 20px;
    opacity: 1;
    font-size: 14px;
    font-weight: 400;
    text-align: left;
    color: #999999;
    line-height: 20px;
    letter-spacing: 0;
    margin-right: 10px;
  }
  
   .divContent .divItem .divUserPhone span:first-child {
    margin-right: 2px;
  }

   .divContent .divItem .divDefault img {
    height: 18px;
    width: 18px;
    margin-right: 5px;
    vertical-align: bottom;
  }

</style>