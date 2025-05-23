package tests;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import pages.ForgotPasswordPage;
import pages.HomePage;
import pages.LogInPage;
import utils.TestData;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class ForgotPasswordTest {
    private WebDriver driver;
    private ForgotPasswordPage forgotPasswordPage;
    private HomePage homePage;
    private LogInPage logInPage;

    @BeforeEach
    public void setUp() {
        ChromeOptions options = getChromeOptions();

        driver = new ChromeDriver(options);
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
        driver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(30));

        forgotPasswordPage = new ForgotPasswordPage(driver);
        homePage = new HomePage(driver);
        logInPage = new LogInPage(driver);

        forgotPasswordPage.navigateToForgotPasswordPage();
    }

    private static ChromeOptions getChromeOptions() {
        ChromeOptions options = new ChromeOptions();

        Map<String, Object> prefs = new HashMap<>();
        prefs.put("credentials_enable_service", false);
        prefs.put("profile.password_manager_enabled", false);
        options.setExperimentalOption("prefs", prefs);

        options.addArguments("--start-maximized");
        options.addArguments("--remote-allow-origins=*");
        options.addArguments("--disable-notifications");
        options.addArguments("--disable-popup-blocking");
        return options;
    }

    @AfterEach
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    @Test
    public void testSignupWithIllegalEmail() {
        forgotPasswordPage.send(TestData.ForgotPassword.ILLEGAL_EMAIL);

        String errorMessage = forgotPasswordPage.getEmailError();
        boolean ok = errorMessage.contains("valid email");

        assertTrue(ok);
        assertTrue(forgotPasswordPage.isForgotPasswordPageDisplayed());
    }

    @Test
    public void testSendWithEmptyCredentials() {
        forgotPasswordPage.send("");

        String errorMessage = forgotPasswordPage.getEmailError();
        boolean ok = errorMessage.contains("enter your email");

        assertTrue(ok);
        assertTrue(forgotPasswordPage.isForgotPasswordPageDisplayed());
    }

    @Test
    public void testSuccessfulSend() {
        forgotPasswordPage.send(TestData.ForgotPassword.EMAIL);

        assertTrue(logInPage.isLogInPageDisplayed());
    }
}
