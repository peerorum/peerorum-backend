with open('src/main/java/io/github/peerorum/peer_orum/global/security/oauth2/OAuth2SuccessHandler.java', 'r') as f:
    content = f.read()

content = content.replace(
    '.queryParam("role", user.getRole().name())',
    '.queryParam("role", user.getRole().name())\n                .queryParam("name", user.getName())'
)
content = content.replace(
    '.queryParam(\n                        "role",\n                        user.getRole().name()\n                )',
    '.queryParam(\n                        "role",\n                        user.getRole().name()\n                )\n                .queryParam(\n                        "name",\n                        user.getName()\n                )'
)

with open('src/main/java/io/github/peerorum/peer_orum/global/security/oauth2/OAuth2SuccessHandler.java', 'w') as f:
    f.write(content)
