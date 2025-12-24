import { useState } from 'react'
import {
  Card,
  Button,
  Space,
  Table,
  Modal,
  Form,
  Input,
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
import { TypeMur, MateriauMur, OrientationMur } from '@/api/types/batiment.types'
import type { Mur } from '@/api/types/batiment.types'
import type { ColumnsType } from 'antd/es/table'
import { TYPE_MUR_LABELS, MATERIAU_MUR_LABELS, ORIENTATION_MUR_LABELS } from '../constants/labels'

interface MursManagerProps {
  batimentId: string
  niveauId: string
  murs?: Mur[]
}

interface MurFormData {
  nom?: string
  longueur: number
  hauteur: number
  epaisseur: number
  type: TypeMur
  materiau?: MateriauMur
  orientation?: OrientationMur
}

export default function MursManager({ batimentId, niveauId, murs = [] }: MursManagerProps) {
  const queryClient = useQueryClient()
  const [messageApi, contextHolder] = message.useMessage()
  const [form] = Form.useForm<MurFormData>()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMur, setEditingMur] = useState<Mur | null>(null)

  // Mutation pour ajouter un mur
  const addMutation = useMutation({
    mutationFn: (mur: Partial<Mur>) => niveauxApi.addMur(batimentId, niveauId, mur),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.batiments.detail(batimentId) })
      messageApi.success('Mur ajouté avec succès')
      handleCloseModal()
    },
    onError: () => {
      messageApi.error("Erreur lors de l'ajout du mur")
    },
  })

  // Mutation pour modifier un mur
  const updateMutation = useMutation({
    mutationFn: ({ murId, mur }: { murId: string; mur: Partial<Mur> }) =>
      niveauxApi.updateMur(batimentId, niveauId, murId, mur),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.batiments.detail(batimentId) })
      messageApi.success('Mur modifié avec succès')
      handleCloseModal()
    },
    onError: () => {
      messageApi.error('Erreur lors de la modification du mur')
    },
  })

  // Mutation pour supprimer un mur
  const deleteMutation = useMutation({
    mutationFn: (murId: string) => niveauxApi.deleteMur(batimentId, niveauId, murId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.batiments.detail(batimentId) })
      messageApi.success('Mur supprimé avec succès')
    },
    onError: () => {
      messageApi.error('Erreur lors de la suppression du mur')
    },
  })

  const handleAdd = () => {
    setEditingMur(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  const handleEdit = (mur: Mur) => {
    setEditingMur(mur)
    form.setFieldsValue({
      nom: mur.nom,
      longueur: mur.longueur,
      hauteur: mur.hauteur,
      epaisseur: mur.epaisseur,
      type: mur.type,
      materiau: mur.materiau,
      orientation: mur.orientation,
    })
    setIsModalOpen(true)
  }

  const handleDelete = (murId: string) => {
    deleteMutation.mutate(murId)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingMur(null)
    form.resetFields()
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()

      if (editingMur) {
        updateMutation.mutate({
          murId: editingMur.id,
          mur: values,
        })
      } else {
        addMutation.mutate(values)
      }
    } catch (error) {
      // Validation échouée
    }
  }

  const columns: ColumnsType<Mur> = [
    {
      title: 'Nom',
      dataIndex: 'nom',
      key: 'nom',
      width: 150,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: TypeMur) => TYPE_MUR_LABELS[type],
      width: 120,
    },
    {
      title: 'Matériau',
      dataIndex: 'materiau',
      key: 'materiau',
      render: (materiau?: MateriauMur) => materiau ? MATERIAU_MUR_LABELS[materiau] : '-',
      width: 140,
    },
    {
      title: 'Dimensions (L×H×E)',
      key: 'dimensions',
      render: (_, record) =>
        `${record.longueur.toFixed(2)} × ${record.hauteur.toFixed(2)} × ${record.epaisseur.toFixed(2)} m`,
      width: 180,
    },
    {
      title: 'Orientation',
      dataIndex: 'orientation',
      key: 'orientation',
      render: (orientation?: OrientationMur) =>
        orientation ? ORIENTATION_MUR_LABELS[orientation] : '-',
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
            title="Supprimer le mur"
            description="Êtes-vous sûr de vouloir supprimer ce mur ?"
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
        title={`Murs (${murs.length})`}
        extra={
          <Button type="primary" size="small" icon={<PlusOutlined />} onClick={handleAdd}>
            Ajouter
          </Button>
        }
      >
        {murs.length > 0 ? (
          <Table
            columns={columns}
            dataSource={murs}
            rowKey="id"
            pagination={false}
            size="small"
            scroll={{ x: 900 }}
          />
        ) : (
          <Empty description="Aucun mur défini" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </Card>

      <Modal
        title={editingMur ? 'Modifier le mur' : 'Ajouter un mur'}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={handleCloseModal}
        confirmLoading={addMutation.isPending || updateMutation.isPending}
        okText={editingMur ? 'Modifier' : 'Ajouter'}
        cancelText="Annuler"
        width={700}
      >
        <Form form={form} layout="vertical" style={{ marginTop: '24px' }}>
          <Form.Item
            label="Nom"
            name="nom"
          >
            <Input placeholder="Ex: Mur façade sud" />
          </Form.Item>

          <Space style={{ width: '100%' }} size="middle">
            <Form.Item
              label="Type"
              name="type"
              rules={[{ required: true, message: 'Veuillez sélectionner le type' }]}
              style={{ flex: 1, minWidth: 200 }}
            >
              <Select
                placeholder="Sélectionner"
                options={Object.entries(TYPE_MUR_LABELS).map(([value, label]) => ({
                  value,
                  label,
                }))}
              />
            </Form.Item>

            <Form.Item
              label="Matériau"
              name="materiau"
              style={{ flex: 1, minWidth: 200 }}
            >
              <Select
                placeholder="Sélectionner (optionnel)"
                allowClear
                options={Object.entries(MATERIAU_MUR_LABELS).map(([value, label]) => ({
                  value,
                  label,
                }))}
              />
            </Form.Item>
          </Space>

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

          <Form.Item label="Orientation" name="orientation">
            <Select
              placeholder="Sélectionner (optionnel)"
              allowClear
              options={Object.entries(ORIENTATION_MUR_LABELS).map(([value, label]) => ({
                value,
                label,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
