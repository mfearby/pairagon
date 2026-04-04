package com.standup.controller

import com.standup.dto.*
import com.standup.service.TeamService
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/teams")
class TeamController(
    private val service: TeamService,
) {
    @GetMapping
    fun listTeams() = service.listTeams()

    @GetMapping("/{id}")
    fun getTeam(
        @PathVariable id: Long,
    ) = service.getTeam(id)

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createTeam(
        @RequestBody req: CreateTeamRequest,
    ) = service.createTeam(req)

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteTeam(
        @PathVariable id: Long,
    ) = service.deleteTeam(id)

    // --- Members ---

    @PostMapping("/{teamId}/members")
    @ResponseStatus(HttpStatus.CREATED)
    fun addMember(
        @PathVariable teamId: Long,
        @RequestBody req: CreateMemberRequest,
    ) = service.addMember(teamId, req)

    @DeleteMapping("/{teamId}/members/{memberId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun removeMember(
        @PathVariable teamId: Long,
        @PathVariable memberId: Long,
    ) = service.removeMember(teamId, memberId)

    // --- Tasks ---

    @PostMapping("/{teamId}/tasks")
    @ResponseStatus(HttpStatus.CREATED)
    fun createTask(
        @PathVariable teamId: Long,
        @RequestBody req: CreateTaskRequest,
    ) = service.createTask(teamId, req)

    @PutMapping("/{teamId}/tasks/reorder")
    fun reorderTasks(
        @PathVariable teamId: Long,
        @RequestBody req: ReorderTasksRequest,
    ) = service.reorderTasks(teamId, req)

    @PutMapping("/{teamId}/tasks/randomize")
    fun randomlyAssign(
        @PathVariable teamId: Long,
    ) = service.randomlyAssignAll(teamId)

    @PatchMapping("/{teamId}/tasks/{taskId}")
    fun updateTask(
        @PathVariable teamId: Long,
        @PathVariable taskId: Long,
        @RequestBody req: UpdateTaskRequest,
    ) = service.updateTask(taskId, req)

    @PatchMapping("/{teamId}/tasks/{taskId}/close")
    fun closeTask(
        @PathVariable teamId: Long,
        @PathVariable taskId: Long,
    ) = service.closeTask(taskId)

    @DeleteMapping("/{teamId}/tasks/{taskId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteTask(
        @PathVariable teamId: Long,
        @PathVariable taskId: Long,
    ) = service.deleteTask(taskId)

    @PutMapping("/{teamId}/tasks/{taskId}/assignees")
    fun assignMembers(
        @PathVariable teamId: Long,
        @PathVariable taskId: Long,
        @RequestBody req: AssignMembersRequest,
    ) = service.assignMembers(taskId, req)
}
