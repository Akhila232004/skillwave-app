// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Control Flow SwitchCase Example
//  Author       : Team Tinitiate
// ==============================================================================

public class SwitchCaseExample {
    public static void main(String[] args) {
        int day = 2;

        switch (day) {
            case 1:
                System.out.println("Monday");
                break;
            case 2:
                System.out.println("Tuesday");
                break;
            default:
                System.out.println("Invalid day");
        }
    }
}

// Output:
// Tuesday
