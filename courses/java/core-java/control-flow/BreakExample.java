// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Control Flow Break Example
//  Author       : Team Tinitiate
// ==============================================================================


public class BreakExample {
    public static void main(String[] args) {
        for (int i = 1; i <= 10; i++) {
            if (i == 5) break;
            System.out.println(i);
        }
    }
}

// Output:
// 1
// 2
// 3
// 4
