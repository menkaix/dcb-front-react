import { Layout, Typography, Button } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { useUIStore } from '@/store/ui.store'

const { Header: AntHeader } = Layout
const { Title } = Typography

export default function Header() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore()

  return (
    <AntHeader
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        background: '#001529',
        padding: '0 24px',
      }}
    >
      <Button
        type="text"
        icon={sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={toggleSidebar}
        style={{
          fontSize: '16px',
          width: 48,
          height: 48,
          color: '#fff',
        }}
      />
      <Title level={3} style={{ color: '#fff', margin: 0 }}>
        DCB - Devis Construction Bâtiment
      </Title>
    </AntHeader>
  )
}
