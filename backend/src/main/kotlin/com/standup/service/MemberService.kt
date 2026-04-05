package com.standup.service

import com.standup.domain.Member
import com.standup.dto.CreateMemberRequest
import com.standup.dto.MemberDto
import com.standup.dto.UpdateMemberRequest
import com.standup.dto.toDto
import com.standup.repository.MemberRepository
import com.standup.repository.TeamRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class MemberService(
    private val memberRepo: MemberRepository,
    private val teamRepo: TeamRepository,
) {
    fun addMember(teamId: Long, req: CreateMemberRequest): MemberDto {
        val team = teamRepo.findByIdOrNull(teamId) ?: throw NoSuchElementException("Team $teamId not found")
        return memberRepo.save(Member(name = req.name, team = team)).toDto()
    }

    fun removeMember(memberId: Long) = memberRepo.deleteById(memberId)

    fun updateMember(memberId: Long, req: UpdateMemberRequest): MemberDto {
        val member = memberRepo.findByIdOrNull(memberId) ?: throw NoSuchElementException("Member $memberId not found")
        return memberRepo.save(member.copy(name = req.name)).toDto()
    }
}
