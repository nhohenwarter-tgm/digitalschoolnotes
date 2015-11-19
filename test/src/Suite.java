import admin.UserManagement;
import edit.Notebook;
import junit.framework.Test;
import junit.framework.TestSuite;
import mainpage.Login;
import mainpage.RegisterUser;
import mainpage.ResetPassword;
import management.*;

public class Suite {

    public static Test suite() {
        TestSuite suite = new TestSuite();
        suite.addTestSuite(RegisterUser.class);
        suite.addTestSuite(ResetPassword.class);
        suite.addTestSuite(Login.class);
        suite.addTestSuite(Profile.class);
        suite.addTestSuite(ProfileSearch.class);
        suite.addTestSuite(UserManagement.class);
        suite.addTestSuite(Notebook.class);
        suite.addTestSuite(NotebookOptions.class);
        suite.addTestSuite(PublicNotebooks.class);
        suite.addTestSuite(EditAccount.class);
        return suite;
    }

    public static void main(String[] args) {
        junit.textui.TestRunner.run(suite());
    }
}