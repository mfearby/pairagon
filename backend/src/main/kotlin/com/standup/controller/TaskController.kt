package com.standup.controller

import com.standup.dto.AssignMembersRequest
import com.standup.dto.CreateTaskRequest
import com.standup.dto.ReorderTasksRequest
import com.standup.dto.UpdateTaskRequest
import com.standup.service.TaskService
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/teams")
class TaskController(
    private val service: TaskService,
) {
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
    ) = service.reorderTasks(req)

    @PutMapping("/{teamId}/tasks/randomize")
    fun randomlyAssign(
        @PathVariable teamId: Long,
    ) = service.randomlyAssignAll(teamId)

    @PutMapping("/{teamId}/tasks/smart-assign")
    fun smartAddPairs(
        @PathVariable teamId: Long,
    ) = service.smartAddPairs(teamId)

    @PatchMapping("/{teamId}/tasks/{taskId}")
    fun updateTask(
        @PathVariable teamId: Long,
        @PathVariable taskId: Long,
        @RequestBody req: UpdateTaskRequest,
    ) = service.updateTask(teamId, taskId, req)

    @DeleteMapping("/{teamId}/tasks/{taskId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteTask(
        @PathVariable teamId: Long,
        @PathVariable taskId: Long,
    ) = service.deleteTask(teamId, taskId)

    @PutMapping("/{teamId}/tasks/{taskId}/assignees")
    fun assignMembers(
        @PathVariable teamId: Long,
        @PathVariable taskId: Long,
        @RequestBody req: AssignMembersRequest,
    ) = service.assignMembers(teamId, taskId, req)
}
