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
import type { Fondations } from '@/api/types/batiment.types'
import { TYPE_FONDATION_LABELS } from '../constants/labels'

interface FondationsFormProps {
  batimentId: string
  fondations?: Fondations
}

export default function FondationsForm({ batimentId, fondations }: FondationsFormProps) {
  const queryClient = useQueryClient()
  const [messageApi, contextHolder] = message.useMessage()
  const [form] = Form.useForm<Fondations>()
  const [isEditing, setIsEditing] = useState(false)

  // Mutation pour sauvegarder les fondations
  const saveMutation = useMutation({
    mutationFn: (data: Fondations) => elementsApi.setFondations(batimentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.batiments.detail(batimentId) })
      messageApi.success('Fondations enregistrées avec succès')
      setIsEditing(false)
    },
    onError: () => {
      messageApi.error("Erreur lors de l'enregistrement des fondations")
    },
  })

  // Mutation pour supprimer les fondations
  const deleteMutation = useMutation({
    mutationFn: () => elementsApi.deleteFondations(batimentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.batiments.detail(batimentId) })
      messageApi.success('Fondations supprimées avec succès')
      setIsEditing(false)
      form.resetFields()
    },
    onError: () => {
      messageApi.error('Erreur lors de la suppression des fondations')
    },
  })

  const handleEdit = () => {
    if (fondations) {
      form.setFieldsValue(fondations)
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

  if (!isEditing && !fondations) {
    return (
      <>
        {contextHolder}
        <Card>
          <Empty description="Aucune information sur les fondations">
            <Button type="primary" onClick={handleEdit}>
              Ajouter les informations des fondations
            </Button>
          </Empty>
        </Card>
      </>
    )
  }

  if (!isEditing && fondations) {
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
            <Descriptions.Item label="Type">
              {fondations.typeFondation ? TYPE_FONDATION_LABELS[fondations.typeFondation] : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Profondeur (m)">
              {fondations.profondeur?.toFixed(2) || '-'}
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
            label="Type de fondations"
            name="typeFondation"
            rules={[{ required: true, message: 'Veuillez sélectionner le type de fondations' }]}
          >
            <Select
              placeholder="Sélectionner un type"
              options={Object.entries(TYPE_FONDATION_LABELS).map(([value, label]) => ({
                value,
                label,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Profondeur (m)"
            name="profondeur"
            rules={[
              { required: true, message: 'Veuillez saisir la profondeur' },
              { type: 'number', min: 0, message: 'La profondeur doit être positive' },
            ]}
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
        </Form>
      </Card>
    </>
  )
}
