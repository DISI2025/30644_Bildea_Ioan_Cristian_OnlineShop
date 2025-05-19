package pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;

public class ForgotPasswordPage extends BasePage{
    private final By emailField = By.id("email");

    private final By emailError = By.id("email_help");

    private final By sendButton = By.cssSelector("button[type='submit']");
    private final By errorMessage = By.cssSelector("[data-test='error']");

    // constructors
    public ForgotPasswordPage(WebDriver driver) {
        super(driver);
    }

    // methods
    public void navigateToForgotPasswordPage() {
        driver.get("http://localhost:5173/forgot-password");
    }

    public boolean isForgotPasswordPageDisplayed() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(sendButton)).isDisplayed();
    }

    public void send(String email) {
        WebElement emailElement = wait.until(ExpectedConditions.visibilityOfElementLocated(emailField));
        WebElement sendElement = wait.until(ExpectedConditions.elementToBeClickable(sendButton));

        this.sendKeys(emailElement, email);
        this.click(sendElement);
    }

    public boolean isEmailError(){
        WebElement errorElement = wait.until(ExpectedConditions.visibilityOfElementLocated(this.emailError));
        return true;
    }

    public String getErrorMessage() {
        WebElement errorElement = wait.until(ExpectedConditions.visibilityOfElementLocated(errorMessage));
        return this.getText(errorElement);
    }
}
