package org.deal.core.exception;

import java.io.Serializable;

public record DealError(String message) implements Serializable {
    public final static DealError INTERNAL_SERVER_ERROR = new DealError("Internal Server Error");
    public final static DealError USERNAME_NOT_FOUND = new DealError("Username Not Found");
    public final static DealError INVALID_TOKEN = new DealError("Invalid Token");
    public final static DealError TOKEN_EXPIRED = new DealError("Token expired");

}
