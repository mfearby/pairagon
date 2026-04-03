package com.standup.service

import com.standup.domain.Member
import com.standup.domain.Task
import com.standup.domain.Team
import com.standup.dto.*
import com.standup.repository.MemberRepository
import com.standup.repository.TaskRepository
import com.standup.repository.TeamRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class TeamService(
    private val teamRepo: TeamRepository,
    private val memberRepo: MemberRepository,
    private val taskRepo: TaskRepository,
) {
    // --- Teams ---

    fun listTeams(): List<TeamDto> = teamRepo.findAll().map { it.toDto() }

    fun getTeam(id: Long): TeamDetailDto = teamRepo.findByIdOrNull(id)?.toDetailDto() ?: throw NoSuchElementException("Team $id not found")

    fun createTeam(req: CreateTeamRequest): TeamDto = teamRepo.save(Team(name = req.name)).toDto()

    fun deleteTeam(id: Long) = teamRepo.deleteById(id)

    // --- Members ---

    fun addMember(
        teamId: Long,
        req: CreateMemberRequest,
    ): MemberDto {
        val team = teamRepo.findByIdOrNull(teamId) ?: throw NoSuchElementException("Team $teamId not found")
        return memberRepo.save(Member(name = req.name, team = team)).toDto()
    }

    fun removeMember(
        teamId: Long,
        memberId: Long,
    ) = memberRepo.deleteById(memberId)

    // --- Tasks ---

    fun createTask(
        teamId: Long,
        req: CreateTaskRequest,
    ): TaskDto {
        val team = teamRepo.findByIdOrNull(teamId) ?: throw NoSuchElementException("Team $teamId not found")
        val maxPosition = taskRepo.findAllByTeamId(teamId).maxOfOrNull { it.position } ?: -1
        return taskRepo.save(Task(name = req.name, description = req.description, position = maxPosition + 1, team = team)).toDto()
    }

    fun updateTask(
        taskId: Long,
        req: UpdateTaskRequest,
    ): TaskDto {
        val task = taskRepo.findByIdOrNull(taskId) ?: throw NoSuchElementException("Task $taskId not found")
        val updated =
            task.copy(
                name = req.name ?: task.name,
                description = req.description ?: task.description,
            )
        return taskRepo.save(updated).toDto()
    }

    fun closeTask(taskId: Long): TaskDto {
        val task = taskRepo.findByIdOrNull(taskId) ?: throw NoSuchElementException("Task $taskId not found")
        task.closed = true
        return taskRepo.save(task).toDto()
    }

    fun deleteTask(taskId: Long) = taskRepo.deleteById(taskId)

    fun reorderTasks(
        teamId: Long,
        req: ReorderTasksRequest,
    ) {
        req.orderedIds.forEachIndexed { index, taskId ->
            val task = taskRepo.findByIdOrNull(taskId) ?: return@forEachIndexed
            task.position = index
            taskRepo.save(task)
        }
    }

    // --- Assignments ---

    fun assignMembers(
        taskId: Long,
        req: AssignMembersRequest,
    ): TaskDto {
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
            // distribute members across tasks in round-robin pairs
            val start = (index * 2) % members.size
            val assigned = listOf(members[start], members[(start + 1) % members.size]).distinct()
            task.assignees.addAll(assigned)
            taskRepo.save(task)
        }
        return tasks.map { it.toDto() }
    }
}
