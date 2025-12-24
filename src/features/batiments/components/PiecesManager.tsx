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
import { TypePiece } from '@/api/types/batiment.types'
import type { Piece } from '@/api/types/batiment.types'
import type { ColumnsType } from 'antd/es/table'
import { TYPE_PIECE_LABELS } from '../constants/labels'

interface PiecesManagerProps {
  batimentId: string
  niveauId: string
  pieces?: Piece[]
}

interface PieceFormData {
  nom: string
  type: TypePiece
  surface: number
  hauteurSousPlafond?: number
}

export default function PiecesManager({ batimentId, niveauId, pieces = [] }: PiecesManagerProps) {
  const queryClient = useQueryClient()
  const [messageApi, contextHolder] = message.useMessage()
  const [form] = Form.useForm<PieceFormData>()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPiece, setEditingPiece] = useState<Piece | null>(null)

  // Mutation pour ajouter une pièce
  const addMutation = useMutation({
    mutationFn: (piece: Partial<Piece>) => niveauxApi.addPiece(batimentId, niveauId, piece),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.batiments.detail(batimentId) })
      messageApi.success('Pièce ajoutée avec succès')
      handleCloseModal()
    },
    onError: () => {
      messageApi.error("Erreur lors de l'ajout de la pièce")
    },
  })

  // Mutation pour modifier une pièce
  const updateMutation = useMutation({
    mutationFn: ({ pieceId, piece }: { pieceId: string; piece: Partial<Piece> }) =>
      niveauxApi.updatePiece(batimentId, niveauId, pieceId, piece),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.batiments.detail(batimentId) })
      messageApi.success('Pièce modifiée avec succès')
      handleCloseModal()
    },
    onError: () => {
      messageApi.error('Erreur lors de la modification de la pièce')
    },
  })

  // Mutation pour supprimer une pièce
  const deleteMutation = useMutation({
    mutationFn: (pieceId: string) => niveauxApi.deletePiece(batimentId, niveauId, pieceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.batiments.detail(batimentId) })
      messageApi.success('Pièce supprimée avec succès')
    },
    onError: () => {
      messageApi.error('Erreur lors de la suppression de la pièce')
    },
  })

  const handleAdd = () => {
    setEditingPiece(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  const handleEdit = (piece: Piece) => {
    setEditingPiece(piece)
    form.setFieldsValue({
      nom: piece.nom,
      type: piece.type,
      surface: piece.surface,
      hauteurSousPlafond: piece.hauteurSousPlafond,
    })
    setIsModalOpen(true)
  }

  const handleDelete = (pieceId: string) => {
    deleteMutation.mutate(pieceId)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingPiece(null)
    form.resetFields()
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()

      if (editingPiece) {
        updateMutation.mutate({
          pieceId: editingPiece.id,
          piece: values,
        })
      } else {
        addMutation.mutate(values)
      }
    } catch (error) {
      // Validation échouée
    }
  }

  const columns: ColumnsType<Piece> = [
    {
      title: 'Nom',
      dataIndex: 'nom',
      key: 'nom',
      width: 200,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: TypePiece) => TYPE_PIECE_LABELS[type],
      width: 150,
    },
    {
      title: 'Surface (m²)',
      dataIndex: 'surface',
      key: 'surface',
      render: (surface: number) => surface.toFixed(2),
      width: 120,
      align: 'right',
    },
    {
      title: 'Hauteur S.P. (m)',
      dataIndex: 'hauteurSousPlafond',
      key: 'hauteurSousPlafond',
      render: (hauteur?: number) => (hauteur !== undefined ? hauteur.toFixed(2) : '-'),
      width: 150,
      align: 'right',
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
            title="Supprimer la pièce"
            description="Êtes-vous sûr de vouloir supprimer cette pièce ?"
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
        title={`Pièces (${pieces.length})`}
        extra={
          <Button type="primary" size="small" icon={<PlusOutlined />} onClick={handleAdd}>
            Ajouter
          </Button>
        }
      >
        {pieces.length > 0 ? (
          <Table
            columns={columns}
            dataSource={pieces}
            rowKey="id"
            pagination={false}
            size="small"
            scroll={{ x: 700 }}
          />
        ) : (
          <Empty description="Aucune pièce définie" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </Card>

      <Modal
        title={editingPiece ? 'Modifier la pièce' : 'Ajouter une pièce'}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={handleCloseModal}
        confirmLoading={addMutation.isPending || updateMutation.isPending}
        okText={editingPiece ? 'Modifier' : 'Ajouter'}
        cancelText="Annuler"
        width={600}
      >
        <Form form={form} layout="vertical" style={{ marginTop: '24px' }}>
          <Form.Item
            label="Nom"
            name="nom"
            rules={[{ required: true, message: 'Veuillez saisir le nom de la pièce' }]}
          >
            <Input placeholder="Ex: Chambre 1" />
          </Form.Item>

          <Form.Item
            label="Type"
            name="type"
            rules={[{ required: true, message: 'Veuillez sélectionner le type de pièce' }]}
          >
            <Select
              placeholder="Sélectionner un type"
              options={Object.entries(TYPE_PIECE_LABELS).map(([value, label]) => ({
                value,
                label,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Surface (m²)"
            name="surface"
            rules={[
              { required: true, message: 'Veuillez saisir la surface' },
              { type: 'number', min: 0, message: 'La surface doit être positive' },
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="0.00"
              min={0}
              step={0.01}
              precision={2}
              addonAfter="m²"
            />
          </Form.Item>

          <Form.Item label="Hauteur sous plafond (m)" name="hauteurSousPlafond">
            <InputNumber
              style={{ width: '100%' }}
              placeholder="2.50"
              min={0}
              step={0.01}
              precision={2}
              addonAfter="m"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
