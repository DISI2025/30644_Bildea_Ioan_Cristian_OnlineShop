package org.deal.productservice.config;

import org.neo4j.cypherdsl.core.renderer.Dialect;
import org.neo4j.driver.Driver;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.transaction.TransactionManagerCustomizers;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.neo4j.core.DatabaseSelectionProvider;
import org.springframework.data.neo4j.core.Neo4jClient;
import org.springframework.data.neo4j.core.Neo4jOperations;
import org.springframework.data.neo4j.core.Neo4jTemplate;
import org.springframework.data.neo4j.core.mapping.Neo4jMappingContext;
import org.springframework.data.neo4j.core.transaction.Neo4jTransactionManager;
import org.springframework.data.neo4j.repository.config.EnableNeo4jRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableNeo4jRepositories(basePackages = "org.deal.productservice.repository.graph")
@EnableTransactionManagement
public class Neo4jConfig {

    @Bean({"neo4jTemplate"})
    @ConditionalOnMissingBean({Neo4jOperations.class})
    public Neo4jTemplate neo4jTemplate(
            final Neo4jClient neo4jClient,
            final Neo4jMappingContext neo4jMappingContext,
            final Driver driver,
            final DatabaseSelectionProvider databaseNameProvider,
            final ObjectProvider<TransactionManagerCustomizers> optionalCustomizers) {
        Neo4jTransactionManager transactionManager = new Neo4jTransactionManager(driver, databaseNameProvider);
        optionalCustomizers.ifAvailable((customizer) -> {
            customizer.customize(transactionManager);
        });
        return new Neo4jTemplate(neo4jClient, neo4jMappingContext, transactionManager);
    }

    @Bean
    public org.neo4j.cypherdsl.core.renderer.Configuration cypherDslConfiguration() {
        return org.neo4j.cypherdsl.core.renderer.Configuration.newConfig()
                .withDialect(Dialect.NEO4J_5).build();
    }
} 