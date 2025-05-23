package pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;

public class ForgotPasswordPage extends BasePage{
    private final By emailField = By.id("email");

    private final By emailError = By.id("email_help");

    private final By sendButton = By.cssSelector("button[type='submit']");
//    private final By errorMessage = By.cssSelector("[data-test='error']");
    private final By errorMessage = By.className("TODO");

    // constructors
    public ForgotPasswordPage(WebDriver driver) {
        super(driver);
    }

    // methods
    public void navigateToForgotPasswordPage() {
        driver.get("http://localhost:5173/forgot-password");
    }

    public boolean isForgotPasswordPageDisplayed() {
        WebElement sendElement = wait.until(ExpectedConditions.visibilityOfElementLocated(sendButton));
        String text = sendElement.getText();
        return text.contains("Send reset link");
    }

    public void send(String email) {
        WebElement emailElement = wait.until(ExpectedConditions.visibilityOfElementLocated(emailField));
        WebElement sendElement = wait.until(ExpectedConditions.elementToBeClickable(sendButton));

        this.sendKeys(emailElement, email);
        this.click(sendElement);
    }

    public String getEmailError(){
        WebElement errorElement = wait.until(ExpectedConditions.visibilityOfElementLocated(this.emailError));
        return errorElement.getText();
    }

    public String getErrorMessage() {
        WebElement errorElement = wait.until(ExpectedConditions.visibilityOfElementLocated(errorMessage));
        return this.getText(errorElement);
    }
}
