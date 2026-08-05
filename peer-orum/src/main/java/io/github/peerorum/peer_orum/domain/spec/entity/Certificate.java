package io.github.peerorum.peer_orum.domain.spec.entity;

import io.github.peerorum.peer_orum.domain.user.entity.User;
import io.github.peerorum.peer_orum.global.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
public class Certificate extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String certName;

    @Column(nullable = false)
    private String certNo;

    private LocalDate issueDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VerificationStatus status;

    @Column(name = "file_url")
    private String fileUrl;

    @Builder
    public Certificate(User user, String certName, String certNo, LocalDate issueDate, String fileUrl) {
        this.user = user;
        this.certName = certName;
        this.certNo = certNo;
        this.issueDate = issueDate;
        this.status = VerificationStatus.PENDING;
        this.fileUrl = fileUrl;
    }

    public void updateStatus(VerificationStatus status) {
        this.status = status;
    }
}
