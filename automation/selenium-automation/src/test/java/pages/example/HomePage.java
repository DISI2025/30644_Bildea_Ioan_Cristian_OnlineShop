package pages.example;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class HomePage {
    private final WebDriver driver;
    private final WebDriverWait wait;
    
    private final By appLogo = By.className("app_logo");
    private final By menuButton = By.id("react-burger-menu-btn");
    private final By logoutLink = By.id("logout_sidebar_link");
    private final By productSort = By.className("product_sort_container");

    public HomePage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    public boolean isHomePageDisplayed() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(appLogo)).isDisplayed();
    }

    public void logout() {
        WebElement menuElement = wait.until(ExpectedConditions.elementToBeClickable(menuButton));
        menuElement.click();
        WebElement logoutElement = wait.until(ExpectedConditions.elementToBeClickable(logoutLink));
        logoutElement.click();
    }

    public boolean isProductSortDisplayed() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(productSort)).isDisplayed();
    }

    public String getPageTitle() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(appLogo)).getText();
    }
} 