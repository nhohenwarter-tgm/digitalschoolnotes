package mainpage;

import junit.framework.TestCase;
import org.apache.jasper.tagplugins.jstl.core.Param;
import org.junit.*;
import org.openqa.selenium.*;
import util.Parameters;

import javax.swing.*;
import java.util.Random;

/**
 * Testet das Zurücksetzen des Passwortes
 */
public class ResetPassword extends TestCase{
    private WebDriver driver;
    private String baseUrl;
    private boolean acceptNextAlert = true;
    private StringBuffer verificationErrors = new StringBuffer();

    @Before
    public void setUp() throws Exception {
        Parameters.setUpBrowser();
        this.driver = Parameters.driver;
        this.baseUrl = Parameters.baseUrl;
        driver.get(baseUrl+'/');
    }

    /**
     * Testet ob Fehlermeldungen angezeigt werden, wenn keine E-Mail Adresse eingegeben wird und das Captcha nicht gelöst wird
     * @throws Exception
     */
    @Test
    public void testReqAllWrong() throws Exception {
        driver.get(baseUrl + "/login");
        driver.findElement(By.linkText("Passwort vergessen?")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.id("submit")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        //Search for Error Messages
        String page = driver.getPageSource();
        if(!page.contains("Bitte gib deine E-Mail Adresse an.")) throw new NotFoundException();
        if(!page.contains("Bitte löse das Captcha.")) throw new NotFoundException();
    }

    /**
     * Testet ob ein Fehler angezeigt wird, wenn die E-Mail Adresse keinem User zugeordnet werden kann
     * @throws Exception
     */
    @Test
    public void testReqEmailInvalid() throws Exception {
        driver.get(baseUrl + "/login");
        driver.findElement(By.linkText("Passwort vergessen?")).click();
        driver.findElement(By.name("email")).clear();
        driver.findElement(By.name("email")).sendKeys("a@a.a");
        JOptionPane.showMessageDialog(null,
                "Bitte löse das Captcha. \n Du hast 5 Sekunden Zeit.",
                "Action Required!",
                JOptionPane.WARNING_MESSAGE);
        Thread.sleep(Parameters.SLEEP_CAPTCHA);
        driver.findElement(By.id("submit")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        String page = driver.getPageSource();
        if(!page.contains("E-Mail Adresse ist nicht korrekt.")) throw new NotFoundException();
    }

    /**
     * Testet ob eine Erfolgsmeldung nach richtigem Ausfüllen kommt
     * @throws Exception
     */
    @Test
    public void testReqSuccess() throws Exception {
        driver.get(baseUrl + "/login");
        driver.findElement(By.linkText("Passwort vergessen?")).click();
        driver.findElement(By.name("email")).clear();
        driver.findElement(By.name("email")).sendKeys(Parameters.testingEmail);
        JOptionPane.showMessageDialog(null,
                "Bitte löse das Captcha. \n Du hast 5 Sekunden Zeit.",
                "Action Required!",
                JOptionPane.WARNING_MESSAGE);
        Thread.sleep(Parameters.SLEEP_CAPTCHA);
        driver.findElement(By.id("submit")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        String page = driver.getPageSource();
        if(!page.contains("erfolgreich")) throw new NotFoundException();
    }

    /**
     * Testet ob Fehlermeldungen angezeigt werden, wenn in die Formularfelder nichts eingegeben wird
     * @throws Exception
     */
    @Test
    public void testResetAllWrong() throws Exception {
        driver.get(baseUrl + "/login");
        driver.findElement(By.linkText("Passwort vergessen?")).click();
        Thread.sleep(Parameters.SLEEP_CAPTCHA);
        driver.findElement(By.name("email")).clear();
        driver.findElement(By.name("email")).sendKeys(Parameters.testingEmail);
        isElementPresent(By.id("captcha"));
        JOptionPane.showMessageDialog(null,
                "Bitte löse das Captcha. \n Du hast 5 Sekunden Zeit.",
                "Action Required!",
                JOptionPane.WARNING_MESSAGE);
        Thread.sleep(Parameters.SLEEP_CAPTCHA);
        driver.findElement(By.id("submit")).click();
        String hash = JOptionPane.showInputDialog(null, "Eine E-Mail sollte nun an "
                                + Parameters.testingEmail + " verschickt worden sein.\n" +
                                "Bitte gib hier den Link in dieser E-Mail ein.");
        driver.get(baseUrl + hash.split(".com")[1]);
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        String page = driver.getPageSource();
        if(!page.contains("Bitte gib dein Passwort an.")) throw new NotFoundException();
        if(!page.contains("Bitte gib dein Passwort nochmal an.")) throw new NotFoundException();
    }

    /**
     * Testet ob Fehlermeldungen angezeigt werden, wenn das neue Passwort zu kurz oder zu lang ist
     * @throws Exception
     */
    @Test
    public void testResetPasswordTooShortOrTooLong() throws Exception {
        driver.get(baseUrl + "/login");
        driver.findElement(By.linkText("Passwort vergessen?")).click();
        driver.findElement(By.name("email")).clear();
        driver.findElement(By.name("email")).sendKeys(Parameters.testingEmail);
        isElementPresent(By.id("captcha"));
        JOptionPane.showMessageDialog(null,
                "Bitte löse das Captcha. \n Du hast 5 Sekunden Zeit.",
                "Action Required!",
                JOptionPane.WARNING_MESSAGE);
        Thread.sleep(Parameters.SLEEP_CAPTCHA);
        driver.findElement(By.id("submit")).click();
        String hash = JOptionPane.showInputDialog(null, "Eine E-Mail sollte nun an "
                + Parameters.testingEmail + " verschickt worden sein.\n" +
                "Bitte gib hier den Link in dieser E-Mail ein.");
        driver.get(baseUrl + hash.split(".com")[1]);
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.id("pwd")).clear();
        driver.findElement(By.id("pwd")).sendKeys(new String(new char[7]).replace("\0", "a"));
        driver.findElement(By.id("submit")).click();
        String page = driver.getPageSource();
        if(!page.contains("Das Passwort ist zu kurz (mind. 8 Zeichen).")) throw new NotFoundException();
        driver.findElement(By.id("pwd")).clear();
        driver.findElement(By.id("pwd")).sendKeys(new String(new char[129]).replace("\0", "a"));
        driver.findElement(By.id("submit")).click();
        page = driver.getPageSource();
        if(!page.contains("Das Passwort ist zu lang (max. 128 Zeichen).")) throw new NotFoundException();
    }

    /**
     * Testet ob eine Fehlermeldung angezeigt wird, wenn die Passwörter nicht überein stimmen
     * @throws Exception
     */
    @Test
    public void testResetPasswordsDontMatch() throws Exception {
        driver.get(baseUrl + "/login");
        driver.findElement(By.linkText("Passwort vergessen?")).click();
        driver.findElement(By.name("email")).clear();
        driver.findElement(By.name("email")).sendKeys(Parameters.testingEmail);
        isElementPresent(By.id("captcha"));
        JOptionPane.showMessageDialog(null,
                "Bitte löse das Captcha. \n Du hast 5 Sekunden Zeit.",
                "Action Required!",
                JOptionPane.WARNING_MESSAGE);
        Thread.sleep(Parameters.SLEEP_CAPTCHA);
        driver.findElement(By.id("submit")).click();
        String hash = JOptionPane.showInputDialog(null, "Eine E-Mail sollte nun an "
                + Parameters.testingEmail + " verschickt worden sein.\n" +
                "Bitte gib hier den Link in dieser E-Mail ein.");
        driver.get(baseUrl + hash.split(".com")[1]);
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.id("pwd")).clear();
        driver.findElement(By.id("pwd")).sendKeys(new String(new char[8]).replace("\0", "a"));
        driver.findElement(By.id("pwdrepeat")).clear();
        driver.findElement(By.id("pwdrepeat")).sendKeys(new String(new char[9]).replace("\0", "a"));
        driver.findElement(By.id("submit")).click();
        String page = driver.getPageSource();
        if(!page.contains("Passwörter stimmen nicht überein")) throw new NotFoundException();
    }

    /**
     * Testet ob ein neues Passwort erfolgreich gesetzt werden kann
     * @throws Exception
     */
    @Test
    public void testResetSuccess() throws Exception {
        driver.get(baseUrl + "/login");
        driver.findElement(By.linkText("Passwort vergessen?")).click();
        driver.findElement(By.name("email")).clear();
        driver.findElement(By.name("email")).sendKeys(Parameters.testingEmail);
        isElementPresent(By.id("captcha"));
        JOptionPane.showMessageDialog(null,
                "Bitte löse das Captcha. \n Du hast 5 Sekunden Zeit.",
                "Action Required!",
                JOptionPane.WARNING_MESSAGE);
        Thread.sleep(Parameters.SLEEP_CAPTCHA);
        driver.findElement(By.id("submit")).click();
        String hash = JOptionPane.showInputDialog(null, "Eine E-Mail sollte nun an "
                + Parameters.testingEmail + " verschickt worden sein.\n" +
                "Bitte gib hier den Link in dieser E-Mail ein.");
        driver.get(baseUrl + hash.split(".com")[1]);
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.id("pwd")).clear();
        driver.findElement(By.id("pwd")).sendKeys(Parameters.testingPwd);
        driver.findElement(By.id("pwdrepeat")).clear();
        driver.findElement(By.id("pwdrepeat")).sendKeys(Parameters.testingPwd);
        driver.findElement(By.id("submit")).click();
        String page = driver.getPageSource();
        if(!page.contains("Dein neues Passwort wurde erfolgreich gesetzt!")) throw new NotFoundException();
    }

    @After
    public void tearDown() throws Exception {
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
