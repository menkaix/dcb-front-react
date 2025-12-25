import { useState } from 'react'
import {
  Table,
  Button,
  Space,
  Typography,
  Tag,
  Input,
  Select,
  Modal,
  Drawer,
  message,
  Popconfirm,
  Card
} from 'antd'
import {
  PlusOutlined,
  DeleteOutlined,
  CopyOutlined,
  EyeOutlined,
  SearchOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { batimentsApi } from '@/api/endpoints/batiments'
import { queryKeys } from '@/api/query-keys'
import { TypeBatiment, StatutBatiment } from '@/api/types/batiment.types'
import type { Batiment } from '@/api/types/batiment.types'
import type { TablePaginationConfig } from 'antd/es/table'
import type { ColumnsType } from 'antd/es/table'
import { TYPE_BATIMENT_LABELS, STATUT_LABELS, STATUT_COLORS } from '../constants/labels'
import BatimentWizard from './wizard/BatimentWizard'

const { Title } = Typography
const { Search } = Input

export default function BatimentList() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [messageApi, contextHolder] = message.useMessage()

  // États pour les filtres et pagination
  const [searchText, setSearchText] = useState('')
  const [typeFilter, setTypeFilter] = useState<TypeBatiment | undefined>()
  const [statutFilter, setStatutFilter] = useState<StatutBatiment | undefined>()
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  // Modal de création rapide
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newBatimentNom, setNewBatimentNom] = useState('')
  const [newBatimentType, setNewBatimentType] = useState<TypeBatiment>(TypeBatiment.MAISON_INDIVIDUELLE)

  // Wizard de configuration
  const [isWizardOpen, setIsWizardOpen] = useState(false)

  // Requête pour récupérer les bâtiments avec filtres et pagination
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.batiments.list({
      nom: searchText || undefined,
      type: typeFilter,
      statut: statutFilter,
    }, { page, size: pageSize }),
    queryFn: () => batimentsApi.getAll(
      {
        nom: searchText || undefined,
        type: typeFilter,
        statut: statutFilter,
      },
      { page, size: pageSize }
    ),
  })

  // Mutation pour créer un bâtiment
  const createMutation = useMutation({
    mutationFn: (request: { nom: string; type: TypeBatiment }) =>
      batimentsApi.init(request),
    onSuccess: (newBatiment) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.batiments.lists() })
      messageApi.success('Bâtiment créé avec succès')
      setIsCreateModalOpen(false)
      setNewBatimentNom('')
      navigate(`/batiments/${newBatiment.id}`)
    },
    onError: () => {
      messageApi.error('Erreur lors de la création du bâtiment')
    },
  })

  // Mutation pour supprimer un bâtiment
  const deleteMutation = useMutation({
    mutationFn: (id: string) => batimentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.batiments.lists() })
      messageApi.success('Bâtiment supprimé avec succès')
    },
    onError: () => {
      messageApi.error('Erreur lors de la suppression du bâtiment')
    },
  })

  // Mutation pour dupliquer un bâtiment
  const duplicateMutation = useMutation({
    mutationFn: ({ id, nouveauNom }: { id: string; nouveauNom: string }) =>
      batimentsApi.duplicate(id, nouveauNom),
    onSuccess: (duplicatedBatiment) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.batiments.lists() })
      messageApi.success('Bâtiment dupliqué avec succès')
      navigate(`/batiments/${duplicatedBatiment.id}`)
    },
    onError: () => {
      messageApi.error('Erreur lors de la duplication du bâtiment')
    },
  })

  // Handlers
  const handleCreate = () => {
    if (!newBatimentNom.trim()) {
      messageApi.warning('Veuillez saisir un nom pour le bâtiment')
      return
    }
    createMutation.mutate({ nom: newBatimentNom, type: newBatimentType })
  }

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id)
  }

  const handleDuplicate = (batiment: Batiment) => {
    const nouveauNom = `${batiment.nom} (copie)`
    duplicateMutation.mutate({ id: batiment.id, nouveauNom })
  }

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPage((pagination.current || 1) - 1)
    setPageSize(pagination.pageSize || 10)
  }

  const handleSearch = (value: string) => {
    setSearchText(value)
    setPage(0)
  }

  const handleTypeFilterChange = (value: TypeBatiment | undefined) => {
    setTypeFilter(value)
    setPage(0)
  }

  const handleStatutFilterChange = (value: StatutBatiment | undefined) => {
    setStatutFilter(value)
    setPage(0)
  }

  // Colonnes du tableau
  const columns: ColumnsType<Batiment> = [
    {
      title: 'Nom',
      dataIndex: 'nom',
      key: 'nom',
      sorter: (a, b) => a.nom.localeCompare(b.nom),
      width: 250,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: TypeBatiment) => TYPE_BATIMENT_LABELS[type],
      width: 180,
    },
    {
      title: 'Statut',
      dataIndex: 'statut',
      key: 'statut',
      render: (statut: StatutBatiment) => (
        <Tag color={STATUT_COLORS[statut]}>{STATUT_LABELS[statut]}</Tag>
      ),
      width: 120,
    },
    {
      title: 'Surface (m²)',
      key: 'surfaceTotale',
      render: (_, record) => {
        const surface = record.terrain?.surface || 0
        return surface ? surface.toFixed(2) : '-'
      },
      width: 120,
      align: 'right',
    },
    {
      title: 'Niveaux',
      key: 'nombreNiveaux',
      render: (_, record) => record.niveaux?.length || 0,
      width: 100,
      align: 'center',
    },
    {
      title: 'Créé le',
      dataIndex: 'dateCreation',
      key: 'dateCreation',
      render: (date?: string) => date ? new Date(date).toLocaleDateString('fr-FR') : '-',
      width: 120,
    },
    {
      title: 'Modifié le',
      dataIndex: 'dateModification',
      key: 'dateModification',
      render: (date?: string) => date ? new Date(date).toLocaleDateString('fr-FR') : '-',
      width: 120,
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/batiments/${record.id}`)}
          >
            Voir
          </Button>
          <Button
            type="link"
            size="small"
            icon={<CopyOutlined />}
            onClick={() => handleDuplicate(record)}
            loading={duplicateMutation.isPending}
          >
            Dupliquer
          </Button>
          <Popconfirm
            title="Supprimer le bâtiment"
            description="Êtes-vous sûr de vouloir supprimer ce bâtiment ?"
            onConfirm={() => handleDelete(record.id)}
            okText="Oui"
            cancelText="Non"
          >
            <Button
              type="link"
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
    },
  ]

  return (
    <>
      {contextHolder}
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={2} style={{ margin: 0 }}>Liste des Bâtiments</Title>
          <Space>
            <Button
              icon={<PlusOutlined />}
              onClick={() => setIsCreateModalOpen(true)}
              size="large"
            >
              Création rapide
            </Button>
            <Button
              type="primary"
              icon={<ThunderboltOutlined />}
              onClick={() => setIsWizardOpen(true)}
              size="large"
            >
              Assistant de configuration
            </Button>
          </Space>
        </div>

        <Card>
          {/* Filtres */}
          <Space style={{ marginBottom: '16px' }} wrap>
            <Search
              placeholder="Rechercher par nom..."
              allowClear
              onSearch={handleSearch}
              onChange={(e) => !e.target.value && handleSearch('')}
              style={{ width: 300 }}
              prefix={<SearchOutlined />}
            />
            <Select
              placeholder="Filtrer par type"
              allowClear
              style={{ width: 200 }}
              onChange={handleTypeFilterChange}
              value={typeFilter}
              options={Object.entries(TYPE_BATIMENT_LABELS).map(([value, label]) => ({
                value,
                label,
              }))}
            />
            <Select
              placeholder="Filtrer par statut"
              allowClear
              style={{ width: 200 }}
              onChange={handleStatutFilterChange}
              value={statutFilter}
              options={Object.entries(STATUT_LABELS).map(([value, label]) => ({
                value,
                label,
              }))}
            />
          </Space>

          {/* Tableau */}
          <Table
            columns={columns}
            dataSource={data?.content || []}
            rowKey="id"
            loading={isLoading}
            pagination={{
              current: page + 1,
              pageSize: pageSize,
              total: data?.totalElements || 0,
              showSizeChanger: true,
              showTotal: (total) => `Total: ${total} bâtiment(s)`,
              pageSizeOptions: ['10', '20', '50', '100'],
            }}
            onChange={handleTableChange}
            scroll={{ x: 1200 }}
          />
        </Card>

        {/* Modal de création */}
        <Modal
          title="Créer un nouveau bâtiment"
          open={isCreateModalOpen}
          onOk={handleCreate}
          onCancel={() => {
            setIsCreateModalOpen(false)
            setNewBatimentNom('')
            setNewBatimentType(TypeBatiment.MAISON_INDIVIDUELLE)
          }}
          confirmLoading={createMutation.isPending}
          okText="Créer"
          cancelText="Annuler"
        >
          <Space vertical style={{ width: '100%' }} size="large">
            <div>
              <label style={{ display: 'block', marginBottom: '8px' }}>Nom du bâtiment *</label>
              <Input
                placeholder="Ex: Maison Martin"
                value={newBatimentNom}
                onChange={(e) => setNewBatimentNom(e.target.value)}
                onPressEnter={handleCreate}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px' }}>Type de bâtiment *</label>
              <Select
                style={{ width: '100%' }}
                value={newBatimentType}
                onChange={setNewBatimentType}
                options={Object.entries(TYPE_BATIMENT_LABELS).map(([value, label]) => ({
                  value,
                  label,
                }))}
              />
            </div>
          </Space>
        </Modal>

        {/* Drawer de l'assistant de configuration */}
        <Drawer
          title="Assistant de configuration de bâtiment"
          width="80%"
          onClose={() => setIsWizardOpen(false)}
          open={isWizardOpen}
          destroyOnClose
          styles={{ body: { paddingBottom: 80 } }}
        >
          <BatimentWizard onClose={() => setIsWizardOpen(false)} />
        </Drawer>
      </div>
    </>
  )
}
