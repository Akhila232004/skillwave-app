import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

public class InheritedAnnotationDemo {

    // 1) Inheritable annotation
    @Inherited
    @Target(ElementType.TYPE)
    @Retention(RetentionPolicy.RUNTIME)
    @interface InheritableAnno { }

    // 2) NOT inheritable (no @Inherited)
    @Target(ElementType.TYPE)
    @Retention(RetentionPolicy.RUNTIME)
    @interface UnInheritableAnno { }

    // Parent classes
    @InheritableAnno
    static class ParentWithInheritable { }

    @UnInheritableAnno
    static class ParentWithUnInheritable { }

    // Child classes
    static class Child1 extends ParentWithInheritable { }
    static class Child2 extends ParentWithUnInheritable { }

    public static void main(String[] args) {

        System.out.println("ParentWithInheritable has InheritableAnno? " +
                (ParentWithInheritable.class.getAnnotation(InheritableAnno.class) != null));

        System.out.println("Child1 has InheritableAnno (inherited)? " +
                (Child1.class.getAnnotation(InheritableAnno.class) != null));

        System.out.println("ParentWithUnInheritable has UnInheritableAnno? " +
                (ParentWithUnInheritable.class.getAnnotation(UnInheritableAnno.class) != null));

        // This is the key: will be NULL because @Inherited is missing
        System.out.println("Child2 has UnInheritableAnno (inherited)? " +
                (Child2.class.getAnnotation(UnInheritableAnno.class) != null));
    }
}