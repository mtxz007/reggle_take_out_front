<template>
  <div id="address_edit" class="app">
    <div class="divHead">
      <div class="divTitle">
        <i class="el-icon-arrow-left" @click="goBack"></i>{{ title }}
      </div>
    </div>
    <div class="divContent">
<!--      <div class="divItem">-->
<!--        <span>联系人：</span>-->
<!--        <el-input placeholder=" 请填写收货人的姓名" v-model="form.consignee" maxlength='10' class="inputUser">-->
<!--        </el-input>-->
<!--        <span class="spanChecked" @click="form.sex = '1'">-->
<!--                    <i :class="{iActive:form.sex === '1'}"></i>-->
<!--                    先生-->
<!--                   </span>-->
<!--        <span class="spanChecked" @click="form.sex = '0'">-->
<!--                    <i :class="{iActive:form.sex === '0'}"></i>-->
<!--                    女士-->
<!--                </span>-->
<!--      </div>-->
<!--      <div class="divItem">-->
<!--        <span>手机号：</span>-->
<!--        <el-input placeholder=" 请填写收货人手机号码" v-model="form.phone" maxlength='20'-->
<!--                  style="width: calc(100% - 80px);">-->
<!--        </el-input>-->
<!--      </div>-->
<!--      <div class="divItem">-->
<!--        <span>收货地址：</span>-->
<!--        <el-input placeholder=" 请输入收货地址" v-model="form.detail" maxlength='140'>-->
<!--        </el-input>-->
<!--      </div>-->
<!--      <div class="divItem ">-->
<!--        <span>标签：</span>-->
<!--        <span v-for="(item,index) in labelList" :key="index" @click="form.label = item;activeIndex = index"-->
<!--              :class="{spanItem:true,spanActiveSchool:activeIndex === index}">{{ item }}</span>-->
<!--      </div>-->
<!--      <div class="divSave" @click="saveAddress">保存地址</div>-->
<!--      <div class="divDelete" @click="deleteAddress" v-if="id">删除地址</div>-->
      <van-address-edit
          show-delete
          show-set-default
          :show-area="false"
          :address-info="{
            id:id,
            name:form.consignee,
            tel:form.phone,
            addressDetail:form.detail,
            isDefault:form.isDefault === 1
          }"
          @save="saveAddress"
          @delete="deleteAddress"
      />
    </div>
  </div>
</template>

<script>
import AddressApi from "@/api/address";

export default {
    name: "AddressEdit",
    data(){
      return {
        title:'新增收货地址',
        form:{
          consignee:'',//联系人
          phone:undefined,//手机号
          sex:'1',//0表示女 1 表示男
          detail:'',//收货地址
          label:'公司',//标签
          isDefault:0
        },
        labelList:[
          '无','公司','家','学校'
        ],
        /* 以下为组件所需参数 */
        id:this.$store.state.AddRessEditId,
      }
    },
    computed:{},
    created(){
      this.initData()
    },
    mounted(){
    },
    methods:{
      goBack(){
        // history.go(-1)
        this.$router.back()
      },
      async initData(){
        // const params = commonjs.parseUrl(window.location.search)
        // this.id = params.id
        console.log('传过来的id为：',this.id)
        if(this.id){
          this.title = '编辑收货地址'
          const res = await AddressApi.addressFindOneApi(this.id)
          console.log('编辑收货地址：',res)
          if(res.data.code === 1){
            this.form = res.data.data
          }else{
            this.$notify({ type:'warning', message:res.data.msg});
          }
        }
      },
      initForm(content){
        this.form.consignee = content.name
        this.form.phone = content.tel
        this.form.detail = content.addressDetail
        this.form.isDefault = content.isDefault ? 1 : 0
      },
      async saveAddress(content){
        console.log('回调参数：',content)
        this.initForm(content)
        const form = this.form
        console.log('form：',form)
        if(!form.consignee){
          this.$notify({ type:'warning', message:'请输入联系人'});
          return
        }
        if(!form.phone){
          this.$notify({ type:'warning', message:'请输入手机号'});
          return
        }
        if(!form.detail){
          this.$notify({ type:'warning', message:'请输入收货地址'});
          return
        }
        const reg = /^1[3|4|5|7|8][0-9]{9}$/
        if(!reg.test(form.phone)){
          this.$notify({ type:'warning', message:'手机号码不合法'});
          return
        }
        let res= {}
        if(this.id){
          res = await AddressApi.updateAddressApi(this.form)
        }else{
          res = await AddressApi.addAddressApi(this.form)
        }
        console.log('saveAddress:',res)
        if(res.data.code === 1){
          // window.requestAnimationFrame(()=>{
          //   window.location.replace('/front/page/address.html')
          // })
          this.$router.push('/address')
        }else{
          this.$notify({ type:'warning', message:res.data.msg});
        }
      },
      async deleteAddress() {
        const res = await AddressApi.deleteAddressApi({id: this.id})
        console.log('删除地址：', res)
        if (res.data.code === 1) {
          // window.requestAnimationFrame(()=>{
          //   window.location.replace('/front/page/address.html')
          // })
          this.$router.push('/address')
        } else {
          this.$notify({type: 'warning', message: res.data.msg});
        }
      }
    }
  }
