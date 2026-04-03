import { Routes, Route } from 'react-router-dom'
import { AppShell, Title, Group, Anchor } from '@mantine/core'
import { Link } from 'react-router-dom'
import TeamsPage from './pages/TeamsPage'
import TeamBoardPage from './pages/TeamBoardPage'
import TeamSettingsPage from './pages/TeamSettingsPage'

export default function App() {
  return (
    <AppShell header={{ height: 56 }} padding="md">
      <AppShell.Header>
        <Group h="100%" px="md">
          <Anchor component={Link} to="/" underline="never">
            <Title order={4}>Pairagon: Standup Board</Title>
          </Anchor>
        </Group>
      </AppShell.Header>
      <AppShell.Main>
        <Routes>
          <Route path="/" element={<TeamsPage />} />
          <Route path="/teams/:teamId" element={<TeamBoardPage />} />
          <Route path="/teams/:teamId/settings" element={<TeamSettingsPage />} />
        </Routes>
      </AppShell.Main>
    </AppShell>
  )
}
