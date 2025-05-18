package pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;

public class LogInPage extends BasePage {
    private final By usernameField = By.id("username");
    private final By passwordField = By.id("password");
    private final By logInButton = By.cssSelector("button[type='submit']");
    // TODO get the elements properly
    private final By errorMessage = By.cssSelector("[data-test='error']");

    // constructors
    public LogInPage(WebDriver driver) {
        super(driver);
    }

    // methods
    public void navigateToLogInPage() {
        driver.get("http://localhost:5173/login");
    }

    public boolean isLogInPageDisplayed() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(logInButton)).isDisplayed();
    }

    public void logIn(String username, String password) {
        WebElement usernameElement = wait.until(ExpectedConditions.visibilityOfElementLocated(usernameField));
        WebElement passwordElement = wait.until(ExpectedConditions.visibilityOfElementLocated(passwordField));
        WebElement logInElement = wait.until(ExpectedConditions.elementToBeClickable(logInButton));

        this.sendKeys(usernameElement, username);
        this.sendKeys(passwordElement, password);
        this.click(logInElement);
    }

    public String getErrorMessage() {
        WebElement errorElement = wait.until(ExpectedConditions.visibilityOfElementLocated(errorMessage));
        return this.getText(errorElement);
    }
}
