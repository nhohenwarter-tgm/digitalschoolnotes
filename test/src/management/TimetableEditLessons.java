package management;

import junit.framework.TestCase;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.*;
import util.Parameters;


/**
 * Testet ob Stunden zum Stundenplan hinzugefügt werden können
 */
public class TimetableEditLessons extends TestCase{
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
     * Testet ob ein Heft einer fremden Person geöffnet werden kann
     * @throws Exception
     */
    @Test
    public void testEditLesson() throws Exception {
        driver.get(baseUrl + "/management");
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.id("timetableToggleEdit")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElements(By.className("timetable-td")).get(0).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);

        driver.findElement(By.name("subject")).clear();
        driver.findElement(By.name("subject")).sendKeys("Testy_Fach");
        driver.findElement(By.name("teacher")).clear();
        driver.findElement(By.name("teacher")).sendKeys("Testy_Lehrer");
        driver.findElement(By.name("room")).clear();
        driver.findElement(By.name("room")).sendKeys("Testy_Raum");
        driver.findElement(By.id("submit")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);

        boolean bool = true;
        assertFalse(!driver.findElement(By.xpath("//*[contains(text(), 'Testy_Fach')]")).isDisplayed());
        assertFalse(!driver.findElement(By.xpath("//*[contains(text(), 'Testy_Lehrer')]")).isDisplayed());
        assertFalse(!driver.findElement(By.xpath("//*[contains(text(), 'Testy_Raum')]")).isDisplayed());
        Thread.sleep(Parameters.SLEEP_PAGELOAD);

        driver.findElements(By.className("timetable-td")).get(0).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);

        driver.findElement(By.name("subject")).clear();
        driver.findElement(By.name("teacher")).clear();
        driver.findElement(By.name("room")).clear();
        driver.findElement(By.id("submit")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);

        assertTrue(bool);
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