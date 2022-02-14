<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 我的服务
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <span style="position: relative; bottom: 7px">编号：</span>
                <el-input v-model="query.orderNum" placeholder="请输入订单编号" class="handle-input mr10"></el-input>
                <span style="position: relative; bottom: 7px">服务名称：</span>
                <el-input v-model="query.serviceName" placeholder="请输入服务名称" class="handle-input mr10"></el-input>
                <span style="position: relative; bottom: 7px">状态：</span>
                <el-select v-model="query.orderStatus" placeholder="请选择状态" class="handle-select mr10">
                    <el-option key="99" label="全部" value="99"></el-option>
                    <el-option key="0" label="待发货" value="1"></el-option>
                    <el-option key="1" label="服务中" value="2"></el-option>
                    <el-option key="2" label="已完成" value="3"></el-option>
                </el-select>

                <el-button style="position: relative; bottom: 7px" type="primary" icon="el-icon-search"
                           @click="getTableData" class="reset">搜索
                </el-button>
                <el-button style="position: relative; bottom: 7px" type="primary" icon="el-icon-search"
                           @click="resetTableData" class="reset">重置
                </el-button>
            </div>
            <el-table :data="list" v-loading="isLoading" class="table" ref="multipleTable"
                      header-cell-class-name="table-header">
                <el-table-column label="序号" type="index" width="55"></el-table-column>
                <el-table-column prop="orderNum" label="订单编号"></el-table-column>
                <el-table-column prop="serviceName" label="服务名称"></el-table-column>
                <el-table-column prop="amount" label="购买数量"></el-table-column>
                <el-table-column prop="totalPrice" label="付款金额"></el-table-column>
                <el-table-column prop="createTime" label="下单时间"></el-table-column>
                <el-table-column width="100%" prop="orderStatus" label="状态" align="center">
                    <template #default="scope">
                        <el-tag :type="
                                scope.row.orderStatus === '1'
                                    ? 'info'
                                    : scope.row.orderStatus === '3' ? 'success' : ''
                            ">{{ scope.row.orderStatus === '1' ? "待发货" : scope.row.orderStatus === '2' ? "服务中" :
                            "已完成"}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template #default="scope">
                        <el-button type="text" icon="el-icon-lx-text" class="blue"
                                   @click="orderDetails(scope.row.id)">详情
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background layout="total, sizes, prev, pager, next, jumper"
                               :current-page="query.pageIndex"
                               :page-size="query.pageSize"
                               :total="query.total"
                               :page-sizes="[10,20,30,50]"
                               @prev-click="prePage"
                               @next-click="nextPage"
                               @size-change="sizeChange"
                               @current-change="currentPage"></el-pagination>
            </div>
        </div>
        <!-- 详情弹出框 -->
        <el-dialog title="详情" v-model="detailsVisible">
            <el-form label-width="27%">
                <el-form-item label="编号：">
                    <span>{{detailsInfo.orderNum}}</span>
                </el-form-item>
                <el-form-item label="下单人：">
                    <span>{{detailsInfo.createUserName}}</span>
                </el-form-item>
                <el-form-item label="电话：">
                    <span>{{detailsInfo.phone}}</span>
                </el-form-item>
                <el-form-item label="名称：">
                    <span>{{detailsInfo.serviceName}}</span>
                </el-form-item>
                <el-form-item label="数量：">
                    <span>{{detailsInfo.amount}}</span>
                </el-form-item>
                <el-form-item label="付款金额：">
                    <span>{{detailsInfo.totalPrice}}</span>
                </el-form-item>
                <el-form-item label="备注：">
                    <span>{{detailsInfo.remark}}</span>
                </el-form-item>
                <el-form-item label="下单时间：">
                    <span>{{detailsInfo.createTime}}</span>
                </el-form-item>
                <el-form-item label="状态：">
                    <el-steps :active="detailsInfo.orderStatus === '1'?detailsInfo.orderStatus-1:detailsInfo.orderStatus" finish-status="success">
                        <el-step
                                :title="detailsInfo.orderStatus === '0'?'待发货':detailsInfo.orderStatus === '1'?'待发货':'已发货'"
                                :description="`付款时间：`+detailsInfo.createTime"></el-step>
                        <el-step title="服务中"
                                 :description="`发货时间：`+(detailsInfo.sendTime===null?'':detailsInfo.sendTime)"></el-step>
                        <el-step title="已完成"
                                 :description="`完成时间：`+(detailsInfo.completeTime===null?'':detailsInfo.completeTime)"></el-step>
                    </el-steps>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="endService(detailsInfo.id)" :disabled="detailsInfo.orderStatus === '1'?false:true">发 货</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import {ElMessage, ElMessageBox} from "element-plus";
    import axios from "axios";
    import {reactive, ref} from "vue";

    export default {
        name: "MyOrders",
        data() {
            return {
                TStatus: '1',
                //查询参数
                query: reactive({
                    orderNum: '',
                    serviceName: '',
                    orderStatus: null,
                    pageIndex: 1,
                    pageNo: 1,
                    pageSize: 10,
                    total: 0,
                }),
                isLoading: false,
                //列表数据
                list: null,
                detailsVisible: ref(false),
                //详情参数
                detailsInfo: reactive({
                    id: '',
                    orderNum: "",
                    createUserName: "",
                    phone: "",
                    serviceName: "",
                    amount: "",
                    totalPrice: "",
                    orderStatus: "",
                    sendTime: "",
                    completeTime: "",
                    remark: "",
                    createTime: "",
                }),
            }
        },
        mounted() {
            this.getTableData();
        },
        methods: {
            //获取表格信息
            getTableData() {
                this.isLoading = true;
                axios.post('http://localhost:8762/thirdparty/order/list', {
                    orderNum: this.query.orderNum,
                    serviceName: this.query.serviceName,
                    orderStatus: this.query.orderStatus === '99' ? null : this.query.orderStatus,
                    pageNo: this.query.pageNo,
                    pageSize: this.query.pageSize,
                }, {
                    headers: {
                        authorization: localStorage.getItem("token")
                    }
                }).then(res => {
                    console.log(res.data);
                    if (res.data.code !== 1000) {
                        if (res.data.code === 999) {
                            ElMessage.error(res.data.message);
                            this.$router.push("/login");
                        }
                        ElMessage.error(res.data.message);
                        return false;
                    } else {
                        this.list = res.data.data.list;
                        this.query.total = res.data.data.total;
                        setTimeout(() => {
                            this.isLoading = false;
                        }, 0.5 * 1000);
                    }
                })
            },

            //重置查询
            resetTableData() {
                this.query.orderNum = '',
                    this.query.serviceName = '',
                    this.query.orderStatus = null,
                    this.query.pageIndex = 1,
                    this.query.pageNo = 1,
                    this.query.pageSize = 10,
                    this.getTableData();
            },

            //上一页
            prePage(currentNo) {
                this.query.pageNo = currentNo;
                this.getTableData();
            },

            //下一页
            nextPage(currentNo) {
                this.query.pageNo = currentNo;
                this.getTableData();
            },

            //pagesize改变
            sizeChange(size) {
                this.query.pageSize = size;
                this.getTableData();
            },

            //当前页改变
            currentPage(currentNo) {
                this.query.pageNo = currentNo;
                this.getTableData();
            },

            //详情
            orderDetails(id) {
                axios.post('http://localhost:8762/thirdparty/order/details', {
                    id: id,
                }, {
                    headers: {
                        authorization: localStorage.getItem("token")
                    }
                }).then(res => {
                    console.log(res.data)
                    if (res.data.code !== 1000) {
                        if (res.data.code === 999) {
                            ElMessage.error(res.data.message);
                            this.$router.push("/login");
                        }
                        ElMessage.error(res.data.message);
                        return false;
                    } else {
                        this.detailsInfo = res.data.data;
                        this.detailsVisible = true;
                    }
                });
            },

            //发货
            endService(id) {
                console.log(id + "发货");
                axios.post('http://localhost:8762/thirdparty/order/update', {
                    id: id,
                    orderStatus: '2'
                }, {
                    headers: {
                        authorization: localStorage.getItem("token")
                    }
                }).then(res => {
                    console.log(res.data)
                    if (res.data.code !== 1000) {
                        if (res.data.code === 999) {
                            ElMessage.error(res.data.message);
                            this.$router.push("/login");
                        }
                        ElMessage.error(res.data.message);
                        return false;
                    } else {
                        ElMessage.success(res.data.message);
                        this.detailsVisible = false;
                        this.getTableData();
                    }
                });
            },
        },
    }
</script>

<style scoped>
    .handle-box {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 15%;
        display: inline-block;
    }

    .table {
        width: 100%;
        font-size: 14px;
    }

    .red {
        color: #ff0000;
    }

    .mr10 {
        margin-right: 30px;
        margin-bottom: 10px;
    }

    .reset {
        margin-left: 58px;
    }
</style>
