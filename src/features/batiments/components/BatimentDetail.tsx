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
  Empty,
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
      children: (
        <Card>
          {batiment.charpente ? (
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Type">{batiment.charpente.type || '-'}</Descriptions.Item>
              <Descriptions.Item label="Forme du toit">{batiment.charpente.formeToit || '-'}</Descriptions.Item>
              <Descriptions.Item label="Pente (°)">{batiment.charpente.pente?.toFixed(2) || '-'}</Descriptions.Item>
              <Descriptions.Item label="Portée (m)">{batiment.charpente.portee?.toFixed(2) || '-'}</Descriptions.Item>
            </Descriptions>
          ) : (
            <Empty description="Aucune information sur la charpente" />
          )}
        </Card>
      ),
    },
    {
      key: 'toiture',
      label: 'Toiture',
      children: (
        <Card>
          {batiment.toiture ? (
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Type">{batiment.toiture.type || '-'}</Descriptions.Item>
              <Descriptions.Item label="Surface (m²)">{batiment.toiture.surface?.toFixed(2) || '-'}</Descriptions.Item>
              <Descriptions.Item label="Pente (°)">{batiment.toiture.pente?.toFixed(2) || '-'}</Descriptions.Item>
              <Descriptions.Item label="Couleur">{batiment.toiture.couleur || '-'}</Descriptions.Item>
            </Descriptions>
          ) : (
            <Empty description="Aucune information sur la toiture" />
          )}
        </Card>
      ),
    },
    {
      key: 'systemes',
      label: 'Systèmes',
      children: (
        <Space vertical size="middle" style={{ width: '100%' }}>
          <Card title="Système électrique" size="small">
            {batiment.systemeElectrique ? (
              <Descriptions bordered column={2} size="small">
                <Descriptions.Item label="Type">
                  {batiment.systemeElectrique.tableauElectrique?.type || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Puissance abonnement (kVA)">
                  {batiment.systemeElectrique.puissanceAbonnement?.toFixed(2) || '-'}
                </Descriptions.Item>
              </Descriptions>
            ) : (
              <Empty description="Non défini" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>

          <Card title="Système de plomberie" size="small">
            {batiment.systemePlomberie?.productionEauChaude ? (
              <Descriptions bordered column={2} size="small">
                <Descriptions.Item label="Type production eau chaude">
                  {batiment.systemePlomberie.productionEauChaude.type || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Capacité (L)">
                  {batiment.systemePlomberie.productionEauChaude.capacite || '-'}
                </Descriptions.Item>
              </Descriptions>
            ) : (
              <Empty description="Non défini" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>

          <Card title="Système de chauffage" size="small">
            {batiment.systemeChauffage?.generateur ? (
              <Descriptions bordered column={2} size="small">
                <Descriptions.Item label="Type générateur">
                  {batiment.systemeChauffage.generateur.type || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Puissance (kW)">
                  {batiment.systemeChauffage.generateur.puissance?.toFixed(2) || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Énergie">
                  {batiment.systemeChauffage.generateur.energie || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Rendement (%)">
                  {batiment.systemeChauffage.generateur.rendement?.toFixed(2) || '-'}
                </Descriptions.Item>
              </Descriptions>
            ) : (
              <Empty description="Non défini" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>

          <Card title="Système de ventilation" size="small">
            {batiment.systemeVentilation ? (
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Type">{batiment.systemeVentilation.type || '-'}</Descriptions.Item>
              </Descriptions>
            ) : (
              <Empty description="Non défini" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>
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
