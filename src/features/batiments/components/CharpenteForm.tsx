import { useState } from 'react'
import {
  Card,
  Button,
  Form,
  Input,
  Select,
  message,
  Descriptions,
  Empty,
  Space,
} from 'antd'
import { EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { elementsApi } from '@/api/endpoints/elements'
import { queryKeys } from '@/api/query-keys'
import { TypeCharpente } from '@/api/types/batiment.types'
import type { Charpente } from '@/api/types/batiment.types'
import { TYPE_CHARPENTE_LABELS } from '../constants/labels'

interface CharpenteFormProps {
  batimentId: string
  charpente?: Charpente | null
}

interface CharpenteFormData {
  type: TypeCharpente
  materiau?: string
}

export default function CharpenteForm({ batimentId, charpente }: CharpenteFormProps) {
  const queryClient = useQueryClient()
  const [messageApi, contextHolder] = message.useMessage()
  const [form] = Form.useForm<CharpenteFormData>()

  const [isEditing, setIsEditing] = useState(false)

  // Mutation pour définir/mettre à jour la charpente
  const setMutation = useMutation({
    mutationFn: (data: Partial<Charpente>) => elementsApi.setCharpente(batimentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.batiments.detail(batimentId) })
      messageApi.success('Charpente enregistrée avec succès')
      setIsEditing(false)
    },
    onError: () => {
      messageApi.error("Erreur lors de l'enregistrement de la charpente")
    },
  })

  const handleEdit = () => {
    if (charpente) {
      form.setFieldsValue({
        type: charpente.type,
        materiau: charpente.materiau,
      })
    }
    setIsEditing(true)
  }

  const handleCancel = () => {
    form.resetFields()
    setIsEditing(false)
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setMutation.mutate(values)
    } catch (error) {
      // Validation échouée
    }
  }

  return (
    <>
      {contextHolder}
      <Card
        size="small"
        title="Charpente"
        extra={
          !isEditing && charpente ? (
            <Space size="small">
              <Button size="small" icon={<EditOutlined />} onClick={handleEdit}>
                Modifier
              </Button>
            </Space>
          ) : null
        }
      >
        {!charpente && !isEditing ? (
          <Empty
            description="Aucune charpente définie"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" size="small" onClick={() => setIsEditing(true)}>
              Ajouter
            </Button>
          </Empty>
        ) : isEditing ? (
          <Form form={form} layout="vertical">
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Form.Item
                label="Type de charpente"
                name="type"
                rules={[{ required: true, message: 'Veuillez sélectionner le type' }]}
              >
                <Select
                  placeholder="Sélectionner"
                  options={Object.entries(TYPE_CHARPENTE_LABELS).map(([value, label]) => ({
                    value,
                    label,
                  }))}
                />
              </Form.Item>

              <Form.Item label="Matériau" name="materiau">
                <Input placeholder="Ex: Bois, Métal..." />
              </Form.Item>

              <Space style={{ width: '100%' }} align="end">
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={handleSubmit}
                  loading={setMutation.isPending}
                >
                  Enregistrer
                </Button>
                <Button icon={<CloseOutlined />} onClick={handleCancel}>
                  Annuler
                </Button>
              </Space>
            </Space>
          </Form>
        ) : charpente ? (
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="Type">
              {TYPE_CHARPENTE_LABELS[charpente.type]}
            </Descriptions.Item>
            {charpente.materiau && (
              <Descriptions.Item label="Matériau">
                {charpente.materiau}
              </Descriptions.Item>
            )}
          </Descriptions>
        ) : null}
      </Card>
    </>
  )
}
