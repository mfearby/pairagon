package com.standup

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class StandupApplication

fun main(args: Array<String>) {
    runApplication<StandupApplication>(*args)
}
