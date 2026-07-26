package io.github.peerorum.peer_orum.domain.comparison.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ProfileCreateRequest {
    private String university;
    private String major;
    private Integer entranceYear;
    private String desiredJob;
}
