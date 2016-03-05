import admin.ContactUser;
import admin.UserManagement;
import edit.*;
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
        suite.addTestSuite(ContactUser.class);
        suite.addTestSuite(TimetableView.class);
        suite.addTestSuite(TimetableEditLessons.class);
        suite.addTestSuite(DeleteAccount.class);
        suite.addTestSuite(Bildelement.class);
        suite.addTestSuite(Codeelement.class);
        suite.addTestSuite(CreateMoveDeleteElement.class);
        suite.addTestSuite(ImportPage.class);
        suite.addTestSuite(MoveElement.class);
        suite.addTestSuite(OCR.class);
        suite.addTestSuite(Textelement.class);
        suite.addTestSuite(DeleteNotebook.class);
        return suite;
    }

    public static void main(String[] args) {
        junit.textui.TestRunner.run(suite());
    }
}