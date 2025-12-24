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
import { EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { elementsApi } from '@/api/endpoints/elements'
import { queryKeys } from '@/api/query-keys'
import { TypeProductionEauChaude } from '@/api/types/batiment.types'
import type { SystemePlomberie } from '@/api/types/batiment.types'
import { TYPE_PRODUCTION_EAU_CHAUDE_LABELS } from '../constants/labels'

interface SystemePlomberieFormProps {
  batimentId: string
  systeme?: SystemePlomberie | null
}

interface SystemePlomberieFormData {
  productionEauChaude: {
    type: TypeProductionEauChaude
    capacite: number
    puissance?: number
  }
}

export default function SystemePlomberieForm({
  batimentId,
  systeme,
}: SystemePlomberieFormProps) {
  const queryClient = useQueryClient()
  const [messageApi, contextHolder] = message.useMessage()
  const [form] = Form.useForm<SystemePlomberieFormData>()

  const [isEditing, setIsEditing] = useState(false)

  // Mutation pour définir/mettre à jour le système de plomberie
  const setMutation = useMutation({
    mutationFn: (data: Partial<SystemePlomberie>) =>
      elementsApi.setSystemePlomberie(batimentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.batiments.detail(batimentId) })
      messageApi.success('Système de plomberie enregistré avec succès')
      setIsEditing(false)
    },
    onError: () => {
      messageApi.error("Erreur lors de l'enregistrement du système de plomberie")
    },
  })

  const handleEdit = () => {
    if (systeme?.productionEauChaude) {
      form.setFieldsValue({
        productionEauChaude: {
          type: systeme.productionEauChaude.type,
          capacite: systeme.productionEauChaude.capacite,
          puissance: systeme.productionEauChaude.puissance,
        },
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
        title="Système de plomberie"
        extra={
          !isEditing && systeme?.productionEauChaude ? (
            <Space size="small">
              <Button size="small" icon={<EditOutlined />} onClick={handleEdit}>
                Modifier
              </Button>
            </Space>
          ) : null
        }
      >
        {!systeme?.productionEauChaude && !isEditing ? (
          <Empty description="Aucun système de plomberie défini" image={Empty.PRESENTED_IMAGE_SIMPLE}>
            <Button type="primary" size="small" onClick={() => setIsEditing(true)}>
              Ajouter
            </Button>
          </Empty>
        ) : isEditing ? (
          <Form form={form} layout="vertical">
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Card title="Production d'eau chaude" size="small" type="inner">
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                  <Form.Item
                    label="Type de production"
                    name={['productionEauChaude', 'type']}
                    rules={[{ required: true, message: 'Veuillez sélectionner le type' }]}
                  >
                    <Select
                      placeholder="Sélectionner"
                      options={Object.entries(TYPE_PRODUCTION_EAU_CHAUDE_LABELS).map(
                        ([value, label]) => ({
                          value,
                          label,
                        })
                      )}
                    />
                  </Form.Item>

                  <Space style={{ width: '100%' }} size="middle">
                    <Form.Item
                      label="Capacité (L)"
                      name={['productionEauChaude', 'capacite']}
                      rules={[
                        { required: true, message: 'Requis' },
                        { type: 'number', min: 0, message: 'Doit être positif' },
                      ]}
                      style={{ flex: 1 }}
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        placeholder="0"
                        min={0}
                        step={10}
                        precision={0}
                        addonAfter="L"
                      />
                    </Form.Item>

                    <Form.Item
                      label="Puissance (kW)"
                      name={['productionEauChaude', 'puissance']}
                      style={{ flex: 1 }}
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        placeholder="0.00"
                        min={0}
                        step={0.1}
                        precision={2}
                        addonAfter="kW"
                      />
                    </Form.Item>
                  </Space>
                </Space>
              </Card>

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
        ) : systeme?.productionEauChaude ? (
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="Type production">
              {TYPE_PRODUCTION_EAU_CHAUDE_LABELS[systeme.productionEauChaude.type]}
            </Descriptions.Item>
            <Descriptions.Item label="Capacité">
              {systeme.productionEauChaude.capacite} L
            </Descriptions.Item>
            {systeme.productionEauChaude.puissance != null && (
              <Descriptions.Item label="Puissance">
                {systeme.productionEauChaude.puissance.toFixed(2)} kW
              </Descriptions.Item>
            )}
          </Descriptions>
        ) : null}
      </Card>
    </>
  )
}
