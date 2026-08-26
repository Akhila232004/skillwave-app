import java.lang.reflect.Method;
import java.lang.annotation.Annotation;

// Class-level annotation
@TinitiateAnno(
    Description = "This is a Class",
    date = "19-Mar-2013",
    version = 1
)
public class CustomAnnotationDemo {

    // Method-level annotation
    @TinitiateAnno(
        Description = "This is the Greatest Method Out there",
        date = "19-Mar-2013",
        version = 1
    )
    public static void theGreatestMethod() {
        System.out.println("This is the Greatest Method");
    }

    public static void main(String[] args) throws Exception {

        // Call method normally
        theGreatestMethod();

        // === Read class-level annotation ===
        Class<CustomAnnotationDemo> cls = CustomAnnotationDemo.class;

        if (cls.isAnnotationPresent(TinitiateAnno.class)) {
            TinitiateAnno classAnno = cls.getAnnotation(TinitiateAnno.class);

            System.out.println("\n--- Class Annotation ---");
            System.out.println("Description : " + classAnno.Description());
            System.out.println("Version     : " + classAnno.version());
            System.out.println("Date        : " + classAnno.date());
        }

        // === Read method-level annotations ===
        System.out.println("\n--- Method Annotation ---");

        for (Method m : cls.getDeclaredMethods()) {
            if (m.isAnnotationPresent(TinitiateAnno.class)) {

                TinitiateAnno methodAnno = m.getAnnotation(TinitiateAnno.class);

                System.out.println("Method Name : " + m.getName());
                System.out.println("Description : " + methodAnno.Description());
                System.out.println("Version     : " + methodAnno.version());
                System.out.println("Date        : " + methodAnno.date());
            }
        }
    }
}
