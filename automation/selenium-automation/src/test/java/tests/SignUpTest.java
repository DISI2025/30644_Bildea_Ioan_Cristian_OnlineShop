package tests;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import pages.HomePage;
import pages.SignUpPage;
import utils.TestData;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class SignUpTest {
    private WebDriver driver;
    private SignUpPage signupPage;
    private HomePage homePage;

    @BeforeEach
    public void setUp() {
        ChromeOptions options = getChromeOptions();

        driver = new ChromeDriver(options);
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
        driver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(30));

        signupPage = new SignUpPage(driver);
        homePage = new HomePage(driver);

        signupPage.navigateToSignUpPage();
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
    public void testSignupWithExistingUsername() {
        signupPage.signUp(
                TestData.SignUp.EXISTING_USERNAME,
                TestData.SignUp.generateEmail(),
                TestData.SignUp.PASSWORD,
                TestData.SignUp.PASSWORD);

        String errorMessage = signupPage.getErrorMessage();
        boolean ok = errorMessage.contains("Something went wrong");

        assertTrue(ok);
        assertTrue(signupPage.isSignUpPageDisplayed());
    }

    @Test
    public void testSignupWithExistingEmail() {
        signupPage.signUp(
                TestData.SignUp.generateUsername(),
                TestData.SignUp.EXISTING_EMAIL,
                TestData.SignUp.PASSWORD,
                TestData.SignUp.PASSWORD);

        String errorMessage = signupPage.getErrorMessage();
        boolean ok = errorMessage.contains("Something went wrong");

        assertTrue(ok);
        assertTrue(signupPage.isSignUpPageDisplayed());
    }

    @Test
    public void testSignupWithIllegalEmail() {
        signupPage.signUp(
                TestData.SignUp.generateUsername(),
                TestData.SignUp.ILLEGAL_EMAIL,
                TestData.SignUp.PASSWORD,
                TestData.SignUp.PASSWORD);

        String text = signupPage.getEmailError();
        boolean okText = text.contains("valid email");

        assertTrue(okText);
        assertTrue(signupPage.isSignUpPageDisplayed());
    }

    @Test
    public void testSignupWithDifferentPasswords() {
        signupPage.signUp(
                TestData.SignUp.generateUsername(),
                TestData.SignUp.generateEmail(),
                TestData.SignUp.PASSWORD,
                TestData.SignUp.INVALID_PASSWORD);

        String text = signupPage.getConfirmPasswordError();
        boolean okText = text.contains("passwords do not match");

        assertTrue(okText);
        assertTrue(signupPage.isSignUpPageDisplayed());
    }

    @Test
    public void testSignupWithEmptyCredentials() {
        signupPage.signUp("", "", "", "");

        String usernameError = signupPage.getUsernameError();
        boolean okUsername = usernameError.contains("enter your username");

        String emailError = signupPage.getEmailError();
        boolean okEmail = emailError.contains("enter your email");

        String passwordError = signupPage.getPasswordError();
        boolean okPassword = passwordError.contains("enter your password");

        String confirmError = signupPage.getConfirmPasswordError();
        boolean okConfirm = confirmError.contains("confirm your password");

        assertTrue(okUsername);
        assertTrue(okEmail);
        assertTrue(okPassword);
        assertTrue(okConfirm);
        assertTrue(signupPage.isSignUpPageDisplayed());
    }

    @Test
    public void testSuccessfulSignup() {
        String username = TestData.SignUp.generateUsername();
        String email = TestData.SignUp.generateEmail();

        signupPage.signUp(
                username,
                email,
                TestData.SignUp.PASSWORD,
                TestData.SignUp.PASSWORD);

        try {
            // Must wait for the Home Page to load!
            Thread.sleep(5000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }

        assertTrue(homePage.isHomePageDisplayed());
    }
}
