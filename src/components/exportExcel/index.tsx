import { Activity } from '@/apis/activity/typing'
import { exportExecl } from '@/utils'
import { ProColumns, ProFormInstance, ProTable, ProTableProps } from '@ant-design/pro-components'
import { Button } from 'antd'
import { SortOrder } from 'antd/es/table/interface'
import { forwardRef, useRef, useState, useEffect, useImperativeHandle } from 'react'
import type { FC } from 'react'

type ParamsType = Order.OrderListParams & Product.ProductListParams & User.UserListParams & Role.RoleListParams & Activity.ActivityListParams

type IExcelTable = {
  columns: ProColumns<any, 'text'>[]
  /** 接口请求 */
  requestFn: (params: ParamsType, sort?: Record<string, SortOrder>) => Promise<Record<string, any>>
  /** 导出接口 */
  exportExeclReq?: (params: Record<string, any>) => Promise<Record<string, any>>
  /** 导出接口 */
  /** toolBarRender */
  toolBarRenderFn?: (params: any) => any
  ref?: any
  /** 设置选择的row */
  setSelectedRows?: React.Dispatch<React.SetStateAction<any[]>>
  /** 自定义导出 */
  customExport?: (params: any) => any
  /** 额外的勾选属性 */
  extraRowSelection?: Record<string, any>
  /** 初始值key选择 */
  initRowKey?: any[]
  /** 自定义state key */
  customKeys?: any[]
  setCustomKeys?: React.Dispatch<React.SetStateAction<any[]>>
  /** 是否隐藏search */
  hideSearch?: boolean
} & ProTableProps<any, any>

const ExcelTable: FC<IExcelTable> = forwardRef((props, formRefMy: any) => {
  const {
    columns,
    requestFn,
    exportExeclReq,
    toolBarRenderFn,
    hideSearch,
    setSelectedRows,
    customExport,
    extraRowSelection,
    initRowKey,
    customKeys,
    setCustomKeys,
    ...otherProps
  } = props
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>(initRowKey || [])
  const formRefin = useRef<ProFormInstance>(null)
  const formRef = formRefMy || formRefin

  const onSelectChange = (rowKeys: any[], selectedRows: any[]) => {
    console.log('selectedRowKeys changed: ', rowKeys, selectedRows)
    setSelectedRowKeys(rowKeys)
    if (setCustomKeys) {
      setCustomKeys(rowKeys)
    }

    if (setSelectedRows) {
      setSelectedRows(selectedRows)
    }
  }

  /** 自定义state key 赋予初始值 */
  useEffect(() => {
    if (initRowKey && setCustomKeys) {
      setCustomKeys(initRowKey)
    }
    if (initRowKey && setSelectedRows) {
      setSelectedRows(
        initRowKey?.map(item => ({
          id: item
        }))
      )
    }
  }, [initRowKey])

  const onExport = async () => {
    console.log(formRef?.current?.getFieldsValue())
    if (customExport) {
      customExport({
        record: formRef?.current?.getFieldsValue(),
        id__in:
          (customKeys || selectedRowKeys)?.length > 0
            ? (customKeys || selectedRowKeys)?.join?.(',')
            : undefined
      })
    } else {
      const data = await exportExeclReq?.({
        formData: formRef?.current?.getFieldsValue(),
        is_export: true,
        id__in:
          (customKeys || selectedRowKeys)?.length > 0
            ? (customKeys || selectedRowKeys)?.join?.(',')
            : undefined
      })
      exportExecl(data)
    }
  }

  useImperativeHandle(formRefMy, () => ({
    onExport: () => onExport()
  }))

  return (
    <>
      <ProTable
        columns={columns}
        formRef={formRef as any}
        request={async (params = {}, sort) => {
          const { current: page, pageSize, ...otherParams } = params
          const res = await requestFn({ page, pageSize, ...otherParams }, sort)
          if (res?.code === 200) {
            return {
              total: res?.data?.total,
              data: res?.data?.list,
              success: true,
              page: res?.data?.page
            }
          }
          return {
            success: false
          }
        }}
        rowKey="id"
        rowSelection={{
          // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
          // 注释该行则默认不显示下拉选项
          //   selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
          preserveSelectedRowKeys: true,
          selectedRowKeys: customKeys || selectedRowKeys,
          onChange: onSelectChange,
          ...extraRowSelection
        }}
        search={ hideSearch ? false : {
          labelWidth: 'auto',
          optionRender: (searchConfig, formProps, dom) => [
            dom[1],
            <Button
              key="reset"
              onClick={() => {
                const keyArr = (searchConfig as any)?.items?.map(
                  (item: { props: { name: any } }) => [item?.props?.name, undefined]
                )
                formProps?.form?.setFieldsValue(Object.fromEntries(new Map(keyArr).entries()))
                formProps?.form?.submit()
              }}
            >
              重置
            </Button>
          ]
        }}
        bordered
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true
        }}
        dateFormatter="string"
        toolBarRender={
          toolBarRenderFn || exportExeclReq
            ? () => [
                exportExeclReq && (
                  <Button key="out" onClick={onExport} type="primary">
                    导出数据
                  </Button>
                ),
                ...(toolBarRenderFn?.({ rowKeys: customKeys || selectedRowKeys }) || [])
              ]
            : false
        }
        {...otherProps}
      />
    </>
  )
})

export default ExcelTable
