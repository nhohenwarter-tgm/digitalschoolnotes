import junit.framework.Test;
import junit.framework.TestSuite;
import mainpage.Login;
import mainpage.RegisterUser;
import mainpage.ResetPassword;
import management.Profile;
import management.ProfileSearch;

public class Suite {

    public static Test suite() {
        TestSuite suite = new TestSuite();
        suite.addTestSuite(RegisterUser.class);
        suite.addTestSuite(ResetPassword.class);
        suite.addTestSuite(Login.class);
        suite.addTestSuite(Profile.class);
        suite.addTestSuite(ProfileSearch.class);
        return suite;
    }

    public static void main(String[] args) {
        junit.textui.TestRunner.run(suite());
    }
}