package mainpage;

import junit.framework.TestCase;
import org.junit.*;
import org.openqa.selenium.*;
import util.Parameters;

import javax.swing.*;
import java.util.Random;


/**
 * Testet die Registrierung
 */
public class RegisterUser extends TestCase{
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
        driver.findElement(By.id("lang_de")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
    }

    /**
     * Testet ob falls nichts beim Registrieren eingegeben wird alle Fehlermeldungen Angezeigt werden
     * @throws Exception
     */
    @Test
    public void testAllFalse() throws Exception {
        driver.get(baseUrl + "/");
        driver.findElement(By.name("submit")).click();
        //Search for Error Messages
        WebElement body = driver.findElement(By.tagName("body"));
        String bodyText = body.getText();
        if(!bodyText.contains("Bitte gib deinen Vornamen an.")) throw new NotFoundException();
        if(!bodyText.contains("Bitte gib deinen Nachnamen an.")) throw new NotFoundException();
        if(!bodyText.contains("Bitte gib deine E-Mail Adresse ein.")) throw new NotFoundException();
        if(!bodyText.contains("Bitte gib dein Passwort ein.")) throw new NotFoundException();
        if(!bodyText.contains("Bitte gib dein Passwort nochmal an.")) throw new NotFoundException();
        if(!bodyText.contains("Bitte akzeptiere unsere Nutzungsbedingungen.")) throw new NotFoundException();
        if(!bodyText.contains("Bitte löse das Captcha.")) throw new NotFoundException();
    }

    /**
     * Testet ob die Email Adresse bereits in Verwendung ist bzw. ob der Fehler angezeigt wird
     * @throws Exception
     */
    @Test
    public void testEmailAlreadyInUse() throws Exception {
        driver.get(baseUrl + "/");
        driver.findElement(By.name("firstname")).clear();
        driver.findElement(By.name("firstname")).sendKeys("Vorname1");
        driver.findElement(By.name("lastname")).clear();
        driver.findElement(By.name("lastname")).sendKeys("Nachname1");
        driver.findElement(By.name("email")).clear();
        driver.findElement(By.name("email")).sendKeys("test@test.test");
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
        if(!page.contains("Diese E-Mail Adresse wird bereits verwendet!")) throw new NotFoundException();
    }

    /**
     * Testet ob ein Error ausgegeben wird falls das Passwort zu kurz ist
     * @throws Exception
     */
    @Test
    public void testPasswordToShort() throws Exception {
        driver.get(baseUrl + "/");
        driver.findElement(By.name("pwd")).clear();
        driver.findElement(By.name("pwd")).sendKeys("1234");
        WebElement body = driver.findElement(By.tagName("body"));
        String bodyText = body.getText();
        if(!bodyText.contains("Das Passwort ist zu kurz (mind. 8 Zeichen).")) throw new NotFoundException();
        driver.findElement(By.name("pwd")).sendKeys("1234");
        body = driver.findElement(By.tagName("body"));
        bodyText = body.getText();
        if(bodyText.contains("Das Passwort ist zu kurz (mind. 8 Zeichen).")) throw new NotFoundException();
    }

    /**
     * Testet ob ein Fehler ausgegeben wird falls die Passwörter nicht übereinstimmen
     * @throws Exception
     */
    @Test
    public void testPasswordsNotEqual() throws Exception {
        driver.get(baseUrl + "/");
        driver.findElement(By.name("pwd")).clear();
        driver.findElement(By.name("pwd")).sendKeys("123456789");
        driver.findElement(By.name("pwd_repeat")).clear();
        driver.findElement(By.name("pwd_repeat")).sendKeys("12345678");
        driver.findElement(By.name("submit")).click();
        WebElement body = driver.findElement(By.tagName("body"));
        String bodyText = body.getText();
        if(!bodyText.contains("Passwörter stimmen nicht überein!")) throw new NotFoundException();
    }

    /**
     * Testet ob ein Account erstellt wird (gibt alles richtig ein)
     * @throws Exception
     */
    @Test
    public void testRegister() throws Exception {
        Random randomGenerator = new Random();
        int randomInt = randomGenerator.nextInt(1000);
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