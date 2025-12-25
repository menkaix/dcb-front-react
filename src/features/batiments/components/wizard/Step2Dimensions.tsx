import { Form, InputNumber, Card, Row, Col, Divider } from 'antd'

export default function Step2Dimensions() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Card
        title="Dimensions horizontales"
        styles={{ body: { padding: '24px' } }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Longueur"
              name={['dimensions', 'longueur']}
              rules={[
                { required: true, message: 'Requis' },
                { type: 'number', min: 0.1, message: 'Doit être > 0' },
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="0.00"
                min={0.1}
                step={0.1}
                precision={2}
                addonAfter="m"
                size="large"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Largeur"
              name={['dimensions', 'largeur']}
              rules={[
                { required: true, message: 'Requis' },
                { type: 'number', min: 0.1, message: 'Doit être > 0' },
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="0.00"
                min={0.1}
                step={0.1}
                precision={2}
                addonAfter="m"
                size="large"
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <Card
        title="Dimensions verticales"
        styles={{ body: { padding: '24px' } }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Nombre de niveaux"
              name={['dimensions', 'nombreNiveaux']}
              rules={[
                { required: true, message: 'Requis' },
                { type: 'number', min: 1, message: 'Au moins 1 niveau' },
              ]}
              tooltip="Nombre d'étages du bâtiment (RDC = 1 niveau)"
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="1"
                min={1}
                max={50}
                step={1}
                size="large"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Hauteur sous plafond"
              name={['dimensions', 'hauteurSousPlafond']}
              rules={[
                { required: true, message: 'Requis' },
                { type: 'number', min: 2.0, message: 'Minimum 2.0m' },
              ]}
              tooltip="Hauteur sous plafond standard pour tous les niveaux"
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="2.50"
                min={2.0}
                max={10.0}
                step={0.1}
                precision={2}
                addonAfter="m"
                size="large"
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        <Form.Item
          label="Hauteur totale du bâtiment"
          name={['dimensions', 'hauteur']}
          tooltip="Hauteur totale depuis le sol jusqu'au faîtage (optionnel)"
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder="0.00"
            min={0}
            step={0.1}
            precision={2}
            addonAfter="m"
            size="large"
          />
        </Form.Item>
      </Card>
    </div>
  )
}
