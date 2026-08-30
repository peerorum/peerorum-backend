package io.github.peerorum.peer_orum.global.security.oauth2;

import io.github.peerorum.peer_orum.domain.spec.repository.SpecProfileRepository;
import io.github.peerorum.peer_orum.domain.user.entity.Provider;
import io.github.peerorum.peer_orum.domain.user.entity.Role;
import io.github.peerorum.peer_orum.domain.user.entity.User;
import io.github.peerorum.peer_orum.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@Service
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserRepository userRepository;
    private final SpecProfileRepository specProfileRepository;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = delegate.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        String userNameAttributeName = userRequest.getClientRegistration().getProviderDetails()
                .getUserInfoEndpoint().getUserNameAttributeName();

        Map<String, Object> attributes = oAuth2User.getAttributes();
        OAuth2UserInfo userInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(registrationId, attributes);

        if (userInfo.getEmail() == null) {
            throw new OAuth2AuthenticationException("Email not found from OAuth2 provider");
        }

        String normalizedEmail = userInfo.getEmail()
                .trim()
                .toLowerCase(Locale.ROOT);
        Provider requestedProvider = Provider.valueOf(
                registrationId.toUpperCase(Locale.ROOT)
        );

        Optional<User> userOptional =
                userRepository.findByEmailIgnoreCase(normalizedEmail);
        User user;

        if (userOptional.isPresent()) {
            user = userOptional.get();

            if (user.getProvider() != requestedProvider) {
                throw new OAuth2AuthenticationException(
                        providerConflictCode(user.getProvider())
                );
            }

            if (user.getRole() == Role.ROLE_GUEST
                    && specProfileRepository.findByUser(user).isPresent()) {
                user.updateRole(Role.ROLE_USER);
            }
        } else {
            // First time login -> create new user
            String virtualNickname = "User_" + UUID.randomUUID().toString().substring(0, 8);
            user = User.builder()
                    .email(normalizedEmail)
                    .name(userInfo.getName())
                    .provider(requestedProvider)
                    .providerId(userInfo.getId())
                    .role(Role.ROLE_GUEST)
                    .virtualNickname(virtualNickname)
                    .build();
            userRepository.save(user);
        }

        return new CustomOAuth2User(user, attributes, userNameAttributeName);
    }

    private String providerConflictCode(Provider provider) {
        return switch (provider) {
            case LOCAL -> "account_exists_with_local";
            case KAKAO -> "account_exists_with_kakao";
            case GOOGLE -> "account_exists_with_google";
        };
    }
}
