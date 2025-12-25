import { Form, InputNumber, Card, Select, Row, Col } from 'antd'
import {
  TYPE_SYSTEME_ELECTRIQUE_LABELS,
  TYPE_GENERATEUR_CHAUFFAGE_LABELS,
  TYPE_ENERGIE_LABELS,
  TYPE_VENTILATION_LABELS,
  TYPE_PRODUCTION_EAU_CHAUDE_LABELS,
} from '../../constants/labels'

export default function Step6Systemes() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Card
        title="Système électrique"
        size="small"
        styles={{ body: { padding: '20px' } }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Type"
              name={['systemes', 'electrique', 'type']}
              tooltip="Type de raccordement électrique"
            >
              <Select
                placeholder="Sélectionner"
                allowClear
                options={Object.entries(TYPE_SYSTEME_ELECTRIQUE_LABELS).map(
                  ([value, label]) => ({ value, label })
                )}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Puissance abonnement"
              name={['systemes', 'electrique', 'puissanceAbonnement']}
              tooltip="Puissance de l'abonnement électrique"
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="12.00"
                min={0}
                step={1}
                precision={2}
                addonAfter="kVA"
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <Card
        title="Système de chauffage"
        size="small"
        styles={{ body: { padding: '20px' } }}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Type générateur"
              name={['systemes', 'chauffage', 'type']}
            >
              <Select
                placeholder="Sélectionner"
                allowClear
                options={Object.entries(TYPE_GENERATEUR_CHAUFFAGE_LABELS).map(
                  ([value, label]) => ({ value, label })
                )}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Énergie" name={['systemes', 'chauffage', 'energie']}>
              <Select
                placeholder="Sélectionner"
                allowClear
                options={Object.entries(TYPE_ENERGIE_LABELS).map(([value, label]) => ({
                  value,
                  label,
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Puissance"
              name={['systemes', 'chauffage', 'puissance']}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="25.00"
                min={0}
                step={1}
                precision={2}
                addonAfter="kW"
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <Card
        title="Système de ventilation"
        size="small"
        styles={{ body: { padding: '20px' } }}
      >
        <Form.Item label="Type de ventilation" name={['systemes', 'ventilation', 'type']}>
          <Select
            placeholder="Sélectionner"
            allowClear
            options={Object.entries(TYPE_VENTILATION_LABELS).map(([value, label]) => ({
              value,
              label,
            }))}
          />
        </Form.Item>
      </Card>

      <Card
        title="Système de plomberie"
        size="small"
        styles={{ body: { padding: '20px' } }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Production eau chaude"
              name={['systemes', 'plomberie', 'typeProductionEauChaude']}
            >
              <Select
                placeholder="Sélectionner"
                allowClear
                options={Object.entries(TYPE_PRODUCTION_EAU_CHAUDE_LABELS).map(
                  ([value, label]) => ({ value, label })
                )}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Capacité ballon"
              name={['systemes', 'plomberie', 'capacite']}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="200"
                min={0}
                step={10}
                precision={0}
                addonAfter="L"
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>
    </div>
  )
}
