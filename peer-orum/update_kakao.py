with open('src/main/java/io/github/peerorum/peer_orum/global/security/oauth2/KakaoOAuth2UserInfo.java', 'r') as f:
    content = f.read()

# Kakao email can be null, if so, return a dummy email to prevent oauth_email_required error.
content = content.replace(
    'return (String) kakaoAccount.get("email");',
    'String email = (String) kakaoAccount.get("email");\n        if (email == null) {\n            return "kakao_" + getId() + "@kakao.com";\n        }\n        return email;'
)
with open('src/main/java/io/github/peerorum/peer_orum/global/security/oauth2/KakaoOAuth2UserInfo.java', 'w') as f:
    f.write(content)
