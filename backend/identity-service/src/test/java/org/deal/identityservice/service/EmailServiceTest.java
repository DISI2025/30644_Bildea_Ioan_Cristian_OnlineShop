package org.deal.identityservice.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.util.ReflectionTestUtils;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasItemInArray;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class EmailServiceTest {

    private static final String FROM_EMAIL = "from@email";
    private static final String RESET_URL = "resetUrl";
    private static final String RESET_TITLE = "resetTitle";
    private static final String RESET_TOKEN = "resetToken";
    private static final String RESET_BODY = "resetBody";

    private static final String TO_EMAIL = "to@email";
    private static final String SUBJECT = "subject";
    private static final String BODY = "body";

    @Mock
    private JavaMailSender mailSender;

    @InjectMocks
    private EmailService victim;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(victim, "fromEmail", FROM_EMAIL);
        ReflectionTestUtils.setField(victim, "passwordResetUrl", RESET_URL);
        ReflectionTestUtils.setField(victim, "passwordResetTitle", RESET_TITLE);
        ReflectionTestUtils.setField(victim, "passwordResetBody", RESET_BODY);
    }

    @Test
    void testSendEmail() {
        var messageCaptor = ArgumentCaptor.forClass(SimpleMailMessage.class);

        victim.sendEmail(TO_EMAIL, SUBJECT, BODY);

        verify(mailSender).send(messageCaptor.capture());
        var sentMessage = messageCaptor.getValue();
        assertThat(sentMessage.getTo(), hasItemInArray(TO_EMAIL));
        assertThat(sentMessage.getFrom(), equalTo(FROM_EMAIL));
        assertThat(sentMessage.getSubject(), equalTo(SUBJECT));
        assertThat(sentMessage.getText(), equalTo(BODY));
    }

    @Test
    void testSendPasswordResetEmail() {
        var messageCaptor = ArgumentCaptor.forClass(SimpleMailMessage.class);

        victim.sendPasswordResetEmail(TO_EMAIL, RESET_TOKEN);

        verify(mailSender).send(messageCaptor.capture());
        var sentMessage = messageCaptor.getValue();
        assertThat(sentMessage.getTo(), hasItemInArray(TO_EMAIL));
        assertThat(sentMessage.getFrom(), equalTo(FROM_EMAIL));
        assertThat(sentMessage.getSubject(), equalTo(RESET_TITLE));
        assertThat(sentMessage.getText(), equalTo(RESET_BODY + RESET_URL + "?token=" + RESET_TOKEN));
    }
}
