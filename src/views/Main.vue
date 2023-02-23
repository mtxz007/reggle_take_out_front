<template>
  <div id="main" class="app">
        <div class="divHead">
<!--          <img src="../assets/images/user.png" @click="toUserPage"/>-->
            <div class="divTitle">
              <i class="el-icon-arrow-left"></i>
              点餐
<!--              <van-icon name="https://b.yzcdn.cn/vant/icon-demo-1126.png" size="40" @click="toUserPage"/>-->
<!--              <van-button type="default" plain  @click="toUserPage">我的</van-button>-->
              <span @click="toUserPage">我的</span>
            </div>
        </div>
<!--    <div class="divTitle">-->
<!--      <div class="divStatic">-->
<!--        <img src="../assets/images/logo.png" class="logo"/>-->
<!--        <div class="divDesc">-->
<!--          <div class="divName">菩提阁餐厅</div>-->
<!--          <div class="divSend">-->
<!--            <span><img src="../assets/images/time.png"/> 距离1.5km</span>-->
<!--            <span><img src="../assets/images/money.png"/> 配送费6元</span>-->
<!--            <span><img src="../assets/images/location.png"/> 预计时长12min</span>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--      <div class="divDesc">-->
<!--        简介: 菩提阁中餐厅是菩提阁点餐的独立的品牌，定位“大众 化的美食外送餐饮”，旨为顾客打造专业美食。-->
<!--      </div>-->
<!--    </div>-->

    <!-- 分割线 -->
    <van-divider/>

    <!-- 商品展示区 -->
    <div class="divBody">

      <!-- van-flex布局 分24栅格 -->
      <van-row type="flex" justify="space-around">

        <!-- 导航栏 设置6栅格 -->
        <van-col span="6">
          <van-sidebar v-model="activeKey">
            <van-sidebar-item v-for="(item,index) in categoryList" :key="index" :title="item.name"
                              @click="categoryClick(index,item.id,item.type)"/>
          </van-sidebar>
        </van-col>

        <!-- 商品栏 设置18栅格 -->
        <van-col span="18">
          <van-card v-for="(item,index) in dishList" :key="index" @click="dishDetails(item)"
                    :thumb="imgPathConvert(item.image)"
                    :title="item.name"
                    :desc="item.description"
                    :price="item.price/100"
          >
            <template #bottom>
              <span style="float: right">
                <van-button v-if="item.number > 0" type="primary" size="mini" icon="minus" round
                            @click.prevent.stop="subtractCart(item)"></van-button>
                {{ item.number }}
                <van-button v-if="item.flavors && item.flavors.length > 0 && !item.number " type="primary" round size="small"
                            @click.prevent.stop="chooseFlavorClick(item)">选择口味</van-button>
                <van-button v-else type="primary" size="mini" icon="plus" round
                            @click.prevent.stop="addCart(item)"></van-button>
              </span>
            </template>
          </van-card>
        </van-col>
      </van-row>
    </div>

    <div class="divLayer">
      <div class="divLayerLeft"></div>
      <div class="divLayerRight"></div>
    </div>

    <!-- 购物车栏 -->
    <van-submit-bar :price="goodsPrice * 100" button-text="提交订单" button-color="rgb(7,193,96)"
                    @submit="toAddOrderPage">
      <van-goods-action-icon icon="cart-o" text="购物车" :badge="goodsNum" @click="openCart"/>
    </van-submit-bar>


    <!-- 选择规格界面 -->
    <van-dialog v-model="dialogFlavor.show" :show-confirm-button="false" class="dialogFlavor" ref="flavorDialog">
      <!-- 标题 -->
      <div class="dialogTitle">{{ dialogFlavor.name }}</div>
      <!-- 口味遍历 -->
      <div class="divContent">
        <div v-for="flavor in dialogFlavor.flavors" :key="flavor.id">
          <div class="divFlavorTitle">{{ flavor.name }}</div>
          <span v-for="item in JSON.parse(flavor.value)"
                :key="item"
                @click="flavorClick(flavor,item)"
                :class="{spanActive:flavor.dishFlavor === item}"
          >{{ item }}</span>
        </div>
      </div>
      <!-- 底部金额及按钮 -->
      <div class="divBottom">
        <div><span class="spanMoney">￥</span>{{ dialogFlavor.price / 100 }}</div>
        <div @click="dialogFlavorAddCart">加入购物车</div>
      </div>
      <!-- 关闭按钮 -->
      <div class="divFlavorClose" @click="dialogFlavor.show = false">
        <img src="../assets/images/close.png"/>
      </div>
    </van-dialog>

    <!-- 购物车界面 底部弹出 -->
    <van-popup v-model="cartDialogShow" round position="bottom" :style="{ height: '50%' }" class="dialogCart">
      <!-- 标题及清空按钮 -->
      <div class="divCartTitle">
        <div class="title">购物车</div>
        <div class="clear" @click="clearCart">
          <i class="el-icon-delete"></i> 清空
        </div>
      </div>
      <!-- 购物车内容 -->
      <div class="divCartContent">
        <div v-for="item in cartData" :key="item.id" class="divCartItem">
          <!-- 图片 -->
          <el-image :src="imgPathConvert(item.image)">
            <div slot="error" class="image-slot">
              <img src="../assets/images/noImg.png"/>
            </div>
          </el-image>
          <!-- 名称及金额 -->
          <div class="divDesc">
            <div class="name">{{ item.name }}</div>
            <div class="price">
              <span class="spanMoney">￥</span>{{ item.amount }}
            </div>
          </div>
          <!-- 加减按钮及数量 -->
          <div class="divNum">
            <div class="divSubtract">
              <!--              <img src="../assets/images/subtract.png" @click="cartNumberSubtract(item)"/>-->
              <van-button type="primary" size="mini" icon="minus" round @click="cartNumberSubtract(item)"></van-button>
            </div>
            <div class="divDishNum">{{ item.number }}</div>
            <div class="divAdd">
              <!--              <img src="../assets/images/add.png" @click="cartNumAdd(item)"/>-->
              <van-button type="primary" size="mini" icon="plus" round @click="cartNumAdd(item)"></van-button>
            </div>
          </div>
          <!-- 各个内容分割 -->
          <div class="divSplit"></div>
          <!--          <van-divider />-->
        </div>
      </div>
      <van-submit-bar :price="goodsPrice * 100" button-text="提交订单" button-color="rgb(7,193,96)"
                      @submit="toAddOrderPage">
        <van-goods-action-icon icon="cart-o" text="购物车" :badge="goodsNum" @click="openCart"/>
      </van-submit-bar>
    </van-popup>

    <!-- 菜品详情信息界面 -->
    <van-dialog v-model="detailsDialog.show"
                :show-confirm-button="false"
                class="detailsDialog"
                ref="detailsDialog"
                v-if="detailsDialog.show"
    >
      <!-- 图片标题及内容 -->
      <div class="divContainer">
        <el-image :src="imgPathConvert(detailsDialog.item.image)">
          <div slot="error" class="image-slot">
            <img src="../assets/images/noImg.png"/>
          </div>
        </el-image>
        <div class="title">{{ detailsDialog.item.name }}</div>
        <div class="content">{{ detailsDialog.item.description }}</div>
      </div>
      <!-- 金额及加减数量 -->
      <div class="divNum">
        <div class="left">
          <span>￥</span><span>{{ detailsDialog.item.price / 100 }}</span>
        </div>
        <div class="right">
          <div class="divSubtract" v-if="detailsDialog.item.number > 0">
            <!--            <img src="../assets/images/subtract.png" @click="subtractCart(detailsDialog.item)"/>-->
            <van-button type="primary" size="mini" icon="minus" round
                        @click="subtractCart(detailsDialog.item)"></van-button>
          </div>
          <div class="divDishNum">{{ detailsDialog.item.number }}</div>
          <!--          <div class="divTypes" v-if="detailsDialog.item.flavors && detailsDialog.item.flavors.length > 0 && !detailsDialog.item.number " @click ="chooseFlavorClick(detailsDialog.item)">选择规格</div>-->
          <van-button class="divTypes"
                      v-if="detailsDialog.item.flavors && detailsDialog.item.flavors.length > 0 && !detailsDialog.item.number "
                      @click="chooseFlavorClick(detailsDialog.item)" type="primary" round size="small">选择口味
          </van-button>
          <div class="divAdd" v-else>
            <!--            <img src="../assets/images/add.png" @click="addCart(detailsDialog.item)"/>-->
            <van-button type="primary" size="mini" icon="plus" round @click="addCart(detailsDialog.item)"></van-button>
          </div>
        </div>
      </div>
      <!-- 关闭按钮 -->
      <div class="detailsDialogClose" @click="detailsDialog.show = false">
        <img src="../assets/images/close.png"/>
      </div>
    </van-dialog>

    <!-- 套餐详情信息界面 -->
    <van-dialog v-model="setMealDialog.show"
                :show-confirm-button="false"
                class="setMealDetailsDialog"
                ref="setMealDetailsDialog"
                v-if="setMealDialog.show"
    >
      <div class="divContainer">
        <!-- 套餐名称及图片 -->
        <div class="title">{{ setMealDialog.item.name }}</div>
        <el-image :src="imgPathConvert(setMealDialog.item.image)">
          <div slot="error" class="image-slot">
            <img src="../assets/images/noImg.png"/>
          </div>
        </el-image>
        <!-- 套餐中的菜品及金额 -->
        <div class="item" v-for="(item,index) in setMealDialog.item.list.setmealDishes" :key="index">
          <div class="divSubTitle">{{ item.name + '(' + item.copies + '份)' }}
            <div class="divPrice">
              <span>￥</span><span>{{ item.price / 100 }}</span>
            </div>
          </div>
          <div class="content">{{ item.description }}</div>
        </div>
      </div>
      <!-- 套餐总金额 -->
      <div class="divNum">
        <div class="left">
          <span>￥</span><span>{{ setMealDialog.item.price / 100 }}</span>
        </div>
        <div class="right">
          <div class="divSubtract" v-if="setMealDialog.item.number > 0">
            <!--            <img src="../assets/images/subtract.png" @click="subtractCart(setMealDialog.item)"/>-->
            <van-button type="primary" size="mini" icon="minus" round
                        @click="subtractCart(setMealDialog.item)"></van-button>
          </div>
          <div class="divDishNum">{{ setMealDialog.item.number }}</div>
          <div class="divAdd" v-if="setMealDialog.item.number">
            <!--            <img src="../assets/images/add.png" @click="addCart(setMealDialog.item)"/>-->
            <van-button type="primary" size="mini" icon="plus" round @click="addCart(setMealDialog.item)"></van-button>
          </div>
          <div class="addCart" @click="addCart(setMealDialog.item)" v-if="!setMealDialog.item.number">加入购物车</div>
        </div>
      </div>
      <!-- 关闭按钮 -->
      <div class="detailsDialogClose" @click="setMealDialog.show = false">
        <img src="../assets/images/close.png"/>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import MainApi from "@/api/main";
