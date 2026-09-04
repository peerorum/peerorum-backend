package io.github.peerorum.peer_orum.domain.admin.controller;

import io.github.peerorum.peer_orum.domain.spec.entity.SpecProfile;
import io.github.peerorum.peer_orum.domain.spec.repository.SpecProfileRepository;
import io.github.peerorum.peer_orum.domain.user.entity.Role;
import io.github.peerorum.peer_orum.domain.user.entity.User;
import io.github.peerorum.peer_orum.domain.user.repository.UserRepository;
import io.github.peerorum.peer_orum.global.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;
import java.util.Random;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class DataFixerController {

    private final UserRepository userRepository;
    private final SpecProfileRepository specProfileRepository;
    private final JdbcTemplate jdbcTemplate;
    
    private final String[] NICKNAME_PREFIXES = {
        "성장하는펭귄", "오름러", "스펙마스터", "도전왕개미", "열정펭귄",
        "상위1%도전자", "꾸준한다람쥐", "취준왕독수리", "갓생러", "자소서장인"
    };

    private final String[] MAJORS = {
        "국어국문학과", "철학과", "사학과", "영미인문학과", "법학과",
        "정치외교학과", "행정학과", "상담학과", "경제학과", "무역학과",
        "전자전기공학과", "융합반도체공학과", "기계공학과", "화학공학과",
        "소프트웨어학과", "컴퓨터공학과", "인공지능학과", "국제경영학과",
        "경영경제대학 경영학부 경영학전공", "무역학과", "산업경영학과(야)"
    };

    @GetMapping("/fix-mock-data")
    @Transactional
    public ApiResponse<String> fixMockData() {
        List<User> mockUsers = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.ROLE_GUEST || (u.getEmail() != null && u.getEmail().contains("mock")))
                .toList();
                
        Random random = new Random();
        int count = 0;
        
        for (User user : mockUsers) {
            String randomNickname = NICKNAME_PREFIXES[random.nextInt(NICKNAME_PREFIXES.length)] 
                                  + " " + (1000 + random.nextInt(9000));
            String randomMajor = MAJORS[random.nextInt(MAJORS.length)];
            
            // Update virtual nickname
            user.updateVirtualNickname(randomNickname);
            userRepository.save(user);

            // Update major using native query or JdbcTemplate if no setter exists
            Optional<SpecProfile> specProfileOpt = specProfileRepository.findByUser(user);
            if (specProfileOpt.isPresent()) {
                SpecProfile profile = specProfileOpt.get();
                jdbcTemplate.update("UPDATE spec_profile SET major = ? WHERE id = ?", randomMajor, profile.getId());
            }
            count++;
        }
        
        return ApiResponse.success("Fixed " + count + " mock users' nickname and major.");
    }
}
