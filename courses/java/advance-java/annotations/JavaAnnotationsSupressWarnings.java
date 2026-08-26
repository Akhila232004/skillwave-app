public class JavaAnnotationsSupressWarnings {

    public static void main(String[] args) {

        int a1 = 1;  // unused → will show warning

        @SuppressWarnings("unused")
        int a2 = 1;  // unused → warning removed
    }
}