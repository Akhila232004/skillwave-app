// Parent class
class ParentClass {

    public final int ParentsMoney = 1000;

    public int getSomeMoney() {
        return ParentsMoney * 10 / 100;
    }
}

public class JavaAnnotationsOverride extends ParentClass {

    @Override
    public int getSomeMoney() {
        return ParentsMoney * 20 / 100;
    }

    // Wrong override - compiler error (if uncommented)
    /*
    @Override
    public int getLittleMoney() {
        return 100;
    }
    */

    public static void main(String[] args) {
        JavaAnnotationsOverride obj = new JavaAnnotationsOverride();
        System.out.println(obj.getSomeMoney());
    }
}