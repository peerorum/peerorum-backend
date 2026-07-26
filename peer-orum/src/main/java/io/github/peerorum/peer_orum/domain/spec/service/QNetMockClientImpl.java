package io.github.peerorum.peer_orum.domain.spec.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class QNetMockClientImpl implements QNetMockClient {

    @Override
    public boolean verifyCertificate(String certName, String certNo, String userName) {
        log.info("Mock QNet API Call: certName={}, certNo={}, userName={}", certName, certNo, userName);
        
        // Mock logic: Valid if certNo starts with "QNET" and is 10 chars long
        if (certNo != null && certNo.startsWith("QNET") && certNo.length() == 10) {
            log.info("Certificate Verification Success");
            return true;
        }
        
        log.info("Certificate Verification Failed");
        return false;
    }
}
