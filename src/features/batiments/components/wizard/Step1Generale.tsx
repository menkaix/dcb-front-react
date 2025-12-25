import { Form, Input, Select, Card, Typography, Radio } from 'antd'
import { FormeBatiment } from '../../types/wizard.types'
import { TYPE_BATIMENT_LABELS } from '../../constants/labels'
import { FORME_BATIMENT_LABELS, FORME_BATIMENT_DESCRIPTIONS } from '../../constants/forme-batiment-labels'

const { Text } = Typography

export default function Step1Generale() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Card
        title="Identification du bâtiment"
        styles={{ body: { padding: '24px' } }}
      >
        <Form.Item
          label="Nom du bâtiment"
          name="nom"
          rules={[{ required: true, message: 'Veuillez saisir le nom du bâtiment' }]}
        >
          <Input
            placeholder="Ex: Maison Familiale, Immeuble A..."
            size="large"
            showCount
            maxLength={100}
          />
        </Form.Item>

        <Form.Item
          label="Type de bâtiment"
          name="type"
          rules={[{ required: true, message: 'Veuillez sélectionner le type' }]}
        >
          <Select
            placeholder="Sélectionner le type"
            size="large"
            options={Object.entries(TYPE_BATIMENT_LABELS).map(([value, label]) => ({
              value,
              label,
            }))}
          />
        </Form.Item>

        <Form.Item
          label="Adresse"
          name="adresse"
          tooltip="Adresse complète du bâtiment (optionnel)"
        >
          <Input.TextArea
            placeholder="Ex: 123 Rue de la République, 75001 Paris"
            size="large"
            rows={2}
            showCount
            maxLength={200}
          />
        </Form.Item>
      </Card>

      <Card
        title="Forme du bâtiment"
        styles={{ body: { padding: '24px' } }}
      >
        <Form.Item
          name="forme"
          rules={[{ required: true, message: 'Veuillez sélectionner la forme du bâtiment' }]}
        >
          <Radio.Group style={{ width: '100%' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '12px',
            }}>
              {Object.entries(FORME_BATIMENT_LABELS).map(([value, label]) => (
                <Card
                  key={value}
                  size="small"
                  hoverable
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  styles={{
                    body: { padding: '16px' }
                  }}
                >
                  <Radio value={value} style={{ width: '100%' }}>
                    <div style={{ marginLeft: '4px' }}>
                      <div style={{
                        fontWeight: 600,
                        fontSize: '14px',
                        marginBottom: '6px',
                        color: '#262626'
                      }}>
                        {label}
                      </div>
                      <Text type="secondary" style={{ fontSize: '12px', lineHeight: '1.5' }}>
                        {FORME_BATIMENT_DESCRIPTIONS[value as FormeBatiment]}
                      </Text>
                    </div>
                  </Radio>
                </Card>
              ))}
            </div>
          </Radio.Group>
        </Form.Item>
      </Card>
    </div>
  )
}
