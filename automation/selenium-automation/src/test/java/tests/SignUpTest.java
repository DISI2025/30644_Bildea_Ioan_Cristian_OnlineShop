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
                TestData.SignUp.NEW_EMAIL,
                TestData.SignUp.PASSWORD,
                TestData.SignUp.PASSWORD);

        assertTrue(signupPage.isSignUpPageDisplayed(), TestData.Messages.ERROR_INVALID_CREDENTIALS);
    }

    @Test
    public void testSignupWithExistingEmail() {
        signupPage.signUp(
                TestData.SignUp.NEW_USERNAME,
                TestData.SignUp.EXISTING_EMAIL,
                TestData.SignUp.PASSWORD,
                TestData.SignUp.PASSWORD);

        assertTrue(signupPage.isSignUpPageDisplayed(), TestData.Messages.ERROR_INVALID_CREDENTIALS);
    }

    @Test
    public void testSignupWithIllegalEmail() {
        signupPage.signUp(
                TestData.SignUp.NEW_USERNAME,
                TestData.SignUp.ILLEGAL_EMAIL,
                TestData.SignUp.PASSWORD,
                TestData.SignUp.PASSWORD);

        assertTrue(signupPage.isEmailError());
        assertTrue(signupPage.isSignUpPageDisplayed(), TestData.Messages.ERROR_INVALID_CREDENTIALS);
    }

    @Test
    public void testSignupWithDifferentPasswords() {
        signupPage.signUp(
                TestData.SignUp.NEW_USERNAME,
                TestData.SignUp.NEW_EMAIL,
                TestData.SignUp.PASSWORD,
                TestData.SignUp.INVALID_PASSWORD);

        assertTrue(signupPage.isConfirmPasswordError());
        assertTrue(signupPage.isSignUpPageDisplayed(), TestData.Messages.ERROR_INVALID_CREDENTIALS);
    }

    @Test
    public void testSignupWithEmptyCredentials() {
        signupPage.signUp("", "", "", "");

        assertTrue(signupPage.isUsernameError());
        assertTrue(signupPage.isEmailError());
        assertTrue(signupPage.isPasswordError());
        assertTrue(signupPage.isConfirmPasswordError());
        assertTrue(signupPage.isSignUpPageDisplayed());
    }

    @Test
    public void testSuccessfulSignup() {
        signupPage.signUp(
                TestData.SignUp.NEW_USERNAME,
                TestData.SignUp.NEW_EMAIL,
                TestData.SignUp.PASSWORD,
                TestData.SignUp.PASSWORD);

        assertTrue(homePage.isHomePageDisplayed(), TestData.Messages.HOME_PAGE_DISPLAYED);
    }
}
