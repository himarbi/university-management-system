package com.university.management.controller;

import com.university.management.dto.AnnouncementDto;
import com.university.management.model.Announcement;
import com.university.management.model.User;
import com.university.management.repository.AnnouncementRepository;
import com.university.management.repository.UserRepository;
import com.university.management.security.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/announcements")
public class AnnouncementController {

    @Autowired
    private AnnouncementRepository announcementRepository;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("Current user not found"));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public List<AnnouncementDto> getAllAnnouncements() {
        return announcementRepository.findAllByOrderByCreatedAtDesc().stream()
                .sorted(Comparator.comparingInt((Announcement a) -> {
                    if ("URGENT".equalsIgnoreCase(a.getPriority())) return 0;
                    if ("HIGH".equalsIgnoreCase(a.getPriority())) return 1;
                    return 2;
                }).thenComparing(Announcement::getCreatedAt, Comparator.reverseOrder()))
                .map(AnnouncementDto::build)
                .collect(Collectors.toList());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createAnnouncement(@Valid @RequestBody AnnouncementDto dto) {
        User currentUser = getCurrentUser();

        Announcement announcement = Announcement.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .targetRole(dto.getTargetRole() != null ? dto.getTargetRole() : "ALL")
                .priority(dto.getPriority() != null ? dto.getPriority() : "NORMAL")
                .category(dto.getCategory() != null ? dto.getCategory() : "GENERAL")
                .author(currentUser)
                .createdAt(LocalDateTime.now())
                .build();

        Announcement saved = announcementRepository.save(announcement);
        return ResponseEntity.ok(AnnouncementDto.build(saved));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteAnnouncement(@PathVariable Long id) {
        return announcementRepository.findById(id).map(a -> {
            announcementRepository.delete(a);
            return ResponseEntity.ok("Announcement deleted successfully!");
        }).orElse(ResponseEntity.notFound().build());
    }
}
