package com.university.management.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "announcements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Announcement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(min = 3, max = 150)
    @Column(nullable = false)
    private String title;

    @NotBlank
    @Size(max = 2000)
    @Column(nullable = false, length = 2000)
    private String content;

    @NotBlank
    @Column(nullable = false)
    @Builder.Default
    private String targetRole = "ALL"; // ALL, STUDENT, TEACHER

    @NotBlank
    @Column(nullable = false)
    @Builder.Default
    private String priority = "NORMAL"; // URGENT, HIGH, NORMAL

    @NotBlank
    @Column(nullable = false)
    @Builder.Default
    private String category = "GENERAL"; // ACADEMIC, EXAMS, EMERGENCY, CAMPUS_LIFE, GENERAL

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "author_id")
    private User author;

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
