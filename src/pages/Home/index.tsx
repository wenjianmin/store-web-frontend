import { ProCard, StatisticCard } from '@ant-design/pro-components'
import RcResizeObserver from 'rc-resize-observer'
import { useState } from 'react'

const { Statistic } = StatisticCard

const Home: React.FC = () => {
  const [responsive, setResponsive] = useState(false)

  return (
    <RcResizeObserver
      key="resize-observer"
      onResize={(offset) => {
        setResponsive(offset.width < 596)
      }}
    >
      <ProCard
        title="数据概览"
        split={responsive ? 'horizontal' : 'vertical'}
        headerBordered
        bordered
      >
        <ProCard split="horizontal">
          <ProCard split="horizontal">
            <ProCard split="vertical">
              <StatisticCard
                statistic={{
                  title: '昨日订单数',
                  value: 234,
                  description: (
                    <Statistic
                      title="较本月平均订单数"
                      value="8.04%"
                      trend="down"
                    />
                  ),
                }}
              />
              <StatisticCard
                statistic={{
                  title: '本月累计订单数',
                  value: 234,
                  description: (
                    <Statistic title="月同比" value="8.04%" trend="up" />
                  ),
                }}
              />
            </ProCard>
            <ProCard split="vertical">
              <StatisticCard
                statistic={{
                  title: '昨日成交金额',
                  value: 2332,
                  prefix: '￥',
                }}
              />
              <StatisticCard
                statistic={{
                  title: '本月成交金额',
                  value: 44324,
                  prefix: '￥',
                }}
              />
            </ProCard>
          </ProCard>
        </ProCard>
        <StatisticCard
          colSpan={responsive ? 24 : 6}
          title="财年业绩目标"
          statistic={{
            value: 82.6,
            suffix: '亿',
            description: <Statistic title="日同比" value="6.47%" trend="up" />,
          }}
          chart={
            <img
              src="https://gw.alipayobjects.com/zos/alicdn/PmKfn4qvD/mubiaowancheng-lan.svg"
              alt="进度条"
              width="100%"
            />
          }
          footer={
            <>
              <Statistic
                value="70.98%"
                title="财年业绩完成率"
                layout="horizontal"
              />
              <Statistic
                value="86.98%"
                title="去年同期业绩完成率"
                layout="horizontal"
              />
              <Statistic
                value="88.98%"
                title="前年同期业绩完成率"
                layout="horizontal"
              />
            </>
          }
        />
      </ProCard>
    </RcResizeObserver>
  )
}

export default Home
