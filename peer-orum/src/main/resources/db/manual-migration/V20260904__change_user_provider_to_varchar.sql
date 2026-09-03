-- Provider 값이 추가될 때마다 MySQL ENUM 정의를 변경해야 하는 문제를 방지한다.
-- 기존 GOOGLE, KAKAO, LOCAL 데이터는 문자열 값 그대로 유지된다.
ALTER TABLE users
    MODIFY COLUMN provider VARCHAR(20) NOT NULL;