import commonjs from "@/assets/js/common";

export default {
    name: "MyMain",
    data() {
      return {
        activeKey: 0,
        //左边菜品类别index
        activeType: 0,
        categoryList: [],
        categoryId: undefined,
        dishList: [],
        cartData: [],
        dialogFlavor: {
          name: '',
          flavors: [],
          dishId: undefined,
          price: undefined,
          show: false,
          image: ''
        },
        cartDialogShow: false,
        detailsDialog: {
          show: false,
          item: {image: ''}
        },
        setMealDialog: {
          show: false,
          item: {}
        },
      }
    },
    computed: {
      goodsNum() {
        let num = 0
        this.cartData.forEach(item => {
          num += item.number
        })
        if (num < 99) {
          return num
        } else {
          return '99+'
        }
      },
      goodsPrice() {
        let price = 0
        this.cartData.forEach(item => {
          price += (item.number * item.amount)
        })
        return price
      },
    },
    created() {
    },
    watch: {
      // 更改购物车栏zIndex属性
      // 'dialogFlavor.show'(flag){
      //   if(flag){
      //     document.querySelector('.divCart').style.zIndex = 1
      //   }else{
      //     document.querySelector('.divCart').style.zIndex = 3000
      //   }
      // },
    },
    mounted() {
      this.initData()
    },
    methods: {
      //初始化数据
      initData() {
        Promise.all([MainApi.categoryListApi(), MainApi.cartListApi({})]).then(res => {
          console.log('获取分类数据:', res)
          //获取分类数据
          if (res[0].data.code === 1) {
            this.categoryList = res[0].data.data
            if (Array.isArray(res[0].data.data) && res[0].data.data.length > 0) {
              this.categoryId = res[0].data.data[0].id
              if (res[0].data.data[0].type === 1) {
                this.getDishList()
              } else {
                this.getSetmealData()
              }
            }
          } else {
            this.$notify({type: 'warning', message: res[0].data.msg});
          }
          //获取菜品数据
          if (res[1].data.code === 1) {
            this.cartData = res[1].data.data
          } else {
            this.$notify({type: 'warning', message: res[1].data.msg});
          }
        })
      },
      //分类点击
      categoryClick(index, id, type) {
        this.activeType = index
        this.categoryId = id
        if (type === 1) {//菜品
          this.getDishList()
        } else {
          this.getSetmealData()
        }
      },
      //各分类数量
      categoryNum(){
        return this.dishList.reduce((accumulator, currentValue) => {
          if (currentValue.number) {
            return accumulator + currentValue.number;
          } else {
            return accumulator;
          }
        }, 0)
      },

      //获取菜品数据
      async getDishList() {
        if (!this.categoryId) {
          return
        }
        const res = await MainApi.dishListApi({categoryId: this.categoryId, status: 1})
        console.log('获取菜品数据：', res)
        if (res.data.code === 1) {
          let dishList = res.data.data
          const cartData = this.cartData
          if (dishList.length > 0 && cartData.length > 0) {
            dishList.forEach(dish => {
              cartData.forEach(cart => {
                if (dish.id === cart.dishId) {
                  dish.number = cart.number
                }
              })
            })
          }
          this.dishList = dishList
        } else {
          this.$notify({type: 'warning', message: res.data.msg});
        }
      },
      //获取套餐数据setmealId
      async getSetmealData() {
        if (!this.categoryId) {
          return
        }
        const res = await MainApi.setmealListApi({categoryId: this.categoryId, status: 1})
        console.log('获取套餐数据:', res)
        if (res.data.code === 1) {
          let dishList = res.data.data
          const cartData = this.cartData
          if (dishList.length > 0 && cartData.length > 0) {
            dishList.forEach(dish => {
              cartData.forEach(cart => {
                if (dish.id === cart.setmealId) {
                  dish.number = cart.number
                }
              })
            })
          }
          this.dishList = dishList
        } else {
          this.$notify({type: 'warning', message: res.data.msg});
        }
      },
      //获取购物车数据
      async getCartData() {
        const res = await MainApi.cartListApi({})
        console.log('获取购物车数据：', res)
        if (res.data.code === 1) {
          this.cartData = res.data.data
        } else {
          this.$notify({type: 'warning', message: res.data.msg});
        }
      },
      //菜单中往购物车中添加商品
      async addCart(item) {
        let params = {
          amount: item.price / 100,//金额
          dishFlavor: item.dishFlavor,//口味  如果没有传undefined
          dishId: undefined,//菜品id
          setmealId: undefined,//套餐id
          name: item.name,
          image: item.image
        }
        if (Array.isArray(item.flavors)) {//表示是菜品
          params.dishId = item.id
        } else {//表示套餐 套餐没有口味
          params.setmealId = item.id
        }
        const res = await MainApi.addCartApi(params)
        console.log('addCart...', res)
        if (res.data.code === 1) {
          this.dishList.forEach(dish => {
            if (dish.id === item.id) {
              dish.number = res.data.data.number
            }
          })
          if (this.setMealDialog.show) {
            item.number = res.data.data.number
          }
          this.getCartData()
        } else {
          this.$notify({type: 'warning', message: res.data.msg});
        }
      },

      //菜单中减少选中的商品
      async subtractCart(item) {
        let params = {
          dishId: item.id,
        }
        if (!Array.isArray(item.flavors)) {
          params = {
            setmealId: item.id,
          }
        }
        console.log('params:', params)
        const res = await MainApi.updateCartApi(params)
        console.log('updateCart...', res)
        if (res.data.code === 1) {
          this.dishList.forEach(dish => {
            if (dish.id === item.id) {
              dish.number = (res.data.data.number === 0 ? undefined : res.data.data.number)
              // console.log('dish:',dish)
            }
          })
          if (this.setMealDialog.show) {
            item.number = (res.data.data.number === 0 ? undefined : res.data.data.number)
          }
          this.getCartData()
        } else {
          this.$notify({type: 'warning', message: res.data.msg});
        }
      },

      //展开购物车
      openCart() {
        if (this.cartData.length > 0) {
          this.cartDialogShow = true
        }
      },
      //购物车中增加商品数量
      async cartNumAdd(item) {
        let params = {
          amount: item.amount,//金额
          dishFlavor: item.dishFlavor,//口味  如果没有传undefined
          dishId: item.dishId,//菜品id
          setmealId: item.setmealId,//套餐id
          name: item.name,
          image: item.image
        }
        const res = await MainApi.addCartApi(params)
        console.log('addCart...', res)
        if (res.data.code === 1) {
          this.dishList.forEach(dish => {
            if (dish.id === (item.dishId || item.setmealId)) {
              dish.number = res.data.data.number
            }
          })
          console.log('dishList:', this.dishList)
          this.getCartData()
        } else {
          this.$notify({type: 'warning', message: res.data.msg});
        }
      },
      //购物车中减少商品数量
      async cartNumberSubtract(item) {
        let params = {
          dishId: item.dishId,
          setmealId: item.setmealId,
        }
        const res = await MainApi.updateCartApi(params)
        console.log('updateCart...', res)
        if (res.data.code === 1) {
          this.dishList.forEach(dish => {
            if (dish.id === (item.dishId || item.setmealId)) {
              dish.number = (res.data.data.number === 0 ? undefined : res.data.data.number)
              // console.log('dish:',dish)
            }
          })
          this.getCartData()
        } else {
          this.$notify({type: 'warning', message: res.data.msg});
        }
      },

      //修改商品列表中的数据number
      changeDishList(item) {
        for (let ele of this.dishList) {
          if (ele.id === (item.setmealId || item.dishId)) {
            ele.number = item.number
          }
        }
      },

      //清空购物车
      async clearCart() {
        const res = await MainApi.clearCartApi()
        console.log('清空购物车：', res)
        if (res.data.code === 1) {
          for (let ele of this.dishList) {
            ele.number = undefined
          }
          this.cartData = []
          this.cartDialogShow = false
        } else {
          this.$notify({type: 'warning', message: res.data.msg});
        }
      },
      //点击选择规格
      chooseFlavorClick(item) {
        this.dialogFlavor = {
          name: '',
          flavors: [],
          dishId: undefined,
          price: undefined,
          show: false
        }
        this.dialogFlavor = {
          name: item.name,
          flavors: item.flavors,
          dishId: item.id,
          price: item.price,
          show: true,
          image: item.image
        }
      },
      flavorClick(flavor, item) {
        flavor.dishFlavor = item
        //强制刷新dialog的dom
        this.dialogFlavor.show = false
        this.dialogFlavor.show = true
      },
      //选择规格加入购物车
      dialogFlavorAddCart() {
        const dialogFlavor = this.dialogFlavor
        let flag = true
        let dishFlavor = []
        dialogFlavor.flavors.forEach(item => {
          if (item.dishFlavor) {
            dishFlavor.push(item.dishFlavor)
          } else {
            flag = false
            this.$notify({type: 'warning', message: '请选择' + item.name});
          }
        })
        console.log('口味选择：', dishFlavor)
        if (flag) {
          this.addCart({
            price: dialogFlavor.price,
            dishFlavor: dishFlavor.join(","),
            id: dialogFlavor.dishId,
            flavors: [],
            image: dialogFlavor.image,
            name: dialogFlavor.name
          })
          this.dialogFlavor.show = false
        }

      },
      //网络图片路径转换
      imgPathConvert(path) {
        return commonjs.imgPath(path)
      },
      //跳转到去结算界面
      toAddOrderPage() {
        if (this.cartData.length > 0) {
          // window.requestAnimationFrame(()=>{
          //   window.location.href ='/front/page/add-order.html'
          // })
          this.$router.push('/add-order')
        }
      },
      toUserPage() {
        // window.requestAnimationFrame(() => {
        //   window.location.href = '/front/page/user.html'
        // })
        this.$router.push('/user')
      },
      async dishDetails(item) {
        //先清除对象数据，如果不行的话dialog使用v-if
        this.detailsDialog.item = {}
        this.setMealDialog.item = {}
        if (Array.isArray(item.flavors)) {
          this.detailsDialog.item = item
          this.detailsDialog.show = true
        } else {
          //显示套餐的数据
          const res = await MainApi.setMealDishDetailsApi(item.id)
          console.log('显示套餐的数据：', res)
          if (res.data.code === 1) {
            this.setMealDialog.item = {...item, list: res.data.data}
            this.setMealDialog.show = true
          } else {
            this.$notify({type: 'warning', message: res.data.msg});
          }
        }
      }
    }
  }
