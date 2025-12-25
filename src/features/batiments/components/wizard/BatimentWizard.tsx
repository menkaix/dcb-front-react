import { useState, useEffect } from 'react'
import { Button, Form, message, Card, Space, Result, Typography } from 'antd'
import {
  LeftOutlined,
  RightOutlined,
  SaveOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'

const { Title, Text } = Typography
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { batimentsApi } from '@/api/endpoints/batiments'
import { elementsApi } from '@/api/endpoints/elements'
import { niveauxApi } from '@/api/endpoints/niveaux'
import { queryKeys } from '@/api/query-keys'
import type { WizardFormData } from '../../types/wizard.types'
import type { Batiment } from '@/api/types/batiment.types'
import Step1Generale from './Step1Generale'
import Step2Dimensions from './Step2Dimensions'
import Step3Terrain from './Step3Terrain'
import Step4Fondations from './Step4Fondations'
import Step5Toiture from './Step5Toiture'
import Step6Systemes from './Step6Systemes'

const steps = [
  {
    title: 'Général',
    description: 'Informations de base',
    content: <Step1Generale />,
  },
  {
    title: 'Dimensions',
    description: 'Taille du bâtiment',
    content: <Step2Dimensions />,
  },
  {
    title: 'Terrain',
    description: 'Caractéristiques terrain',
    content: <Step3Terrain />,
  },
  {
    title: 'Fondations',
    description: 'Type de fondations',
    content: <Step4Fondations />,
  },
  {
    title: 'Toiture',
    description: 'Configuration toiture',
    content: <Step5Toiture />,
  },
  {
    title: 'Systèmes',
    description: 'Équipements techniques',
    content: <Step6Systemes />,
  },
]

interface BatimentWizardProps {
  onClose?: () => void
}

export default function BatimentWizard({ onClose }: BatimentWizardProps) {
  const [current, setCurrent] = useState(0)
  const [form] = Form.useForm<WizardFormData>()
  const [messageApi, contextHolder] = message.useMessage()
  const [createdBatiment, setCreatedBatiment] = useState<Batiment | null>(null)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  // Initialiser les valeurs par défaut du formulaire
  useEffect(() => {
    form.setFieldsValue({
      dimensions: {},
      terrain: {},
      fondations: {},
      toiture: {},
      systemes: {
        electrique: {},
        chauffage: {},
        ventilation: {},
        plomberie: {},
      },
    })
  }, [form])

  const createBatimentMutation = useMutation({
    mutationFn: async (data: WizardFormData) => {
      console.log('Creating batiment with data:', data)

      // Vérifier que les champs essentiels sont présents
      if (!data.nom || !data.type || !data.forme) {
        throw new Error('Les champs nom, type et forme sont requis')
      }

      // 1. Créer le bâtiment de base
      const createPayload = {
        nom: data.nom,
        type: data.type as any,
        adresse: data.adresse,
      }
      console.log('Create payload:', createPayload)

      const batiment = await batimentsApi.create(createPayload)

      // 2. Ajouter le terrain
      if (data.terrain.surface && data.terrain.typeSol) {
        await elementsApi.setTerrain(batiment.id, {
          surface: data.terrain.surface,
          typeSol: data.terrain.typeSol as any,
          altitude: data.terrain.altitude,
        })
      }

      // 3. Ajouter les fondations
      if (data.fondations.type && data.fondations.profondeur) {
        await elementsApi.setFondations(batiment.id, {
          typeFondation: data.fondations.type as any,
          profondeur: data.fondations.profondeur,
        })
      }

      // 4. Créer les niveaux
      if (data.dimensions.nombreNiveaux) {
        for (let i = 0; i < data.dimensions.nombreNiveaux; i++) {
          await niveauxApi.add(batiment.id, {
            nom: i === 0 ? 'RDC' : `Étage ${i}`,
            numero: i,
            altitude: i * (data.dimensions.hauteurSousPlafond || 2.5),
            hauteurSousPlafond: data.dimensions.hauteurSousPlafond || 2.5,
          })
        }
      }

      // 5. Ajouter la toiture
      if (data.toiture.type && data.toiture.pente != null) {
        await elementsApi.setToiture(batiment.id, {
          type: data.toiture.type as any,
          forme: data.toiture.forme as any,
          pente: data.toiture.pente,
          surfaceTotale: data.toiture.surfaceTotale,
        })
      }

      // 6. Ajouter les systèmes si définis
      if (
        data.systemes.electrique?.puissanceAbonnement ||
        data.systemes.electrique?.type
      ) {
        await elementsApi.setSystemeElectrique(batiment.id, {
          puissanceAbonnement: data.systemes.electrique.puissanceAbonnement,
          tableauElectrique: data.systemes.electrique.type
            ? {
                type: data.systemes.electrique.type as any,
                puissance: 0,
                nombreCircuits: 0,
              }
            : undefined,
        })
      }

      if (data.systemes.chauffage?.type) {
        await elementsApi.setSystemeChauffage(batiment.id, {
          generateur: {
            type: data.systemes.chauffage.type as any,
            energie: (data.systemes.chauffage.energie || 'ELECTRICITE') as any,
            puissance: data.systemes.chauffage.puissance || 0,
          },
        })
      }

      if (data.systemes.ventilation?.type) {
        await elementsApi.setSystemeVentilation(batiment.id, {
          type: data.systemes.ventilation.type as any,
        })
      }

      if (data.systemes.plomberie?.typeProductionEauChaude) {
        await elementsApi.setSystemePlomberie(batiment.id, {
          productionEauChaude: {
            type: data.systemes.plomberie.typeProductionEauChaude as any,
            capacite: data.systemes.plomberie.capacite || 0,
          },
        })
      }

      // Récupérer le bâtiment complet avec tous les éléments
      const completeBatiment = await batimentsApi.getById(batiment.id)
      return completeBatiment
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.batiments.lists() })
      setCreatedBatiment(data)
      messageApi.success('Bâtiment créé avec succès!')
    },
    onError: (error: any) => {
      messageApi.error(
        error.response?.data?.message ||
          "Erreur lors de la création du bâtiment"
      )
    },
  })

  const next = async () => {
    try {
      await form.validateFields()
      setCurrent(current + 1)
    } catch (error) {
      messageApi.warning('Veuillez remplir tous les champs requis')
    }
  }

  const prev = () => {
    setCurrent(current - 1)
  }

  const handleSubmit = async () => {
    try {
      // Valider tous les champs du formulaire
      await form.validateFields()

      // Récupérer toutes les valeurs du formulaire (y compris celles des étapes précédentes)
      const values = form.getFieldsValue(true)
      console.log('All form values:', values)

      // Vérifier la structure des données
      if (!values.nom) {
        console.error('Nom is missing!')
        messageApi.error('Le nom du bâtiment est requis')
        return
      }
      if (!values.type) {
        console.error('Type is missing!')
        messageApi.error('Le type de bâtiment est requis')
        return
      }
      if (!values.forme) {
        console.error('Forme is missing!')
        messageApi.error('La forme du bâtiment est requise')
        return
      }

      createBatimentMutation.mutate(values)
    } catch (error) {
      console.error('Validation error:', error)
      messageApi.warning('Veuillez remplir tous les champs requis')
    }
  }

  const handleViewBatiment = () => {
    if (createdBatiment) {
      navigate(`/batiments/${createdBatiment.id}`)
      onClose?.()
    }
  }

  const handleCreateAnother = () => {
    setCreatedBatiment(null)
    setCurrent(0)
    form.resetFields()
  }

  if (createdBatiment) {
    return (
      <>
        {contextHolder}
        <Result
          status="success"
          title="Bâtiment créé avec succès!"
          subTitle={`Le bâtiment "${createdBatiment.nom}" a été créé et configuré.`}
          extra={[
            <Button type="primary" size="large" key="view" onClick={handleViewBatiment}>
              Voir le bâtiment
            </Button>,
            <Button size="large" key="another" onClick={handleCreateAnother}>
              Créer un autre bâtiment
            </Button>,
          ]}
        />
      </>
    )
  }

  const progressPercent = Math.round(((current + 1) / steps.length) * 100)

  return (
    <>
      {contextHolder}
      <div style={{ display: 'flex', gap: '24px', height: '100%' }}>
        {/* Progress sidebar */}
        <div style={{ width: '180px', flexShrink: 0 }}>
          <Card
            style={{ height: '100%' }}
            styles={{ body: { padding: '20px' } }}
          >
            {/* Progress bar */}
            <div>
              <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Progression
              </Text>
              <div style={{
                height: '12px',
                background: '#f0f0f0',
                borderRadius: '6px',
                overflow: 'hidden',
                marginTop: '12px',
                marginBottom: '24px'
              }}>
                <div style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #1890ff 0%, #52c41a 100%)',
                  width: `${progressPercent}%`,
                  transition: 'width 0.3s ease',
                  boxShadow: '0 2px 4px rgba(24, 144, 255, 0.3)'
                }} />
              </div>

              {/* Step counter */}
              <div style={{
                padding: '20px',
                background: 'linear-gradient(135deg, #1890ff 0%, #52c41a 100%)',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(24, 144, 255, 0.2)'
              }}>
                <Text style={{ fontSize: '12px', display: 'block', marginBottom: '12px', color: 'rgba(255,255,255,0.9)' }}>
                  ÉTAPE
                </Text>
                <div style={{
                  fontSize: '56px',
                  fontWeight: 'bold',
                  color: 'white',
                  lineHeight: 1,
                  marginBottom: '8px'
                }}>
                  {current + 1}
                </div>
                <div style={{
                  fontSize: '16px',
                  color: 'rgba(255,255,255,0.8)',
                  marginBottom: '12px'
                }}>
                  sur {steps.length}
                </div>
                <div style={{
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(255,255,255,0.3)'
                }}>
                  <Text strong style={{ fontSize: '13px', color: 'white', display: 'block', lineHeight: '1.4' }}>
                    {steps[current].title}
                  </Text>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Form content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Current step header */}
          <Card
            style={{ marginBottom: '16px' }}
            styles={{ body: { padding: '20px 24px' } }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #1890ff 0%, #52c41a 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '20px',
                fontWeight: 'bold'
              }}>
                {current + 1}
              </div>
              <div style={{ flex: 1 }}>
                <Title level={4} style={{ margin: 0, marginBottom: '4px' }}>
                  {steps[current].title}
                </Title>
                <Text type="secondary">{steps[current].description}</Text>
              </div>
              <Text type="secondary">
                Étape {current + 1} sur {steps.length}
              </Text>
            </div>
          </Card>

          {/* Form */}
          <Card
            style={{
              flex: 1,
              marginBottom: '16px',
              overflow: 'auto'
            }}
            styles={{ body: { padding: '24px' } }}
          >
            <Form form={form} layout="vertical">
              {steps[current].content}
            </Form>
          </Card>

          {/* Navigation buttons */}
          <Card styles={{ body: { padding: '16px 24px' } }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button
                size="large"
                icon={<LeftOutlined />}
                onClick={prev}
                disabled={current === 0}
              >
                Précédent
              </Button>

              <Space size="middle">
                {current > 0 && (
                  <Text type="secondary">
                    <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '4px' }} />
                    {current} étape{current > 1 ? 's' : ''} complétée{current > 1 ? 's' : ''}
                  </Text>
                )}
              </Space>

              <Space>
                {current < steps.length - 1 && (
                  <Button
                    type="primary"
                    size="large"
                    icon={<RightOutlined />}
                    onClick={next}
                    iconPosition="end"
                  >
                    Suivant
                  </Button>
                )}
                {current === steps.length - 1 && (
                  <Button
                    type="primary"
                    size="large"
                    icon={<SaveOutlined />}
                    onClick={handleSubmit}
                    loading={createBatimentMutation.isPending}
                  >
                    Créer le bâtiment
                  </Button>
                )}
              </Space>
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}
