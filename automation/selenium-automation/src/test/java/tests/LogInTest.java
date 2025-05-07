package tests;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import pages.HomePage;
import pages.LogInPage;
import utils.TestData;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class LogInTest {
    private WebDriver driver;
    private LogInPage loginPage;
    private HomePage homePage;

    @BeforeEach
    public void setUp() {
        ChromeOptions options = getChromeOptions();

        driver = new ChromeDriver(options);
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
        driver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(30));

        loginPage = new LogInPage(driver);
        homePage = new HomePage(driver);

        loginPage.navigateToLogInPage();
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
    public void testSuccessfulLogin() {
        loginPage.logIn(TestData.Credentials.STANDARD_USER, TestData.Credentials.PASSWORD);

        assertTrue(homePage.isHomePageDisplayed(), TestData.Messages.HOME_PAGE_DISPLAYED);
    }

    @Test
    public void testLoginWithInvalidCredentials() {
        loginPage.logIn(TestData.Credentials.INVALID_USER, TestData.Credentials.INVALID_PASSWORD);

        assertTrue(loginPage.isLogInPageDisplayed(), TestData.Messages.ERROR_INVALID_CREDENTIALS);
    }

    @Test
    public void testLoginWithEmptyCredentials() {
        loginPage.logIn("", "");

        assertTrue(loginPage.isLogInPageDisplayed());
    }
}
