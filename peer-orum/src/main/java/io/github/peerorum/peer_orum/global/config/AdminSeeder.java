package io.github.peerorum.peer_orum.global.config;

import io.github.peerorum.peer_orum.domain.user.entity.Provider;
import io.github.peerorum.peer_orum.domain.user.entity.Role;
import io.github.peerorum.peer_orum.domain.user.entity.User;
import io.github.peerorum.peer_orum.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@RequiredArgsConstructor
@Component
public class AdminSeeder implements ApplicationRunner {

    private final UserRepository userRepository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) throws Exception {
        String adminEmail = "peeroreum1001@gmail.com";
        userRepository.findByEmail(adminEmail).ifPresentOrElse(
                user -> {
                    if (user.getRole() != Role.ROLE_ADMIN) {
                        user.updateRole(Role.ROLE_ADMIN);
                        userRepository.save(user);
                        log.info("Updated existing user {} to ROLE_ADMIN", adminEmail);
                    }
                },
                () -> {
                    User adminUser = User.builder()
                            .email(adminEmail)
                            .name("관리자")
                            .provider(Provider.GOOGLE)
                            .providerId("admin-google-id")
                            .role(Role.ROLE_ADMIN)
                            .virtualNickname("AdminUser")
                            .build();
                    userRepository.save(adminUser);
                    log.info("Created new admin user with email {}", adminEmail);
                }
        );
    }
}
