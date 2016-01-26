package util;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;;
import org.openqa.selenium.safari.SafariDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.ie.InternetExplorerDriver;
import org.openqa.selenium.remote.DesiredCapabilities;

import java.util.concurrent.TimeUnit;

public class Parameters{
    public static final int FIREFOX = 0;
    public static final int INTERNET_EXPLORER = 1;
    public static final int CHROME = 2;
    public static final int SAFARI = 3;

    public static final String LINUX = "linux";
    public static final String MAC = "mac";
    public static final String WINDOWS = "windows.exe";

    public static String os = LINUX; //HIER OS AENDERN
    public static int browser = FIREFOX; //HIER BROWSER AENDERN
    public static int port = 5001; //HIER PORT AENDERN

    public static boolean stable = false;

    //E-Mail Adresse, bei der die E-Mails tatsächlich abgerufen werden können (muss existierender Benutzer in DSN sein!)
    public static String testingEmail = "sbrinnich@gmx.at"; //HIER EMAIL AENDERN
    //Testing Passwort muss zwischen 8 und 128 Zeichen haben und sollte anders sein als das
    // aktuelle Passwort des Users mit der obigen E-Mail Adresse
    public static String testingPwd = "12345678"; //HIER TEST-PASSWORT AENDERN

    public static final int SLEEP_CAPTCHA = 5000; //HIER WARTEZEIT FUER CAPTCHA-EINGABE AENDERN
    public static final int SLEEP_PAGELOAD = 2500; //HIER WARTEZEIT FUER PAGE LOAD AENDERN

    public static String baseUrl = "";
    public static final String URLDEV = "https://digitalschoolnotes.com:"+port;
    public static final String URLSTABLE = "https://digitalschoolnotes.com";

    public static WebDriver driver;

    public static void setUpBrowser() throws Exception {
        switch(browser){
            case FIREFOX:
                driver = new FirefoxDriver();
                break;
            case INTERNET_EXPLORER:
                if(os.equals(LINUX) || os.equals(MAC)){
                    System.err.println("Falsches OS du honk!");
                    System.exit(0);
                }
                System.setProperty("webdriver.ie.driver", "webdrivers/iedriver_"+os);
                DesiredCapabilities caps = DesiredCapabilities.internetExplorer(); caps.setCapability(InternetExplorerDriver.INITIAL_BROWSER_URL, "");
                driver = new InternetExplorerDriver(caps);
                break;
            case CHROME:
                System.setProperty("webdriver.chrome.driver", "webdrivers/chromedriver_"+os);
                driver = new ChromeDriver();
                break;
            case SAFARI:
                if(os == LINUX){
                    System.err.println("Falsches OS du honk!");
                    System.exit(0);
                }
                driver = new SafariDriver();
                break;
        }
        driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
        if(stable){
            baseUrl = URLSTABLE;
        }else{
            baseUrl = URLDEV;
        }
    }
}
