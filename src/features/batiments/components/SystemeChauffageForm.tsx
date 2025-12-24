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
import { TypeGenerateurChauffage, TypeEnergie } from '@/api/types/batiment.types'
import type { SystemeChauffage } from '@/api/types/batiment.types'
import {
  TYPE_GENERATEUR_CHAUFFAGE_LABELS,
  TYPE_ENERGIE_LABELS,
} from '../constants/labels'

interface SystemeChauffageFormProps {
  batimentId: string
  systeme?: SystemeChauffage | null
}

interface SystemeChauffageFormData {
  generateur: {
    type: TypeGenerateurChauffage
    puissance: number
    energie: TypeEnergie
    rendement?: number
  }
}

export default function SystemeChauffageForm({
  batimentId,
  systeme,
}: SystemeChauffageFormProps) {
  const queryClient = useQueryClient()
  const [messageApi, contextHolder] = message.useMessage()
  const [form] = Form.useForm<SystemeChauffageFormData>()

  const [isEditing, setIsEditing] = useState(false)

  // Mutation pour définir/mettre à jour le système de chauffage
  const setMutation = useMutation({
    mutationFn: (data: Partial<SystemeChauffage>) =>
      elementsApi.setSystemeChauffage(batimentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.batiments.detail(batimentId) })
      messageApi.success('Système de chauffage enregistré avec succès')
      setIsEditing(false)
    },
    onError: () => {
      messageApi.error("Erreur lors de l'enregistrement du système de chauffage")
    },
  })

  const handleEdit = () => {
    if (systeme?.generateur) {
      form.setFieldsValue({
        generateur: {
          type: systeme.generateur.type,
          puissance: systeme.generateur.puissance,
          energie: systeme.generateur.energie,
          rendement: systeme.generateur.rendement,
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
        title="Système de chauffage"
        extra={
          !isEditing && systeme?.generateur ? (
            <Space size="small">
              <Button size="small" icon={<EditOutlined />} onClick={handleEdit}>
                Modifier
              </Button>
            </Space>
          ) : null
        }
      >
        {!systeme?.generateur && !isEditing ? (
          <Empty description="Aucun système de chauffage défini" image={Empty.PRESENTED_IMAGE_SIMPLE}>
            <Button type="primary" size="small" onClick={() => setIsEditing(true)}>
              Ajouter
            </Button>
          </Empty>
        ) : isEditing ? (
          <Form form={form} layout="vertical">
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Card title="Générateur de chauffage" size="small" type="inner">
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                  <Form.Item
                    label="Type de générateur"
                    name={['generateur', 'type']}
                    rules={[{ required: true, message: 'Veuillez sélectionner le type' }]}
                  >
                    <Select
                      placeholder="Sélectionner"
                      options={Object.entries(TYPE_GENERATEUR_CHAUFFAGE_LABELS).map(
                        ([value, label]) => ({
                          value,
                          label,
                        })
                      )}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Type d'énergie"
                    name={['generateur', 'energie']}
                    rules={[{ required: true, message: 'Veuillez sélectionner l\'énergie' }]}
                  >
                    <Select
                      placeholder="Sélectionner"
                      options={Object.entries(TYPE_ENERGIE_LABELS).map(([value, label]) => ({
                        value,
                        label,
                      }))}
                    />
                  </Form.Item>

                  <Space style={{ width: '100%' }} size="middle">
                    <Form.Item
                      label="Puissance (kW)"
                      name={['generateur', 'puissance']}
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
                        step={0.1}
                        precision={2}
                        addonAfter="kW"
                      />
                    </Form.Item>

                    <Form.Item
                      label="Rendement (%)"
                      name={['generateur', 'rendement']}
                      rules={[{ type: 'number', min: 0, max: 100, message: 'Entre 0 et 100' }]}
                      style={{ flex: 1 }}
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        placeholder="0.00"
                        min={0}
                        max={100}
                        step={0.1}
                        precision={2}
                        addonAfter="%"
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
        ) : systeme?.generateur ? (
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="Type générateur">
              {TYPE_GENERATEUR_CHAUFFAGE_LABELS[systeme.generateur.type]}
            </Descriptions.Item>
            <Descriptions.Item label="Énergie">
              {TYPE_ENERGIE_LABELS[systeme.generateur.energie]}
            </Descriptions.Item>
            <Descriptions.Item label="Puissance">
              {systeme.generateur.puissance?.toFixed(2) || '-'} kW
            </Descriptions.Item>
            {systeme.generateur.rendement != null && (
              <Descriptions.Item label="Rendement">
                {systeme.generateur.rendement.toFixed(2)} %
              </Descriptions.Item>
            )}
          </Descriptions>
        ) : null}
      </Card>
    </>
  )
}
