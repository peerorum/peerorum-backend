package io.github.peerorum.peer_orum.domain.spec.repository;

import io.github.peerorum.peer_orum.domain.spec.entity.SpecProfile;
import java.util.List;

public interface SpecProfileCustomRepository {
    List<SpecProfile> findPeers(String university, String major, Integer entranceYear, String desiredJob);
    List<SpecProfile> searchPeers(String university, String major, Double minGpa, Double maxGpa);
}