</script>

<style scoped>
  /*  {*/
  /*  height: 100%;*/
  /*}*/
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
    height: 100%;
    opacity: 1;
    background: #ffffff;
    padding-left: 9px;
    padding-right: 9px;
  }
  
    .divContent .divItem {
    height: 55px;
    font-size: 14px;
    font-weight: 500;
    text-align: left;
    color: #333333;
    line-height: 20px;
    letter-spacing: 0;
    border-bottom: 1px solid #efefef;
    display: flex;
    align-items: center;
  }
  
    .divContent .divItem .el-input {
    width: auto;
  }
  
    .divContent .divItem input {
    border: 0;
    padding: 0;
  }
  
    .divContent .divItem .inputUser {
    width: 150px;
  }
  
    .divContent .divItem span {
    display: block;
  }
  
    .divContent .divItem span:first-child {
    margin-right: 12px;
    white-space: nowrap;
    width: 69px;
  }
  
    .divContent .divItem .spanChecked {
    width: 50px;
  }
  
    .divContent .divItem span i {
    width: 16px;
    height: 16px;
    background: url(../assets/images/checked_false.png);
    display: inline-block;
    background-size: cover;
    vertical-align: sub;
  }
  
    .divContent .divItem span .iActive {
    background: url(../assets/images/checked_true.png);
    background-size: cover;
  }
  
    .divContent .divItem .spanItem {
    width: 34px;
    height: 20px;
    opacity: 1;
    border: 1px solid #e5e4e4;
    text-align: center;
    margin-right: 10px;
    border-radius: 2px;
    font-weight: 400;
    color: #333333;
  }
  
    .divContent .divItem .spanActiveCompany {
    background: #e1f1fe;
  }
  
    .divContent .divItem .spanActiveHome {
    background: #fef8e7;
  }
  
    .divContent .divItem .spanActiveSchool {
    background: #e7fef8;
  }
  
    .divContent .divItem .el-input__inner {
    font-size: 13px;
    font-weight: 400;
    text-align: left;
    color: #333333;
  }
  
    .divContent .divSave {
    height: 36px;
    opacity: 1;
    background: #ffc200;
    border-radius: 18px;
    font-size: 15px;
    font-weight: 500;
    text-align: center;
    color: #333333;
    line-height: 36px;
    margin-top: 20px;
  }
  
    .divContent .divDelete {
    height: 36px;
    opacity: 1;
    background: #f6f6f6;
    border-radius: 18px;
    font-size: 15px;
    font-weight: 500;
    text-align: center;
    color: #333333;
    line-height: 36px;
    margin-top: 20px;
  }

</style>