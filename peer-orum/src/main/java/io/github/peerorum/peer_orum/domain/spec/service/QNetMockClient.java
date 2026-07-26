package io.github.peerorum.peer_orum.domain.spec.service;

public interface QNetMockClient {
    boolean verifyCertificate(String certName, String certNo, String userName);
}
