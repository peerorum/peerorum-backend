package io.github.peerorum.peer_orum.global.config;

import io.github.peerorum.peer_orum.global.interceptor.GiveToGetInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class WebMvcConfig implements WebMvcConfigurer {

    private final GiveToGetInterceptor giveToGetInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(giveToGetInterceptor)
                .addPathPatterns("/api/comparison/**");
    }
}
