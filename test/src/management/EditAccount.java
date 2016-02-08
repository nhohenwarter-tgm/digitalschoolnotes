package management;

import junit.framework.TestCase;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.*;
import util.Parameters;


/**
 * Testet die Optionen eines Accounts
 */
public class EditAccount extends TestCase{
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
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.get(baseUrl + "/login");
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.name("email")).clear();
        driver.findElement(By.name("email")).sendKeys("test@test.test");
        driver.findElement(By.name("pwd")).sendKeys("12341234");
        driver.findElement(By.id("submit")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.id("lang_de")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
    }

    /**
     * Testet ob ein Heft erstellt werden kann
     * @throws Exception
     */
    @Test
    public void testEditName() throws Exception {
        driver.get(baseUrl + "/management");
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.partialLinkText("Settings")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.name("first_name")).clear();
        driver.findElement(By.name("first_name")).sendKeys("Test_firstname");
        driver.findElement(By.name("last_name")).clear();
        driver.findElement(By.name("last_name")).sendKeys("Test_lastname");
        driver.findElement(By.name("old_pwd")).clear();
        driver.findElement(By.name("old_pwd")).sendKeys("12341234");
        driver.findElement(By.id("submit")).click();

        driver.findElement(By.id("search")).clear();
        driver.findElement(By.id("search")).sendKeys("test@test.test");
        driver.findElement(By.id("searchbtn")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.partialLinkText("test@test.test")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        String page = driver.getPageSource();
        if (!page.contains("Test_firstname")) throw new NotFoundException();
    }

    /**
     * Testet ob ein Heftname verändert werden kann
     * @throws Exception
     */
    @Test
    public void testEditEmail() throws Exception {
        driver.get(baseUrl + "/management");
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.partialLinkText("Settings")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.name("email")).clear();
        driver.findElement(By.name("email")).sendKeys("test@test.test");
        driver.findElement(By.name("old_pwd")).clear();
        driver.findElement(By.name("old_pwd")).sendKeys("12341234");
        driver.findElement(By.id("submit")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);

        driver.findElement(By.id("search")).clear();
        driver.findElement(By.id("search")).sendKeys("test@test.test");
        driver.findElement(By.id("searchbtn")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        String page = driver.getPageSource();
        if (!page.contains("test@test.test")) throw new NotFoundException();
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