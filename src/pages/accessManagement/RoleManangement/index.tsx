import { getComponTree } from '@/apis/accessManagement/compon'
import { getPermissionList } from '@/apis/accessManagement/resource'
import {
  addRole,
  delRole,
  editRole,
  editRoleStatus,
  getRoleList
} from '@/apis/accessManagement/role'

import ExcelTable from '@/components/exportExcel'
import {
  ActionType,
  ProForm,
  ProFormCascader,
  ProFormInstance,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect
} from '@ant-design/pro-components'
import { Button, Cascader, Modal, Popconfirm, Switch, Tag, TreeSelect, message } from 'antd'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const RoleManangement: React.FC = () => {
  const actionRef = useRef<ActionType>()
  const modalFormRef = useRef<ProFormInstance>()
  const navigate = useNavigate()

  const onSubmit = async (record?: Resource.ResourceCategoryEntity) => {
    const val = await modalFormRef?.current?.validateFields()
    const relVal = {
      ...val
    }

    if (record) {
      // 编辑
      const res = await editRole({
        ...relVal,
        id: record?.id
      })
      if (res?.code === 200) {
        message.success('编辑成功')
        actionRef?.current?.reload()
        return Promise.resolve()
      }
      return Promise.reject()
    }
    // 新建
    const res = await addRole({ ...relVal })
    message.success('新建成功')
    actionRef?.current?.reload()
  }
  const showModal = (record?: Role.RoleEntity) => {
    Modal.confirm({
      title: record ? '编辑角色' : '新增角色',
      onOk: async () => onSubmit(record),
      okText: '确定',
      cancelText: '取消',
      maskClosable: true,
      width: 800,
      content: (
        <ProForm
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 12 }}
          submitter={false}
          layout="horizontal"
          initialValues={{
            status: 1,
            ...record,
            permissions: record?.permissions?.map(item => item?.id)
          }}
          formRef={modalFormRef}
        >
          <ProFormText label="角色名称" name="name" rules={[{ required: true }]} />
          <ProFormTreeSelect
            label="角色权限"
            name="permissions"
            fieldProps={{
              multiple: true,
              showCheckedStrategy: TreeSelect.SHOW_ALL,
              fieldNames: {
                label: 'title',
                value: 'id'
              },
              treeCheckable: true
            }}
            allowClear
            rules={[{ required: true, message: '请选择' }]}
            request={async () => {
              const { data } = await getPermissionList()
              return data.list
            }}
          />
          <ProFormTextArea label="描述" name="desc" />
        </ProForm>
      )
    })
  }
  return (
    <ExcelTable
      columns={[
        {
          title: '角色名称',
          dataIndex: 'name',
          hideInTable: true
        },
        /** search */
        {
          title: '角色名称',
          dataIndex: 'name',
          hideInSearch: true
        },
        {
          title: '描述',
          dataIndex: 'desc',
          hideInSearch: true
        },
        {
          title: '是否系统内置',
          dataIndex: 'isSystem',
          hideInSearch: true,
          render(_, entity) {
            return <Tag color={entity.isSystem ? 'green' : 'red'}>{entity.isSystem ? '是' : '否'}</Tag>
          }
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          hideInSearch: true,
          valueType: 'dateTime'
        },
        {
          title: '操作',
          key: 'option',
          valueType: 'option',
          render: (_, record) => (!record.isSystem && [
            <Button key="edit" type="link" onClick={() => showModal(record)}>
              编辑
            </Button>,
            <Popconfirm
              key="delete"
              placement="topRight"
              title="确定要删除吗?"
              onConfirm={async () => {
                const res = await delRole({ id: record?.id })
                if (res?.code === 200) {
                  message.success('删除成功')
                  actionRef?.current?.reloadAndRest?.()
                  return Promise.resolve()
                }
                return Promise.reject()
              }}
              okText="确定"
              okType="danger"
              cancelText="取消"
            >
              <Button type="link" danger key="delete">
                删除
              </Button>
            </Popconfirm>
          ])
        }
      ]}
      requestFn={async (params) => {
        const data = await getRoleList(params)
        return data
      }}
      actionRef={actionRef}
      rowSelection={false}
      toolBarRenderFn={() => [
        <Button key="add" type='primary' onClick={() => showModal()}>
          新增角色
        </Button>
      ]}
    />
  )
}

export default RoleManangement
