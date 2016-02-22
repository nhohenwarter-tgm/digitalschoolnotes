package management;

import junit.framework.TestCase;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.*;
import util.Parameters;

import javax.swing.*;


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
        driver.findElement(By.name("email")).sendKeys("testusersettings@mailinator.com");
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
        driver.findElement(By.partialLinkText("Kontoeinstellungen")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.name("first_name")).clear();
        driver.findElement(By.name("first_name")).sendKeys("Test_firstname");
        driver.findElement(By.name("last_name")).clear();
        driver.findElement(By.name("last_name")).sendKeys("Test_lastname");
        driver.findElement(By.id("submit_data")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.id("pwd_confirm")).sendKeys("12341234");
        driver.findElement(By.id("submit_confirm")).click();
        driver.findElement(By.id("close")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);

        driver.findElement(By.id("search")).clear();
        driver.findElement(By.id("search")).sendKeys("testusersettings@mailinator.com");
        driver.findElement(By.id("searchbtn")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.partialLinkText("testusersettings@mailinator.com")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        String page = driver.getPageSource();
        if (!page.contains("Test_firstname")) throw new NotFoundException();
        if (!page.contains("Test_lastname")) throw new NotFoundException();

        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.partialLinkText("Kontoeinstellungen")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.name("first_name")).clear();
        driver.findElement(By.name("first_name")).sendKeys("Test");
        driver.findElement(By.name("last_name")).clear();
        driver.findElement(By.name("last_name")).sendKeys("Test");
        driver.findElement(By.id("submit_data")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.id("pwd_confirm")).sendKeys("12341234");
        driver.findElement(By.id("submit_confirm")).click();
        driver.findElement(By.id("close")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
    }

    /**
     * Testet ob ein Heftname verändert werden kann
     * @throws Exception
     */
    @Test
    public void testEditEmail() throws Exception {
        driver.get(baseUrl + "/management");
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.partialLinkText("Kontoeinstellungen")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.name("email")).clear();
        driver.findElement(By.name("email")).sendKeys("dsn@mailinator.com");
        driver.findElement(By.id("submit_data")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.id("pwd_confirm")).sendKeys("12341234");
        driver.findElement(By.id("submit_confirm")).click();
        driver.findElement(By.id("close")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        JOptionPane.showMessageDialog(null,
                "Bitte schalte den Account auf aktiviert. \n Drücke erst OK wenn der Account aktiviert wurde.(dsn@mailinator.com)",
                "Action Required!",
                JOptionPane.WARNING_MESSAGE);

        driver.get(baseUrl + "/");
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.get(baseUrl + "/login");
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.name("email")).clear();
        driver.findElement(By.name("email")).sendKeys("dsn@mailinator.com");
        driver.findElement(By.name("pwd")).sendKeys("12341234");
        driver.findElement(By.id("submit")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.id("lang_de")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.id("search")).clear();
        driver.findElement(By.id("search")).sendKeys("dsn@mailinator.com");
        driver.findElement(By.id("searchbtn")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.partialLinkText("dsn@mailinator.com")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        String page = driver.getPageSource();
        if (!page.contains("dsn@mailinator.com")) throw new NotFoundException();

        driver.findElement(By.partialLinkText("Kontoeinstellungen")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.name("email")).clear();
        driver.findElement(By.name("email")).sendKeys("testusersettings@mailinator.com");
        driver.findElement(By.id("submit_data")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.id("pwd_confirm")).sendKeys("12341234");
        driver.findElement(By.id("submit_confirm")).click();
        driver.findElement(By.id("close")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        JOptionPane.showMessageDialog(null,
                "Bitte schalte den Account auf aktiviert. \n Drücke erst OK wenn der Account aktiviert wurde.",
                "Action Required!",
                JOptionPane.WARNING_MESSAGE);
    }

    /**
     * Testet ob ein Heft erstellt werden kann
     * @throws Exception
     */
    @Test
    public void testEditPassword() throws Exception {
        driver.get(baseUrl + "/management");
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.partialLinkText("Kontoeinstellungen")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.id("pwd")).clear();
        driver.findElement(By.id("pwd")).sendKeys("12345678");
        driver.findElement(By.id("pwdrepeat")).clear();
        driver.findElement(By.id("pwdrepeat")).sendKeys("12345678");
        driver.findElement(By.id("submit_password")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.id("pwd_confirm")).sendKeys("12341234");
        driver.findElement(By.id("submit_confirm")).click();
        driver.findElement(By.id("close")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);

        driver.findElement(By.partialLinkText("Abmelden")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);

        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.get(baseUrl + "/login");
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.name("email")).clear();
        driver.findElement(By.name("email")).sendKeys("testusersettings@mailinator.com");
        driver.findElement(By.name("pwd")).sendKeys("12345678");
        driver.findElement(By.id("submit")).click();

        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.partialLinkText("Kontoeinstellungen")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.id("pwd")).clear();
        driver.findElement(By.id("pwd")).sendKeys("12341234");
        driver.findElement(By.id("pwdrepeat")).clear();
        driver.findElement(By.id("pwdrepeat")).sendKeys("12341234");
        driver.findElement(By.id("submit_password")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.id("pwd_confirm")).sendKeys("12345678");
        driver.findElement(By.id("submit_confirm")).click();
        driver.findElement(By.id("close")).click();
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