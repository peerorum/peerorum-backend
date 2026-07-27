package io.github.peerorum.peer_orum.domain.spec.repository;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import io.github.peerorum.peer_orum.domain.spec.entity.QSpecProfile;
import io.github.peerorum.peer_orum.domain.spec.entity.SpecProfile;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@RequiredArgsConstructor
@Repository
public class SpecProfileCustomRepositoryImpl implements SpecProfileCustomRepository {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<SpecProfile> findPeers(String university, String major, Integer entranceYear, String desiredJob) {
        QSpecProfile specProfile = QSpecProfile.specProfile;

        return queryFactory
                .selectFrom(specProfile)
                .where(
                        eqUniversity(university),
                        eqMajor(major),
                        eqEntranceYear(entranceYear),
                        eqDesiredJob(desiredJob)
                )
                .orderBy(specProfile.gpa.desc())
                .fetch();
    }

    private BooleanExpression eqUniversity(String university) {
        if (university == null || university.isEmpty()) {
            return null;
        }
        return QSpecProfile.specProfile.university.eq(university);
    }

    private BooleanExpression eqMajor(String major) {
        if (major == null || major.isEmpty()) {
            return null;
        }
        return QSpecProfile.specProfile.major.eq(major);
    }

    private BooleanExpression eqEntranceYear(Integer entranceYear) {
        if (entranceYear == null) {
            return null;
        }
        return QSpecProfile.specProfile.entranceYear.eq(entranceYear);
    }

    private BooleanExpression eqDesiredJob(String desiredJob) {
        if (desiredJob == null || desiredJob.isEmpty()) {
            return null;
        }
        return QSpecProfile.specProfile.desiredJob.eq(desiredJob);
    }
}
