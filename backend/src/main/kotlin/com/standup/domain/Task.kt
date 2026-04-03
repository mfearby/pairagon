package com.standup.domain

import jakarta.persistence.*

@Entity
@Table(name = "tasks")
data class Task(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = false)
    val name: String = "",

    val description: String? = null,

    @Column(nullable = false)
    var position: Int = 0,

    @Column(nullable = false)
    var closed: Boolean = false,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false)
    val team: Team = Team(),

    @ManyToMany
    @JoinTable(
        name = "task_assignees",
        joinColumns = [JoinColumn(name = "task_id")],
        inverseJoinColumns = [JoinColumn(name = "member_id")]
    )
    val assignees: MutableList<Member> = mutableListOf()
)
