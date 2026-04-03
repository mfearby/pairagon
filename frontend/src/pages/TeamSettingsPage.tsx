import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
    Stack,
    Title,
    Group,
    TextInput,
    Button,
    Card,
    Text,
    ActionIcon,
    Anchor,
} from '@mantine/core'
import { IconTrash, IconArrowLeft } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { api } from '../api'
import type { TeamDetail } from '../types'

export default function TeamSettingsPage() {
    const { teamId } = useParams<{ teamId: string }>()
    const id = Number(teamId)
    const [team, setTeam] = useState<TeamDetail | null>(null)
    const [newMember, setNewMember] = useState('')

    useEffect(() => {
        api.getTeam(id)
            .then(setTeam)
            .catch(() =>
                notifications.show({
                    message: 'Failed to load team',
                    color: 'red',
                })
            )
    }, [id])

    const handleAddMember = async () => {
        if (!newMember.trim() || !team) return
        try {
            const member = await api.addMember(id, newMember.trim())
            setTeam((prev) =>
                prev ? { ...prev, members: [...prev.members, member] } : prev
            )
            setNewMember('')
        } catch {
            notifications.show({
                message: 'Failed to add member',
                color: 'red',
            })
        }
    }

    const handleRemoveMember = async (memberId: number) => {
        try {
            await api.removeMember(id, memberId)
            setTeam((prev) =>
                prev
                    ? {
                          ...prev,
                          members: prev.members.filter(
                              (m) => m.id !== memberId
                          ),
                      }
                    : prev
            )
        } catch {
            notifications.show({
                message: 'Failed to remove member',
                color: 'red',
            })
        }
    }

    if (!team) return null

    return (
        <Stack maw={500} mx="auto">
            <Anchor component={Link} to={`/teams/${id}`} size="sm">
                <Group gap={4}>
                    <IconArrowLeft size={14} /> Back to board
                </Group>
            </Anchor>
            <Title order={2}>{team.name} — Settings</Title>
            <Title order={4}>Team Members</Title>
            <Group>
                <TextInput
                    placeholder="Member name"
                    value={newMember}
                    onChange={(e) => setNewMember(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddMember()}
                    style={{ flex: 1 }}
                />
                <Button onClick={handleAddMember}>Add</Button>
            </Group>
            {team.members.map((member) => (
                <Card key={member.id} withBorder py="xs">
                    <Group justify="space-between">
                        <Text>{member.name}</Text>
                        <ActionIcon
                            color="red"
                            variant="subtle"
                            onClick={() => handleRemoveMember(member.id)}
                        >
                            <IconTrash size={16} />
                        </ActionIcon>
                    </Group>
                </Card>
            ))}
        </Stack>
    )
}
