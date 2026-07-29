package io.github.peerorum.peer_orum.global.security.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Component
public class JwtTokenProvider {

    private static final String TOKEN_TYPE = "tokenType";
    private static final String ACCESS_TOKEN_TYPE = "access";
    private static final String REFRESH_TOKEN_TYPE = "refresh";

    private final Key key;
    private final long accessTokenValidityTime;
    private final long refreshTokenValidityTime;

    public JwtTokenProvider(
            @Value("${jwt.secret}") String secretKey,
            @Value("${jwt.expiration}") long accessTokenValidityTime,
            @Value("${jwt.refresh-expiration}") long refreshTokenValidityTime
    ) {
        byte[] keyBytes = secretKey.getBytes(StandardCharsets.UTF_8);
        this.key = Keys.hmacShaKeyFor(keyBytes);
        this.accessTokenValidityTime = accessTokenValidityTime;
        this.refreshTokenValidityTime = refreshTokenValidityTime;
    }

    // 우리 API를 이용할 때 사용하는 Access Token
    public String createToken(
            String email,
            String role,
            String anonymousUuid
    ) {
        Claims claims = Jwts.claims().setSubject(email);
        claims.put("role", role);
        claims.put("anonymousUuid", anonymousUuid);
        claims.put(TOKEN_TYPE, ACCESS_TOKEN_TYPE);

        Date now = new Date();
        Date validity =
                new Date(now.getTime() + accessTokenValidityTime);

        return Jwts.builder()
                .setClaims(claims)
                .setId(UUID.randomUUID().toString())
                .setIssuedAt(now)
                .setExpiration(validity)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // Access Token을 다시 발급받을 때 사용하는 Refresh Token
    public String createRefreshToken(String email) {
        Claims claims = Jwts.claims().setSubject(email);
        claims.put(TOKEN_TYPE, REFRESH_TOKEN_TYPE);

        Date now = new Date();
        Date validity =
                new Date(now.getTime() + refreshTokenValidityTime);

        return Jwts.builder()
                .setClaims(claims)
                .setId(UUID.randomUUID().toString())
                .setIssuedAt(now)
                .setExpiration(validity)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public Authentication getAuthentication(String token) {
        Claims claims = parseClaims(token);

        Collection<? extends GrantedAuthority> authorities =
                Arrays.stream(claims.get("role").toString().split(","))
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList());

        User principal =
                new User(claims.getSubject(), "", authorities);

        return new UsernamePasswordAuthenticationToken(
                principal,
                token,
                authorities
        );
    }

    // JwtAuthenticationFilter에서는 Access Token만 허용
    public boolean validateToken(String token) {
        return validateTokenType(token, ACCESS_TOKEN_TYPE);
    }

    // 재발급 API에서는 Refresh Token만 허용
    public boolean validateRefreshToken(String token) {
        return validateTokenType(token, REFRESH_TOKEN_TYPE);
    }

    public String getEmailFromToken(String token) {
        return parseClaims(token).getSubject();
    }

    public Instant getExpirationFromToken(String token) {
        return parseClaims(token)
                .getExpiration()
                .toInstant();
    }

    private boolean validateTokenType(
            String token,
            String expectedTokenType
    ) {
        try {
            Claims claims = parseClaims(token);
            String actualTokenType =
                    claims.get(TOKEN_TYPE, String.class);

            if (!expectedTokenType.equals(actualTokenType)) {
                log.info(
                        "Invalid JWT token type. expected={}, actual={}",
                        expectedTokenType,
                        actualTokenType
                );
                return false;
            }

            return true;
        } catch (io.jsonwebtoken.security.SecurityException
                 | MalformedJwtException e) {
            log.info("Invalid JWT Token", e);
        } catch (ExpiredJwtException e) {
            log.info("Expired JWT Token", e);
        } catch (UnsupportedJwtException e) {
            log.info("Unsupported JWT Token", e);
        } catch (IllegalArgumentException e) {
            log.info("JWT claims string is empty.", e);
        }

        return false;
    }

    private Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}