package edit;

import junit.framework.TestCase;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.*;
import util.Parameters;


/**
 * Testet ob man öffentliche Hefte anderer Benutzer einsehen kann
 */
public class Notebook extends TestCase{
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
     * Testet ob ein Heft geöffnet werden kann
     * @throws Exception
     */
    @Test
    public void testOpenNotebook() throws Exception {
        driver.get(baseUrl + "/management");
        driver.findElement(By.partialLinkText("Hefte")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.xpath("//*[contains(text(), 'Test1')]")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
    }



    /**
     * Testet ob Seitennummern vorhanden sind
     * @throws Exception
     */
    @Test
    public void testNotebookPageNumbers() throws Exception {
        driver.get(baseUrl + "/management");
        driver.findElement(By.partialLinkText("Hefte")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.xpath("//*[contains(text(), 'Test1')]")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        String page = driver.getPageSource();
        // Testet ob im String die Seitennummern enthalten sind
        // Es wird davon ausgegangen, dass man sich am Anfang des Heftes befindet
        if(!page.contains("1")) throw new NotFoundException();

    }

    /**
     * Testet ob nach vorne geblättert werden kann
     * @throws Exception
     */
    @Test
    public void testNotebookPageTurnForward() throws Exception {
        driver.get(baseUrl + "/management");
        driver.findElement(By.partialLinkText("Hefte")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.xpath("//*[contains(text(), 'Test1')]")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.id("turn_left_fast")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.id("turn_right")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        String page = driver.getPageSource();
        // Testet ob im String die Seitennummern enthalten sind
        if(!page.contains("2")) throw new NotFoundException();

    }

    /**
     * Testet ob zurück geblättert werden kann
     * @throws Exception
     */
    @Test
    public void testNotebookPageTurnBackward() throws Exception {
        driver.get(baseUrl + "/management");
        driver.findElement(By.partialLinkText("Hefte")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.xpath("//*[contains(text(), 'Test1')]")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.id("turn_left_fast")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.id("turn_right")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.id("turn_left")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        String page = driver.getPageSource();
        // Testet ob im String die Seitennummern enthalten sind
        if(!page.contains("1")) throw new NotFoundException();

    }

    /**
     * Testet ob zum Ende des Heftes geblättert werden kann
     * @throws Exception
     */
    @Test
    public void testNotebookJumpToEnd() throws Exception {
        driver.get(baseUrl + "/management");
        driver.findElement(By.partialLinkText("Hefte")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.xpath("//*[contains(text(), 'Test1')]")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.id("turn_left_fast")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.id("turn_right_fast")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        String page = driver.getPageSource();
        // Testet ob im String die Seitennummern enthalten sind
        // Es wird davon ausgegangen, dass man sich am Anfang des Heftes befindet
        if(!page.contains("2") && page.contains("6")) throw new NotFoundException();

    }

    /**
     * Testet ob zum Anfang des Heftes geblättert werden kann
     * @throws Exception
     */
    @Test
    public void testNotebookPageJumpToStart() throws Exception {
        driver.get(baseUrl + "/management");
        driver.findElement(By.partialLinkText("Hefte")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.xpath("//*[contains(text(), 'Test1')]")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.id("turn_left_fast")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        String page = driver.getPageSource();
        // Testet ob im String die Seitennummern enthalten sind
        if(!page.contains("1")) throw new NotFoundException();

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