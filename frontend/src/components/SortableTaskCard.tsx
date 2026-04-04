import { ActionIcon, Group, MultiSelect, Stack, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconCheck, IconGripVertical, IconTrash } from '@tabler/icons-react'
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
                <Group gap="xs" wrap="nowrap">
                    <ActionIcon
                        variant="subtle"
                        size="sm"
                        {...attributes}
                        {...listeners}
                        style={{ cursor: 'grab' }}
                    >
                        <IconGripVertical size={16} />
                    </ActionIcon>
                    <Stack gap={2}>
                        <Text fw={500}>{task.name}</Text>
                        {task.description && (
                            <Text size="xs" c="dimmed">{task.description}</Text>
                        )}
                    </Stack>
                </Group>
                <Group gap="xs">
                    <ActionIcon variant="subtle" color="green" title="Close task" onClick={handleClose}>
                        <IconCheck size={16} />
                    </ActionIcon>
                    <ActionIcon variant="subtle" color="red" title="Delete task" onClick={handleDelete}>
                        <IconTrash size={16} />
                    </ActionIcon>
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
