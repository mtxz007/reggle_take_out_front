import axios from "axios";

const OrderApi = {
    //提交订单
    addOrderApi(data) {
        return axios({
            'url': '/order/submit',
            'method': 'post',
            data
        })
    },
    //查询所有订单
    orderListApi() {
        return axios({
            'url': '/order/list',
            'method': 'get',
        })
    },
    //分页查询订单
    orderPagingApi(data) {
        return axios({
            'url': '/order/userPage',
            'method': 'get',
            params: {...data}
        })
    },
    //再来一单
    orderAgainApi(data) {
        return axios({
            'url': '/order/again',
            'method': 'post',
            data
        })
    }
}

export default OrderApi