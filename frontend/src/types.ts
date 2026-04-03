export interface Member {
  id: number
  name: string
}

export interface Task {
  id: number
  name: string
  description: string | null
  position: number
  closed: boolean
  assignees: Member[]
}

export interface Team {
  id: number
  name: string
}

export interface TeamDetail {
  id: number
  name: string
  members: Member[]
  tasks: Task[]
}
