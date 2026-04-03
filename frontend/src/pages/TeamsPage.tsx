import { useEffect, useState } from 'react'
import { Stack, Title, Button, TextInput, Card, Group, Text, ActionIcon } from '@mantine/core'
import { IconTrash, IconSettings } from '@tabler/icons-react'
import { Link } from 'react-router-dom'
import { notifications } from '@mantine/notifications'
import { api } from '../api'
import type { Team } from '../types'

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [newName, setNewName] = useState('')

  useEffect(() => {
    api.listTeams().then(setTeams).catch(() => notifications.show({ message: 'Failed to load teams', color: 'red' }))
  }, [])

  const handleCreate = async () => {
    if (!newName.trim()) return
    try {
      const team = await api.createTeam(newName.trim())
      setTeams(prev => [...prev, team])
      setNewName('')
    } catch {
      notifications.show({ message: 'Failed to create team', color: 'red' })
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await api.deleteTeam(id)
      setTeams(prev => prev.filter(t => t.id !== id))
    } catch {
      notifications.show({ message: 'Failed to delete team', color: 'red' })
    }
  }

  return (
    <Stack maw={600} mx="auto">
      <Title order={2}>Teams</Title>
      <Group>
        <TextInput
          placeholder="New team name"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleCreate()}
          style={{ flex: 1 }}
        />
        <Button onClick={handleCreate}>Add Team</Button>
      </Group>
      {teams.map(team => (
        <Card key={team.id} withBorder shadow="sm">
          <Group justify="space-between">
            <Text component={Link} to={`/teams/${team.id}`} fw={500}>{team.name}</Text>
            <Group gap="xs">
              <ActionIcon component={Link} to={`/teams/${team.id}/settings`} variant="subtle">
                <IconSettings size={16} />
              </ActionIcon>
              <ActionIcon color="red" variant="subtle" onClick={() => handleDelete(team.id)}>
                <IconTrash size={16} />
              </ActionIcon>
            </Group>
          </Group>
        </Card>
      ))}
    </Stack>
  )
}
