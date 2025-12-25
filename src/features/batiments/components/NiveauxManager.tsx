import { useState } from 'react'
import {
  Card,
  Button,
  Space,
  Collapse,
  Descriptions,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Empty,
  Tabs,
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
} from '@ant-design/icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { niveauxApi } from '@/api/endpoints/niveaux'
import { queryKeys } from '@/api/query-keys'
import type { Niveau } from '@/api/types/batiment.types'
import PiecesManager from './PiecesManager'
import MursManager from './MursManager'
import CloisonsManager from './CloisonsManager'

interface NiveauxManagerProps {
  batimentId: string
  niveaux?: Niveau[]
}

interface NiveauFormData {
  nom: string
  numero: number
  altitude?: number
  hauteurSousPlafond?: number
  surface?: number
}

export default function NiveauxManager({ batimentId, niveaux = [] }: NiveauxManagerProps) {
  const queryClient = useQueryClient()
  const [messageApi, contextHolder] = message.useMessage()
  const [form] = Form.useForm<NiveauFormData>()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingNiveau, setEditingNiveau] = useState<Niveau | null>(null)

  // Mutation pour ajouter un niveau
  const addMutation = useMutation({
    mutationFn: (niveau: Partial<Niveau>) => niveauxApi.add(batimentId, niveau),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.batiments.detail(batimentId) })
      messageApi.success('Niveau ajouté avec succès')
      handleCloseModal()
    },
    onError: () => {
      messageApi.error("Erreur lors de l'ajout du niveau")
    },
  })

  // Mutation pour modifier un niveau
  const updateMutation = useMutation({
    mutationFn: ({ niveauId, niveau }: { niveauId: string; niveau: Partial<Niveau> }) =>
      niveauxApi.update(batimentId, niveauId, niveau),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.batiments.detail(batimentId) })
      messageApi.success('Niveau modifié avec succès')
      handleCloseModal()
    },
    onError: () => {
      messageApi.error('Erreur lors de la modification du niveau')
    },
  })

  // Mutation pour supprimer un niveau
  const deleteMutation = useMutation({
    mutationFn: (niveauId: string) => niveauxApi.delete(batimentId, niveauId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.batiments.detail(batimentId) })
      messageApi.success('Niveau supprimé avec succès')
    },
    onError: () => {
      messageApi.error('Erreur lors de la suppression du niveau')
    },
  })

  // Mutation pour dupliquer un niveau
  const duplicateMutation = useMutation({
    mutationFn: (niveauId: string) => niveauxApi.duplicate(batimentId, niveauId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.batiments.detail(batimentId) })
      messageApi.success('Niveau dupliqué avec succès')
    },
    onError: () => {
      messageApi.error('Erreur lors de la duplication du niveau')
    },
  })

  const handleAdd = () => {
    setEditingNiveau(null)
    form.resetFields()
    // Définir le numéro par défaut pour le prochain niveau
    const nextNumero = niveaux.length > 0 ? Math.max(...niveaux.map((n) => n.numero)) + 1 : 0
    form.setFieldsValue({ numero: nextNumero })
    setIsModalOpen(true)
  }

  const handleEdit = (niveau: Niveau) => {
    setEditingNiveau(niveau)
    form.setFieldsValue({
      nom: niveau.nom,
      numero: niveau.numero,
      altitude: niveau.altitude,
      hauteurSousPlafond: niveau.hauteurSousPlafond,
      surface: niveau.surface,
    })
    setIsModalOpen(true)
  }

  const handleDelete = (niveauId: string) => {
    deleteMutation.mutate(niveauId)
  }

  const handleDuplicate = (niveauId: string) => {
    duplicateMutation.mutate(niveauId)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingNiveau(null)
    form.resetFields()
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()

      if (editingNiveau) {
        updateMutation.mutate({
          niveauId: editingNiveau.id,
          niveau: values,
        })
      } else {
        addMutation.mutate(values)
      }
    } catch (error) {
      // Validation échouée
    }
  }

  // Générer les items pour le collapse (accordéon)
  const collapseItems = niveaux.map((niveau) => ({
    key: niveau.id,
    label: (
      <Space size="middle">
        <strong>{niveau.nom}</strong>
        <span>Niveau {niveau.numero}</span>
        {niveau.altitude != null && <span>• Alt: {niveau.altitude.toFixed(2)} m</span>}
        {niveau.surface != null && <span>• {niveau.surface.toFixed(2)} m²</span>}
        <span>• {niveau.pieces?.length || 0} pièce(s)</span>
        <span>• {niveau.murs?.length || 0} mur(s)</span>
      </Space>
    ),
    extra: (
      <Space size="small" onClick={(e) => e.stopPropagation()}>
        <Button
          size="small"
          icon={<EditOutlined />}
          onClick={() => handleEdit(niveau)}
        >
          Modifier
        </Button>
        <Button
          size="small"
          icon={<CopyOutlined />}
          onClick={() => handleDuplicate(niveau.id)}
          loading={duplicateMutation.isPending}
        >
          Dupliquer
        </Button>
        <Popconfirm
          title="Supprimer le niveau"
          description="Êtes-vous sûr de vouloir supprimer ce niveau ?"
          onConfirm={() => handleDelete(niveau.id)}
          okText="Oui"
          cancelText="Non"
        >
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            loading={deleteMutation.isPending}
          >
            Supprimer
          </Button>
        </Popconfirm>
      </Space>
    ),
    children: (
      <Space vertical size="middle" style={{ width: '100%' }}>
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="Nom">{niveau.nom}</Descriptions.Item>
          <Descriptions.Item label="Numéro">{niveau.numero}</Descriptions.Item>
          <Descriptions.Item label="Altitude (m)">
            {niveau.altitude != null ? niveau.altitude.toFixed(2) : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Hauteur sous plafond (m)">
            {niveau.hauteurSousPlafond != null ? niveau.hauteurSousPlafond.toFixed(2) : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Surface (m²)">
            {niveau.surface != null ? niveau.surface.toFixed(2) : '-'}
          </Descriptions.Item>
        </Descriptions>

        <Tabs
          defaultActiveKey="pieces"
          items={[
            {
              key: 'pieces',
              label: `Pièces (${niveau.pieces?.length || 0})`,
              children: (
                <PiecesManager
                  batimentId={batimentId}
                  niveauId={niveau.id}
                  pieces={niveau.pieces}
                />
              ),
            },
            {
              key: 'murs',
              label: `Murs (${niveau.murs?.length || 0})`,
              children: (
                <MursManager
                  batimentId={batimentId}
                  niveauId={niveau.id}
                  murs={niveau.murs}
                />
              ),
            },
            {
              key: 'cloisons',
              label: `Cloisons (${niveau.cloisons?.length || 0})`,
              children: (
                <CloisonsManager
                  batimentId={batimentId}
                  niveauId={niveau.id}
                  cloisons={niveau.cloisons}
                />
              ),
            },
          ]}
        />
      </Space>
    ),
  }))

  return (
    <>
      {contextHolder}
      <Card
        title="Gestion des niveaux"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Ajouter un niveau
          </Button>
        }
      >
        {niveaux.length > 0 ? (
          <Collapse items={collapseItems} />
        ) : (
          <Empty description="Aucun niveau défini" />
        )}
      </Card>

      <Modal
        title={editingNiveau ? 'Modifier le niveau' : 'Ajouter un niveau'}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={handleCloseModal}
        confirmLoading={addMutation.isPending || updateMutation.isPending}
        okText={editingNiveau ? 'Modifier' : 'Ajouter'}
        cancelText="Annuler"
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: '24px' }}
        >
          <Form.Item
            label="Nom"
            name="nom"
            rules={[{ required: true, message: 'Veuillez saisir le nom du niveau' }]}
          >
            <Input placeholder="Ex: Rez-de-chaussée" />
          </Form.Item>

          <Form.Item
            label="Numéro"
            name="numero"
            rules={[{ required: true, message: 'Veuillez saisir le numéro du niveau' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="0"
              min={-10}
              max={50}
            />
          </Form.Item>

          <Form.Item
            label="Altitude (m)"
            name="altitude"
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="0.00"
              step={0.01}
              precision={2}
            />
          </Form.Item>

          <Form.Item
            label="Hauteur sous plafond (m)"
            name="hauteurSousPlafond"
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="2.50"
              min={0}
              step={0.01}
              precision={2}
            />
          </Form.Item>

          <Form.Item
            label="Surface (m²)"
            name="surface"
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="0.00"
              min={0}
              step={0.01}
              precision={2}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
