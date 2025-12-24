import { useState } from 'react'
import {
  Typography,
  Tabs,
  Card,
  Descriptions,
  Button,
  Space,
  Tag,
  Spin,
  Alert,
} from 'antd'
import {
  ArrowLeftOutlined,
  EditOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { batimentsApi } from '@/api/endpoints/batiments'
import { queryKeys } from '@/api/query-keys'
import { TYPE_BATIMENT_LABELS, STATUT_LABELS, STATUT_COLORS } from '../constants/labels'
import NiveauxManager from './NiveauxManager'
import TerrainForm from './TerrainForm'
import FondationsForm from './FondationsForm'
import CharpenteForm from './CharpenteForm'
import ToitureForm from './ToitureForm'
import SystemeElectriqueForm from './SystemeElectriqueForm'
import SystemePlomberieForm from './SystemePlomberieForm'
import SystemeChauffageForm from './SystemeChauffageForm'
import SystemeVentilationForm from './SystemeVentilationForm'
import ValidationPanel from './ValidationPanel'

const { Title } = Typography

export default function BatimentDetail() {
  const { batimentId } = useParams<{ batimentId: string }>()
  const navigate = useNavigate()
  const [validationOpen, setValidationOpen] = useState(false)

  // Récupérer les données du bâtiment
  const { data: batiment, isLoading, error } = useQuery({
    queryKey: queryKeys.batiments.detail(batimentId!),
    queryFn: () => batimentsApi.getById(batimentId!),
    enabled: !!batimentId,
  })

  if (isLoading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    )
  }

  if (error || !batiment) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Erreur"
          description="Impossible de charger les détails du bâtiment."
          type="error"
          showIcon
        />
        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/batiments')}
          style={{ marginTop: '16px' }}
        >
          Retour à la liste
        </Button>
      </div>
    )
  }

  const tabItems = [
    {
      key: 'general',
      label: 'Informations générales',
      children: (
        <Card>
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Nom">{batiment.nom}</Descriptions.Item>
            <Descriptions.Item label="Type">{TYPE_BATIMENT_LABELS[batiment.type]}</Descriptions.Item>
            <Descriptions.Item label="Statut">
              <Tag color={STATUT_COLORS[batiment.statut]}>{STATUT_LABELS[batiment.statut]}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Adresse">{batiment.adresse || '-'}</Descriptions.Item>
            <Descriptions.Item label="Date de création">
              {batiment.dateCreation ? new Date(batiment.dateCreation).toLocaleDateString('fr-FR') : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Date de modification">
              {batiment.dateModification ? new Date(batiment.dateModification).toLocaleDateString('fr-FR') : '-'}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      ),
    },
    {
      key: 'terrain',
      label: 'Terrain',
      children: <TerrainForm batimentId={batiment.id} terrain={batiment.terrain} />,
    },
    {
      key: 'fondations',
      label: 'Fondations',
      children: <FondationsForm batimentId={batiment.id} fondations={batiment.fondations} />,
    },
    {
      key: 'niveaux',
      label: `Niveaux (${batiment.niveaux?.length || 0})`,
      children: <NiveauxManager batimentId={batiment.id} niveaux={batiment.niveaux} />,
    },
    {
      key: 'charpente',
      label: 'Charpente',
      children: <CharpenteForm batimentId={batiment.id} charpente={batiment.charpente} />,
    },
    {
      key: 'toiture',
      label: 'Toiture',
      children: <ToitureForm batimentId={batiment.id} toiture={batiment.toiture} />,
    },
    {
      key: 'systemes',
      label: 'Systèmes',
      children: (
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <SystemeElectriqueForm
            batimentId={batiment.id}
            systeme={batiment.systemeElectrique}
          />
          <SystemePlomberieForm
            batimentId={batiment.id}
            systeme={batiment.systemePlomberie}
          />
          <SystemeChauffageForm
            batimentId={batiment.id}
            systeme={batiment.systemeChauffage}
          />
          <SystemeVentilationForm
            batimentId={batiment.id}
            systeme={batiment.systemeVentilation}
          />
        </Space>
      ),
    },
  ]

  return (
    <>
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/batiments')}>
              Retour
            </Button>
            <Title level={2} style={{ margin: 0 }}>
              {batiment.nom}
            </Title>
            <Tag color={STATUT_COLORS[batiment.statut]}>{STATUT_LABELS[batiment.statut]}</Tag>
          </Space>
          <Space>
            <Button icon={<EditOutlined />} type="default">
              Modifier
            </Button>
            <Button
              icon={<CheckCircleOutlined />}
              type="primary"
              onClick={() => setValidationOpen(true)}
            >
              Valider
            </Button>
          </Space>
        </div>

        <Tabs defaultActiveKey="general" items={tabItems} />

        <ValidationPanel
          batimentId={batiment.id}
          open={validationOpen}
          onClose={() => setValidationOpen(false)}
        />
      </div>
    </>
  )
}
