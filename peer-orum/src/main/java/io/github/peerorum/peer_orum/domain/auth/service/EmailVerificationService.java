package io.github.peerorum.peer_orum.domain.auth.service;

import io.github.peerorum.peer_orum.domain.auth.entity.SchoolAuth;
import io.github.peerorum.peer_orum.domain.auth.repository.SchoolAuthRepository;
import io.github.peerorum.peer_orum.domain.user.entity.User;
import io.github.peerorum.peer_orum.domain.user.repository.UserRepository;
import io.github.peerorum.peer_orum.global.error.CustomException;
import io.github.peerorum.peer_orum.global.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@Service
public class EmailVerificationService {

    private final JavaMailSender javaMailSender;
    private final SchoolAuthRepository schoolAuthRepository;
    private final UserRepository userRepository;

    @Transactional
    public void sendVerificationEmail(Long userId, String email) {
        if (!email.endsWith(".ac.kr")) {
            throw new CustomException(ErrorCode.INVALID_INPUT_VALUE, "Not a valid university email address");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND, "User not found"));

        String token = UUID.randomUUID().toString();

        SchoolAuth schoolAuth = schoolAuthRepository.findByUser(user).orElse(null);
        if (schoolAuth == null) {
            schoolAuth = SchoolAuth.builder()
                    .user(user)
                    .universityEmail(email)
                    .verificationToken(token)
                    .build();
        } else {
            schoolAuth.updateToken(token);
        }

        schoolAuthRepository.save(schoolAuth);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Peer-Orum University Email Verification");
        message.setText("Verification token: " + token);

        javaMailSender.send(message);
    }

    @Transactional
    public void verifyEmail(Long userId, String token) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND, "User not found"));

        SchoolAuth schoolAuth = schoolAuthRepository.findByUser(user)
                .orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND, "Verification request not found"));

        if (!schoolAuth.getVerificationToken().equals(token)) {
            throw new CustomException(ErrorCode.INVALID_INPUT_VALUE, "Invalid verification token");
        }

        schoolAuth.verify();
        schoolAuthRepository.save(schoolAuth);
    }
}
