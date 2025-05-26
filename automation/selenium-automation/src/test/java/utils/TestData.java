package utils;

public class TestData {

    // Constants for Example Test Data. Can be deleted and replaced with actual test data.
    public static class Credentials {
        public static final String STANDARD_USER = "Ristian";
        public static final String PASSWORD = "mypass";
        public static final String INVALID_USER = "invalid_user";
        public static final String INVALID_PASSWORD = "invalid_password";
    }

    public static class Messages {
        // Success messages
        public static final String HOME_PAGE_DISPLAYED = "Home page should be displayed after login";
        public static final String PAGE_TITLE = "Page title should be correct";
        public static final String ERROR_MESSAGE_DISPLAYED = "Error message should be displayed";

        // Error messages from application
        public static final String ERROR_INVALID_CREDENTIALS = "Epic sadface: Username and password do not match";
        public static final String ERROR_USERNAME_REQUIRED = "Epic sadface: Username is required";

        // Expected values
        public static final String EXPECTED_PAGE_TITLE = "Swag Labs";
    }
    //-----------------------------------------------------------------------------------------------------------//
    //TODO Add here actual Test Data for your tests

    public static class UserData {
        public static final String EXISTING_USERNAME = "Ristian";
        public static final String ADMIN_USERNAME = "NewAccount";

        public static final String EXISTING_EMAIL = "ristiristi@gmail.com";
        public static final String ILLEGAL_EMAIL = "wrong.mail.com";

        public static final String PASSWORD = "mypass";
        public static final String INVALID_PASSWORD = "invalid_password";
        public static final String ADMIN_PASSWORD = "MyPass#1";

        public static String generateUsername() {
            return "New_User_" + System.currentTimeMillis();
        }

        public static String generateEmail() {
            return "mail." + System.currentTimeMillis() + "@gmail.com";
        }
    }

    public static class EnvData {
        public static final String BASE_URL = "http://localhost:5173";
    }
}