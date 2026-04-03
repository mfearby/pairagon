package com.standup.domain

import jakarta.persistence.*

@Entity
@Table(name = "teams")
data class Team(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    @Column(nullable = false, unique = true)
    val name: String = "",
    @OneToMany(mappedBy = "team", cascade = [CascadeType.ALL], orphanRemoval = true)
    val members: MutableList<Member> = mutableListOf(),
    @OneToMany(mappedBy = "team", cascade = [CascadeType.ALL], orphanRemoval = true)
    @OrderBy("position ASC")
    val tasks: MutableList<Task> = mutableListOf(),
)
