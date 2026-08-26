import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.Method;

/***
// * @AUTHOR  TINITIATE.COM
// * @TOPIC   JAVA Reflection
// * @NOTES   1) Java Reflection enables to Inspect Classes, Interfaces and Methods at RunTime.   
// *          2) Inspection of the above mentioned aspects of a Program can be done without knowing 
// *             the Class Name.
// *          3) The starting point for using reflection is always a java.lang.Class instance.
// *          4) Step I: In this demonstration the objective is to, read the InterestingClass, at Runtime.
// *          5) Step II: Dynamically Execute the InterestingClass.         
// *          6) Advantages of Reflection
// *               * Makes the application Extensible, by enabling creation of instances of 
// *                 external and user-defined classes.
// *               * Helps Debuggers and Test Tools to examine private members on classes.
//            7) Disadvantages
// *               * Performance Overhead Because reflection involves types that are dynamically resolved
// *               * Security Restrictions Reflection requires a runtime permission which may not be present 
// *                 when running under a security manager.
// *               * Exposure of Internals Since reflection such as accessing private fields and methods.
// *               * Unexpected side-effects, which may render code dysfunctional and may destroy portability. 
// *               * Reflective code breaks abstractions and therefore may change behavior with upgrades 
// *                 of the platform. 
// */

/***
// * @CLASS InterestingClass
// * @NOTES 1) This is the Class we want to Inspect at RunTime
// *        2) This Class has Methods, Fields and Constructors for the Reflection to Read.
// */
class InterestingClass {

    // Fields of the InterestingClass 
    public String stringField;
    public int intField;
    char[] charArrField;

    // Methods of the InterestingClass    
    public void secretMethod() {
        System.out.println("This is a very secret method");
    }

    public void coolMethod() {
        System.out.println("This is a very cool method");
    }

    // * Method with Params
    public int GreatestAddingMachine(Integer a, Integer b) {
        return a+b;
    }

    public void AboutInterestingClass() {
        System.out.println("InterestingClass Has:");
        System.out.println("3 Fields (stringField,intField,charArrField)");
        System.out.println("4 Methods (secretMethod,coolMethod,GreatestAddingMachine,AboutInterestingClass)");
        System.out.println("2 Constructors");
    }

    // Constructors of the InterestingClass
    public InterestingClass(String stringField, int intField) {
        this.intField = intField;
        this.stringField = stringField;
        charArrField = stringField.toCharArray();
    }

    public InterestingClass(String stringField, int intField, char[] charArrField) {
        this.intField = intField;
        this.stringField = stringField;
        this.charArrField = charArrField;
    }
    public InterestingClass() {
        this.intField = 1;
        this.stringField = "hello";
    }
}

/***
// * @CLASS   JavaReflectionBasics
// * @NOTES   1) Demonstrates Basics of Reflection
// *          2) Analyzes a Target Class, In this Case "InterestingClass"
// *          3) Reads all the FieldNames and FieldTypes
// *          4) Reads all the MethodNames, ParameterTypes and ReturnTypes
// *          5) Reads all the ConstructorNames and ParameterTypes
// *
// */
public class JavaReflectionBasics {

