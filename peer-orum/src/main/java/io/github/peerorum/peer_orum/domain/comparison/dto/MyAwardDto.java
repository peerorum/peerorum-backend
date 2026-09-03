package io.github.peerorum.peer_orum.domain.comparison.dto;

import io.github.peerorum.peer_orum.domain.spec.entity.Award;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MyAwardDto {
    private Long id;
    private String name;
    private String host;
    private String date;
    private String detail;

    public static MyAwardDto from(Award award) {
        return MyAwardDto.builder()
                .id(award.getId())
                .name(award.getName())
                .host(award.getHost())
                .date(award.getAwardDate())
                .detail(award.getDetail())
                .build();
    }
}
