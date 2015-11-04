package admin;

import junit.framework.TestCase;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.*;
import util.Parameters;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


/**
 * Testet das Usermanagement
 */
public class UserManagement extends TestCase{
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
     * Testet ob ein User mithilfe der Suche gefunden werden kann
     * @throws Exception
     */
    @Test
    public void testUserSearch() throws Exception {
        driver.get(baseUrl + "/admin");
        driver.findElement(By.id("search")).clear();
        driver.findElement(By.id("search")).sendKeys("test@test.test");
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        String page = driver.getPageSource();
        int matches = 0;
        Matcher matcher = Pattern.compile("\\btest@test.test\\b").matcher(page);
        while (matcher.find()) matches++;
        if(matches < 2) throw new NotFoundException();
    }

    /**
     * Testet ob ein User gelöscht werden kann
     * @throws Exception
     */
    @Test
    public void testUserDelete() throws Exception {
        driver.get(baseUrl + "/admin");
        driver.findElement(By.id("search")).clear();
        driver.findElement(By.id("search")).sendKeys("vorname");
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        List<WebElement> btn = driver.findElements(By.xpath("//*[contains(text(), 'Account löschen')]"));
        String page = driver.getPageSource();
        int before = 0;
        Matcher matcher = Pattern.compile("Vorname[0-9]{0,4}").matcher(page);
        while (matcher.find()) before++;
        System.out.print(before);
        btn.get(0).click();
        closeAlertAndGetItsText();
        closeAlertAndGetItsText();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        page = driver.getPageSource();
        int after = 0;
        matcher = Pattern.compile("Vorname[0-9]{0,4}").matcher(page);
        while (matcher.find()) after++;
        System.out.println(before + " / "+after);
        if(after == before-1) throw new Exception("Falsche Anzahl");
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