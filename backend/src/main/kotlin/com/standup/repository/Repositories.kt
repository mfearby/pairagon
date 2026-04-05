package com.standup.repository

import com.standup.domain.Member
import com.standup.domain.Task
import com.standup.domain.Team
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface TeamRepository : JpaRepository<Team, Long>

interface MemberRepository : JpaRepository<Member, Long> {
    fun findAllByTeamId(teamId: Long): List<Member>
}

interface TaskRepository : JpaRepository<Task, Long> {
    @Query("SELECT t FROM Task t WHERE t.team.id = :teamId ORDER BY t.position ASC")
    fun findOpenByTeamId(teamId: Long): List<Task>

    @Query("SELECT t FROM Task t WHERE t.team.id = :teamId ORDER BY t.position ASC")
    fun findAllByTeamId(teamId: Long): List<Task>
}
