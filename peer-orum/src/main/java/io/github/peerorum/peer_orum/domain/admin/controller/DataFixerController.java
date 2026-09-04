package io.github.peerorum.peer_orum.domain.admin.controller;

import io.github.peerorum.peer_orum.domain.spec.entity.SpecProfile;
import io.github.peerorum.peer_orum.domain.spec.repository.SpecProfileRepository;
import io.github.peerorum.peer_orum.domain.user.entity.Role;
import io.github.peerorum.peer_orum.domain.user.entity.User;
import io.github.peerorum.peer_orum.domain.user.repository.UserRepository;
import io.github.peerorum.peer_orum.global.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;
import java.util.Random;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class DataFixerController {

    private final UserRepository userRepository;
    private final SpecProfileRepository specProfileRepository;
    private final JdbcTemplate jdbcTemplate;
    
    private final String[] ADJECTIVES = {
        "두근두근", "열정적인", "성장하는", "도전하는", "꾸준한",
        "상위1%", "합격하는", "갓생사는", "완벽한", "빛나는",
        "노력하는", "긍정적인", "발전하는", "집중하는", "즐거운"
    };

    private final String[] NOUNS = {
        "합격", "개발자", "기획자", "디자이너", "마케터",
        "펭귄", "개미", "독수리", "다람쥐", "지원자",
        "루키", "전문가", "도전자", "신입", "인재"
    };

    private final String[] MAJORS = {
        "국어국문학과", "철학과", "사학과", "영미인문학과", "법학과",
        "정치외교학과", "행정학과", "상담학과", "경제학과", "무역학과",
        "전자전기공학과", "융합반도체공학과", "기계공학과", "화학공학과",
        "소프트웨어학과", "컴퓨터공학과", "인공지능학과", "국제경영학과",
        "경영경제대학 경영학부 경영학전공", "무역학과", "산업경영학과(야)"
    };

    @GetMapping("/fix-mock-data")
    @Transactional
    public ApiResponse<String> fixMockData() {
        try {
            String updateUsersSql = "UPDATE users SET virtual_nickname = CONCAT(" +
                "ELT(FLOOR(RAND() * 15) + 1, '두근두근', '열정적인', '성장하는', '도전하는', '꾸준한', '상위1%', '합격하는', '갓생사는', '완벽한', '빛나는', '노력하는', '긍정적인', '발전하는', '집중하는', '즐거운'), " +
                "ELT(FLOOR(RAND() * 15) + 1, '합격', '개발자', '기획자', '디자이너', '마케터', '펭귄', '개미', '독수리', '다람쥐', '지원자', '루키', '전문가', '도전자', '신입', '인재'), " +
                "id) WHERE role = 'ROLE_GUEST' OR email LIKE '%mock%'";
                
            String updateSpecProfilesSql = "UPDATE spec_profile sp " +
                "JOIN users u ON sp.user_id = u.id " +
                "SET sp.major = ELT(FLOOR(RAND() * 188) + 1, '철학과', '과학교육과', '사이버보안학과', '상담학과', '미디어커뮤니케이션학부 영상콘텐츠전공', '기계공학과', '건축학부 건축공학전공', '무역학과', '인프라건설공학과', '수학교육과', '수학교육과', '고분자시스템공학부 융합소재공학전공', '철학과', '공연영화학부 영화전공', '과학교육과', '경영경제대학 경영학부 회계학전공', '미디어커뮤니케이션학부 저널리즘전공', '행정학과', '인프라건설공학과', 'SW융합학부', '정치외교학과', '소프트웨어학과', '음악학부 관현악전공', 'AI건축융합학과', '산업경영학과(야)', '도예과', '국어국문학과', '미디어커뮤니케이션학부 영상콘텐츠전공', '사이버보안학과', '도시계획/부동산학부 도시지역계획학전공', '디자인학부 커뮤니케이션디자인전공', '행정학과', '수학교육과', 'AI건축융합학과', '건축학부 건축학전공', '고분자시스템공학부 고분자공학전공', '국어국문학과', '건축학부 건축학전공', '한문교육과', '산업경영학과(야)', '영미인문학과', '도시계획/부동산학부 부동산학전공', '건축학부 건축공학전공', '경영경제대학 경영학부 경영학전공', '과학교육과', '경제학과', '전자전기공학과', '디자인학부 패션산업디자인전공', '무용과', '교직교육과', '행정학과', '미디어커뮤니케이션학부 영상콘텐츠전공', '특수교육과', '화학공학과', 'AI건축융합학과', '사학과', '도시계획/부동산학부 도시지역계획학전공', '정치외교학과', '소프트웨어학과', '영미인문학과', '미디어커뮤니케이션학부 저널리즘전공', '전자전기공학과', '경제학과', '철학과', '무역학과', '국어국문학과', '산업경영학과(야)', '도시계획/부동산학부 도시지역계획학전공', '도시계획/부동산학부 부동산학전공', '미디어커뮤니케이션학부 광고홍보전공', '인공지능학과', '미디어커뮤니케이션학부 저널리즘전공', '법학과', '전자전기공학과', '국어국문학과', '상담학과', '도시계획/부동산학부 부동산학전공', '법학과', '컴퓨터공학과', '행정학과', '철학과', '한국학과', '상담학과', '교직교육과', '정치외교학과', '건축학부 건축학전공', '수학교육과', '경영경제대학 경영학부 경영학전공', '미디어커뮤니케이션학부 광고홍보전공', '경영경제대학 경영학부 경영학전공', '기계공학과', '음악학부 작곡전공', '도시계획/부동산학부 부동산학전공', '컴퓨터공학과', '경영경제대학 경영학부 경영학전공', '융합반도체공학과', '과학교육과', '인공지능학과', '교직교육과', '미디어커뮤니케이션학부 저널리즘전공', '산업경영학과(야)', '도시계획/부동산학부 도시지역계획학전공', '정치외교학과', '고분자시스템공학부 융합소재공학전공', '국제경영학과', '건축학부 건축공학전공', '사학과', '한문교육과', '바이오소재융합공학과', '체육교육과', 'SW융합학부', '음악학부 성악전공', '경제학과', '소프트웨어학과', '융합반도체공학과', '특수교육과', '도시계획/부동산학부 부동산학전공', '인프라건설공학과', '수학교육과', '고분자시스템공학부 고분자공학전공', '체육교육과', '고분자시스템공학부 고분자공학전공', '정치외교학과', '경제학과', '사학과', '한문교육과', '행정학과', '경영경제대학 경영학부 회계학전공', '통계데이터사이언스학과', '음악학부 국악전공', '사학과', '철학과', '교직교육과', '경영경제대학 경영학부 회계학전공', '컴퓨터공학과', '법학과', '체육교육과', '사학과', '산업경영학과(야)', '화학공학과', '한문교육과', '고분자시스템공학부 융합소재공학전공', '경제학과', '모바일시스템공학과', '경영경제대학 경영학부 경영학전공', '특수교육과', '기계공학과', '화학공학과', '사이버보안학과', '체육교육과', '경영경제대학 경영학부 회계학전공', '무역학과', '모바일시스템공학과', '공연영화학부 연극전공', '과학교육과', '무역학과', '상담학과', '미디어커뮤니케이션학부 영상콘텐츠전공', '특수교육과', '공연영화학부 뮤지컬전공', '음악학부 피아노전공', '통계데이터사이언스학과', '무역학과', '연기영상예술학과', '영미인문학과', '융합반도체공학과', '도시계획/부동산학부 도시지역계획학전공', '미디어커뮤니케이션학부 광고홍보전공', '법학과', '영미인문학과', '글로벌기초교육학부', 'SW융합학부', '모바일시스템공학과', '특수교육과', '국어국문학과', '미디어커뮤니케이션학부 광고홍보전공', '인공지능학과', '교직교육과', '영미인문학과', '상담학과', '체육교육과', '미디어커뮤니케이션학부 영상콘텐츠전공', '미디어커뮤니케이션학부 광고홍보전공', '경영경제대학 경영학부 회계학전공', '통계데이터사이언스학과', '미디어커뮤니케이션학부 저널리즘전공', '한문교육과', '법학과') " +
                "WHERE u.role = 'ROLE_GUEST' OR u.email LIKE '%mock%'";

            String insertInternsSql = "INSERT INTO intern (user_id, company, period, detail, created_at, updated_at) " +
                "SELECT u.id, ELT(FLOOR(RAND() * 5) + 1, '네이버', '카카오', '라인', '쿠팡', '배달의민족'), '6개월', '백엔드 인턴십 수료', NOW(), NOW() " +
                "FROM users u " +
                "WHERE (u.role = 'ROLE_GUEST' OR u.email LIKE '%mock%') AND RAND() < 0.2 " +
                "AND NOT EXISTS (SELECT 1 FROM intern i WHERE i.user_id = u.id)";

            int usersUpdated = jdbcTemplate.update(updateUsersSql);
            int profilesUpdated = jdbcTemplate.update(updateSpecProfilesSql);
            int internsInserted = jdbcTemplate.update(insertInternsSql);
            
            return ApiResponse.success("Fixed " + usersUpdated + " mock users' nickname, " + profilesUpdated + " majors, inserted " + internsInserted + " interns via native SQL.");
        } catch (Exception e) {
            return ApiResponse.success("Error: " + e.getMessage() + " | Cause: " + (e.getCause() != null ? e.getCause().getMessage() : "null"));
        }
    }
}
