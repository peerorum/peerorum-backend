package io.github.peerorum.peer_orum.global.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Slf4j
@Service
public class S3UploadService {

    // Mock implementation for MVP
    // In production, this will use amazon-s3-sdk to upload to real S3 bucket.
    public String uploadFile(MultipartFile file, String dirName) {
        if (file == null || file.isEmpty()) {
            return null;
        }
        
        String originalFileName = file.getOriginalFilename();
        String fakeS3Url = "https://mock-s3-bucket.s3.ap-northeast-2.amazonaws.com/" 
                + dirName + "/" + UUID.randomUUID() + "_" + originalFileName;
        
        log.info("Mock S3 Uploaded: {} -> {}", originalFileName, fakeS3Url);
        return fakeS3Url;
    }
}
