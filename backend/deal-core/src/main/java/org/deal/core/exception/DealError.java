package org.deal.core.exception;

import java.io.Serializable;

public record DealError(String message) implements Serializable {
    public final static DealError INTERNAL_SERVER_ERROR = new DealError("Internal Server Error");
    public final static DealError BAD_CREDENTIAL_EXCEPTION = new DealError("Invalid username or password");
    public final static DealError REGISTRATION_FAILED = new DealError("Registration failed");
    public final static DealError BAD_TOKEN = new DealError("Malformed token");
    public final static DealError FORBIDDEN = new DealError("Access denied");
    public final static DealError PASSWORD_RESET_FAIL = new DealError("Password reset failed");
}
