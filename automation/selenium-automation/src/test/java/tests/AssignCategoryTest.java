package tests;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import pages.AssignCategoryPage;
import pages.LogInPage;
import utils.TestData;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class AssignCategoryTest {
    private WebDriver driver;
    private AssignCategoryPage assignCategoryPage;
    private LogInPage loginPage;

    @BeforeEach
    public void setUp() {
        ChromeOptions options = getChromeOptions();

        driver = new ChromeDriver(options);
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
        driver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(30));

        assignCategoryPage = new AssignCategoryPage(driver);
        loginPage = new LogInPage(driver);

        loginPage.navigateToLogInPage();
        loginPage.logIn(
                TestData.UserData.ADMIN_USERNAME,
                TestData.UserData.ADMIN_PASSWORD);
        try {
            Thread.sleep(10000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        assignCategoryPage.navigateToPage();
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
    public void testDumb() {
        assignCategoryPage.assignCategory();

        try {
            Thread.sleep(10000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }

        // if this call fails with TimeoutException, the test fails as expected
        // if this call succeeds, the test is ok
        String text = this.assignCategoryPage.getCategoryTagText();
        System.out.println(text);

        assertTrue(assignCategoryPage.isPageDisplayed());
    }
}
