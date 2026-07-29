package io.github.peerorum.peer_orum.domain.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiJobInfoResponse {
    private String jobName;
    private String description;
    private List<String> keyTasks;
    private List<String> requiredCompetencies;
}
