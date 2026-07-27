package io.github.peerorum.peer_orum;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class PeerOrumApplication {

	public static void main(String[] args) {
		SpringApplication.run(PeerOrumApplication.class, args);
	}

}
