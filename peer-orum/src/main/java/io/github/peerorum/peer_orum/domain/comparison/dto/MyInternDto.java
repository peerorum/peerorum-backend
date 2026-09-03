package io.github.peerorum.peer_orum.domain.comparison.dto;

import io.github.peerorum.peer_orum.domain.spec.entity.Intern;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MyInternDto {
    private Long id;
    private String company;
    private String period;
    private String detail;

    public static MyInternDto from(Intern intern) {
        return MyInternDto.builder()
                .id(intern.getId())
                .company(intern.getCompany())
                .period(intern.getPeriod())
                .detail(intern.getDetail())
                .build();
    }
}
