// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Collections Framework ForEach Example
//  Author       : Team Tinitiate
// ==============================================================================

public class ForEachExample {
    public static void main(String[] args) {
        java.util.List<String> names = new java.util.ArrayList<>();
        names.add("Ava");
        names.add("Ben");
        names.add("Chen");

        int position = 0; // for-each has no index, so track it manually when needed
        for (String name : names) {
            System.out.println(position + ": " + name);
            position++;
        }
    }
}
/*
Expected output:
0: Ava
1: Ben
2: Chen
*/
