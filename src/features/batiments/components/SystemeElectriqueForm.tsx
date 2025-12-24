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
import { TypeSystemeElectrique } from '@/api/types/batiment.types'
import type { SystemeElectrique } from '@/api/types/batiment.types'
import { TYPE_SYSTEME_ELECTRIQUE_LABELS } from '../constants/labels'

interface SystemeElectriqueFormProps {
  batimentId: string
  systeme?: SystemeElectrique | null
}

interface SystemeElectriqueFormData {
  puissanceAbonnement: number
  tableauElectrique?: {
    puissance: number
    nombreCircuits: number
    type: TypeSystemeElectrique
  }
}

export default function SystemeElectriqueForm({
  batimentId,
  systeme,
}: SystemeElectriqueFormProps) {
  const queryClient = useQueryClient()
  const [messageApi, contextHolder] = message.useMessage()
  const [form] = Form.useForm<SystemeElectriqueFormData>()

  const [isEditing, setIsEditing] = useState(false)

  // Mutation pour définir/mettre à jour le système électrique
  const setMutation = useMutation({
    mutationFn: (data: Partial<SystemeElectrique>) =>
      elementsApi.setSystemeElectrique(batimentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.batiments.detail(batimentId) })
      messageApi.success('Système électrique enregistré avec succès')
      setIsEditing(false)
    },
    onError: () => {
      messageApi.error("Erreur lors de l'enregistrement du système électrique")
    },
  })

  const handleEdit = () => {
    if (systeme) {
      form.setFieldsValue({
        puissanceAbonnement: systeme.puissanceAbonnement,
        tableauElectrique: systeme.tableauElectrique
          ? {
              puissance: systeme.tableauElectrique.puissance,
              nombreCircuits: systeme.tableauElectrique.nombreCircuits,
              type: systeme.tableauElectrique.type,
            }
          : undefined,
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
        title="Système électrique"
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
          <Empty description="Aucun système électrique défini" image={Empty.PRESENTED_IMAGE_SIMPLE}>
            <Button type="primary" size="small" onClick={() => setIsEditing(true)}>
              Ajouter
            </Button>
          </Empty>
        ) : isEditing ? (
          <Form form={form} layout="vertical">
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Form.Item
                label="Puissance abonnement (kVA)"
                name="puissanceAbonnement"
                rules={[
                  { required: true, message: 'Veuillez saisir la puissance' },
                  { type: 'number', min: 0, message: 'Doit être positif' },
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="0.00"
                  min={0}
                  step={0.01}
                  precision={2}
                  addonAfter="kVA"
                />
              </Form.Item>

              <Card title="Tableau électrique" size="small" type="inner">
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                  <Form.Item
                    label="Type de système"
                    name={['tableauElectrique', 'type']}
                    rules={[{ required: true, message: 'Veuillez sélectionner le type' }]}
                  >
                    <Select
                      placeholder="Sélectionner"
                      options={Object.entries(TYPE_SYSTEME_ELECTRIQUE_LABELS).map(
                        ([value, label]) => ({
                          value,
                          label,
                        })
                      )}
                    />
                  </Form.Item>

                  <Space style={{ width: '100%' }} size="middle">
                    <Form.Item
                      label="Puissance (kW)"
                      name={['tableauElectrique', 'puissance']}
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
                        step={1}
                        precision={0}
                        addonAfter="kW"
                      />
                    </Form.Item>

                    <Form.Item
                      label="Nombre de circuits"
                      name={['tableauElectrique', 'nombreCircuits']}
                      rules={[
                        { required: true, message: 'Requis' },
                        { type: 'number', min: 1, message: 'Au moins 1' },
                      ]}
                      style={{ flex: 1 }}
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        placeholder="0"
                        min={1}
                        step={1}
                        precision={0}
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
        ) : systeme ? (
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="Puissance abonnement">
              {systeme.puissanceAbonnement?.toFixed(2) || '-'} kVA
            </Descriptions.Item>
            {systeme.tableauElectrique && (
              <>
                <Descriptions.Item label="Type système">
                  {TYPE_SYSTEME_ELECTRIQUE_LABELS[systeme.tableauElectrique.type]}
                </Descriptions.Item>
                <Descriptions.Item label="Puissance tableau">
                  {systeme.tableauElectrique.puissance} kW
                </Descriptions.Item>
                <Descriptions.Item label="Nombre circuits">
                  {systeme.tableauElectrique.nombreCircuits}
                </Descriptions.Item>
              </>
            )}
          </Descriptions>
        ) : null}
      </Card>
    </>
  )
}
