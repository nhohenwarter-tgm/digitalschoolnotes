package mainpage;

import junit.framework.TestCase;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.omg.CosNaming.NamingContextPackage.NotFound;
import org.openqa.selenium.*;
import util.Parameters;


/**
 * Testet den Login und Logout
 */
public class Login extends TestCase{
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
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.id("lang_de")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
    }

    /**
     * Testet ob eine Fehlermeldung ausgegeben wird falls der User nicht existiert
     * @throws Exception
     */
    @Test
    public void testLoginUserInexistent() throws Exception {
        driver.get(baseUrl + "/login");
        driver.findElement(By.name("email")).clear();
        driver.findElement(By.name("email")).sendKeys("testtesttest@test.inexistent");
        driver.findElement(By.name("pwd")).sendKeys("12341234");
        driver.findElement(By.id("submit")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        String page = driver.getPageSource();
        if(!page.contains("E-Mail Adresse oder Passwort falsch!")) throw new NotFoundException();
    }

    /**
     * Testet ob eine Fehlermeldung ausgegeben wird falls keine Email Adresse angegeben wird
     * @throws Exception
     */
    @Test
    public void testNoEmail() throws Exception {
        driver.get(baseUrl + "/login");
        driver.findElement(By.name("pwd")).sendKeys("12341234");
        driver.findElement(By.id("submit")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        String page = driver.getPageSource();
        if(!page.contains("Bitte gib deine E-Mail Adresse ein.")) throw new NotFoundException();
    }

    /**
     * Testet ob eine Fehlermeldung ausgegeben wird falls kein Passwort angegeben wird
     * @throws Exception
     */
    @Test
    public void testNoPassword() throws Exception {
        driver.get(baseUrl + "/login");
        driver.findElement(By.name("email")).clear();
        driver.findElement(By.name("email")).sendKeys("testtesttest@test.inexistent");
        driver.findElement(By.id("submit")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        String page = driver.getPageSource();
        if(!page.contains("Bitte gib dein Passwort ein.")) throw new NotFoundException();
    }

    /**
     * Testet ob eine Fehlermeldung ausgegeben wird falls der User nicht validiert wurde
     * @throws Exception
     */
    @Test
    public void testInvalidUser() throws Exception {
        driver.get(baseUrl + "/login");
        driver.findElement(By.name("email")).clear();
        driver.findElement(By.name("email")).sendKeys("testinactive@test.test");
        driver.findElement(By.name("pwd")).sendKeys("12341234");
        driver.findElement(By.id("submit")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        String page = driver.getPageSource();
        if(!page.contains("Bitte bestätige zuerst deine E-Mail Adresse!")) throw new NotFoundException();
    }

    /**
     * Testet ob der Login funktioniert (alles richtig)
     * @throws Exception
     */
    @Test
    public void testLogin() throws Exception {
        driver.get(baseUrl + "/login");
        driver.findElement(By.name("email")).clear();
        driver.findElement(By.name("email")).sendKeys("test@test.test");
        driver.findElement(By.name("pwd")).sendKeys("12341234");
        driver.findElement(By.id("submit")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        String page = driver.getCurrentUrl();
        if(!page.equals(baseUrl+"/management")) throw new NotFound();
    }

    /**
     * Testet ob der Logout funktioniert
     * @throws Exception
     */
    @Test
    public void testLogout() throws Exception {
        driver.get(baseUrl + "/login");
        driver.findElement(By.name("email")).clear();
        driver.findElement(By.name("email")).sendKeys("test@test.test");
        driver.findElement(By.name("pwd")).sendKeys("12341234");
        driver.findElement(By.id("submit")).click();
        driver.get(baseUrl + "/logout");
        driver.get(baseUrl + "/management");
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        String page = driver.getPageSource();
        if(!page.contains("Bitte melde dich zuerst an!")) throw new NotFoundException();
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