</script>

<style scoped>
/*.right img{*/
/*  width: 36rem;*/
/*  height: 36rem;*/
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
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.divHead .divTitle i {
  margin-left: 16px;
}


/* 选择口味样式 */
.dialogFlavor {
  opacity: 1;
  background: #ffffff;
  border-radius: 10px;
}

.dialogFlavor .dialogTitle {
  margin-top: 26px;
  margin-bottom: 14px;
  font-size: 18px;
  font-weight: 500;
  color: #333333;
  letter-spacing: 0;
  text-align: center;
}

.dialogFlavor .divContent {
  margin-left: 15px;
  margin-right: 15px;
}

.dialogFlavor .divContent .divFlavorTitle {
  height: 20px;
  opacity: 1;
  font-size: 14px;
  font-weight: 400;
  text-align: left;
  color: #666666;
  line-height: 20px;
  letter-spacing: 0;
  margin-left: 5px;
  margin-bottom: 10px;
  margin-top: 10px;
}

.dialogFlavor .divContent span {
  display: inline-block;
  height: 30px;
  opacity: 1;
  background: #ffffff;
  border: 1px solid rgb(7, 193, 96);
  border-radius: 7px;
  line-height: 30px;
  padding-left: 13px;
  padding-right: 13px;
  margin: 0 5px 10px 5px;
  font-size: 14px;
  font-weight: 400;
  text-align: center;
  color: #333333;
}

