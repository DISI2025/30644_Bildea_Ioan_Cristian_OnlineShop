package org.deal.core.client;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum DealService {
    IS("identity-service"),
    PS("product-service"),
    ;

    private final String value;
}
