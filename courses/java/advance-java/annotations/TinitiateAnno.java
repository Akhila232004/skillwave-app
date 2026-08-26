import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

// Custom Annotation
@Retention(RetentionPolicy.RUNTIME)
public @interface TinitiateAnno {
    String Description();
    String date();
    int version();
}
