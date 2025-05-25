package org.deal.productservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.neo4j.core.DatabaseSelectionProvider;
import org.springframework.data.neo4j.core.transaction.Neo4jTransactionManager;
import org.springframework.data.neo4j.repository.config.EnableNeo4jRepositories;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.neo4j.driver.Driver;

@Configuration
@EnableNeo4jRepositories(basePackages = "org.deal.productservice.repository")
@EnableTransactionManagement
public class Neo4jConfig {

    @Bean
    public PlatformTransactionManager transactionManager(Driver driver, DatabaseSelectionProvider databaseNameProvider) {
        return new Neo4jTransactionManager(driver, databaseNameProvider);
    }
} 