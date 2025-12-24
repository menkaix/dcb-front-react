import { useState } from 'react'
import {
  Card,
  Button,
  Form,
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
import { TypeVentilation } from '@/api/types/batiment.types'
import type { SystemeVentilation } from '@/api/types/batiment.types'
import { TYPE_VENTILATION_LABELS } from '../constants/labels'

interface SystemeVentilationFormProps {
  batimentId: string
  systeme?: SystemeVentilation | null
}

interface SystemeVentilationFormData {
  type: TypeVentilation
}

export default function SystemeVentilationForm({
  batimentId,
  systeme,
}: SystemeVentilationFormProps) {
  const queryClient = useQueryClient()
  const [messageApi, contextHolder] = message.useMessage()
  const [form] = Form.useForm<SystemeVentilationFormData>()

  const [isEditing, setIsEditing] = useState(false)

  // Mutation pour définir/mettre à jour le système de ventilation
  const setMutation = useMutation({
    mutationFn: (data: Partial<SystemeVentilation>) =>
      elementsApi.setSystemeVentilation(batimentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.batiments.detail(batimentId) })
      messageApi.success('Système de ventilation enregistré avec succès')
      setIsEditing(false)
    },
    onError: () => {
      messageApi.error("Erreur lors de l'enregistrement du système de ventilation")
    },
  })

  const handleEdit = () => {
    if (systeme) {
      form.setFieldsValue({
        type: systeme.type,
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
        title="Système de ventilation"
        extra={
          !isEditing && systeme ? (
            <Space size="small">
              <Button size="small" icon={<EditOutlined />} onClick={handleEdit}>
                Modifier
              </Button>
            </Space>
          ) : null
        }
      >
        {!systeme && !isEditing ? (
          <Empty
            description="Aucun système de ventilation défini"
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
                label="Type de ventilation"
                name="type"
                rules={[{ required: true, message: 'Veuillez sélectionner le type' }]}
              >
                <Select
                  placeholder="Sélectionner"
                  options={Object.entries(TYPE_VENTILATION_LABELS).map(([value, label]) => ({
                    value,
                    label,
                  }))}
                />
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
        ) : systeme ? (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Type">{TYPE_VENTILATION_LABELS[systeme.type]}</Descriptions.Item>
          </Descriptions>
        ) : null}
      </Card>
    </>
  )
}
