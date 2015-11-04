package management;

import junit.framework.TestCase;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.*;
import util.Parameters;
import java.util.Random;


/**
 * Testet die Optionen eines Heftes wie etwa den Namen oder die Sichtbarkeit
 */
public class NotebookOptions extends TestCase{
    private WebDriver driver;
    private String baseUrl;
    private boolean acceptNextAlert = true;
    private StringBuffer verificationErrors = new StringBuffer();

    @Before
    public void setUp() throws Exception {
        Parameters.setUpBrowser();
        this.driver = Parameters.driver;
        this.baseUrl = Parameters.baseUrl;
        driver.get(baseUrl + "/");
        driver.get(baseUrl + "/login");
        driver.findElement(By.name("email")).clear();
        driver.findElement(By.name("email")).sendKeys("test@test.test");
        driver.findElement(By.name("pwd")).sendKeys("12341234");
        driver.findElement(By.id("submit")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
    }

    /**
     * Testet ob ein Heft erstellt werden kann
     * @throws Exception
     */
    @Test
    public void testCreate() throws Exception {
        driver.get(baseUrl + "/management");
        driver.findElement(By.partialLinkText("Notebooks")).click();
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
    }

    /**
     * Testet ob ein Heft verändert werden kann
     * @throws Exception
     */
    @Test
    public void testEdit() throws Exception {
        driver.get(baseUrl + "/management/notebook_edit/563749feda532b693ff443e8");
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.name("name")).clear();
        driver.findElement(By.name("name")).sendKeys("TestEdit");
        driver.findElement(By.id("submit")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        String page = driver.getPageSource();
        if (!page.contains("TestEdit")) throw new NotFoundException();
        driver.get(baseUrl + "management/notebook_edit/563749feda532b693ff443e8");
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.name("name")).clear();
        driver.findElement(By.name("name")).sendKeys("Test1");
        driver.findElement(By.id("submit")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
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