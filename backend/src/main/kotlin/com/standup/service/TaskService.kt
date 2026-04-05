package com.standup.service

import com.standup.domain.Task
import com.standup.dto.AssignMembersRequest
import com.standup.dto.CreateTaskRequest
import com.standup.dto.ReorderTasksRequest
import com.standup.dto.TaskDto
import com.standup.dto.UpdateTaskRequest
import com.standup.dto.toDto
import com.standup.repository.MemberRepository
import com.standup.repository.TaskRepository
import com.standup.repository.TeamRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class TaskService(
    private val taskRepo: TaskRepository,
    private val teamRepo: TeamRepository,
    private val memberRepo: MemberRepository,
) {
    fun createTask(teamId: Long, req: CreateTaskRequest): TaskDto {
        val team = teamRepo.findByIdOrNull(teamId) ?: throw NoSuchElementException("Team $teamId not found")
        val maxPosition = taskRepo.findAllByTeamId(teamId).maxOfOrNull { it.position } ?: -1
        return taskRepo.save(Task(name = req.name, description = req.description, position = maxPosition + 1, team = team)).toDto()
    }

    fun updateTask(taskId: Long, req: UpdateTaskRequest): TaskDto {
        val task = taskRepo.findByIdOrNull(taskId) ?: throw NoSuchElementException("Task $taskId not found")
        val updated = task.copy(
            name = req.name ?: task.name,
            description = if (req.description != null) req.description.ifBlank { null } else task.description,
        )
        return taskRepo.save(updated).toDto()
    }

    fun deleteTask(taskId: Long) = taskRepo.deleteById(taskId)

    fun reorderTasks(req: ReorderTasksRequest) {
        req.orderedIds.forEachIndexed { index, taskId ->
            val task = taskRepo.findByIdOrNull(taskId) ?: return@forEachIndexed
            task.position = index
            taskRepo.save(task)
        }
    }

    fun assignMembers(taskId: Long, req: AssignMembersRequest): TaskDto {
        val task = taskRepo.findByIdOrNull(taskId) ?: throw NoSuchElementException("Task $taskId not found")
        val members = memberRepo.findAllById(req.memberIds)
        task.assignees.clear()
        task.assignees.addAll(members)
        return taskRepo.save(task).toDto()
    }

    fun randomlyAssignAll(teamId: Long): List<TaskDto> {
        val members = memberRepo.findAllByTeamId(teamId).shuffled()
        val tasks = taskRepo.findOpenByTeamId(teamId)
        if (members.isEmpty() || tasks.isEmpty()) return tasks.map { it.toDto() }

        tasks.forEachIndexed { index, task ->
            task.assignees.clear()
            val start = (index * 2) % members.size
            val assigned = listOf(members[start], members[(start + 1) % members.size]).distinct()
            task.assignees.addAll(assigned)
            taskRepo.save(task)
        }
        return tasks.map { it.toDto() }
    }

    fun smartAddPairs(teamId: Long): List<TaskDto> {
        val allMembers = memberRepo.findAllByTeamId(teamId)
        val tasks = taskRepo.findOpenByTeamId(teamId)
        if (allMembers.isEmpty() || tasks.isEmpty()) return tasks.map { it.toDto() }

        // count how many tasks each member is assigned to
        val assignmentCount = allMembers.associate { it.id to 0 }.toMutableMap()
        tasks.forEach { task ->
            task.assignees.forEach { member -> assignmentCount[member.id] = (assignmentCount[member.id] ?: 0) + 1 }
        }

        // pick the member with the least assignments (prefer zero), randomised among ties
        fun pickLeastAssigned(exclude: Set<Long> = emptySet()): com.standup.domain.Member? {
            val candidates = allMembers.filter { it.id !in exclude }
            val minCount = candidates.minOfOrNull { assignmentCount[it.id] ?: 0 } ?: return null
            return candidates.filter { (assignmentCount[it.id] ?: 0) == minCount }.random()
        }

        tasks.forEach { task ->
            when (task.assignees.size) {
                0 -> {
                    // assign two preferably unassigned developers
                    val first = pickLeastAssigned()
                    val second = pickLeastAssigned(exclude = setOfNotNull(first?.id))
                    listOfNotNull(first, second).forEach { member ->
                        if (!task.assignees.contains(member)) {
                            task.assignees.add(member)
                            assignmentCount[member.id] = (assignmentCount[member.id] ?: 0) + 1
                        }
                    }
                    taskRepo.save(task)
                }
                1 -> {
                    // add one developer, preferring unassigned
                    val existing = task.assignees.map { it.id }.toSet()
                    val candidate = pickLeastAssigned(exclude = existing)
                    if (candidate != null) {
                        task.assignees.add(candidate)
                        assignmentCount[candidate.id] = (assignmentCount[candidate.id] ?: 0) + 1
                        taskRepo.save(task)
                    }
                }
                // tasks with 2+ assignees are left unchanged
            }
        }

        return taskRepo.findOpenByTeamId(teamId).map { it.toDto() }
    }
}
