import java.sql.*;

public class CheckDb {
    public static void main(String[] args) throws Exception {
        String url = "jdbc:mysql://peer-orum-db.cp6cy240q0qs.ap-northeast-2.rds.amazonaws.com:3306/peerorumdb?useSSL=false&serverTimezone=Asia/Seoul";
        String user = System.getenv("DB_USERNAME");
        String password = System.getenv("DB_PASSWORD");
        
        try (Connection conn = DriverManager.getConnection(url, user, password)) {
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT major, COUNT(*) FROM spec_profile GROUP BY major");
            while(rs.next()) {
                System.out.println(rs.getString(1) + ": " + rs.getInt(2));
            }
        }
    }
}
