import { useState } from 'react'
import {
  Drawer,
  Button,
  Space,
  Alert,
  List,
  Tag,
  Typography,
  Spin,
  Empty,
  Divider,
} from 'antd'
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  CloseOutlined,
} from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { batimentsApi } from '@/api/endpoints/batiments'
import { queryKeys } from '@/api/query-keys'
import type { ValidationError } from '@/api/types/batiment.types'

const { Title, Text } = Typography

interface ValidationPanelProps {
  batimentId: string
  open: boolean
  onClose: () => void
}

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'ERROR':
      return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
    case 'WARNING':
      return <ExclamationCircleOutlined style={{ color: '#faad14' }} />
    case 'INFO':
      return <InfoCircleOutlined style={{ color: '#1890ff' }} />
    default:
      return <InfoCircleOutlined />
  }
}

const getSeverityColor = (severity: string): string => {
  switch (severity) {
    case 'ERROR':
      return 'error'
    case 'WARNING':
      return 'warning'
    case 'INFO':
      return 'info'
    default:
      return 'default'
  }
}

export default function ValidationPanel({ batimentId, open, onClose }: ValidationPanelProps) {
  const { data: validation, isLoading, refetch } = useQuery({
    queryKey: queryKeys.batiments.validation(batimentId),
    queryFn: () => batimentsApi.validate(batimentId),
    enabled: open && !!batimentId,
  })

  const errors = validation?.errors || []
  const warnings = validation?.warnings || []
  const allIssues: ValidationError[] = [...errors, ...warnings]

  return (
    <Drawer
      title={
        <Space>
          <CheckCircleOutlined />
          <span>Validation du bâtiment</span>
        </Space>
      }
      placement="right"
      width={600}
      open={open}
      onClose={onClose}
      extra={
        <Space>
          <Button onClick={() => refetch()} loading={isLoading}>
            Actualiser
          </Button>
          <Button icon={<CloseOutlined />} onClick={onClose}>
            Fermer
          </Button>
        </Space>
      }
    >
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" tip="Validation en cours..." />
        </div>
      ) : (
        <Space vertical size="large" style={{ width: '100%' }}>
          {/* Résumé */}
          <Alert
            message={
              validation?.valid
                ? 'Bâtiment valide'
                : `${errors.length} erreur(s) et ${warnings.length} avertissement(s)`
            }
            description={
              validation?.valid
                ? 'Le bâtiment respecte toutes les règles de validation.'
                : 'Le bâtiment présente des problèmes qui doivent être corrigés.'
            }
            type={validation?.valid ? 'success' : 'error'}
            showIcon
            icon={validation?.valid ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
          />

          {/* Statistiques */}
          {!validation?.valid && (
            <Space size="large">
              {errors.length > 0 && (
                <div>
                  <Tag color="error" style={{ fontSize: '14px', padding: '4px 12px' }}>
                    {errors.length} Erreur{errors.length > 1 ? 's' : ''}
                  </Tag>
                </div>
              )}
              {warnings.length > 0 && (
                <div>
                  <Tag color="warning" style={{ fontSize: '14px', padding: '4px 12px' }}>
                    {warnings.length} Avertissement{warnings.length > 1 ? 's' : ''}
                  </Tag>
                </div>
              )}
            </Space>
          )}

          {/* Liste des problèmes */}
          {allIssues.length > 0 ? (
            <>
              <Divider>Détails</Divider>
              <List
                dataSource={allIssues}
                renderItem={(issue) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={getSeverityIcon(issue.severity)}
                      title={
                        <Space>
                          <Tag color={getSeverityColor(issue.severity)}>
                            {issue.severity}
                          </Tag>
                          <Text strong>{issue.ruleName}</Text>
                        </Space>
                      }
                      description={
                        <Space vertical size="small">
                          <Text>{issue.message}</Text>
                          {issue.field && (
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              Champ concerné: {issue.field}
                            </Text>
                          )}
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            </>
          ) : (
            validation?.valid && (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Aucun problème détecté"
              />
            )
          )}
        </Space>
      )}
    </Drawer>
  )
}
