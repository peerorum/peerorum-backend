package io.github.peerorum.peer_orum.global.common;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/majors")
public class MajorController {

    @GetMapping
    public ResponseEntity<List<String>> getMajors() {
        // 단국대학교 주요 학과 리스트 (하드코딩된 데이터로 시작)
        List<String> majors = Arrays.asList(
                "국어국문학과", "사학과", "철학과", "영미인문학과",
                "법학과", "정치외교학과", "행정학과", "도시계획·부동산학부",
                "경제학과", "무역학과", "경영학부", "회계학과",
                "전자전기공학부", "고분자시스템공학부", "토목환경공학과", "기계공학과",
                "화학공학과", "건축학부", "컴퓨터공학과", "소프트웨어학과",
                "모바일시스템공학과", "통계데이터사이언스학과", "사이버보안학과",
                "수학교육과", "과학교육과", "체육교육과", "특수교육과",
                "도예과", "커뮤니케이션디자인과", "패션산업디자인과",
                "무용과", "음악학부"
        );
        return ResponseEntity.ok(majors);
    }
}
