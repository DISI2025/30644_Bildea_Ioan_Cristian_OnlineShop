package pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;

public class LogInPage extends BasePage {
    private final By usernameField = By.name("username");
    private final By passwordField = By.name("password");
    private final By logInButton = By.xpath("//button[contains(text(), 'Sign in')");
    // TODO get the elements properly
    private final By errorMessage = By.cssSelector("[data-test='error']");

    // constructors
    public LogInPage(WebDriver driver) {
        super(driver);
    }

    // methods
    public void navigateToLogInPage() {
        driver.get("http://localhost:3000/login");
    }

    public boolean isLogInPageDisplayed() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(logInButton)).isDisplayed();
    }

    public void logIn(String username, String password) {
        WebElement usernameElement = wait.until(ExpectedConditions.visibilityOfElementLocated(usernameField));
        WebElement passwordElement = wait.until(ExpectedConditions.visibilityOfElementLocated(passwordField));
        WebElement logInElement = wait.until(ExpectedConditions.elementToBeClickable(logInButton));

        super.sendKeys(usernameElement, username);
        super.sendKeys(passwordElement, password);
        super.click(logInElement);
    }

    public String getErrorMessage() {
        WebElement errorElement = wait.until(ExpectedConditions.visibilityOfElementLocated(errorMessage));
        return super.getText(errorElement);
    }
}
