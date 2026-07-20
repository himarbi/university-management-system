package com.university.management.dto;

import com.university.management.model.Announcement;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.format.DateTimeFormatter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnnouncementDto {
    private Long id;

    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 150, message = "Title must be between 3 and 150 characters")
    private String title;

    @NotBlank(message = "Content is required")
    @Size(max = 2000, message = "Content cannot exceed 2000 characters")
    private String content;

    private String targetRole; // ALL, STUDENT, TEACHER
    private UserDto author;
    private String createdAt;

    public static AnnouncementDto build(Announcement announcement) {
        if (announcement == null) return null;
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        return AnnouncementDto.builder()
                .id(announcement.getId())
                .title(announcement.getTitle())
                .content(announcement.getContent())
                .targetRole(announcement.getTargetRole())
                .author(UserDto.build(announcement.getAuthor()))
                .createdAt(announcement.getCreatedAt() != null ? announcement.getCreatedAt().format(formatter) : null)
                .build();
    }
}
