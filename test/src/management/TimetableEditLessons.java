package management;

import junit.framework.TestCase;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.*;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.Select;
import util.Parameters;

import javax.swing.*;
import java.util.Random;


/**
 * Testet ob Stunden zum Stundenplan hinzugefügt werden können
 */
public class TimetableEditLessons extends TestCase{
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
        driver.findElement(By.name("email")).sendKeys("test@test.test");
        driver.findElement(By.name("pwd")).sendKeys("12341234");
        driver.findElement(By.id("submit")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.id("lang_de")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
    }

    /**
     * Testet ob ein Fach im Stundenplan angelegt werden kann
     * @throws Exception
     */
    @Test
    public void testEditLesson() throws Exception {
        driver.get(baseUrl + "/management");
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        Actions builder = new Actions(driver);
        builder.moveToElement(driver.findElement(By.id("times_1"))).perform();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.id("timetableToggleEdit")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.id("lesson_monday_1")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);

        driver.findElement(By.name("subject")).clear();
        driver.findElement(By.name("subject")).sendKeys("SYT");
        driver.findElement(By.name("teacher")).clear();
        driver.findElement(By.name("teacher")).sendKeys("BORM");
        driver.findElement(By.name("room")).clear();
        driver.findElement(By.name("room")).sendKeys("H666");
        driver.findElement(By.id("submit")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.id("exit_editmode")).click();

        boolean bool = true;
        assertFalse(!driver.findElement(By.xpath("//*[contains(text(), 'SYT')]")).isDisplayed());
        assertFalse(!driver.findElement(By.xpath("//*[contains(text(), 'BORM')]")).isDisplayed());
        assertFalse(!driver.findElement(By.xpath("//*[contains(text(), 'H666')]")).isDisplayed());
        Thread.sleep(Parameters.SLEEP_PAGELOAD);

        builder.moveToElement(driver.findElement(By.id("times_1"))).perform();
        driver.findElement(By.id("timetableToggleEdit")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.id("lesson_monday_1")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);

        driver.findElement(By.name("subject")).clear();
        driver.findElement(By.name("teacher")).clear();
        driver.findElement(By.name("room")).clear();
        driver.findElement(By.id("submit")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.id("exit_editmode")).click();

        assertTrue(bool);
    }

    /**
     * Testet ob die Anfangs- und Endzeit einer Stunde verändert werden kann
     * @throws Exception
     */
    @Test
    public void testEditLessonTime() throws Exception {
        driver.get(baseUrl + "/management");
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        Actions builder = new Actions(driver);
        builder.moveToElement(driver.findElement(By.id("times_1"))).perform();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.id("timetableToggleEdit")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.id("times_1")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);

        driver.findElement(By.name("z1")).clear();
        driver.findElement(By.name("z1")).sendKeys("13:37");
        driver.findElement(By.name("z2")).clear();
        driver.findElement(By.name("z2")).sendKeys("13:38");
        driver.findElement(By.id("submitTimes")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.id("exit_editmode")).click();

        boolean bool = true;
        assertFalse(!driver.findElement(By.xpath("//*[contains(text(), '13:37')]")).isDisplayed());
        assertFalse(!driver.findElement(By.xpath("//*[contains(text(), '13:38')]")).isDisplayed());
        Thread.sleep(Parameters.SLEEP_PAGELOAD);

        builder.moveToElement(driver.findElement(By.id("times_1"))).perform();
        driver.findElement(By.id("timetableToggleEdit")).click();
        driver.findElement(By.id("times_1")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.name("z1")).clear();
        driver.findElement(By.name("z1")).sendKeys("08:00");
        driver.findElement(By.name("z2")).clear();
        driver.findElement(By.name("z2")).sendKeys("08:50");
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.id("submitTimes")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.id("exit_editmode")).click();

        assertTrue(bool);
    }

    /**
     * Testet ob ein Heft durch den Klick auf eine Stunde im Stundenplan geöffnet werden kann
     * @throws Exception
     */
    @Test
    public void testOpenNotebookFromLesson() throws Exception {
        driver.get(baseUrl + "/management");
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        Actions builder = new Actions(driver);
        builder.moveToElement(driver.findElement(By.id("times_1"))).perform();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.id("timetableToggleEdit")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.id("lesson_monday_1")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);

        driver.findElement(By.name("subject")).clear();
        driver.findElement(By.name("subject")).sendKeys("SYT");
        driver.findElement(By.name("teacher")).clear();
        driver.findElement(By.name("teacher")).sendKeys("BORM");
        driver.findElement(By.name("room")).clear();
        driver.findElement(By.name("room")).sendKeys("H666");
        Select select = new Select(driver.findElement(By.name("notebook")));
        select.selectByVisibleText("Test1");
        driver.findElement(By.id("submit")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.id("exit_editmode")).click();
        driver.findElement(By.id("lesson_monday_1")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);

        String page = driver.getPageSource();
        if(!page.contains("Test1")) throw new NotFoundException();

        driver.get(baseUrl + "/management");
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        builder.moveToElement(driver.findElement(By.id("times_1"))).perform();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.id("timetableToggleEdit")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.id("lesson_monday_1")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);

        driver.findElement(By.name("subject")).clear();
        driver.findElement(By.name("subject")).sendKeys("SYT");
        driver.findElement(By.name("teacher")).clear();
        driver.findElement(By.name("teacher")).sendKeys("BORM");
        driver.findElement(By.name("room")).clear();
        driver.findElement(By.name("room")).sendKeys("H666");
        select = new Select(driver.findElement(By.name("notebook")));
        select.selectByVisibleText("Kein Heft zugeordnet");
        driver.findElement(By.id("submit")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.id("exit_editmode")).click();
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