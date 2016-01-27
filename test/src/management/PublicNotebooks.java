package management;

import junit.framework.TestCase;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.*;
import util.Parameters;


/**
 * Testet ob man öffentliche Hefte anderer Benutzer einsehen kann
 */
public class PublicNotebooks extends TestCase{
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
        driver.findElement(By.id("lang_de")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
    }

    /**
     * Testet ob ein Heft einer fremden Person geöffnet werden kann
     * @throws Exception
     */
    @Test
    public void testOpenPublicNotebook() throws Exception {
        driver.get(baseUrl + "/management");
        driver.findElement(By.id("search")).clear();
        driver.findElement(By.id("search")).sendKeys("test@test.test");
        driver.findElement(By.id("searchbtn")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.partialLinkText("test@test.test")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.xpath("//*[contains(text(), 'Test1')]")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
    }

    /**
     * Teste ob die Pagination im Notebook vorhanden ist
     * @throws Exception
     */
    @Test
    public void testPublicNotebookPagination() throws Exception {
        driver.get(baseUrl + "/management");
        driver.findElement(By.id("search")).clear();
        driver.findElement(By.id("search")).sendKeys("test@test.test");
        driver.findElement(By.id("searchbtn")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.partialLinkText("test@test.test")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.xpath("//*[contains(text(), 'Test1')]")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        String page = driver.getPageSource();
        if (!page.contains("Prev")) throw new NotFoundException();
        if (!page.contains("Next")) throw new NotFoundException();
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