package com.standup.service

import com.standup.domain.Team
import com.standup.dto.CreateTeamRequest
import com.standup.dto.TeamDetailDto
import com.standup.dto.TeamDto
import com.standup.dto.toDetailDto
import com.standup.dto.toDto
import com.standup.repository.TeamRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class TeamService(
    private val teamRepo: TeamRepository,
) {
    fun listTeams(): List<TeamDto> = teamRepo.findAll().map { it.toDto() }

    fun getTeam(id: Long): TeamDetailDto =
        teamRepo.findByIdOrNull(id)?.toDetailDto() ?: throw NoSuchElementException("Team $id not found")

    fun createTeam(req: CreateTeamRequest): TeamDto = teamRepo.save(Team(name = req.name)).toDto()

    fun deleteTeam(id: Long) = teamRepo.deleteById(id)
}
