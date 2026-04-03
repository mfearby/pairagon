package com.standup.dto

import com.standup.domain.Member
import com.standup.domain.Task
import com.standup.domain.Team

// --- Request DTOs ---

data class CreateTeamRequest(val name: String)

data class CreateMemberRequest(val name: String)

data class CreateTaskRequest(val name: String, val description: String? = null)

data class UpdateTaskRequest(val name: String? = null, val description: String? = null)

data class ReorderTasksRequest(val orderedIds: List<Long>)

data class AssignMembersRequest(val memberIds: List<Long>)

// --- Response DTOs ---

data class MemberDto(val id: Long, val name: String)

data class TaskDto(
    val id: Long,
    val name: String,
    val description: String?,
    val position: Int,
    val closed: Boolean,
    val assignees: List<MemberDto>,
)

data class TeamDto(val id: Long, val name: String)

data class TeamDetailDto(
    val id: Long,
    val name: String,
    val members: List<MemberDto>,
    val tasks: List<TaskDto>,
)

// --- Mappers ---

fun Member.toDto() = MemberDto(id, name)

fun Task.toDto() = TaskDto(id, name, description, position, closed, assignees.map { it.toDto() })

fun Team.toDto() = TeamDto(id, name)

fun Team.toDetailDto() =
    TeamDetailDto(
        id,
        name,
        members.map { it.toDto() },
        tasks.filter { !it.closed }.map { it.toDto() },
    )
