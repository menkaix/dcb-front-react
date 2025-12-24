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
import { TypeToiture, FormeToit } from '@/api/types/batiment.types'
import type { Toiture } from '@/api/types/batiment.types'
import { TYPE_TOITURE_LABELS, FORME_TOIT_LABELS } from '../constants/labels'

interface ToitureFormProps {
  batimentId: string
  toiture?: Toiture | null
}

interface ToitureFormData {
  type: TypeToiture
  forme?: FormeToit
  pente: number
  surfaceTotale?: number
}

export default function ToitureForm({ batimentId, toiture }: ToitureFormProps) {
  const queryClient = useQueryClient()
  const [messageApi, contextHolder] = message.useMessage()
  const [form] = Form.useForm<ToitureFormData>()

  const [isEditing, setIsEditing] = useState(false)

  // Mutation pour définir/mettre à jour la toiture
  const setMutation = useMutation({
    mutationFn: (data: Partial<Toiture>) => elementsApi.setToiture(batimentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.batiments.detail(batimentId) })
      messageApi.success('Toiture enregistrée avec succès')
      setIsEditing(false)
    },
    onError: () => {
      messageApi.error("Erreur lors de l'enregistrement de la toiture")
    },
  })

  const handleEdit = () => {
    if (toiture) {
      form.setFieldsValue({
        type: toiture.type,
        forme: toiture.forme,
        pente: toiture.pente,
        surfaceTotale: toiture.surfaceTotale,
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
        title="Toiture"
        extra={
          !isEditing && toiture ? (
            <Space size="small">
              <Button size="small" icon={<EditOutlined />} onClick={handleEdit}>
                Modifier
              </Button>
            </Space>
          ) : null
        }
      >
        {!toiture && !isEditing ? (
          <Empty description="Aucune toiture définie" image={Empty.PRESENTED_IMAGE_SIMPLE}>
            <Button type="primary" size="small" onClick={() => setIsEditing(true)}>
              Ajouter
            </Button>
          </Empty>
        ) : isEditing ? (
          <Form form={form} layout="vertical">
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Form.Item
                label="Type de toiture"
                name="type"
                rules={[{ required: true, message: 'Veuillez sélectionner le type' }]}
              >
                <Select
                  placeholder="Sélectionner"
                  options={Object.entries(TYPE_TOITURE_LABELS).map(([value, label]) => ({
                    value,
                    label,
                  }))}
                />
              </Form.Item>

              <Space style={{ width: '100%' }} size="middle">
                <Form.Item
                  label="Forme"
                  name="forme"
                  style={{ flex: 1 }}
                >
                  <Select
                    placeholder="Sélectionner (optionnel)"
                    allowClear
                    options={Object.entries(FORME_TOIT_LABELS).map(([value, label]) => ({
                      value,
                      label,
                    }))}
                  />
                </Form.Item>

                <Form.Item
                  label="Pente (°)"
                  name="pente"
                  rules={[
                    { required: true, message: 'Requis' },
                    { type: 'number', min: 0, max: 90, message: 'Entre 0 et 90°' },
                  ]}
                  style={{ flex: 1 }}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="0"
                    min={0}
                    max={90}
                    step={0.1}
                    precision={1}
                    addonAfter="°"
                  />
                </Form.Item>
              </Space>

              <Form.Item label="Surface totale (m²)" name="surfaceTotale">
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="0.00"
                  min={0}
                  step={0.01}
                  precision={2}
                  addonAfter="m²"
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
        ) : toiture ? (
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="Type">
              {TYPE_TOITURE_LABELS[toiture.type]}
            </Descriptions.Item>
            <Descriptions.Item label="Pente">
              {toiture.pente?.toFixed(1) || '-'} °
            </Descriptions.Item>
            {toiture.forme && (
              <Descriptions.Item label="Forme">
                {FORME_TOIT_LABELS[toiture.forme]}
              </Descriptions.Item>
            )}
            {toiture.surfaceTotale != null && (
              <Descriptions.Item label="Surface totale">
                {toiture.surfaceTotale.toFixed(2)} m²
              </Descriptions.Item>
            )}
          </Descriptions>
        ) : null}
      </Card>
    </>
  )
}
