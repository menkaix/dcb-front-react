import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import { useUIStore } from '@/store/ui.store'
import Header from './Header'
import Sidebar from './Sidebar'

const { Content } = Layout

export default function AppLayout() {
  const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed)

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header />
      <Layout>
        <Sidebar collapsed={sidebarCollapsed} />
        <Layout style={{ padding: '24px' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: '#fff',
              borderRadius: 8,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}
