import { Form, InputNumber, Card, Row, Col, Select } from 'antd'
import { TYPE_SOL_LABELS } from '../../constants/labels'

export default function Step3Terrain() {
  return (
    <Card
      title="Caractéristiques du terrain"
      styles={{ body: { padding: '24px' } }}
    >
        <Form.Item
          label="Surface du terrain"
          name={['terrain', 'surface']}
          rules={[
            { required: true, message: 'Requis' },
            { type: 'number', min: 1, message: 'Doit être > 0' },
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder="0.00"
            min={1}
            step={1}
            precision={2}
            addonAfter="m²"
            size="large"
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Type de sol"
              name={['terrain', 'typeSol']}
              rules={[{ required: true, message: 'Veuillez sélectionner le type de sol' }]}
            >
              <Select
                placeholder="Sélectionner"
                size="large"
                options={Object.entries(TYPE_SOL_LABELS).map(([value, label]) => ({
                  value,
                  label,
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Altitude"
              name={['terrain', 'altitude']}
              tooltip="Altitude du terrain (optionnel)"
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="0.00"
                step={0.1}
                precision={2}
                addonAfter="m"
                size="large"
              />
            </Form.Item>
          </Col>
        </Row>
    </Card>
  )
}
