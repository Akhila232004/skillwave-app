
public class JavaAnnotationsDeprecated {

    @Deprecated
    public static int oldAdder(int a, int b) {
        return a + b;
    }

    public static int newAdder(int a, int b) {
        return a + b;
    }

    public static void main(String[] args) {

        // Compiler warning
        System.out.println(oldAdder(10, 20));

        // No warning
        System.out.println(newAdder(10, 20));
    }
}
