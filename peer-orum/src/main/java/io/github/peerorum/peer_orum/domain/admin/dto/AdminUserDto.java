package io.github.peerorum.peer_orum.domain.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserDto {
    private String name;
    private String id; // user's handle/virtualNickname
    private String school;
    private String major;
    private String grade; // Optional depending on SpecProfile
    private String joinedAt;
    private String status; // '활성', '휴면', '정지'
    private String verified; // '인증완료', '인증대기'
}
