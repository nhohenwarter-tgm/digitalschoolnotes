package management;

import junit.framework.TestCase;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.*;
import org.openqa.selenium.interactions.Actions;
import util.Parameters;

import java.util.Random;

/**
 * Testet ob der Benutzer ein Heft löschen kann
 */
public class DeleteNotebook extends TestCase{
    private WebDriver driver;
    private String baseUrl;
    private boolean acceptNextAlert = true;
    private StringBuffer verificationErrors = new StringBuffer();
    private String username;

    @Before
    public void setUp() throws Exception {
        Parameters.setUpBrowser();
        this.driver = Parameters.driver;
        this.baseUrl = Parameters.baseUrl;
        driver.get(baseUrl + "/");
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.get(baseUrl + "/login");
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.name("email")).clear();
        driver.findElement(By.name("email")).sendKeys("testdeletenotebook@test.test");
        driver.findElement(By.name("pwd")).sendKeys("12341234");
        driver.findElement(By.id("submit")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.id("lang_de")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
    }

    /**
     * Testet ob ein Heft gelöscht werden kann
     * @throws Exception
     */
    @Test
    public void testDeleteNotebook() throws Exception {
        driver.get(baseUrl + "/management");
        driver.findElement(By.partialLinkText("Hefte")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.className("glyphicon-plus")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        Random randomGenerator = new Random();
        int randomInt = randomGenerator.nextInt(1000);
        driver.findElement(By.name("name")).sendKeys("Test"+randomInt);
        driver.findElement(By.id("submit")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        String page = driver.getPageSource();
        if (!page.contains("Test"+randomInt)) throw new NotFoundException();

        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        Actions builder = new Actions(driver);
        builder.moveToElement(driver.findElement(By.id("Test"+randomInt))).perform();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.id("Test"+randomInt+"_delete")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.id("submit")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);

        page = driver.getPageSource();
        if (page.contains("Test"+randomInt)) throw new NotFoundException();
    }



    @After
    public void tearDown() throws Exception {
        driver.get(baseUrl + "/logout");
        driver.quit();
        String verificationErrorString = verificationErrors.toString();
        if (!"".equals(verificationErrorString)) {
            fail(verificationErrorString);
        }
    }

    private boolean isElementPresent(By by) {
        try {
            driver.findElement(by);
            return true;
        } catch (NoSuchElementException e) {
            return false;
        }
    }

    private boolean isAlertPresent() {
        try {
            driver.switchTo().alert();
            return true;
        } catch (NoAlertPresentException e) {
            return false;
        }
    }

    private String closeAlertAndGetItsText() {
        try {
            Alert alert = driver.switchTo().alert();
            String alertText = alert.getText();
            if (acceptNextAlert) {
                alert.accept();
            } else {
                alert.dismiss();
            }
            return alertText;
        } finally {
            acceptNextAlert = true;
        }
    }
}
