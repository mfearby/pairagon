import { Routes, Route } from 'react-router-dom'
import { AppShell, Title, Group, Anchor, Image } from '@mantine/core'
import { Link } from 'react-router-dom'
import TeamsPage from './pages/TeamsPage'
import TeamBoardPage from './pages/TeamBoardPage'
import TeamSettingsPage from './pages/TeamSettingsPage'
import logo from './assets/pairagon-logo.png'

export default function App() {
    return (
        <AppShell header={{ height: 56 }} padding="md">
            <AppShell.Header>
                <Group h="100%" px="md" gap="sm">
                    <Anchor component={Link} to="/" underline="never">
                        <Image src={logo} h={36} w={36} />
                    </Anchor>
                    <Anchor component={Link} to="/" underline="never">
                        <Title order={4}>Pairagon</Title>
                    </Anchor>
                </Group>
            </AppShell.Header>
            <AppShell.Main>
                <Routes>
                    <Route path="/" element={<TeamsPage />} />
                    <Route path="/teams/:teamId" element={<TeamBoardPage />} />
                    <Route
                        path="/teams/:teamId/settings"
                        element={<TeamSettingsPage />}
                    />
                </Routes>
            </AppShell.Main>
        </AppShell>
    )
}
