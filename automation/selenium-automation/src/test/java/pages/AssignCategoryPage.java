package pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import utils.TestData;

public class AssignCategoryPage extends BasePage {
    private final By editButton = By.xpath("//*[@id=\"root\"]/div/main/div/main/div[3]/div[1]/div/div/div[2]/button");
    private final By dropDown = By.xpath("//*[@id=\"root\"]/div/main/div/main/div[3]/div[1]/div/div/div[1]/div[3]/div/div");
    private final By categoryOption = By.xpath("/html/body/div[3]/div/div/div[2]/div/div/div/div[1]");
    private final By saveButton = By.xpath("//*[@id=\"root\"]/div/main/div/main/div[3]/div[1]/div/div/div[2]/div/div[1]/button");

    private final By categoryTag = By.xpath("//*[@id=\"root\"]/div/main/div/main/div[3]/div[1]/div/div/div[1]/div[3]/div/div/span");

    // constructors
    public AssignCategoryPage(WebDriver driver) {
        super(driver);
    }

    // methods
    public void navigateToPage() {
        driver.get(TestData.EnvData.BASE_URL + "/assign-product-categories");
    }

    public boolean isPageDisplayed() {
        WebElement editButtonElement = wait.until(ExpectedConditions.visibilityOfElementLocated(this.editButton));
        String text = editButtonElement.getText();
        return text.contains("Edit Categories");
    }

    public String getCategoryTagText(){
        WebElement editButtonElement = wait.until(ExpectedConditions.visibilityOfElementLocated(this.categoryTag));
        return editButtonElement.getText();
    }

    public void assignCategory() {
        WebElement editElement = wait.until(ExpectedConditions.visibilityOfElementLocated(this.editButton));
        editElement.click();

        WebElement dropDownElement = wait.until(ExpectedConditions.visibilityOfElementLocated(this.dropDown));
        dropDownElement.click();

        WebElement optionElement = wait.until(ExpectedConditions.visibilityOfElementLocated(this.categoryOption));
        optionElement.click();

        WebElement saveElement = wait.until(ExpectedConditions.visibilityOfElementLocated(this.saveButton));
        saveElement.click();
    }
}
