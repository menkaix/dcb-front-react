import { Form, InputNumber, Card, Select, Row, Col } from 'antd'
import { TYPE_TOITURE_LABELS, FORME_TOIT_LABELS } from '../../constants/labels'

export default function Step5Toiture() {
  return (
    <Card
      title="Configuration de la toiture"
      styles={{ body: { padding: '24px' } }}
    >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Type de toiture"
              name={['toiture', 'type']}
              rules={[{ required: true, message: 'Veuillez sélectionner le type' }]}
            >
              <Select
                placeholder="Sélectionner"
                size="large"
                options={Object.entries(TYPE_TOITURE_LABELS).map(([value, label]) => ({
                  value,
                  label,
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Forme du toit"
              name={['toiture', 'forme']}
              tooltip="Forme géométrique de la toiture"
            >
              <Select
                placeholder="Sélectionner"
                size="large"
                allowClear
                options={Object.entries(FORME_TOIT_LABELS).map(([value, label]) => ({
                  value,
                  label,
                }))}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Pente"
              name={['toiture', 'pente']}
              rules={[
                { required: true, message: 'Requis' },
                { type: 'number', min: 0, max: 90, message: 'Entre 0 et 90°' },
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="30"
                min={0}
                max={90}
                step={1}
                precision={1}
                addonAfter="°"
                size="large"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Surface totale"
              name={['toiture', 'surfaceTotale']}
              tooltip="Surface totale de la toiture (optionnel)"
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="0.00"
                min={0}
                step={1}
                precision={2}
                addonAfter="m²"
                size="large"
              />
            </Form.Item>
          </Col>
        </Row>
    </Card>
  )
}
