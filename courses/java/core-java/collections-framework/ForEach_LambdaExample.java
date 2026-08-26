// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Collections Framework ForEach Lambda Example
//  Author       : Team Tinitiate
// ==============================================================================

public class ForEach_LambdaExample {
public static void main(String[] args) {
        java.util.Map<String, Integer> cityToPopulationK = new java.util.LinkedHashMap<>();
        cityToPopulationK.put("Oslo", 700);
        cityToPopulationK.put("Seoul", 9500);
        cityToPopulationK.put("Lima", 9700);

        cityToPopulationK.forEach((city, popK) ->
            System.out.println(city + " -> " + popK + "k")
        );
    }
}
/*
Expected output:
Oslo -> 700k
Seoul -> 9500k
Lima -> 9700k
*/