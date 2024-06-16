import { createProduct, delProduct, editProduct, fileUpload, getProductList } from '@/apis/product'
import ExcelTable from '@/components/exportExcel'
import {
  ActionType,
  ProForm,
  ProFormInstance,
  ProFormText,
  ProFormSwitch,
  ProFormTextArea
} from '@ant-design/pro-components'
import { Button, GetProp, Modal, Popconfirm, Image, Tag, Upload, UploadFile, UploadProps, message, Form } from 'antd'
import { useRef, useState } from 'react'
import { observer } from 'mobx-react'
import { ProductStatus } from '@/common/enums'
import { PlusOutlined } from '@ant-design/icons'

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]
const ProductManage: React.FC = () => {
  const actionRef = useRef<ActionType>()
  const modalFormRef = useRef<ProFormInstance>()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [record, setRecord] = useState<Product.ProductEntity | null>(null)
  const [imageUrl, setImageUrl] = useState('')

  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [fileList, setFileList] = useState<UploadFile[]>([])

  const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType)
    }

    setPreviewImage(file.url || (file.preview as string))
    setPreviewOpen(true)
  }
  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const handleRemove = (file: UploadFile) => {
    const index = fileList.indexOf(file)
    const newFileList = fileList.slice()
    newFileList.splice(index, 1)
    setFileList(newFileList)
    setImageUrl('')
  }

  const handleBeforeUpload = async (file: FileType) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'product_images')
    const { data = {} } = await fileUpload(formData)
    setImageUrl(data.url)
    return false
  }

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  )

  const onSubmit = async (record: Product.ProductEntity | null) => {
    const val = await modalFormRef?.current?.validateFields()
    const resVal = {
      ...val,
      status: Number(val.status),
      images: [fileList[0]?.url || imageUrl]
    }
    if (record) {
      // 编辑
      const { success } = await editProduct({
        ...resVal,
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
    const { success } = await createProduct({ ...resVal })
    if (success) {
      message.success('新建成功')
      actionRef?.current?.reload()
    }
  }

  const showModal = (record?: Product.ProductEntity) => {
    if (record) {
      setRecord(record)
      const file: UploadFile = {
        uid: 'product',
        name: '图片',
        status: 'done',
        url: record.images?.length ? record.images[0] : ''
      }
      setFileList([file])
    } else {
      setRecord(null)
      setFileList([])
    }
    setIsModalOpen(true)
  }

  const handleOk = async () => {
    await onSubmit(record)
    setIsModalOpen(false)
  }

  const handleUpdateStatus = async (record: Partial<Product.ProductEntity>) => {
    // 上架
    if (record.status === ProductStatus.NOT_ON_SALE || record.status === ProductStatus.OFF_SALE) {
      const { success } = await editProduct({ id: record.id, status: 1 })
      if (success) {
        message.success('上架成功')
        actionRef?.current?.reload()
      }
    } else {
      // 下架
      const { success } = await editProduct({ id: record.id, status: 2 })
      if (success) {
        message.success('下架成功')
        actionRef?.current?.reload()
      }
    }
  }
  return (
    <>
      <ExcelTable
        scroll={{x: 1200}}
        columns={[
          {
            title: '商品名称',
            dataIndex: 'name',
            hideInTable: true
          },
          /** search */
          {
            title: '商品编号',
            dataIndex: 'id',
            width: 100,
            hideInSearch: true
          },
          {
            title: '商品名称',
            dataIndex: 'name',
            width: 120,
            hideInSearch: true,
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
              const text =
                record.status === ProductStatus.NOT_ON_SALE
                  ? '未上架'
                  : record.status === ProductStatus.ON_SALE
                  ? '已上架'
                  : '已下架'
              return <Tag color={green ? 'green' : 'red'}>{text}</Tag>
            }
          },
          {
            title: '价格',
            dataIndex: 'price',
            hideInSearch: true
          },
          {
            title: '创建时间',
            dataIndex: 'createTime',
            hideInSearch: true,
            valueType: 'dateTime'
          },
          {
            title: '商品描述',
            dataIndex: 'desc',
            hideInSearch: true
          },
          {
            title: '操作',
            key: 'option',
            fixed: 'right',
            valueType: 'option',
            render: (_, record) => [
              <Button key="update" type="link" onClick={() => handleUpdateStatus(record)}>
                {record.status === ProductStatus.ON_SALE ? '下架' : '上架'}
              </Button>,
              <Button key="edit" type="link" onClick={() => showModal(record)}>
                编辑
              </Button>,
              <Popconfirm
                key="delete"
                placement="topRight"
                title="确定要删除吗?"
                onConfirm={async () => {
                  const { success } = await delProduct({ id: record?.id })
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
          const data = await getProductList({
            ...params
          })
          return data
        }}
        actionRef={actionRef}
        rowSelection={false}
        toolBarRenderFn={() => [
          <Button type="primary" key="add" onClick={() => showModal()}>
            新增商品
          </Button>
        ]}
      />
      {/* 新增商品 */}
      <Modal
        title={record?.id ? '编辑商品' : '新增商品'}
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
          initialValues={{
            status: 1,
            ...record
          }}
          formRef={modalFormRef}
        >
          <ProFormText label="商品名称" name="name" rules={[{ required: true }]} />
          <ProFormText label="商品价格" name="price" rules={[{ required: true }]} />
          <ProFormSwitch label="是否上架" name="status" rules={[{ required: true }]} />
          <Form.Item label="商品图片" required>
            <Upload
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onRemove={handleRemove}
              onChange={handleChange}
              beforeUpload={handleBeforeUpload}
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
            {previewImage && (
              <Image
                wrapperStyle={{ display: 'none' }}
                preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                  afterOpenChange: (visible) => !visible && setPreviewImage(''),
                }}
                src={previewImage}
              />
            )}
          </Form.Item>
          <ProFormTextArea label="商品描述" name="desc" rules={[{ required: true }]} />
        </ProForm>
      </Modal>
    </>
  )
}

export default observer(ProductManage)
