package management;

import junit.framework.TestCase;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.omg.CosNaming.NamingContextPackage.NotFound;
import org.openqa.selenium.*;
import util.Parameters;

import javax.swing.*;
import java.util.Random;

/**
 * Testet ob der Benutzer seinen eigenen Account löschen kann
 */
public class DeleteAccount extends TestCase{
    private WebDriver driver;
    private String baseUrl;
    private boolean acceptNextAlert = true;
    private StringBuffer verificationErrors = new StringBuffer();
    private String username;

    /**
     * Erstellt einen User der gelöscht werden soll
     * @throws Exception
     */
    @Before
    public void setUp() throws Exception {
        Parameters.setUpBrowser();
        this.driver = Parameters.driver;
        this.baseUrl = Parameters.baseUrl;
        Random randomGenerator = new Random();
        int randomInt = randomGenerator.nextInt(1000);
        username = "vorname"+randomInt+"@nachname"+randomInt+".test";
        driver.get(baseUrl + "/");
        driver.findElement(By.name("firstname")).clear();
        driver.findElement(By.name("firstname")).sendKeys("Vorname"+randomInt);
        driver.findElement(By.name("lastname")).clear();
        driver.findElement(By.name("lastname")).sendKeys("Nachname"+randomInt);
        driver.findElement(By.name("email")).clear();
        driver.findElement(By.name("email")).sendKeys("vorname"+randomInt+"@nachname"+randomInt+".test");
        driver.findElement(By.name("pwd")).clear();
        driver.findElement(By.name("pwd")).sendKeys("12345678");
        driver.findElement(By.name("pwd_repeat")).clear();
        driver.findElement(By.name("pwd_repeat")).sendKeys("12345678");
        driver.findElement(By.name("accept")).click();
        isElementPresent(By.id("captcha"));
        JOptionPane.showMessageDialog(null,
                "Bitte löse das Captcha. \n Du hast 5 Sekunden Zeit.",
                "Action Required!",
                JOptionPane.WARNING_MESSAGE);
        Thread.sleep(Parameters.SLEEP_CAPTCHA);
        driver.findElement(By.name("submit")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        String page = driver.getPageSource();
        if(!page.contains("Vielen Dank")) throw new NotFoundException();
        JOptionPane.showMessageDialog(null,
                "Bitte schalte den Account auf aktiviert. \n Drücke erst OK wenn der Account aktiviert wurde.",
                "Action Required!",
                JOptionPane.WARNING_MESSAGE);
        driver.get(baseUrl + "/login");
        driver.findElement(By.name("email")).clear();
        driver.findElement(By.name("email")).sendKeys(username);
        driver.findElement(By.name("pwd")).sendKeys("12345678");
        driver.findElement(By.id("submit")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        page = driver.getCurrentUrl();
        if(!page.equals(baseUrl+"/management")) throw new NotFound();
    }

    /**
     * Testet ob ein User gelöscht werden kann
     * @throws Exception
     */
    @Test
    public void testDeleteUser() throws Exception {
        driver.get(baseUrl + "/management");
        driver.findElement(By.partialLinkText("Account Settings")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.id("deleteAccount")).click();
        closeAlertAndGetItsText();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.get(baseUrl + "/login");
        driver.findElement(By.name("email")).clear();
        driver.findElement(By.name("email")).sendKeys(username);
        driver.findElement(By.name("pwd")).sendKeys("12345678");
        driver.findElement(By.id("submit")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        String page = driver.getPageSource();
        if (!page.contains("E-Mail Adresse oder Passwort falsch!")) throw new Exception("User ist nicht gelöscht");
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
