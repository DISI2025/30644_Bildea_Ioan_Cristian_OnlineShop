package org.deal.productservice.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.neo4j.core.Neo4jClient;
import org.springframework.stereotype.Component;

import java.nio.file.Files;
import java.util.Arrays;

@Component
@RequiredArgsConstructor
@Profile("startup")
public class Neo4jCypherLoader implements CommandLineRunner {
    private final Neo4jClient neo4jClient;

    @Override
    public void run(final String... args) throws Exception {
        var resource = new ClassPathResource("new-data.cypher");
        String cypher = Files.readString(resource.getFile().toPath());

        Arrays.stream(cypher.split(";"))
                .map(String::trim)
                .filter(statement -> !statement.isEmpty())
                .forEach(statement -> neo4jClient.query(statement).run());
    }
}
