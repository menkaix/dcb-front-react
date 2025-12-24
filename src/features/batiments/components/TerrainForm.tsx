import { useState } from 'react'
import {
  Card,
  Button,
  Form,
  InputNumber,
  Select,
  message,
  Descriptions,
  Empty,
  Space,
} from 'antd'
import { EditOutlined, SaveOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { elementsApi } from '@/api/endpoints/elements'
import { queryKeys } from '@/api/query-keys'
import type { Terrain } from '@/api/types/batiment.types'
import { TYPE_SOL_LABELS } from '../constants/labels'

interface TerrainFormProps {
  batimentId: string
  terrain?: Terrain
}

export default function TerrainForm({ batimentId, terrain }: TerrainFormProps) {
  const queryClient = useQueryClient()
  const [messageApi, contextHolder] = message.useMessage()
  const [form] = Form.useForm<Terrain>()
  const [isEditing, setIsEditing] = useState(false)

  // Mutation pour sauvegarder le terrain
  const saveMutation = useMutation({
    mutationFn: (data: Terrain) => elementsApi.setTerrain(batimentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.batiments.detail(batimentId) })
      messageApi.success('Terrain enregistré avec succès')
      setIsEditing(false)
    },
    onError: () => {
      messageApi.error("Erreur lors de l'enregistrement du terrain")
    },
  })

  // Mutation pour supprimer le terrain
  const deleteMutation = useMutation({
    mutationFn: () => elementsApi.deleteTerrain(batimentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.batiments.detail(batimentId) })
      messageApi.success('Terrain supprimé avec succès')
      setIsEditing(false)
      form.resetFields()
    },
    onError: () => {
      messageApi.error('Erreur lors de la suppression du terrain')
    },
  })

  const handleEdit = () => {
    if (terrain) {
      form.setFieldsValue(terrain)
    }
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    form.resetFields()
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      saveMutation.mutate(values)
    } catch (error) {
      // Validation échouée
    }
  }

  const handleDelete = () => {
    deleteMutation.mutate()
  }

  if (!isEditing && !terrain) {
    return (
      <>
        {contextHolder}
        <Card>
          <Empty description="Aucune information sur le terrain">
            <Button type="primary" onClick={handleEdit}>
              Ajouter les informations du terrain
            </Button>
          </Empty>
        </Card>
      </>
    )
  }

  if (!isEditing && terrain) {
    return (
      <>
        {contextHolder}
        <Card
          extra={
            <Space>
              <Button icon={<EditOutlined />} onClick={handleEdit}>
                Modifier
              </Button>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={handleDelete}
                loading={deleteMutation.isPending}
              >
                Supprimer
              </Button>
            </Space>
          }
        >
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Surface (m²)">
              {terrain.surface?.toFixed(2) || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Type de sol">
              {terrain.typeSol ? TYPE_SOL_LABELS[terrain.typeSol] : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Portance sol (kPa)">
              {terrain.portanceSol?.toFixed(2) || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Profondeur nappe phréatique (m)">
              {terrain.profondeurNappePhréatique?.toFixed(2) || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Parcelles cadastrales" span={2}>
              {terrain.numeroParcellesCadastrales || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Contour" span={2}>
              {terrain.contour ? `${terrain.contour.length} points définis` : '-'}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </>
    )
  }

  return (
    <>
      {contextHolder}
      <Card
        extra={
          <Space>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSubmit}
              loading={saveMutation.isPending}
            >
              Enregistrer
            </Button>
            <Button icon={<CloseOutlined />} onClick={handleCancel}>
              Annuler
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Surface (m²)"
            name="surface"
            rules={[
              { required: true, message: 'Veuillez saisir la surface du terrain' },
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

          <Form.Item
            label="Type de sol"
            name="typeSol"
            rules={[{ required: true, message: 'Veuillez sélectionner le type de sol' }]}
          >
            <Select
              placeholder="Sélectionner un type de sol"
              options={Object.entries(TYPE_SOL_LABELS).map(([value, label]) => ({
                value,
                label,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Portance du sol (kPa)"
            name="portanceSol"
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="0.00"
              min={0}
              step={0.01}
              precision={2}
              addonAfter="kPa"
            />
          </Form.Item>

          <Form.Item
            label="Profondeur de la nappe phréatique (m)"
            name="profondeurNappePhréatique"
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
            label="Numéro parcelles cadastrales"
            name="numeroParcellesCadastrales"
            tooltip="Saisir les références cadastrales"
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Ex: 123456"
            />
          </Form.Item>
        </Form>
      </Card>
    </>
  )
}
