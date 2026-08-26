import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

public class TargetAllDemo {

    // TYPE (class/interface/enum/annotation)
    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.TYPE)
    @interface TypeAnno { String value(); }

    // FIELD
    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.FIELD)
    @interface FieldAnno { String value(); }

    // METHOD
    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.METHOD)
    @interface MethodAnno { String value(); }

    // PARAMETER
    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.PARAMETER)
    @interface ParamAnno { String value(); }

    // CONSTRUCTOR
    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.CONSTRUCTOR)
    @interface CtorAnno { String value(); }

    // LOCAL_VARIABLE
    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.LOCAL_VARIABLE)
    @interface LocalAnno { String value(); }

    // Apply TYPE annotation on class
    @TypeAnno("Applied on CLASS (TYPE)")
    static class Demo {

        // Apply FIELD annotation
        @FieldAnno("Applied on FIELD")
        private String name;

        // Apply CONSTRUCTOR annotation
        @CtorAnno("Applied on CONSTRUCTOR")
        public Demo() { }

        // Apply METHOD annotation + PARAMETER annotation
        @MethodAnno("Applied on METHOD")
        public void hello(@ParamAnno("Applied on PARAMETER") int times) {

            // Apply LOCAL_VARIABLE annotation
            @LocalAnno("Applied on LOCAL_VARIABLE")
            String msg = "Hello";

            for (int i = 0; i < times; i++) {
                System.out.println(msg + " " + i);
            }
        }
    }

    public static void main(String[] args) {
        new Demo().hello(2);
    }
}