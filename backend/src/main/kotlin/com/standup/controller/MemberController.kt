package com.standup.controller

import com.standup.dto.CreateMemberRequest
import com.standup.dto.UpdateMemberRequest
import com.standup.service.MemberService
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/teams")
class MemberController(
    private val service: MemberService,
) {
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
    ) = service.removeMember(memberId)

    @PatchMapping("/{teamId}/members/{memberId}")
    fun updateMember(
        @PathVariable teamId: Long,
        @PathVariable memberId: Long,
        @RequestBody req: UpdateMemberRequest,
    ) = service.updateMember(memberId, req)
}
