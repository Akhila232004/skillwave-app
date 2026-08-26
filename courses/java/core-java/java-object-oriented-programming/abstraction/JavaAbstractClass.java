/** 
 * @author TINITIATE.COM
 * 
 * > TOPIC : Java OOP, Inheritance, Multilevel Hierarchy
 * 
 * > NOTES : Abstract Class
 *           1) A class that cannot be instantiated, is an abstract class. 
 *           2) It can have fields, methods and constructors are all accessed like any other class. 
 *           3) It should be used in a subclass 
 *           4) It is usually a parent class that contains common functionality across child classes, 
 *              Like Event Logging and common Utilities.
 *           5) It is usually a class that is too abstract to be used on its own.
 *
 *           Abstract Methods
 *           1) Abstract methods have only a method signature, but no method body.
 *           2) The abstract keyword is also used to declare a method as abstract.
 *           3) Useful in situations where the actual implementation of that method, is determined by child classes. 
 *           4) If a class contains an abstract method, the class must be abstract as well.
 *           5) Any child class must either override the abstract method or declare itself abstract.
 *           6) A class has to implement the abstract method, or else the abstract classes will be useless.
 *           7) To summarize, Abstract classes are used for Implementing Inheritance, where the behavior of 
 *              super/parent class could be extended/changed, Without having impacts to the child classes.
 *
 */
// Creating an Abstract Class
abstract class VideoPlayer
{
	String playerType;
	String playerManufacturer;
    
	// Constructor for the Abstract Class
	public VideoPlayer(String i_playerType, String i_playerManufacturer)
	{
        playerType          =  i_playerType;
        playerManufacturer  =  i_playerManufacturer;
	}
	
	//Non Abstract Method
	public void PlayerInfo()
	{
        System.out.println("----------------------------------------");
        System.out.println("-> System Info");
        System.out.println("   Player Type  "  + playerType);
        System.out.println("   Manufacturer " + playerManufacturer);
        System.out.println("----------------------------------------");
        System.out.println("");
	}
    // Create abstract methods, with no body(Code Functionality)
	abstract void play();
	abstract void pause();
	abstract void stop();
}
class BluRayPlayer extends VideoPlayer
{
	// Constructor for the Child Class BluRayPlayer
	BluRayPlayer(String v_playerType, String v_playerManufacturer)
	{
        super(v_playerType, v_playerManufacturer);
	}

	// Must create OverRides for the abstract methods
    public void play()
    {
        System.out.println("Playing BluRay disk ....");
    }
    public void pause()
    {
        System.out.println("Pause BluRay disk ....");
    }
    public void stop()
    {
        System.out.println("Stop BluRay disk....");
    }
}
class DVDPlayer extends VideoPlayer
{
	// Constructor for the Child Class DVDPlayer
	DVDPlayer(String v_playerType, String v_playerManufacturer)
	{
        super(v_playerType, v_playerManufacturer);
	}

	// Must create OverRides for the abstract methods
    public void play()
    {
        System.out.println("Playing DVD disk ....");
    }
    public void pause()
    {
        System.out.println("Pause DVD disk ....");
    }
    public void stop()
    {
        System.out.println("Stop DVD disk....");
    }
}
public class JavaAbstractClass 
{
    public static void main(String[] args) 
    {
        // Calling the DVDPlayer class
    	DVDPlayer objSonyDVDPlayer = new DVDPlayer("RCA DVD PLAYER","SONY");
    	objSonyDVDPlayer.PlayerInfo();
    	objSonyDVDPlayer.play();
    	objSonyDVDPlayer.pause();
    	objSonyDVDPlayer.stop();

        System.out.println("");
        System.out.println("");

        // Calling the BluRayPlayer class
    	BluRayPlayer objSonyBluRayPlayer = new BluRayPlayer("HDMI BluRay PLAYER","SONY");
    	objSonyBluRayPlayer.PlayerInfo();
    	objSonyBluRayPlayer.play();
    	objSonyBluRayPlayer.pause();
    	objSonyBluRayPlayer.stop();
    }
}
