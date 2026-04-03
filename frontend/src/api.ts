import type { Member, Task, Team, TeamDetail } from './types'

const BASE = '/api/teams'

async function request<T>(url: string, options?: RequestInit): Promise<T> {
    const res = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    })
    if (!res.ok) throw new Error(`API error: ${res.status}`)
    if (res.status === 204) return undefined as T
    return res.json()
}

export const api = {
    // Teams
    listTeams: () => request<Team[]>(BASE),
    getTeam: (id: number) => request<TeamDetail>(`${BASE}/${id}`),
    createTeam: (name: string) =>
        request<Team>(BASE, { method: 'POST', body: JSON.stringify({ name }) }),
    deleteTeam: (id: number) =>
        request<void>(`${BASE}/${id}`, { method: 'DELETE' }),

    // Members
    addMember: (teamId: number, name: string) =>
        request<Member>(`${BASE}/${teamId}/members`, {
            method: 'POST',
            body: JSON.stringify({ name }),
        }),
    removeMember: (teamId: number, memberId: number) =>
        request<void>(`${BASE}/${teamId}/members/${memberId}`, {
            method: 'DELETE',
        }),

    // Tasks
    createTask: (teamId: number, name: string, description?: string) =>
        request<Task>(`${BASE}/${teamId}/tasks`, {
            method: 'POST',
            body: JSON.stringify({ name, description }),
        }),
    updateTask: (
        teamId: number,
        taskId: number,
        name: string,
        description?: string
    ) =>
        request<Task>(`${BASE}/${teamId}/tasks/${taskId}`, {
            method: 'PATCH',
            body: JSON.stringify({ name, description }),
        }),
    closeTask: (teamId: number, taskId: number) =>
        request<Task>(`${BASE}/${teamId}/tasks/${taskId}/close`, {
            method: 'PATCH',
        }),
    deleteTask: (teamId: number, taskId: number) =>
        request<void>(`${BASE}/${teamId}/tasks/${taskId}`, {
            method: 'DELETE',
        }),
    reorderTasks: (teamId: number, orderedIds: number[]) =>
        request<void>(`${BASE}/${teamId}/tasks/reorder`, {
            method: 'PUT',
            body: JSON.stringify({ orderedIds }),
        }),
    assignMembers: (teamId: number, taskId: number, memberIds: number[]) =>
        request<Task>(`${BASE}/${teamId}/tasks/${taskId}/assignees`, {
            method: 'PUT',
            body: JSON.stringify({ memberIds }),
        }),
    randomizeAssignments: (teamId: number) =>
        request<Task[]>(`${BASE}/${teamId}/tasks/randomize`, { method: 'PUT' }),
}
