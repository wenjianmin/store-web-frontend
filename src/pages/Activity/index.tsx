import { createActivity, delActivity, editActivity, getActivityList } from '@/apis/activity'
import ExcelTable from '@/components/exportExcel'
import {
  ActionType,
  ProForm,
  ProFormDateTimeRangePicker,
  ProFormInstance,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea
} from '@ant-design/pro-components'
import { Button, Modal, Popconfirm, Tag, message } from 'antd'
import { useRef, useState } from 'react'
import { observer } from 'mobx-react'
import { getProductList } from '@/apis/product'
import dayjs from 'dayjs'
import { ActivityStatus, ActivityType } from '@/common/enums'
import { Activity } from '@/apis/activity/typing'

const ActivityManage: React.FC = () => {
  const actionRef = useRef<ActionType>()
  const modalFormRef = useRef<ProFormInstance>()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [record, setRecord] = useState<Activity.ActivityEntity | null>(null)

  const onSubmit = async (record?: Activity.ActivityEntity | null) => {
    const val = await modalFormRef?.current?.validateFields()

    const { dateTimeRange, ...rest } = val
    const params = {
      ...rest,
      startTime: dayjs(dateTimeRange[0]).format('YYYY-MM-DD HH:mm:ss'),
      endTime: dayjs(dateTimeRange[1]).format('YYYY-MM-DD HH:mm:ss')
    }
    if (record) {
      // 编辑
      const { success } = await editActivity({
        ...params,
        id: record?.id
      })
      if (success) {
        message.success('编辑成功')
        actionRef?.current?.reload()
      }
      return
    }
    // 新建
    const { success } = await createActivity({ ...params })
    if (success) {
      message.success('新建成功')
      actionRef?.current?.reload()
    }
  }
  const showModal = (record?: Activity.ActivityEntity) => {
    if (record) {
      setRecord({
        ...record,
        dateTimeRange: [dayjs(record.startTime), dayjs(record.endTime)]
      })
    } else {
      setRecord(null)
    }
    setIsModalOpen(true)
  }
  const handleOk = () => {
    setIsModalOpen(false)
    onSubmit(record)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }
  return (
    <>
      <ExcelTable
        scroll={{ x: 1200 }}
        columns={[
          {
            title: '活动名称',
            dataIndex: 'name',
            hideInTable: true
          },
          /** search */
          {
            title: '序号',
            dataIndex: 'id',
            hideInSearch: true
          },
          {
            title: '活动名称',
            dataIndex: 'name',
            hideInSearch: true
          },
          {
            title: '活动商品',
            dataIndex: 'productName',
            hideInSearch: true,
            render(_, record) {
              return record.product.name
            },
          },
          {
            title: '活动类型',
            dataIndex: 'type',
            hideInSearch: false,
            render(_, record) {
              return record.type === ActivityType.TIME_LIMIT
                ? '限时活动'
                : record.type === ActivityType.GROUP_BUY
                ? '拼团活动'
                : record.type === ActivityType.SECKILL
                ? '秒杀活动'
                : '普通活动'
            },
            renderFormItem() {
              return (
                <ProFormSelect
                  initialValue=""
                  name="type"
                  options={[
                    { label: '全部', value: '' },
                    { label: '普通活动', value: ActivityType.NORMAL },
                    { label: '拼团活动', value: ActivityType.GROUP_BUY },
                    { label: '秒杀活动', value: ActivityType.SECKILL },
                    { label: '限时活动', value: ActivityType.TIME_LIMIT },
                  ]}
                />
              )
            }
          },
          {
            title: '活动状态',
            dataIndex: 'status',
            hideInSearch: false,
            render(_, record) {
              const blue = record.status === ActivityStatus.NOT_START
              const green = record.status === ActivityStatus.START
              const text =
                record.status === ActivityStatus.NOT_START
                  ? '未开始'
                  : record.status === ActivityStatus.START
                  ? '已开始'
                  : '已结束'
              return <Tag color={green ? 'green' : blue ? 'blue' : 'red'}>{text}</Tag>
            },
            renderFormItem() {
              return (
                <ProFormSelect
                  initialValue=""
                  name="status"
                  options={[
                    { label: '全部', value: '' },
                    { label: '未开始', value: ActivityStatus.NOT_START },
                    { label: '已开始', value: ActivityStatus.START },
                    { label: '已结束', value: ActivityStatus.END }
                  ]}
                />
              )
            }
          },
          {
            title: '活动开始时间',
            dataIndex: 'startTime',
            hideInSearch: true,
            valueType: 'dateTime'
          },
          {
            title: '活动结束时间',
            dataIndex: 'endTime',
            hideInSearch: true,
            valueType: 'dateTime'
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
            fixed: 'right',
            width: 250,
            key: 'option',
            valueType: 'option',
            render: (_, record) => [
              record.status === ActivityStatus.START && (
                <Popconfirm
                  key="updateStatus"
                  placement="topRight"
                  title="确定要提前结束活动吗?"
                  onConfirm={async () => {
                    const { success } = await editActivity({
                      id: record?.id,
                      status: ActivityStatus.END
                    })
                    if (success) {
                      message.success('更新成功')
                      actionRef?.current?.reload()
                    }
                  }}
                  okText="确定"
                  okType="danger"
                  cancelText="取消"
                >
                  <Button type="link">提前结束</Button>
                </Popconfirm>
              ),
              record.status !== ActivityStatus.END && (
                <Button key="edit" type="link" onClick={() => showModal(record)}>
                  编辑
                </Button>
              ),
              <Popconfirm
                key="delete"
                placement="topRight"
                title="确定要删除吗?"
                onConfirm={async () => {
                  const { success } = await delActivity({ id: record?.id })
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
          const data = await getActivityList({
            ...params
          })
          return data
        }}
        actionRef={actionRef}
        rowSelection={false}
        toolBarRenderFn={() => [
          <Button type="primary" key="add" onClick={() => showModal()}>
            创建活动
          </Button>
        ]}
      />
      <Modal
        title={record ? '编辑活动' : '创建活动'}
        width={800}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose
      >
        <ProForm
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 10 }}
          submitter={false}
          layout="horizontal"
          initialValues={{
            type: ActivityType.NORMAL,
            ...record
          }}
          formRef={modalFormRef}
        >
          <ProFormText label="活动名称" name="name" rules={[{ required: true }]} />
          <ProFormRadio.Group
            label="活动类型"
            name="type"
            rules={[{ required: true }]}
            valueEnum={
              new Map([
                [ActivityType.NORMAL, '普通活动'],
                [ActivityType.TIME_LIMIT, '限时抢购'],
                [ActivityType.SECKILL, '秒杀活动'],
                [ActivityType.GROUP_BUY, '拼团活动'],
              ])
            }
          />
          <ProFormSelect
            label="活动商品"
            name="productId"
            allowClear
            rules={[{ required: true, message: '请选择' }]}
            request={async () => {
              const res = await getProductList({
                page: 1,
                pageSize: 1000
              })
              if (res?.code === 200) {
                return res?.data?.list?.map((r: any) => ({
                  label: r?.name,
                  value: r?.id
                }))
              }
              return []
            }}
          />
          <ProFormDateTimeRangePicker
            name="dateTimeRange"
            label="活动时间"
            rules={[{ required: true }]}
          />
          <ProFormTextArea label="活动备注" name="desc" required />
        </ProForm>
      </Modal>
    </>
  )
}

export default observer(ActivityManage)
