import { getHotProductList } from '@/apis/product'
import ExcelTable from '@/components/exportExcel'
import { Tag, Image } from 'antd'
import { observer } from 'mobx-react'
import { ProductStatus } from '@/common/enums'

const HotProductList: React.FC = () => {
  return (
    <>
      <ExcelTable
        hideSearch
        columns={[
          {
            title: '排名',
            key: 'index',
            render(_, __, index) {
              return index + 1
            }
          },
          {
            title: '商品名称',
            dataIndex: 'name',
            hideInSearch: true
          },
          {
            title: '商品图片',
            dataIndex: 'images',
            hideInSearch: true,
            render(_, record) {
              return record.images?.length ? record.images?.map((item: string) => (
                <Image width={60} src={item} alt={item} key={item} />
              )) : '-'
            },
          },
          {
            title: '状态',
            dataIndex: 'status',
            hideInSearch: true,
            render(_, record) {
              const green = record.status === ProductStatus.ON_SALE
              const text = record.status === ProductStatus.NOT_ON_SALE ? '未上架' :
              record.status === ProductStatus.ON_SALE ? '已上架' : '已下架'
              return <Tag color={green ? 'green' : 'red'}>{ text }</Tag>
            },
          },
          {
            title: '价格',
            dataIndex: 'price',
            hideInSearch: true
          },
          {
            title: '销量',
            dataIndex: 'score',
            hideInSearch: true
          },
          {
            title: '创建时间',
            dataIndex: 'createTime',
            hideInSearch: true,
            valueType: 'dateTime'
          }
        ]}
        requestFn={async () => {
          const data = await getHotProductList({ topN: 10 })
          return data
        }}
        rowSelection={false}
        toolBarRenderFn={() => []}
      />
    </>
  )
}

export default observer(HotProductList)
