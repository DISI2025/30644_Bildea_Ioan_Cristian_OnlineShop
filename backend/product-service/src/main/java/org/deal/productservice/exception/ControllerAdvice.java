package org.deal.productservice.exception;

import lombok.extern.slf4j.Slf4j;
import org.deal.core.exception.BaseExceptionHandler;
import org.deal.core.exception.DealException;
import org.deal.core.response.DealResponse;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Arrays;

@RestControllerAdvice
@Slf4j
public class ControllerAdvice extends BaseExceptionHandler {

    @ExceptionHandler({DealException.class})
    public DealResponse<?> handleDealException(final DealException exception) {
        log.error(Arrays.toString(exception.getStackTrace()));
        return super.handleDealException(exception);
    }

    @ExceptionHandler({Exception.class, RuntimeException.class})
    public DealResponse<?> handle(final Exception exception) {
        log.error(Arrays.toString(exception.getStackTrace()));
        return super.handle(exception);
    }
}
