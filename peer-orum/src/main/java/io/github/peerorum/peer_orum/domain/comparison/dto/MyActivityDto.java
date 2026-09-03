package io.github.peerorum.peer_orum.domain.comparison.dto;

import io.github.peerorum.peer_orum.domain.spec.entity.Activity;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MyActivityDto {
    private Long id;
    private String activityName;
    private String period;
    private String detail;
    private String authKey;
    private String status;
    private String fileUrl;

    public static MyActivityDto from(Activity activity) {
        return MyActivityDto.builder()
                .id(activity.getId())
                .activityName(activity.getActivityName())
                .period(activity.getPeriod())
                .detail(activity.getDetail())
                .authKey(activity.getAuthKey())
                .status(activity.getStatus() != null ? activity.getStatus().name() : null)
                .fileUrl(activity.getFileUrl())
                .build();
    }
}
