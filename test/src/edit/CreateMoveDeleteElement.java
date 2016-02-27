package edit;

import junit.framework.TestCase;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.*;
import util.Parameters;

import javax.swing.*;


/**
 * CRUD Elemente
 */
public class CreateMoveDeleteElement extends TestCase{
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
     * Testet ob ein Textelement erstellt und gelöscht werden kann
     * @throws Exception
     */
    @Test
    public void testCreateDeleteTextelement() throws Exception {
        driver.get(baseUrl + "/management");
        driver.findElement(By.partialLinkText("Hefte")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.xpath("//*[contains(text(), 'Test1')]")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        JOptionPane.showMessageDialog(null,
                "Bitte erstelle ein neues Textelement und drücke dann auf OK",
                "Action Required!",
                JOptionPane.WARNING_MESSAGE);
        JOptionPane.showMessageDialog(null,
                "Bitte bewege das Textelement und drücke dann OK",
                "Action Required!",
                JOptionPane.WARNING_MESSAGE);
        JOptionPane.showMessageDialog(null,
                "Bitte lösche das Textelement und drücke dann auf OK",
                "Action Required!",
                JOptionPane.WARNING_MESSAGE);
        int dialogResult = JOptionPane.showConfirmDialog (null,
                "Wurde das Element erstellt und wieder gelöscht?","Warning",JOptionPane.YES_NO_OPTION);
        if(dialogResult != JOptionPane.YES_OPTION) {
        throw new Exception("Fehler beim löschen oder erstellen des Elementes");
        }
    }

    /**
     * Testet ob ein Codeelement erstellt und gelöscht werden kann
     * @throws Exception
     */
    @Test
    public void testCreateDeleteCodeelement() throws Exception {
        driver.get(baseUrl + "/management");
        driver.findElement(By.partialLinkText("Hefte")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.xpath("//*[contains(text(), 'Test1')]")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        JOptionPane.showMessageDialog(null,
                "Bitte erstelle ein neues Codeelement und drücke dann auf OK",
                "Action Required!",
                JOptionPane.WARNING_MESSAGE);
        JOptionPane.showMessageDialog(null,
                "Bitte bewege das Codeelement und drücke dann OK",
                "Action Required!",
                JOptionPane.WARNING_MESSAGE);
        JOptionPane.showMessageDialog(null,
                "Bitte lösche das Codeelement und drücke dann auf OK",
                "Action Required!",
                JOptionPane.WARNING_MESSAGE);
        int dialogResult = JOptionPane.showConfirmDialog (null,
                "Wurde das Element erstellt und wieder gelöscht?","Warning",JOptionPane.YES_NO_OPTION);
        if(dialogResult != JOptionPane.YES_OPTION) {
            throw new Exception("Fehler beim löschen oder erstellen des Elementes");
        }
    }


    /**
     * Testet ob ein Bildelement erstellt und gelöscht werden kann
     * @throws Exception
     */
    @Test
    public void testCreateDeleteBildelement() throws Exception {
        driver.get(baseUrl + "/management");
        driver.findElement(By.partialLinkText("Hefte")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        driver.findElement(By.xpath("//*[contains(text(), 'Test1')]")).click();
        Thread.sleep(Parameters.SLEEP_PAGELOAD);
        JOptionPane.showMessageDialog(null,
                "Bitte erstelle ein neues Bildelement und drücke dann auf OK",
                "Action Required!",
                JOptionPane.WARNING_MESSAGE);
        JOptionPane.showMessageDialog(null,
                "Bitte bewege das Codeelement und drücke dann OK",
                "Action Required!",
                JOptionPane.WARNING_MESSAGE);
        JOptionPane.showMessageDialog(null,
                "Bitte lösche das Bildelement und drücke dann auf OK",
                "Action Required!",
                JOptionPane.WARNING_MESSAGE);
        int dialogResult = JOptionPane.showConfirmDialog (null,
                "Wurde das Element erstellt und wieder gelöscht?","Warning",JOptionPane.YES_NO_OPTION);
        if(dialogResult != JOptionPane.YES_OPTION) {
            throw new Exception("Fehler beim löschen oder erstellen des Elementes");
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