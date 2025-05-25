package org.deal.productservice.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.Cache;
import okhttp3.OkHttpClient;
import org.deal.core.client.DealClient;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.stereotype.Component;

import java.io.File;
import java.util.concurrent.TimeUnit;

@Configuration
public class AppConfig {

    @Bean
    public MappingJackson2HttpMessageConverter mappingJackson2HttpMessageConverter() {
        return new MappingJackson2HttpMessageConverter();
    }

    @Bean
    @LoadBalanced
    public OkHttpClient okHttpClient() {
        return new OkHttpClient().newBuilder()
                .callTimeout(15, TimeUnit.SECONDS)
                .cache(new Cache(new File("./backend/product-service/src/main/resources/cache"), 10 * 1024 * 1024))
                .build();
    }

    @Bean
    public DealClient dealClient(final OkHttpClient okHttpClient, final DiscoveryClient discoveryClient) {
        return new DealClient(okHttpClient, new ObjectMapper(), discoveryClient);
    }

    @Component
    public class TokenStorage {

        private volatile String token;

        public synchronized void setToken(final String token) {
            this.token = token;
        }

        public String getToken() {
            return token;
        }

    }

}
