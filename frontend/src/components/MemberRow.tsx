import { useState } from 'react'
import { ActionIcon, Card, Group, Text, TextInput } from '@mantine/core'
import { IconCheck, IconPencil, IconTrash, IconX } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { api } from '../api'
import type { Member } from '../types'

interface Props {
    member: Member
    teamId: number
    onUpdate: (updated: Member) => void
    onRemove: (id: number) => void
}

export default function MemberRow({ member, teamId, onUpdate, onRemove }: Props) {
    const [editing, setEditing] = useState(false)
    const [editName, setEditName] = useState(member.name)

    const handleSave = async () => {
        if (!editName.trim()) return
        try {
            const updated = await api.updateMember(teamId, member.id, editName.trim())
            onUpdate(updated)
            setEditing(false)
        } catch {
            notifications.show({ message: 'Failed to update member', color: 'red' })
        }
    }

    const handleCancel = () => {
        setEditName(member.name)
        setEditing(false)
    }

    return (
        <Card withBorder py="xs">
            <Group justify="space-between">
                {editing ? (
                    <TextInput
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                        size="sm"
                        autoFocus
                        style={{ flex: 1 }}
                    />
                ) : (
                    <Text>{member.name}</Text>
                )}
                <Group gap="xs">
                    {editing ? (
                        <>
                            <ActionIcon variant="subtle" color="green" title="Save" onClick={handleSave}>
                                <IconCheck size={16} />
                            </ActionIcon>
                            <ActionIcon variant="subtle" color="gray" title="Cancel" onClick={handleCancel}>
                                <IconX size={16} />
                            </ActionIcon>
                        </>
                    ) : (
                        <>
                            <ActionIcon variant="subtle" color="blue" title="Edit" onClick={() => setEditing(true)}>
                                <IconPencil size={16} />
                            </ActionIcon>
                            <ActionIcon variant="subtle" color="red" title="Remove" onClick={() => onRemove(member.id)}>
                                <IconTrash size={16} />
                            </ActionIcon>
                        </>
                    )}
                </Group>
            </Group>
        </Card>
    )
}
