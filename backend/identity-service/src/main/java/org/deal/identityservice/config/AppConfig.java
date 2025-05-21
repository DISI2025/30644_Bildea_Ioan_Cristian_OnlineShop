package org.deal.identityservice.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.NonNull;
import okhttp3.Cache;
import okhttp3.OkHttpClient;
import org.deal.core.client.DealClient;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.io.File;
import java.util.concurrent.TimeUnit;

@Configuration
public class AppConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(final @NonNull AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public AuthenticationProvider authenticationProvider(final PasswordEncoder passwordEncoder, final UserDetailsService userDetailsService) {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setPasswordEncoder(passwordEncoder);
        authProvider.setUserDetailsService(userDetailsService);
        return authProvider;
    }

    @Bean
    @LoadBalanced
    public OkHttpClient okHttpClient() {
        return new OkHttpClient().newBuilder()
                .callTimeout(15, TimeUnit.SECONDS)
                .cache(new Cache(new File("./backend/identity-service/src/main/resources/cache"), 10 * 1024 * 1024))
                .build();
    }

    @Bean
    public DealClient dealClient(final OkHttpClient okHttpClient, final DiscoveryClient discoveryClient) {
        return new DealClient(okHttpClient, new ObjectMapper(), discoveryClient);
    }
}
