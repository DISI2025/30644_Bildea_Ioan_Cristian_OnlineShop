package org.deal.core.request.user.forgotpassword;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ResetPasswordRequest (String token, String newPassword) {

}
