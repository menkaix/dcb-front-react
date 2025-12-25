import { Form, InputNumber, Card, Select } from 'antd'
import { TYPE_FONDATION_LABELS } from '../../constants/labels'

export default function Step4Fondations() {
  return (
    <Card
      title="Type de fondations"
      styles={{ body: { padding: '24px' } }}
    >
        <Form.Item
          label="Type"
          name={['fondations', 'type']}
          rules={[{ required: true, message: 'Veuillez sélectionner le type de fondations' }]}
        >
          <Select
            placeholder="Sélectionner"
            size="large"
            options={Object.entries(TYPE_FONDATION_LABELS).map(([value, label]) => ({
              value,
              label,
            }))}
          />
        </Form.Item>

        <Form.Item
          label="Profondeur"
          name={['fondations', 'profondeur']}
          rules={[
            { required: true, message: 'Requis' },
            { type: 'number', min: 0.1, message: 'Doit être > 0' },
          ]}
          tooltip="Profondeur d'enfouissement des fondations"
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder="0.80"
            min={0.1}
            max={20}
            step={0.1}
            precision={2}
            addonAfter="m"
            size="large"
          />
        </Form.Item>
    </Card>
  )
}