.dialogFlavor .divContent .spanActive {
  background: rgb(7, 193, 96);
  font-weight: 500;
}

.dialogFlavor .divBottom {
  margin-top: 20px;
  margin-bottom: 19px;
  margin-left: 20px;
  display: flex;
  position: relative;
}

.dialogFlavor .divBottom div:first-child {
  height: 30px;
  opacity: 1;
  font-size: 20px;
  font-weight: 500;
  text-align: left;
  color: #e94e3c;
  line-height: 30px;
  letter-spacing: 0;
}

.dialogFlavor .divBottom div span {
  font-size: 14px;
}

.dialogFlavor .divBottom div:last-child {
  width: 100px;
  height: 30px;
  opacity: 1;
  background: rgb(7, 193, 96);
  /*border-radius: 15px;*/
  text-align: center;
  line-height: 30px;
  position: absolute;
  right: 20px;
  font-size: 14px;
  font-weight: 500;
  color: #333333;
}

.dialogFlavor .divFlavorClose {
  /*position: absolute;*/
  bottom: -70px;
  left: 50%;
  /*transform: translate(-50%, 0);*/
  text-align: center;
}

.dialogFlavor .divFlavorClose img {
  width: 44px;
  height: 44px;
}

/* 菜单详情页样式 */
.detailsDialog {
  display: flex;
  flex-direction: column;
  text-align: center;
}

