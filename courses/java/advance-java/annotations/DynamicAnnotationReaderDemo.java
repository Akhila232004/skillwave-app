import java.lang.annotation.*;
import java.lang.reflect.*;

public class DynamicAnnotationReaderDemo {

    // Sample annotation with attributes
    @Retention(RetentionPolicy.RUNTIME)
    @Target({ElementType.TYPE, ElementType.METHOD, ElementType.FIELD})
    @interface Info {
        String createdBy();
        int version() default 1;
    }

    // Annotated class
    @Info(createdBy = "Tinitiate", version = 2)
    static class Demo {

        @Info(createdBy = "Admin")
        public void show() { }

        @Info(createdBy = "System", version = 5)
        public String name;
    }

    public static void main(String[] args) throws Exception {

        Class<?> cls = Demo.class;

        // 1) Read ALL class-level annotations dynamically
        System.out.println("=== CLASS ANNOTATIONS ===");
        readAllAnnotations(cls.getAnnotations());

        // 2) Read ALL field-level annotations dynamically
        System.out.println("\n=== FIELD ANNOTATIONS ===");
        for (Field f : cls.getDeclaredFields()) {
            System.out.println("Field: " + f.getName());
            readAllAnnotations(f.getAnnotations());
        }

        // 3) Read ALL method-level annotations dynamically
        System.out.println("\n=== METHOD ANNOTATIONS ===");
        for (Method m : cls.getDeclaredMethods()) {
            System.out.println("Method: " + m.getName());
            readAllAnnotations(m.getAnnotations());
        }
    }

    // Reads annotation type name + all attribute name/value pairs (no prior knowledge needed)
    private static void readAllAnnotations(Annotation[] annotations) {
        if (annotations.length == 0) {
            System.out.println("  (no annotations)");
            return;
        }

        for (Annotation anno : annotations) {
            Class<? extends Annotation> annoType = anno.annotationType();
            System.out.println("  Annotation: " + annoType.getName());

            // Read attributes dynamically using methods declared inside the annotation type
            for (Method attr : annoType.getDeclaredMethods()) {
                try {
                    Object value = attr.invoke(anno);
                    System.out.println("    " + attr.getName() + " = " + value);
                } catch (Exception e) {
                    System.out.println("    " + attr.getName() + " = <error reading>");
                }
            }
        }
    }
}