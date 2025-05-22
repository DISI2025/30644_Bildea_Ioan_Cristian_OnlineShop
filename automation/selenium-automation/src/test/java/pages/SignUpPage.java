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

    private final By usernameError = By.id("username_help");
    private final By emailError = By.id("email_help");
    private final By passwordError = By.id("password_help");
    private final By confirmPasswordError = By.id("confirmPassword_help");

    private final By agreeCheck = By.id("agreeToTerms");
    private final By signUpButton = By.cssSelector("button[type='submit']");
//    private final By errorMessage = By.cssSelector("[data-test='error']");
    private final By errorMessage = By.className("ant-notification-notice-message");

    // constructors
    public SignUpPage(WebDriver driver) {
        super(driver);
    }

    // methods
    public void navigateToSignUpPage() {
        driver.get("http://localhost:5173/register");
    }

    public boolean isSignUpPageDisplayed() {
        WebElement signUpElement = wait.until(ExpectedConditions.visibilityOfElementLocated(signUpButton));
        String text = signUpElement.getText();
        return text.contains("Create Account");
    }

    public void signUp(String username, String email, String password, String confirmPassword) {
        WebElement usernameElement = wait.until(ExpectedConditions.visibilityOfElementLocated(usernameField));
        WebElement emailElement = wait.until(ExpectedConditions.visibilityOfElementLocated(emailField));
        WebElement passwordElement = wait.until(ExpectedConditions.visibilityOfElementLocated(passwordField));
        WebElement confirmPasswordElement = wait.until(ExpectedConditions.visibilityOfElementLocated(confirmPasswordField));
        WebElement signUpElement = wait.until(ExpectedConditions.elementToBeClickable(signUpButton));
        WebElement agreeElement = driver.findElement(this.agreeCheck);

        this.sendKeys(usernameElement, username);
        this.sendKeys(emailElement, email);
        this.sendKeys(passwordElement, password);
        this.sendKeys(confirmPasswordElement, confirmPassword);
        agreeElement.click();
        this.click(signUpElement);
    }

    public String getUsernameError() {
        WebElement errorElement = wait.until(ExpectedConditions.visibilityOfElementLocated(this.usernameError));
        return errorElement.getText();
    }

    public String getEmailError() {
        WebElement errorElement = wait.until(ExpectedConditions.visibilityOfElementLocated(this.emailError));
        return errorElement.getText();
    }

    public String getPasswordError(){
        WebElement errorElement = wait.until(ExpectedConditions.visibilityOfElementLocated(this.passwordError));
        return errorElement.getText();
    }

    public String getConfirmPasswordError(){
        WebElement errorElement = wait.until(ExpectedConditions.visibilityOfElementLocated(this.confirmPasswordError));
        return errorElement.getText();
    }

    public String getErrorMessage() {
        WebElement errorElement = wait.until(ExpectedConditions.visibilityOfElementLocated(errorMessage));
        return this.getText(errorElement);
    }
}
