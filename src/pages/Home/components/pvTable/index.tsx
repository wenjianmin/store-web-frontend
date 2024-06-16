import { PERFORMANCE_TYPE } from '@/apis/home/enum'
import ExcelTable from '@/components/exportExcel'
import { getFirstDayOfMonth } from '@/utils/date'
import { formatToDateTime } from '@/utils/dateUtil'
import { ActionType } from '@ant-design/pro-components'
import { useRef } from 'react'

const PerformanceTable: React.FC = () => {
  const actionRef = useRef<ActionType>()

  return (
    <ExcelTable
      headerTitle="热销产品"
      columns={[]}
      form={{
        syncToUrl: false
      }}
      pagination={{
        pageSize: 10
      }}
      rowKey="_time"
      // requestFn={async params => {
        
      // }}
      actionRef={actionRef}
      rowSelection={false}
      toolBarRenderFn={() => []}
    />
  )
}

export default PerformanceTable
