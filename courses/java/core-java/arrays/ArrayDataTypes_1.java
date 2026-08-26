// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Java Arrays of various data types
//  Author       : Team Tinitiate
// ==============================================================================


// ># Java Arrays of various data types
// >* Arrays of various data types
// >  * int[] intArray
// >  * byte[] byteArray
// >  * short[] shortArray
// >  * long[] longArray
// >  * float[] floatArray
// >  * double[] doubleArray
// >  * boolean[] booleanArray
// >  * char[] charArray
// >  * String[] stringArray
// >* Array of a class (object)
// >  * Create a class
// >  * Use the class as the datatype of an array
// >* Java method returning an array
// >  * Create a method
// >  * Return an array value from that method
// >  * Read the array value from Main method



// This is a class that will be used to create an array object of 
// type "TinitiateArray" 
class TinitiateArray {

   int testVarInt;
   String testVarString;
}

// The class with the main method
public class ArrayDataTypes_1 {

   // This method returns an INT array, and its a static method 
   public static int[] returnInt() {
      
      // Create and initialize an int array
      int[] returnArray = {1,2,3};
      
      // return the data
      return returnArray;
   }
   
   
   // This is the MAIN METHOD
   public static void main(String[] args) {

      // Create arrays of various data types
      // ===================================
      int[] intArray = new int[3];
      byte[] byteArray;
      short[] shortArray;
      long[] longArray;
      float[] floatArray;
      double[] doubleArray;
      boolean[] booleanArray = new boolean[3];
      char[] charArray =  new char[3];
      String[] stringArray =  new String[3];

      // Initialize some of the above arrays
      intArray[0] = 1;
      
      booleanArray[0] = false;
      booleanArray[1] = true;

      charArray[0] = 'A';
      stringArray[0] ="Hello";
      
      
      // Create an array of type CLASS
      // =============================
      // Here we create an array of type "TinitiateArray"
      // Declare and initialize them before referencing the array
      TinitiateArray[] arrayTA = { new TinitiateArray()
                                  ,new TinitiateArray()
                                  ,new TinitiateArray()};

      // Assign values to the array
      arrayTA[0].testVarInt = 100;
      arrayTA[1].testVarInt = 200;
      arrayTA[2].testVarInt = 300;

      arrayTA[0].testVarString = "Welcome";
      arrayTA[1].testVarString = "to";
      arrayTA[2].testVarString = "tinitiate.com";

      // ==
      // OR
      // ==
      
      // Declare the Array
      TinitiateArray[] arrayTA2 = new TinitiateArray[3];
      
      // Initialize the array
      arrayTA2[0] = new TinitiateArray();
      arrayTA2[1] = new TinitiateArray();
      arrayTA2[2] = new TinitiateArray();

      // Assign values to the array
      arrayTA[0].testVarInt = 100;
      arrayTA[1].testVarInt = 200;
      arrayTA[2].testVarInt = 300;

      arrayTA[0].testVarString = "Welcome";
      arrayTA[1].testVarString = "to";
      arrayTA[2].testVarString = "tinitiate.com";

      
      // Array as METHOD RETURN value
      // ============================
      // Capture the int array from a method
      // 
      int[] myarr = returnInt();
      
      // Print the output
      System.out.println(myarr[0]);
      System.out.println(myarr[1]);
      System.out.println(myarr[2]);
   }
}
