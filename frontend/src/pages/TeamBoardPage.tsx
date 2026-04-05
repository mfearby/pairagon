import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import './TeamBoardPage.css'
import { modals } from '@mantine/modals'
import {
    Stack,
    Title,
    Group,
    Button,
    TextInput,
    Anchor,
    Text,
} from '@mantine/core'
import {
    IconArrowLeft,
    IconSettings,
    IconArrowsShuffle,
} from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core'
import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
} from '@dnd-kit/sortable'
import { api } from '../api'
import type { Task, TeamDetail } from '../types'
import SortableTaskCard from '../components/SortableTaskCard'

export default function TeamBoardPage() {
    const { teamId } = useParams<{ teamId: string }>()
    const id = Number(teamId)
    const [team, setTeam] = useState<TeamDetail | null>(null)
    const [tasks, setTasks] = useState<Task[]>([])
    const [newTask, setNewTask] = useState('')

    const sensors = useSensors(useSensor(PointerSensor))

    useEffect(() => {
        api.getTeam(id)
            .then((data) => {
                setTeam(data)
                setTasks(data.tasks)
            })
            .catch(() =>
                notifications.show({
                    message: 'Failed to load team',
                    color: 'red',
                })
            )
    }, [id])

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event
        if (!over || active.id === over.id) return
        const oldIndex = tasks.findIndex((t) => t.id === active.id)
        const newIndex = tasks.findIndex((t) => t.id === over.id)
        const reordered = arrayMove(tasks, oldIndex, newIndex)
        setTasks(reordered)
        try {
            await api.reorderTasks(
                id,
                reordered.map((t) => t.id)
            )
        } catch (err) {
            notifications.show({
                message: 'Failed to save order',
                color: 'red',
            })
        }
    }

    const handleAddTask = async () => {
        if (!newTask.trim()) return
        try {
            const task = await api.createTask(id, newTask.trim())
            setTasks((prev) => [...prev, task])
            setNewTask('')
        } catch {
            notifications.show({
                message: 'Failed to create task',
                color: 'red',
            })
        }
    }

    const handleRandomize = () => {
        modals.openConfirmModal({
            title: 'Randomize all pairs?',
            children: 'This will replace all current developer assignments with randomly assigned pairs.',
            labels: { confirm: 'Randomize', cancel: 'Cancel' },
            confirmProps: { color: 'indigo' },
            onConfirm: async () => {
                try {
                    const updated = await api.randomizeAssignments(id)
                    setTasks(updated)
                } catch {
                    notifications.show({ message: 'Failed to randomize', color: 'red' })
                }
            },
        })
    }

    const handleTaskUpdate = (updated: Task) => {
        if (updated.id < 0 || updated.closed) {
            // closed or deleted — remove from view
            setTasks((prev) =>
                prev.filter((t) => t.id !== Math.abs(updated.id))
            )
        } else {
            setTasks((prev) =>
                prev.map((t) => (t.id === updated.id ? updated : t))
            )
        }
    }

    if (!team) return null

    return (
        <Stack maw={700} mx="auto">
            <Group justify="space-between">
                <Anchor component={Link} to="/" size="sm">
                    <Group gap={4}>
                        <IconArrowLeft size={14} /> All teams
                    </Group>
                </Anchor>
                <Anchor component={Link} to={`/teams/${id}/settings`} size="sm">
                    <Group gap={4}>
                        <IconSettings size={14} /> Settings
                    </Group>
                </Anchor>
            </Group>

            <Group justify="space-between">
                <Title order={2}>{team.name}</Title>
                <Button
                    leftSection={<IconArrowsShuffle size={16} />}
                    variant="light"
                    onClick={handleRandomize}
                >
                    Randomize pairs
                </Button>
            </Group>

            <Group>
                <TextInput
                    placeholder="New task name"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                    style={{ flex: 1 }}
                />
                <Button onClick={handleAddTask}>Add Task</Button>
            </Group>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={tasks.map((t) => t.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <Stack gap="sm">
                        {tasks.map((task) => (
                            <SortableTaskCard
                                key={task.id}
                                task={task}
                                teamId={id}
                                members={team.members}
                                onUpdate={handleTaskUpdate}
                            />
                        ))}
                    </Stack>
                </SortableContext>
            </DndContext>

            {tasks.length === 0 && (
                <Text c="dimmed" ta="center" mt="xl">
                    No open tasks. Add one above.
                </Text>
            )}
        </Stack>
    )
}
