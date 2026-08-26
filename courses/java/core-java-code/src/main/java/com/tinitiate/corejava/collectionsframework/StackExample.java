// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Collections Framework Stack Example
//  Author       : Team Tinitiate
// ==============================================================================



// Demonstrates using Stack for a real-world problem: checking balanced parentheses
package com.tinitiate.corejava.collectionsframework;
import java.util.*;

public class StackExample {
    public static void main(String[] args) {
        String expression = "((2 + 3) * (4 + 5))";

        // Create a Stack to track parentheses
        Stack<Character> stack = new Stack<>();

        // Traverse each character
        for (char ch : expression.toCharArray()) {
            if (ch == '(') {
                stack.push(ch); // push opening bracket
            } else if (ch == ')') {
                // if closing bracket found, check stack
                if (stack.isEmpty()) {
                    System.out.println("Unbalanced Expression ");
                    return;
                }
                stack.pop(); // remove matching opening bracket
            }
        }

        // if stack is empty at the end, expression is balanced
        if (stack.isEmpty()) {
            System.out.println("Expression is Balanced ");
        } else {
            System.out.println("Unbalanced Expression ");
        }
    }
}

/*
Expected Output:
Expression is Balanced ✅
*/