    public static void main(String[] args) {
        
        /***
        // * STEP - I : Analyze the Target Class
        // */
        try {
            // * SYNTAX [1], Create an Entry point to the TargetClass
            // * For this Demo, we are using Variable Class targetClass,
            // * Shown in SYNTAX 2.
            // * Class targetClassUnUsedVariable = Class.forName("InterestingClass");
            
            // * SYNTAX [2], Create an Entry point to the TargetClass
            Class targetClass = InterestingClass.class;

            // * Printing the Class Name
            System.out.println("ClassName " + targetClass.getName());
            System.out.println("===================================");
            /**
             *  PRINT ALL Fields OF THE CLASS, Dynamically
             */
            System.out.println("ALL FIELDS OF THE CLASS " + targetClass.getName());
            System.out.println("DISPLAY-FORMAT <FieldTypeName> <ParameterName>");
            // * Read all the Field objects of the TargetClass to the Field-Array
            Field[] FieldList = targetClass.getDeclaredFields();
            // * Loop and examine the Methods
            for (Field f:FieldList) {
                Class cf = f.getType();
                if (cf.isArray()) { // For an Array print"[]"
                    System.out.print(cf.getName() + "[] ");    
                }
                else {
                    System.out.print(cf.getName() + " ");
                }
                // * Get the FieldName
                System.out.println(f.getName());
            }

            /***
            // *  PRINT ALL METHODS OF THE CLASS, Dynamically
            // */
            System.out.println("\nALL METHODS OF THE CLASS " + targetClass.getName());
            System.out.println("DISPLAY-FORMAT MethodName(<Parameters>) ReturnType <TypeName>");
            // * Read all the Method objects of the TargetClass to the Method-Array
            Method[] MethodList = targetClass.getDeclaredMethods();
            // * Loop and examine the Methods
            for (Method m:MethodList) {
                // * Get the MethodName
                String MethodName = m.getName();
                System.out.print(MethodName);  // NOTE its Print not printLN
                System.out.print("( ");
                // * Loop Through the Parameter Types 
                Class[] c1 = m.getParameterTypes();
                for (Class cc:c1) {
                    if (cc.isArray()) { // For an Arrar print"[]"
                        System.out.print(cc.getName() + "[]");    
                    }
                    else {
                        System.out.print(cc.getName() + " ");
                    }
                }
                System.out.print(") ");
                // * Check the Methods Returns type
                Class c = m.getReturnType();
                System.out.println("ReturnType " + c.getName());
            }

            /***
            // *  PRINT ALL Constructors OF THE CLASS, Dynamically
            // */
            System.out.println("\nALL CONSTRUCTORS OF THE CLASS " + targetClass.getName());
            System.out.println("DISPLAY-FORMAT ConstructorName(<Parameters>)");
            Constructor[] ConstructorList = targetClass.getConstructors();
            for (Constructor ctr:ConstructorList) {
                // * Get the ConstructorName
                System.out.print(ctr.getName() + "( ");  // NOTE its Print not printLN
                for(Class cct : ctr.getParameterTypes()) {
                    if (cct.isArray()) { // For an Arrar print"[]"
                        System.out.print(cct.getName() + "[]");    
                    }
                    else {
                        System.out.print(cct.getName() + " ");
                    }
                }
                System.out.println(")");
            }

        } catch (Exception e) {
          e.printStackTrace();
        }

        /***
        // * STEP - II :Dynamically execute Target Class, Methods
        // */
        System.out.println("\nUsing Reflection to Run the class: 'InterestingClass'\n");
        try {
            // * Steps to Execute a Class, using Reflection

            // * Step (1), Define and Load the Target Class
            Class TargetClass = InterestingClass.class;

            // * Step (2), Create an Object of the Class
            Object objTC = TargetClass.newInstance(); 

            // * Step (3), Prepare the Method to be executed of the TargetClass Object
            // * Executing a Method with No-Params
            Method execMethod1 = TargetClass.getMethod("coolMethod", new Class[] {});
            execMethod1.invoke(objTC, new Object[]{});

            // * Executing a Method with Params
            // * Syntax for calling Class-Methods in case of No-Params for Method:
            // * <TargetClass>.getMethod("<Method-Name", new Class[] {})
            // * Syntax for calling Class-Methods in case of method Params:
            // * <TargetClass>.getMethod("<Method-Name", new Class[] {<DataType>.Class,<DataType>.Class, ... })
            Method execMethod2 = TargetClass.getMethod("GreatestAddingMachine", new Class[] {Integer.class, Integer.class});
            System.out.println("Executing Method :GreatestAddingMachine of the Class:InterestingClass..");
            int result = (Integer) execMethod2.invoke(objTC, new Object[]{1,4});
            System.out.println(" Result from 'GreatestAddingMachine' with inputs 1,4 :" + result);
        }
        catch(Exception e) { e.printStackTrace(); }
    }
}
