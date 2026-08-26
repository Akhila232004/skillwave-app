// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Control Flow Continue Example
//  Author       : Team Tinitiate
// ==============================================================================


public class ContinueExample {
    public static void main(String[] args) {
        for (int i = 1; i <= 5; i++) {
            if (i == 3) continue;
            System.out.println(i);
        }
    }
}

// Output:
// 1
// 2
// 4
// 5
