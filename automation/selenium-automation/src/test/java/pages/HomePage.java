package pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;

public class HomePage extends BasePage {
//    private final By bigDiv = By.id("root");
    private final By header = By.tagName("header");

    // constructors
    public HomePage(WebDriver driver) {
        super(driver);
    }

    // methods
    public void navigateToHomePage() {
        driver.get("http://localhost:5173");
    }

    public boolean isHomePageDisplayed() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(header)).isDisplayed();
    }
}
