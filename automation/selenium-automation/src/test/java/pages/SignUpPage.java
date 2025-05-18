package pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;

public class SignUpPage extends BasePage {
    private final By usernameField = By.id("username");
    private final By emailField = By.id("email");
    private final By passwordField = By.id("password");
    private final By confirmPasswordField = By.id("confirmPassword");
    private final By signUpButton = By.cssSelector("button[type='submit']");
    private final By errorMessage = By.cssSelector("[data-test='error']");

    // constructors
    public SignUpPage(WebDriver driver) {
        super(driver);
    }

    // methods
    public void navigateToSignUpPage() {
        driver.get("http://localhost:5173/register");
    }

    public boolean isSignUpPageDisplayed() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(signUpButton)).isDisplayed();
    }

    public void signUp(String username, String email, String password, String confirmPassword) {
        WebElement usernameElement = wait.until(ExpectedConditions.visibilityOfElementLocated(usernameField));
        WebElement emailElement = wait.until(ExpectedConditions.visibilityOfElementLocated(emailField));
        WebElement passwordElement = wait.until(ExpectedConditions.visibilityOfElementLocated(passwordField));
        WebElement confirmPasswordElement = wait.until(ExpectedConditions.visibilityOfElementLocated(confirmPasswordField));
        WebElement signUpElement = wait.until(ExpectedConditions.elementToBeClickable(signUpButton));

        this.sendKeys(usernameElement, username);
        this.sendKeys(emailElement, email);
        this.sendKeys(passwordElement, password);
        this.sendKeys(confirmPasswordElement, confirmPassword);
        this.click(signUpElement);
    }

    public String getErrorMessage() {
        WebElement errorElement = wait.until(ExpectedConditions.visibilityOfElementLocated(errorMessage));
        return this.getText(errorElement);
    }
}
