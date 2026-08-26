import java.util.regex.*;

/**
 * replaceFirst replaces the first occurrence of the text that matches the regular expression. 
 * replaceAll replaces all the occurrences of the text that matches the regular expression.
 * 
 * Matcher class appendReplacement Method: Appends replaced text.  
 * Matcher class appendTail method for text replacement.
 */

public class RegExModificationMethods 
{
    public static void main(String[] args)
	{
	    String SearchExpression = "great";
		String TargetString_first  = "Java is a great great language !";
		String TargetString_all    = "Java is a great language !";
		String ReplaceString = "awesome";

		// Create a RegEx / Pattern object
 	    Pattern p = Pattern.compile(SearchExpression);

		/**
		 * replaceFirst replaces the first occurrence of the text that 
		 * matches the regular expression.
		 */
		// get a RegEx / matcher object
		Matcher m = p.matcher(TargetString_first); 

		TargetString_first = m.replaceFirst(ReplaceString);
		System.out.println("Example replaceFirst:");
		System.out.println(TargetString_first);

		/**
		 * replaceAll replaces all the occurrences of the text that 
		 * matches the regular expression.
		 */
		// get a RegEx / matcher object
		m = p.matcher(TargetString_all); 
		TargetString_all = m.replaceAll(ReplaceString);
		System.out.println("Example replaceAll:");		
		System.out.println(TargetString_all);


		SearchExpression = "_";
		TargetString_all = "THIS_IS_A_TEST";
		ReplaceString = " ";

		// Re-using pattern object
		p = Pattern.compile(SearchExpression);
		// Re-using matcher object
	    m = p.matcher(TargetString_all);

	    /**
	     *  Matcher class appendReplacement Method: replaces text.  
	     */
        StringBuffer sBuf = new StringBuffer();
	    while(m.find())
	    {  m.appendReplacement(sBuf,ReplaceString);  }
	    
	    System.out.println("String before replace: " + TargetString_all);
	    m.appendTail(sBuf);
	    System.out.println("String after replace: " + sBuf.toString());
    }
}
