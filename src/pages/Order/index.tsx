import { createOrder, delOrder, updateActStatus, getOrderList, getOrderDetail } from '@/apis/order'
import ExcelTable from '@/components/exportExcel'
import {
  ActionType,
  ProForm,
  ProFormDigit,
  ProFormInstance,
  ProFormRadio,
  ProFormSelect,
  ProFormTextArea
} from '@ant-design/pro-components'
import {
  Button,
  Descriptions,
  DescriptionsProps,
  Modal,
  Popconfirm,
  Tag,
  message
} from 'antd'
import { useRef, useState } from 'react'
import { observer } from 'mobx-react'

import { getProductList } from '@/apis/product'
import { getUserList } from '@/apis/accessManagement/user'
import { OrderStatus, ProductStatus } from '@/common/enums'
import dayjs from 'dayjs'

const Order: React.FC = () => {
  const actionRef = useRef<ActionType>()
  const modalFormRef = useRef<ProFormInstance>()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isShowDetail, setIsShowDetail] = useState<boolean>(false)
  const [isPayModalOpen, setIsPayModalOpen] = useState<boolean>(false)
  const [record, setRecord] = useState<Order.OrderEntity | null>(null)
  const [payRecord, setPayRecord] = useState<Order.OrderEntity | null>(null)
  const [productList, setProductList] = useState<Product.ProductEntity[]>([])
  const [detailItems, setDetailItems] = useState<DescriptionsProps['items']>([])
  const [pagination, setPagination] = useState({
    pageSize: 10,
    showSizeChanger: true,
    showQuickJumper: true
  })
  const labelName: Record<string, string> = {
    id: '订单编号',
    name: '商品名称',
    price: '订单价格',
    status: '订单状态',
    discount: '订单折扣',
    desc: '订单备注',
    createTime: '创建时间'
  }

  const onSubmit = async (record?: Order.OrderEntity | null) => {
    const val = await modalFormRef?.current?.validateFields()
    if (record) {
      // 编辑
      const { success } = await updateActStatus({
        ...val,
        id: record?.id
      })
      if (success) {
        message.success('编辑成功')
        actionRef?.current?.reload()
        return Promise.resolve()
      }
      return Promise.reject()
    }
    // 新建
    const { success } = await createOrder({
      ...val
    })
    if (success) {
      message.success('新建成功')
      actionRef?.current?.reload()
      return Promise.resolve()
    }
    return Promise.reject()
  }

  const showModal = () => {
    setRecord(null)
    setIsModalOpen(true)
    setIsShowDetail(false)
  }
  const handleDetail = async (record: Order.OrderEntity) => {
    const { data = {} } = await getOrderDetail({ id: record.id })
    console.log('data', Object.entries(data))
    const items: DescriptionsProps['items'] = []
    Object.entries(data).forEach(([key, value]) => {
      labelName[key] && items.push({
        key,
        label: labelName[key],
        children: key === 'createTime' ?
                  dayjs(value as string).format('YYYY-MM-DD HH:mm:ss') :
                  key === 'status' ?
                  (
                    value === OrderStatus.NOT_PAY
                    ? '未付款'
                    : value === OrderStatus.PAID
                    ? '已付款'
                    : '已取消'
                  ) : `${value}`
      })
    })
    setDetailItems(items)
    setIsShowDetail(true)
  }
  const handleOk = async () => {
    await onSubmit(record)
    setIsModalOpen(false)
  }

  const showPayModal = (record: Partial<Order.OrderEntity>) => {
    setIsPayModalOpen(true)
    setPayRecord(record)
  }
  const handlePayOk = async () => {
    await onSubmit(payRecord)
    setIsPayModalOpen(false)
  }
  // 计算订单价格
  const onValuesChange = (_: string | number, allValues: Order.OrderEntity) => {
    const { count = 1, discount = 1, productId } = allValues
    const { price = 0 } = productList.find(item => item.id === productId) || {}
    const totalPrice = +price * count * discount
    modalFormRef.current?.setFieldValue('price', totalPrice)
  }
  return (
    <>
      <ExcelTable
        scroll={{ x: 1500 }}
        pagination={pagination}
        columns={[
          {
            title: '订单编号',
            dataIndex: 'id',
            render(_, record) {
              return (
                <Button key="detail" type="link" onClick={() => handleDetail(record)}>
                  {record.id}
                </Button>
              )
            }
          },
          /** search */
          {
            title: '商品名称',
            dataIndex: 'name',
            hideInSearch: true
          },
          {
            title: '订单价格（￥）',
            dataIndex: 'price',
            hideInSearch: true
          },
          {
            title: '订单状态',
            dataIndex: 'status',
            render(_, record) {
              const blue = record.status === OrderStatus.NOT_PAY
              const green = record.status === OrderStatus.PAID
              const text =
                record.status === OrderStatus.NOT_PAY
                  ? '未付款'
                  : record.status === OrderStatus.PAID
                  ? '已付款'
                  : '已取消'
              return <Tag color={green ? 'green' : blue ? 'blue' : 'red'}>{text}</Tag>
            },
            renderFormItem() {
              return (
                <ProFormSelect
                  initialValue=""
                  name="status"
                  options={[
                    { label: '全部', value: '' },
                    { label: '未付款', value: OrderStatus.NOT_PAY },
                    { label: '已付款', value: OrderStatus.PAID },
                    { label: '已取消', value: OrderStatus.CANCEL }
                  ]}
                />
              )
            }
          },
          {
            title: '关联员工',
            dataIndex: 'operator',
            hideInSearch: true
          },
          {
            title: '创建时间',
            dataIndex: 'createTime',
            hideInSearch: true,
            valueType: 'dateTime'
          },
          {
            title: '备注',
            dataIndex: 'desc',
            hideInSearch: true
          },
          {
            title: '操作',
            width: 240,
            fixed: 'right',
            key: 'option',
            valueType: 'option',
            render: (_, record) => [
              record.status === OrderStatus.NOT_PAY && (
                <Button key="pay" type="link" onClick={() => showPayModal(record)}>
                  付款
                </Button>
              ),
              record.status === OrderStatus.NOT_PAY && (
                <Popconfirm
                  key="cancel"
                  placement="topRight"
                  title="确定要取消订单吗?"
                  onConfirm={async () => {
                    const { success } = await updateActStatus({
                      id: record?.id,
                      status: OrderStatus.CANCEL
                    })
                    if (success) {
                      message.success('取消成功')
                      actionRef?.current?.reloadAndRest?.()
                    }
                  }}
                  okText="确定"
                  okType="danger"
                  cancelText="取消"
                >
                  <Button type="link">取消订单</Button>
                </Popconfirm>
              ),
              <Popconfirm
                key="delete"
                placement="topRight"
                title="确定要删除吗?"
                onConfirm={async () => {
                  const { success } = await delOrder({ id: record?.id })
                  if (success) {
                    message.success('删除成功')
                    actionRef?.current?.reloadAndRest?.()
                  }
                }}
                okText="确定"
                okType="danger"
                cancelText="取消"
              >
                <Button type="link" danger key="delete">
                  删除
                </Button>
              </Popconfirm>
            ]
          }
        ]}
        requestFn={async params => {
          setPagination({
            ...pagination,
            pageSize: params.pageSize
          })
          const data = await getOrderList({
            ...params
          })
          return data
        }}
        actionRef={actionRef}
        rowSelection={false}
        toolBarRenderFn={() => [
          <Button type="primary" key="add" onClick={() => showModal()}>
            开单收银
          </Button>
        ]}
      />
      {/* 开单收银 */}
      <Modal
        title="开单收银"
        width={800}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        destroyOnClose
      >
        <ProForm
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 10 }}
          submitter={false}
          layout="horizontal"
          formRef={modalFormRef}
          initialValues={{
            status: 0,
            ...record
          }}
          onValuesChange={onValuesChange}
        >
          <ProFormSelect
            label="开单商品"
            name="productId"
            allowClear
            rules={[{ required: true, message: '请选择开单商品' }]}
            request={async () => {
              const { success, data } = await getProductList({
                page: 1,
                pageSize: 1000,
                status: ProductStatus.ON_SALE
              })
              if (success) {
                setProductList(data.list)
                return data.list?.map((r: any) => ({
                  label: `${r?.name} (￥${r?.price})`,
                  value: r?.id
                }))
              }
              return []
            }}
          />
          <ProFormDigit
            label="商品数量"
            name="count"
            placeholder={'请输入商品数量'}
            min={1}
            initialValue={1}
            rules={[{ required: true }]}
          />
          <ProFormDigit
            label="折扣比例"
            name="discount"
            placeholder={'请输入折扣比例'}
            initialValue={1}
            max={1}
            rules={[{ required: true }]}
          />
          <ProFormDigit label="订单价格" required name="price" disabled initialValue={0} />
          <ProFormSelect
            label="关联员工"
            name="operator"
            allowClear
            rules={[{ required: true, message: '请选择关联员工' }]}
            request={async () => {
              const { success, data } = await getUserList({
                page: 1,
                pageSize: 1000
              })
              if (success) {
                return data.list?.map((r: any) => ({
                  label: r?.username,
                  value: r?.id
                }))
              }
              return []
            }}
          />
          <ProFormRadio.Group
            label="是否已收款"
            name="status"
            rules={[{ required: true }]}
            valueEnum={
              new Map([
                [1, '是'],
                [0, '否']
              ])
            }
          />
          <ProFormTextArea label="订单备注" name="desc" />
        </ProForm>
      </Modal>
      {/* 付款 */}
      <Modal
        title="付款"
        width={800}
        open={isPayModalOpen}
        onOk={handlePayOk}
        onCancel={() => setIsPayModalOpen(false)}
        destroyOnClose
      >
        <ProForm
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 10 }}
          submitter={false}
          layout="horizontal"
          initialValues={{
            ...payRecord
          }}
          formRef={modalFormRef}
        >
          <ProFormRadio.Group
            label="是否已收款"
            name="status"
            rules={[{ required: true }]}
            valueEnum={
              new Map([
                [1, '是'],
                [0, '否']
              ])
            }
          />
          <ProFormTextArea label="订单备注" name="desc" />
        </ProForm>
      </Modal>
      {/* 订单详情 */}
      <Modal
        title="订单详情"
        width={800}
        open={isShowDetail}
        cancelText="关闭"
        onCancel={() => setIsShowDetail(false)}
        destroyOnClose
      >
        <Descriptions items={detailItems} />
      </Modal>
    </>
  )
}

export default observer(Order)
