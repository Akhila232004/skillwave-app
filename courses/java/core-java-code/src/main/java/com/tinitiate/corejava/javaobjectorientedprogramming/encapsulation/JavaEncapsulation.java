package com.tinitiate.corejava.javaobjectorientedprogramming.encapsulation;

/** 
 * @author TINITIATE.COM
 * 
 * > TOPIC : Java OOP, Encapsulation
 * 
 * > NOTES : Encapsulation
 *          1) The idea behind "Encapsulation" [of a class] is to prevent other 
 *             classes from needing to know what a class is doing behind the scenes.
 *          2) Making use of private class members (Methods, Variables) to access 
 *             them only inside the declaring class and not their instances.
 *             All other classes can only access, Data (variables) of the Encapsulated 
 *             class, through the provided "get" and "set" methods.
 *             This way data access can be restricted and data acquisition hidden.
 *          3) The Get / Set methods are a standard convention to access private data.   
 *
 */
class SecretClass
{
	private String userID;
	private String passWord;

    // This variable cannot be accessed directly by the child class
	// It can be accessed by a method that returns this variable's value
	private String secretData = "Winning Lottery Numbers for whole of next year...";

	public void setUserIDPassWord(String i_userid, String i_password)
	{
		userID   = i_userid;
		passWord = i_password;
	}

	public String getUserID()
	{
		return userID;
	}

	public String getPassWord(String i_userID)
	{
		if (i_userID == userID) 
		{ return passWord; }
		else
		{ return "";}
	}

	public String getSecretData(String i_userID, String i_password)
	{
		if (i_userID == userID && i_password == passWord) 
		{ return secretData; }
		else
		{ return "";}
	}
}

// Creating the Child class with the main
public class JavaEncapsulation extends SecretClass
{
	public static void main(String[] args)
	{
		JavaEncapsulation objEnTest = new JavaEncapsulation();
		// Call the setUserIDPassWord() from parent class
		String uid, pwd;
		objEnTest.setUserIDPassWord("batman", "joker");
		
		// Printing the UserID, (Private data)
		System.out.println("The userID is: " + objEnTest.getUserID());
		// Printing the Password, (Private data)
		System.out.println("The Password is: " + objEnTest.getPassWord(objEnTest.getUserID()));
		uid = objEnTest.getUserID();
		pwd = objEnTest.getPassWord(objEnTest.getUserID());
		
		/**
		 *  The next line of code cannot be used as the variable "secretData"
		 *  is set to PRIVATE in the parent class.
		 */
		//objEnTest.secretData = "Test";
		
		// Printing the SecretData, (Private data)
		System.out.println("SecretData is: " + objEnTest.getSecretData(uid, pwd));
	}
}