.detailsDialog .divContainer {
  padding: 20px 20px 0 20px;
  overflow: auto;
  max-height: 50vh;
}

.detailsDialog .el-image {
  width: 100%;
  height: 100%;
}

.detailsDialog .el-image img {
  width: 100%;
  height: 100%;
}

.detailsDialog .title {
  height: 28px;
  opacity: 1;
  font-size: 20px;
  font-weight: 600;
  color: #333333;
  line-height: 28px;
  letter-spacing: 0;
  margin-top: 18px;
  margin-bottom: 11px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

.detailsDialog .content {
  opacity: 1;
  font-size: 14px;
  font-weight: 400;
  text-align: justify;
  color: #333333;
  line-height: 24px;
}

.detailsDialog .divNum {
  display: flex;
  justify-content: space-between;
  margin-top: 23px;
  margin-bottom: 20px;
  padding-left: 20px;
  padding-right: 20px;
}

.detailsDialog .divNum .left {
  font-size: 20px;
  font-weight: 500;
  text-align: left;
  color: #e94e3c;
  line-height: 36px;
  letter-spacing: 0;
}

.detailsDialog .divNum .left span:first-child {
  font-size: 12px;
}

.detailsDialog .divNum .right {
  display: flex;
}

.detailsDialog .divNum .divDishNum {
  font-size: 15px;
  font-weight: 500;
  text-align: center;
  color: #333333;
  line-height: 36px;
  letter-spacing: 0;
  width: auto;
  margin-left: 4px;
  margin-right: 4px;
  padding-bottom: 6px;
}

.detailsDialog .divNum .divTypes {
  /*width: 64px;*/
  /*height: 24px;*/
  /*opacity: 1;*/
  /*background: rgb(7,193,96);*/
  /*!*border-radius: 12px;*!*/
  /*font-size: 12px;*/
  /*font-weight: 500;*/
  /*text-align: center;*/
  /*color: #333333;*/
  /*line-height: 24px;*/
  /*letter-spacing: 0;*/
}

.detailsDialog .divNum .divSubtract, .divAdd {
  height: 36px;
}

.detailsDialog .detailsDialogClose {
  /*position: absolute;*/
  bottom: -70px;
  left: 50%;
  /*transform: translate(-50%, 0);*/
  text-align: center;
}

.detailsDialog .detailsDialogClose img {
  width: 44px;
  height: 44px;
}

/*购物车界面样式*/
.dialogCart {
  background: linear-gradient(180deg, #ffffff 0%, #ffffff 81%);
  border-radius: 12px 12px 0px 0px;
}

.dialogCart .divCartTitle {
  height: 59px;
  display: flex;
  line-height: 60px;
  position: relative;
  margin-left: 15px;
  margin-right: 10px;
  border-bottom: 1px solid #efefef;
}

.dialogCart .divCartTitle .title {
  font-size: 20px;
  font-weight: 600;
  text-align: left;
  color: #333333;
}

.dialogCart .divCartTitle i {
  margin-right: 3px;
  font-size: 15px;
  vertical-align: middle;
}

.dialogCart .divCartTitle .clear {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(0, -50%);
  color: #999999;
  font-size: 14px;
  font-weight: 400;
  text-align: left;
}

.dialogCart .divCartContent {
  height: calc(100% - 130px);
  overflow-y: auto;
}

.dialogCart .divCartItem {
  height: 108px;
  margin-left: 15px;
  margin-right: 10px;
  display: flex;
  align-items: center;
  position: relative;
}

.dialogCart .divCartContent .el-image {
  width: 64px;
  height: 64px;
  opacity: 1;
  margin-right: 10px;
}

.dialogCart .divCartContent .el-image img {
  width: 64px;
  height: 64px;
}

.dialogCart .divCartContent .divDesc .name {
  height: 22px;
  opacity: 1;
  font-size: 16px;
  font-weight: 600;
  text-align: left;
  color: #333333;
  line-height: 22px;
  letter-spacing: 0;
  margin-bottom: 17px;
}

.dialogCart .divCartContent .divDesc .price {
  font-size: 18px;
  font-weight: 500;
  text-align: left;
  color: #e94e3c;
}

.dialogCart .divCartContent .divDesc .price .spanMoney {
  font-size: 12px;
}

.dialogCart .divCartContent .divCartItem .divNum {
  position: absolute;
  right: 0;
  bottom: 10px;
  display: flex;
  line-height: 36px;
  height: 36px;
}

.dialogCart .divCartContent .divCartItem .divNum .divDishNum {
  margin-left: 4px;
  margin-right: 4px;
  padding-top: 5px;
}

.dialogCart .divCartContent .divCartItem .divNum van-button {
  /*width: 36px;*/
  /*height: 36px;*/
}

.dialogCart .divCartContent .divCartItem .divSplit {
  width: calc(100% - 64px);
  position: absolute;
  bottom: 0;
  right: 0;
  height: 1px;
  opacity: 1;
  background-color: #efefef;
}

.dialogCart .divCartContent .divCartItem:last-child .divSplit {
  height: 0;
}

/* 套餐详情页效果 */
.setMealDetailsDialog {
  display: flex;
  flex-direction: column;
  text-align: center;
}

.setMealDetailsDialog .divContainer {
  padding: 20px 20px 0 20px;
  overflow: auto;
  max-height: 50vh;
}

.setMealDetailsDialog .title {
  height: 28px;
  opacity: 1;
  font-size: 20px;
  font-weight: 600;
  color: #333333;
  line-height: 28px;
  letter-spacing: 0;
  margin-top: 18px;
  margin-bottom: 11px;
}

.setMealDetailsDialog .el-image {
  width: 100%;
  height: 100%;
}

.setMealDetailsDialog .el-image img {
  width: 100%;
  height: 100%;
}

.setMealDetailsDialog .divSubTitle {
  text-align: left;
  margin-top: 16px;
  margin-bottom: 6px;
  height: 25px;
  opacity: 1;
  font-size: 18px;
  font-weight: 500;
  color: #333333;
  line-height: 25px;
  letter-spacing: 0;
  position: relative;
}

.setMealDetailsDialog .divContainer .item .divSubTitle .divPrice {
  position: absolute;
  right: 0;
  top: 0;
  font-size: 18px;
  font-weight: 500;
  text-align: left;
  color: #e94e3c;
  line-height: 25px;
  letter-spacing: 0;
}

.setMealDetailsDialog .content {
  opacity: 1;
  font-size: 14px;
  font-weight: 400;
  text-align: justify;
  color: #333333;
  line-height: 24px;
}

.setMealDetailsDialog .divNum {
  display: flex;
  justify-content: space-between;
  margin-top: 23px;
  padding-bottom: 15px;
  padding-left: 20px;
  padding-right: 20px;
}

.setMealDetailsDialog .divNum .left {
  font-size: 20px;
  font-weight: 500;
  text-align: left;
  color: #e94e3c;
  line-height: 36px;
  letter-spacing: 0;
}

.setMealDetailsDialog .divNum .left span:first-child {
  font-size: 12px;
}

.setMealDetailsDialog .divNum .right {
  display: flex;
}

.setMealDetailsDialog .divNum .divDishNum {
  font-size: 15px;
  font-weight: 500;
  text-align: center;
  color: #333333;
  line-height: 36px;
  letter-spacing: 0;
  width: auto;
}

.setMealDetailsDialog .divNum .divTypes {
  width: 64px;
  height: 24px;
  opacity: 1;
  background: #ffc200;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  color: #333333;
  line-height: 24px;
  letter-spacing: 0;
}

.setMealDetailsDialog .divNum .divSubtract, .divAdd {
  height: 36px;
}

.setMealDetailsDialog .divNum img {
  width: 36px;
  height: 36px;
}

.setMealDetailsDialog .divNum .right .addCart {
  width: 100px;
  height: 30px;
  opacity: 1;
  background: rgb(7, 193, 96);
  /*border-radius: 15px;*/
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  color: #333333;
  line-height: 30px;
}

.setMealDetailsDialog .detailsDialogClose {
  /*position: absolute;*/
  bottom: -70rem;
  left: 50%;
  /*transform: translate(-50%, 0);*/
  text-align: center;
}

.setMealDetailsDialog .detailsDialogClose img {
  width: 44px;
  height: 44px;
}

</style>