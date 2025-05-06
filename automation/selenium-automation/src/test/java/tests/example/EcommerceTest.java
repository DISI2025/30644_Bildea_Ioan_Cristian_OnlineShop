package tests.example;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import pages.example.*;
import utils.TestData;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class EcommerceTest {
    private WebDriver driver;
    private LoginPage loginPage;
    private HomePage homePage;

    @BeforeEach
    public void setUp() {
        ChromeOptions options = getChromeOptions();
        
        driver = new ChromeDriver(options);
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
        driver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(30));
        
        loginPage = new LoginPage(driver);
        homePage = new HomePage(driver);
        
        loginPage.navigateToLoginPage();
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
        loginPage.login(TestData.Credentials.STANDARD_USER, TestData.Credentials.PASSWORD);
        
        assertTrue(homePage.isHomePageDisplayed(), TestData.Messages.HOME_PAGE_DISPLAYED);
        assertEquals(TestData.Messages.EXPECTED_PAGE_TITLE, homePage.getPageTitle(), 
            TestData.Messages.PAGE_TITLE);
    }

    @Test
    public void testLoginWithInvalidCredentials() {
        loginPage.login(TestData.Credentials.INVALID_USER, TestData.Credentials.INVALID_PASSWORD);
        
        String errorMessage = loginPage.getErrorMessage();
        assertFalse(errorMessage.isEmpty(), TestData.Messages.ERROR_MESSAGE_DISPLAYED);
        assertTrue(errorMessage.contains(TestData.Messages.ERROR_INVALID_CREDENTIALS), 
            "Error message should indicate invalid credentials");
    }

    @Test
    public void testLoginWithEmptyCredentials() {
        loginPage.login("", "");
        
        String errorMessage = loginPage.getErrorMessage();
        assertFalse(errorMessage.isEmpty(), TestData.Messages.ERROR_MESSAGE_DISPLAYED);
        assertTrue(errorMessage.contains(TestData.Messages.ERROR_USERNAME_REQUIRED), 
            "Error message should indicate username is required");
    }
} 