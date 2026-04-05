import { useState } from 'react'
import { ActionIcon, Group, MultiSelect, Stack, Text, TextInput, Textarea } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconCheck, IconGripVertical, IconPencil, IconTrash, IconX } from '@tabler/icons-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { api } from '../api'
import type { Task, TeamDetail } from '../types'

interface Props {
    task: Task
    teamId: number
    members: TeamDetail['members']
    onUpdate: (updated: Task) => void
}

export default function SortableTaskCard({ task, teamId, members, onUpdate }: Props) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: task.id })
    const style = { transform: CSS.Transform.toString(transform), transition }

    const [editing, setEditing] = useState(false)
    const [editName, setEditName] = useState(task.name)
    const [editDescription, setEditDescription] = useState(task.description ?? '')

    const handleAssign = async (memberIds: string[]) => {
        try {
            const updated = await api.assignMembers(teamId, task.id, memberIds.map(Number))
            onUpdate(updated)
        } catch {
            notifications.show({ message: 'Failed to update assignees', color: 'red' })
        }
    }

    const handleClose = async () => {
        try {
            await api.closeTask(teamId, task.id)
            onUpdate({ ...task, closed: true })
        } catch {
            notifications.show({ message: 'Failed to close task', color: 'red' })
        }
    }

    const handleDelete = async () => {
        try {
            await api.deleteTask(teamId, task.id)
            onUpdate({ ...task, closed: true, id: -task.id })
        } catch {
            notifications.show({ message: 'Failed to delete task', color: 'red' })
        }
    }

    const handleSaveEdit = async () => {
        if (!editName.trim()) return
        try {
            const updated = await api.updateTask(teamId, task.id, editName.trim(), editDescription.trim())
            onUpdate(updated)
            setEditing(false)
        } catch {
            notifications.show({ message: 'Failed to update task', color: 'red' })
        }
    }

    const handleCancelEdit = () => {
        setEditName(task.name)
        setEditDescription(task.description ?? '')
        setEditing(false)
    }

    return (
        <div
            ref={setNodeRef}
            style={{
                ...style,
                background: 'var(--mantine-color-body)',
                border: '1px solid var(--mantine-color-default-border)',
                borderRadius: 8,
                padding: '12px 16px',
            }}
        >
            <Group justify="space-between" wrap="nowrap">
                <Group gap="xs" wrap="nowrap" style={{ flex: 1 }}>
                    <ActionIcon
                        variant="subtle"
                        size="sm"
                        {...attributes}
                        {...listeners}
                        style={{ cursor: 'grab' }}
                    >
                        <IconGripVertical size={16} />
                    </ActionIcon>
                    {editing ? (
                        <Stack gap="xs" style={{ flex: 1 }}>
                            <TextInput
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                                placeholder="Task name"
                                size="sm"
                                autoFocus
                            />
                            <Textarea
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                placeholder="Description (optional)"
                                size="sm"
                                autosize
                                minRows={2}
                            />
                        </Stack>
                    ) : (
                        <Stack gap={2}>
                            <Text fw={500}>{task.name}</Text>
                            {task.description && (
                                <Text size="xs" c="dimmed">{task.description}</Text>
                            )}
                        </Stack>
                    )}
                </Group>
                <Group gap="xs">
                    {editing ? (
                        <>
                            <ActionIcon variant="subtle" color="green" title="Save" onClick={handleSaveEdit}>
                                <IconCheck size={16} />
                            </ActionIcon>
                            <ActionIcon variant="subtle" color="gray" title="Cancel" onClick={handleCancelEdit}>
                                <IconX size={16} />
                            </ActionIcon>
                        </>
                    ) : (
                        <>
                            <ActionIcon variant="subtle" color="blue" title="Edit task" onClick={() => setEditing(true)}>
                                <IconPencil size={16} />
                            </ActionIcon>
                            <ActionIcon variant="subtle" color="green" title="Close task" onClick={handleClose}>
                                <IconCheck size={16} />
                            </ActionIcon>
                            <ActionIcon variant="subtle" color="red" title="Delete task" onClick={handleDelete}>
                                <IconTrash size={16} />
                            </ActionIcon>
                        </>
                    )}
                </Group>
            </Group>
            <MultiSelect
                mt="sm"
                color="indigo"
                classNames={{ root: 'task-assignees' }}
                styles={{
                    pill: { backgroundColor: '#1864ab', color: '#fff', fontSize: '1rem' },
                }}
                placeholder="Assign developers..."
                data={members.map((m) => ({ value: String(m.id), label: m.name }))}
                value={task.assignees.map((a) => String(a.id))}
                onChange={handleAssign}
                renderOption={({ option }) => <Text size="sm">{option.label}</Text>}
            />
        </div>
    )
}
