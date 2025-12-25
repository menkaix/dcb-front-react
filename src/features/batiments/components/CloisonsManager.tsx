import { useState } from 'react'
import {
  Card,
  Button,
  Space,
  Table,
  Modal,
  Form,
  InputNumber,
  Select,
  message,
  Popconfirm,
  Empty,
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { niveauxApi } from '@/api/endpoints/niveaux'
import { queryKeys } from '@/api/query-keys'
import { TypeCloison } from '@/api/types/batiment.types'
import type { Cloison } from '@/api/types/batiment.types'
import type { ColumnsType } from 'antd/es/table'
import { TYPE_CLOISON_LABELS } from '../constants/labels'

interface CloisonsManagerProps {
  batimentId: string
  niveauId: string
  cloisons?: Cloison[]
}

interface CloisonFormData {
  longueur: number
  hauteur: number
  epaisseur: number
  type: TypeCloison
}

export default function CloisonsManager({ batimentId, niveauId, cloisons }: CloisonsManagerProps) {
  const cloisonsList = cloisons ?? []
  const queryClient = useQueryClient()
  const [messageApi, contextHolder] = message.useMessage()
  const [form] = Form.useForm<CloisonFormData>()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCloison, setEditingCloison] = useState<Cloison | null>(null)

  // Mutation pour ajouter une cloison
  const addMutation = useMutation({
    mutationFn: (cloison: Partial<Cloison>) => niveauxApi.addCloison(batimentId, niveauId, cloison),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.batiments.detail(batimentId) })
      messageApi.success('Cloison ajoutée avec succès')
      handleCloseModal()
    },
    onError: () => {
      messageApi.error("Erreur lors de l'ajout de la cloison")
    },
  })

  // Mutation pour modifier une cloison
  const updateMutation = useMutation({
    mutationFn: ({ cloisonId, cloison }: { cloisonId: string; cloison: Partial<Cloison> }) =>
      niveauxApi.updateCloison(batimentId, niveauId, cloisonId, cloison),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.batiments.detail(batimentId) })
      messageApi.success('Cloison modifiée avec succès')
      handleCloseModal()
    },
    onError: () => {
      messageApi.error('Erreur lors de la modification de la cloison')
    },
  })

  // Mutation pour supprimer une cloison
  const deleteMutation = useMutation({
    mutationFn: (cloisonId: string) => niveauxApi.deleteCloison(batimentId, niveauId, cloisonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.batiments.detail(batimentId) })
      messageApi.success('Cloison supprimée avec succès')
    },
    onError: () => {
      messageApi.error('Erreur lors de la suppression de la cloison')
    },
  })

  const handleAdd = () => {
    setEditingCloison(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  const handleEdit = (cloison: Cloison) => {
    setEditingCloison(cloison)
    form.setFieldsValue({
      longueur: cloison.longueur,
      hauteur: cloison.hauteur,
      epaisseur: cloison.epaisseur,
      type: cloison.type,
    })
    setIsModalOpen(true)
  }

  const handleDelete = (cloisonId: string) => {
    deleteMutation.mutate(cloisonId)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingCloison(null)
    form.resetFields()
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()

      if (editingCloison) {
        updateMutation.mutate({
          cloisonId: editingCloison.id,
          cloison: values,
        })
      } else {
        addMutation.mutate(values)
      }
    } catch (error) {
      // Validation échouée
    }
  }

  const columns: ColumnsType<Cloison> = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: TypeCloison) => TYPE_CLOISON_LABELS[type],
      width: 180,
    },
    {
      title: 'Dimensions (L×H×E)',
      key: 'dimensions',
      render: (_, record) => {
        const longueur = record.longueur ?? 0
        const hauteur = record.hauteur
        const epaisseur = record.epaisseur
        return `${longueur.toFixed(2)} × ${hauteur.toFixed(2)} × ${epaisseur.toFixed(2)} m`
      },
      width: 180,
    },
    {
      title: 'Surface',
      key: 'surface',
      render: (_, record) => {
        const surface = record.surface
        return surface != null ? `${surface.toFixed(2)} m²` : '-'
      },
      width: 100,
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Modifier
          </Button>
          <Popconfirm
            title="Supprimer la cloison"
            description="Êtes-vous sûr de vouloir supprimer cette cloison ?"
            onConfirm={() => handleDelete(record.id)}
            okText="Oui"
            cancelText="Non"
          >
            <Button
              type="link"
              danger
              size="small"
              icon={<DeleteOutlined />}
              loading={deleteMutation.isPending}
            >
              Supprimer
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <>
      {contextHolder}
      <Card
        size="small"
        title={`Cloisons (${cloisonsList.length})`}
        extra={
          <Button type="primary" size="small" icon={<PlusOutlined />} onClick={handleAdd}>
            Ajouter
          </Button>
        }
      >
        {cloisonsList.length > 0 ? (
          <Table
            columns={columns}
            dataSource={cloisonsList}
            rowKey="id"
            pagination={false}
            size="small"
            scroll={{ x: 800 }}
          />
        ) : (
          <Empty description="Aucune cloison définie" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </Card>

      <Modal
        title={editingCloison ? 'Modifier la cloison' : 'Ajouter une cloison'}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={handleCloseModal}
        confirmLoading={addMutation.isPending || updateMutation.isPending}
        okText={editingCloison ? 'Modifier' : 'Ajouter'}
        cancelText="Annuler"
        width={700}
      >
        <Form form={form} layout="vertical" style={{ marginTop: '24px' }}>
          <Form.Item
            label="Type"
            name="type"
            rules={[{ required: true, message: 'Veuillez sélectionner le type' }]}
          >
            <Select
              placeholder="Sélectionner"
              options={Object.entries(TYPE_CLOISON_LABELS).map(([value, label]) => ({
                value,
                label,
              }))}
            />
          </Form.Item>

          <Space style={{ width: '100%' }} size="middle">
            <Form.Item
              label="Longueur (m)"
              name="longueur"
              rules={[
                { required: true, message: 'Requis' },
                { type: 'number', min: 0, message: 'Doit être positif' },
              ]}
              style={{ flex: 1 }}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="0.00"
                min={0}
                step={0.01}
                precision={2}
                addonAfter="m"
              />
            </Form.Item>

            <Form.Item
              label="Hauteur (m)"
              name="hauteur"
              rules={[
                { required: true, message: 'Requis' },
                { type: 'number', min: 0, message: 'Doit être positif' },
              ]}
              style={{ flex: 1 }}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="0.00"
                min={0}
                step={0.01}
                precision={2}
                addonAfter="m"
              />
            </Form.Item>

            <Form.Item
              label="Épaisseur (m)"
              name="epaisseur"
              rules={[
                { required: true, message: 'Requis' },
                { type: 'number', min: 0, message: 'Doit être positif' },
              ]}
              style={{ flex: 1 }}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="0.00"
                min={0}
                step={0.01}
                precision={2}
                addonAfter="m"
              />
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </>
  )
}
