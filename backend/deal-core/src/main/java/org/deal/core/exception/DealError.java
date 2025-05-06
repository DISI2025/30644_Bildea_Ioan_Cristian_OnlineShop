package org.deal.core.exception;

import java.io.Serializable;

public record DealError(String message) implements Serializable {
    public final static DealError INTERNAL_SERVER_ERROR = new DealError("Internal Server Error");
    public final static DealError BAD_CREDENTIAL_EXCEPTION = new DealError("Invalid username or password");
}
