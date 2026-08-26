// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Java Array Operations
//  Author       : Team Tinitiate
// ==============================================================================

// ># Java Array Operations
// >* Here are demonstrations for a few Array Operations
// >  * **Cloning an Array** , using the built-in **clone()** method 
// >  * **Copying a subset of an array** using built-in, **System.arraycopy**
// >    * System.arraycopy ( SourceArrayName
// >    *                   ,[Index Start position of Source Array]
// >    *                  ,TargetArrayName
// >    *                  ,[Index Start position of Target Array to copy to]
// >    *                  ,[Index End position of Source Array] );
// >  * **Comparing an Array**
// >    * Using the **equals()** built-in method. 
// >  * **Looping through Array elements**
// >    Using the "for loop" to loop through array elements.
// >  * **Sorting an Array**
// >    using the Arrays.sort built-in.


import java.util.Arrays;

public class ArrayOperations_1 {

   public static void main(String[] args) {

      // CLONING AN ARRAY
      // ================
      int SourceArray[] = {1,2,3};
      int TargetArray[];
      // Array Clone using the "clone()" method
      TargetArray = SourceArray.clone();
      
      
      // COPYING AN ARRAY
      // ================
      int inCopyArray[] = {1,2,3,5,6};
      int outCopyArray[] = new int[3];
      // The following Copies the first 3 elements of inCopyArray
      // into outCopyArray.
      System.arraycopy(inCopyArray, 3, outCopyArray, 0, 2);
      
      
      // COMPARING AN ARRAY
      // ==================
      int CmpArray1[] = {1,2,3};
      int CmpArray2[] = {1,2,3};
      int CmpArray3[] = {4,5,6};

      // Compare CmpArray1 and CmpArray2
      if (Arrays.equals(CmpArray1, CmpArray2))
      { System.out.println("Arrays CmpArray1 and CmpArray2 are equal."); }
      else
      {System.out.println("Arrays CmpArray1 and CmpArray2 are not equal."); }      
      
      // Compare CmpArray2 and CmpArray3
      if (Arrays.equals(CmpArray2, CmpArray3))
      { System.out.println("Arrays CmpArray2 and CmpArray3 are equal."); }
      else
      {System.out.println("Arrays CmpArray2 and CmpArray3 are not equal."); }      


      // LOOP THORUGH ARRAY ELEMENTS
      // ============================
      int [] srcArray = {92, 1, 55, 100};
      for(int p: srcArray)
      { System.out.print(p + ","); }
      System.out.println();    


      // SORTING AN ARRAY
      // ================
      int [] x1 = {92, 1, 55, 100};
      
      System.out.println("X1 before sort: ");
      for (int a: x1)
      { System.out.print(a + " "); }
      
      // Print an empty Line
      System.out.println();

      System.out.println("X1 after sort: ");
      // Built-in to sort Array
      Arrays.sort(x1);  
      for (int b: x1)
      { System.out.print(b + " "); }

   }
}


// > >OUTPUT
// >```
// > Arrays CmpArray1 and CmpArray2 are equal.
// > Arrays CmpArray2 and CmpArray3 are not equal.
// > 92,1,55,100,
// > X1 before sort: 
// > 92 1 55 100 
// > X1 after sort: 
// > 1 55 92 100 
// >```
