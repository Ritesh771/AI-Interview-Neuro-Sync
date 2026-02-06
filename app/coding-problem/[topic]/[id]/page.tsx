'use client'

import React, { useState, useRef, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import { Button } from '@/app/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { useParams } from 'next/navigation'

interface TestCase {
  input: string
  expectedOutput: string
  description: string
}

interface Problem {
  id: number
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  solved: boolean
}

const getProblemDetails = (title: string) => {
  const lowerTitle = title.toLowerCase()

  // Conditional statements, loops
  if (lowerTitle.includes('swap two numbers')) {
    return {
      explanation: 'Write a program that reads two integers separated by a space, swaps their values using a temporary variable, and prints the swapped values.',
      inputFormat: 'Two integers separated by a single space.',
      outputFormat: 'Print the two integers after swapping, separated by a single space. No extra spaces or newlines.',
      sampleInput: '5 10',
      sampleOutput: '10 5'
    }
  }

  if (lowerTitle.includes('check whether a number is positive or negative')) {
    return {
      explanation: 'Write a program that reads an integer and determines whether it is positive, negative, or zero.',
      inputFormat: 'A single integer.',
      outputFormat: 'Print "Positive" if the number is greater than 0, "Negative" if less than 0, or "Zero" if equal to 0.',
      sampleInput: '5',
      sampleOutput: 'Positive'
    }
  }

  if (lowerTitle.includes('check whether a number is even or odd')) {
    return {
      explanation: 'Write a program that reads an integer and determines whether it is even or odd.',
      inputFormat: 'A single integer.',
      outputFormat: 'Print "Even" if the number is divisible by 2, otherwise print "Odd".',
      sampleInput: '4',
      sampleOutput: 'Even'
    }
  }

  if (lowerTitle.includes('find largest of two numbers')) {
    return {
      explanation: 'Write a program that reads two integers and finds the largest among them.',
      inputFormat: 'Two integers separated by a space.',
      outputFormat: 'Print the largest number.',
      sampleInput: '5 10',
      sampleOutput: '10'
    }
  }

  if (lowerTitle.includes('check whether a character is vowel or consonant')) {
    return {
      explanation: 'Write a program that reads a character and determines whether it is a vowel or consonant.',
      inputFormat: 'A single character.',
      outputFormat: 'Print "Vowel" if the character is a, e, i, o, u, A, E, I, O, U, otherwise "Consonant".',
      sampleInput: 'a',
      sampleOutput: 'Vowel'
    }
  }

  if (lowerTitle.includes('check whether a number is divisible by 5 and 11')) {
    return {
      explanation: 'Write a program that reads an integer and checks if it is divisible by both 5 and 11.',
      inputFormat: 'A single integer.',
      outputFormat: 'Print "Divisible" if divisible by both 5 and 11, otherwise "Not Divisible".',
      sampleInput: '55',
      sampleOutput: 'Divisible'
    }
  }

  if (lowerTitle.includes('calculate grade based on marks')) {
    return {
      explanation: 'Write a program that reads marks and calculates grade: 90-100:A, 80-89:B, 70-79:C, 60-69:D, below 60:F.',
      inputFormat: 'A single integer representing marks (0-100).',
      outputFormat: 'Print the grade (A, B, C, D, or F).',
      sampleInput: '85',
      sampleOutput: 'B'
    }
  }

  if (lowerTitle.includes('calculate electricity bill')) {
    return {
      explanation: 'Write a program that calculates electricity bill based on units: First 50:$0.50, Next 100:$0.75, Next 100:$1.20, Above 250:$1.50.',
      inputFormat: 'A single integer representing units consumed.',
      outputFormat: 'Print the total bill amount with 2 decimal places.',
      sampleInput: '100',
      sampleOutput: '62.50'
    }
  }

  if (lowerTitle.includes('find roots of a quadratic equation')) {
    return {
      explanation: 'Write a program that reads coefficients a, b, c and finds roots of ax² + bx + c = 0.',
      inputFormat: 'Three floating-point numbers a, b, c separated by spaces.',
      outputFormat: 'Print roots with 2 decimal places.',
      sampleInput: '1 -3 2',
      sampleOutput: '2.00 1.00'
    }
  }

  if (lowerTitle.includes('simple calculator using switch')) {
    return {
      explanation: 'Write a program that reads two numbers and operator (+, -, *, /) and performs calculation using switch.',
      inputFormat: 'Two integers and a character operator separated by spaces.',
      outputFormat: 'Print the result of the operation.',
      sampleInput: '10 5 +',
      sampleOutput: '15'
    }
  }

  if (lowerTitle.includes('display day of the week using switch')) {
    return {
      explanation: 'Write a program that reads number (1-7) and displays day name using switch.',
      inputFormat: 'A single integer (1-7).',
      outputFormat: 'Print the day name.',
      sampleInput: '1',
      sampleOutput: 'Monday'
    }
  }

  if (lowerTitle.includes('display month name using switch')) {
    return {
      explanation: 'Write a program that reads number (1-12) and displays month name using switch.',
      inputFormat: 'A single integer (1-12).',
      outputFormat: 'Print the month name.',
      sampleInput: '1',
      sampleOutput: 'January'
    }
  }

  if (lowerTitle.includes('menu-driven program using switch')) {
    return {
      explanation: 'Write a menu-driven program that performs arithmetic operations using switch.',
      inputFormat: 'First line: choice (1-4), Second line: two numbers.',
      outputFormat: 'Print the result of selected operation.',
      sampleInput: '1\n10 5',
      sampleOutput: '15'
    }
  }

  if (lowerTitle.includes('print numbers from 1 to n')) {
    return {
      explanation: 'Write a program that reads n and prints numbers from 1 to n.',
      inputFormat: 'A single integer n.',
      outputFormat: 'Print numbers from 1 to n separated by spaces.',
      sampleInput: '5',
      sampleOutput: '1 2 3 4 5'
    }
  }

  if (lowerTitle.includes('print even numbers between 1 and n')) {
    return {
      explanation: 'Write a program that reads n and prints even numbers between 1 and n.',
      inputFormat: 'A single integer n.',
      outputFormat: 'Print even numbers separated by spaces.',
      sampleInput: '10',
      sampleOutput: '2 4 6 8 10'
    }
  }

  if (lowerTitle.includes('print multiplication table')) {
    return {
      explanation: 'Write a program that reads n and prints its multiplication table up to 10.',
      inputFormat: 'A single integer n.',
      outputFormat: 'Print table with format "n x i = result".',
      sampleInput: '5',
      sampleOutput: '5 x 1 = 5\n5 x 2 = 10\n5 x 3 = 15\n5 x 4 = 20\n5 x 5 = 25\n5 x 6 = 30\n5 x 7 = 35\n5 x 8 = 40\n5 x 9 = 45\n5 x 10 = 50'
    }
  }

  if (lowerTitle.includes('calculate factorial using for loop')) {
    return {
      explanation: 'Write a program that reads n and calculates factorial using for loop.',
      inputFormat: 'A single integer n (0 ≤ n ≤ 12).',
      outputFormat: 'Print the factorial of n.',
      sampleInput: '5',
      sampleOutput: '120'
    }
  }

  if (lowerTitle.includes('calculate sum of first n natural numbers')) {
    return {
      explanation: 'Write a program that reads n and calculates sum of first n natural numbers.',
      inputFormat: 'A single integer n.',
      outputFormat: 'Print the sum.',
      sampleInput: '5',
      sampleOutput: '15'
    }
  }

  if (lowerTitle.includes('reverse a number using while loop')) {
    return {
      explanation: 'Write a program that reads a number and reverses its digits using while loop.',
      inputFormat: 'A single integer.',
      outputFormat: 'Print the reversed number.',
      sampleInput: '123',
      sampleOutput: '321'
    }
  }

  if (lowerTitle.includes('check whether a number is palindrome')) {
    return {
      explanation: 'Write a program that reads a number and checks if it is palindrome.',
      inputFormat: 'A single integer.',
      outputFormat: 'Print "Palindrome" or "Not Palindrome".',
      sampleInput: '121',
      sampleOutput: 'Palindrome'
    }
  }

  if (lowerTitle.includes('check whether a number is armstrong number')) {
    return {
      explanation: 'Write a program that reads a number and checks if it is Armstrong number.',
      inputFormat: 'A single integer.',
      outputFormat: 'Print "Armstrong" or "Not Armstrong".',
      sampleInput: '153',
      sampleOutput: 'Armstrong'
    }
  }

  if (lowerTitle.includes('count digits in a number')) {
    return {
      explanation: 'Write a program that reads a number and counts its digits.',
      inputFormat: 'A single integer.',
      outputFormat: 'Print the count of digits.',
      sampleInput: '12345',
      sampleOutput: '5'
    }
  }

  if (lowerTitle.includes('find sum of digits of a number')) {
    return {
      explanation: 'Write a program that reads a number and calculates sum of its digits.',
      inputFormat: 'A single integer.',
      outputFormat: 'Print the sum of digits.',
      sampleInput: '123',
      sampleOutput: '6'
    }
  }

  if (lowerTitle.includes('demonstrate do-while loop')) {
    return {
      explanation: 'Write a program that demonstrates do-while loop by printing numbers 1 to 5.',
      inputFormat: 'No input required.',
      outputFormat: 'Print numbers from 1 to 5.',
      sampleInput: '',
      sampleOutput: '1 2 3 4 5'
    }
  }

  if (lowerTitle.includes('display menu until user chooses exit')) {
    return {
      explanation: 'Write a program that displays menu and continues until user chooses exit.',
      inputFormat: 'Multiple inputs: choice then operation inputs.',
      outputFormat: 'Print menu and results until exit.',
      sampleInput: '1\n10 5\n3',
      sampleOutput: '15\nExiting...'
    }
  }

  if (lowerTitle.includes('validate user input using do-while loop')) {
    return {
      explanation: 'Write a program that validates positive number input using do-while loop.',
      inputFormat: 'A positive integer.',
      outputFormat: 'Print the valid input.',
      sampleInput: '5',
      sampleOutput: 'Valid input: 5'
    }
  }

  if (lowerTitle.includes('check if a number is prime')) {
    return {
      explanation: 'Write a program that reads a number and checks if it is prime.',
      inputFormat: 'A single integer n (> 1).',
      outputFormat: 'Print "Prime" or "Not Prime".',
      sampleInput: '7',
      sampleOutput: 'Prime'
    }
  }

  if (lowerTitle.includes('generate fibonacci series')) {
    return {
      explanation: 'Write a program that reads n and prints first n Fibonacci numbers.',
      inputFormat: 'A single integer n.',
      outputFormat: 'Print Fibonacci numbers separated by spaces.',
      sampleInput: '5',
      sampleOutput: '0 1 1 2 3'
    }
  }

  if (lowerTitle.includes('find gcd of two numbers')) {
    return {
      explanation: 'Write a program that reads two numbers and finds their GCD.',
      inputFormat: 'Two integers separated by space.',
      outputFormat: 'Print the GCD.',
      sampleInput: '12 18',
      sampleOutput: '6'
    }
  }

  if (lowerTitle.includes('convert temperature from celsius to fahrenheit')) {
    return {
      explanation: 'Write a program that converts Celsius to Fahrenheit.',
      inputFormat: 'A floating-point number representing Celsius.',
      outputFormat: 'Print Fahrenheit with 2 decimal places.',
      sampleInput: '25',
      sampleOutput: '77.00'
    }
  }

  // Arrays
  if (lowerTitle.includes('find the largest element in an array')) {
    return {
      explanation: 'Write a program that reads n integers and finds the largest element.',
      inputFormat: 'First line: n. Second line: n integers.',
      outputFormat: 'Print the largest element.',
      sampleInput: '5\n1 2 3 4 5',
      sampleOutput: '5'
    }
  }

  if (lowerTitle.includes('find the second largest element in an array')) {
    return {
      explanation: 'Write a program that reads n integers and finds the second largest element.',
      inputFormat: 'First line: n. Second line: n integers.',
      outputFormat: 'Print the second largest element.',
      sampleInput: '5\n1 2 3 4 5',
      sampleOutput: '4'
    }
  }

  if (lowerTitle.includes('find the sum of all elements in an array')) {
    return {
      explanation: 'Write a program that reads n integers and calculates their sum.',
      inputFormat: 'First line: n. Second line: n integers.',
      outputFormat: 'Print the sum.',
      sampleInput: '5\n1 2 3 4 5',
      sampleOutput: '15'
    }
  }

  if (lowerTitle.includes('count even and odd numbers in an array')) {
    return {
      explanation: 'Write a program that reads n integers and counts even and odd numbers.',
      inputFormat: 'First line: n. Second line: n integers.',
      outputFormat: 'Print "Even: X, Odd: Y".',
      sampleInput: '5\n1 2 3 4 5',
      sampleOutput: 'Even: 2, Odd: 3'
    }
  }

  if (lowerTitle.includes('copy all elements from one array to another')) {
    return {
      explanation: 'Write a program that reads n integers and copies them to another array.',
      inputFormat: 'First line: n. Second line: n integers.',
      outputFormat: 'Print the copied array.',
      sampleInput: '5\n1 2 3 4 5',
      sampleOutput: '1 2 3 4 5'
    }
  }

  if (lowerTitle.includes('insert an element at a specific position')) {
    return {
      explanation: 'Write a program that inserts an element at specified position in array.',
      inputFormat: 'First line: n. Second line: n integers. Third line: position and element.',
      outputFormat: 'Print array after insertion.',
      sampleInput: '5\n1 2 3 4 5\n3 10',
      sampleOutput: '1 2 10 3 4 5'
    }
  }

  if (lowerTitle.includes('delete an element from an array')) {
    return {
      explanation: 'Write a program that deletes an element at specified position.',
      inputFormat: 'First line: n. Second line: n integers. Third line: position.',
      outputFormat: 'Print array after deletion.',
      sampleInput: '5\n1 2 3 4 5\n3',
      sampleOutput: '1 2 4 5'
    }
  }

  if (lowerTitle.includes('reverse an array')) {
    return {
      explanation: 'Write a program that reads n integers and reverses the array.',
      inputFormat: 'First line: n. Second line: n integers.',
      outputFormat: 'Print the reversed array.',
      sampleInput: '5\n1 2 3 4 5',
      sampleOutput: '5 4 3 2 1'
    }
  }

  if (lowerTitle.includes('search an element in an array using linear search')) {
    return {
      explanation: 'Write a program that searches for an element using linear search.',
      inputFormat: 'First line: n. Second line: n integers. Third line: element to search.',
      outputFormat: 'Print index if found, -1 if not found.',
      sampleInput: '5\n1 2 3 4 5\n3',
      sampleOutput: '2'
    }
  }

  if (lowerTitle.includes('sort an array in ascending order')) {
    return {
      explanation: 'Write a program that reads n integers and sorts them in ascending order.',
      inputFormat: 'First line: n. Second line: n integers.',
      outputFormat: 'Print the sorted array.',
      sampleInput: '5\n3 1 4 2 5',
      sampleOutput: '1 2 3 4 5'
    }
  }

  // Strings
  if (lowerTitle.includes('find the length of a string')) {
    return {
      explanation: 'Write a program that reads a string and finds its length.',
      inputFormat: 'A single string.',
      outputFormat: 'Print the length.',
      sampleInput: 'hello',
      sampleOutput: '5'
    }
  }

  if (lowerTitle.includes('copy one string to another')) {
    return {
      explanation: 'Write a program that reads a string and copies it to another.',
      inputFormat: 'A single string.',
      outputFormat: 'Print the copied string.',
      sampleInput: 'hello',
      sampleOutput: 'hello'
    }
  }

  if (lowerTitle.includes('concatenate two strings')) {
    return {
      explanation: 'Write a program that reads two strings and concatenates them.',
      inputFormat: 'Two strings separated by space.',
      outputFormat: 'Print the concatenated string.',
      sampleInput: 'hello world',
      sampleOutput: 'helloworld'
    }
  }

  if (lowerTitle.includes('compare two strings')) {
    return {
      explanation: 'Write a program that reads two strings and compares them.',
      inputFormat: 'Two strings separated by space.',
      outputFormat: 'Print 0 if equal, negative if first < second, positive if first > second.',
      sampleInput: 'hello hello',
      sampleOutput: '0'
    }
  }

  if (lowerTitle.includes('reverse a string')) {
    return {
      explanation: 'Write a program that reads a string and reverses it.',
      inputFormat: 'A single string.',
      outputFormat: 'Print the reversed string.',
      sampleInput: 'hello',
      sampleOutput: 'olleh'
    }
  }

  if (lowerTitle.includes('check if a string is palindrome')) {
    return {
      explanation: 'Write a program that reads a string and checks if it is palindrome.',
      inputFormat: 'A single string.',
      outputFormat: 'Print "Palindrome" or "Not Palindrome".',
      sampleInput: 'radar',
      sampleOutput: 'Palindrome'
    }
  }

  if (lowerTitle.includes('count vowels and consonants in a string')) {
    return {
      explanation: 'Write a program that reads a string and counts vowels and consonants.',
      inputFormat: 'A single string.',
      outputFormat: 'Print "Vowels: X, Consonants: Y".',
      sampleInput: 'hello',
      sampleOutput: 'Vowels: 2, Consonants: 3'
    }
  }

  if (lowerTitle.includes('find the frequency of characters in a string')) {
    return {
      explanation: 'Write a program that reads a string and finds frequency of each character.',
      inputFormat: 'A single string.',
      outputFormat: 'Print each character and its frequency.',
      sampleInput: 'hello',
      sampleOutput: 'h:1 e:1 l:2 o:1'
    }
  }

  if (lowerTitle.includes('remove all whitespaces from a string')) {
    return {
      explanation: 'Write a program that reads a string and removes all whitespace characters.',
      inputFormat: 'A single string.',
      outputFormat: 'Print string without whitespaces.',
      sampleInput: 'hello world',
      sampleOutput: 'helloworld'
    }
  }

  if (lowerTitle.includes('toggle case of each character in a string')) {
    return {
      explanation: 'Write a program that reads a string and toggles case of each character.',
      inputFormat: 'A single string.',
      outputFormat: 'Print string with toggled cases.',
      sampleInput: 'Hello',
      sampleOutput: 'hELLO'
    }
  }

  if (lowerTitle.includes('find the first non-repeating character in a string')) {
    return {
      explanation: 'Write a program that finds the first non-repeating character in a string.',
      inputFormat: 'A single string.',
      outputFormat: 'Print the first non-repeating character.',
      sampleInput: 'swiss',
      sampleOutput: 'w'
    }
  }

  if (lowerTitle.includes('check if two strings are anagrams')) {
    return {
      explanation: 'Write a program that reads two strings and checks if they are anagrams.',
      inputFormat: 'Two strings separated by space.',
      outputFormat: 'Print "Anagram" or "Not Anagram".',
      sampleInput: 'listen silent',
      sampleOutput: 'Anagram'
    }
  }

  // Recursion
  if (lowerTitle.includes('calculate factorial using recursion')) {
    return {
      explanation: 'Write a program that reads n and calculates factorial using recursion.',
      inputFormat: 'A single integer n.',
      outputFormat: 'Print the factorial.',
      sampleInput: '5',
      sampleOutput: '120'
    }
  }

  if (lowerTitle.includes('generate fibonacci series using recursion')) {
    return {
      explanation: 'Write a program that reads n and prints first n Fibonacci numbers using recursion.',
      inputFormat: 'A single integer n.',
      outputFormat: 'Print Fibonacci numbers separated by spaces.',
      sampleInput: '5',
      sampleOutput: '0 1 1 2 3'
    }
  }

  if (lowerTitle.includes('calculate power using recursion')) {
    return {
      explanation: 'Write a program that reads base and exponent and calculates power using recursion.',
      inputFormat: 'Two integers: base and exponent.',
      outputFormat: 'Print the result.',
      sampleInput: '2 3',
      sampleOutput: '8'
    }
  }

  // Searching
  if (lowerTitle.includes('implement linear search')) {
    return {
      explanation: 'Write a program that implements linear search algorithm.',
      inputFormat: 'First line: n. Second line: n integers. Third line: element to search.',
      outputFormat: 'Print index if found, -1 if not found.',
      sampleInput: '5\n1 2 3 4 5\n3',
      sampleOutput: '2'
    }
  }

  if (lowerTitle.includes('implement binary search')) {
    return {
      explanation: 'Write a program that implements binary search on a sorted array.',
      inputFormat: 'First line: n. Second line: n sorted integers. Third line: element to search.',
      outputFormat: 'Print index if found, -1 if not found.',
      sampleInput: '5\n1 2 3 4 5\n3',
      sampleOutput: '2'
    }
  }

  // Sorting
  if (lowerTitle.includes('implement bubble sort')) {
    return {
      explanation: 'Write a program that implements bubble sort algorithm.',
      inputFormat: 'First line: n. Second line: n integers.',
      outputFormat: 'Print the sorted array.',
      sampleInput: '5\n3 1 4 2 5',
      sampleOutput: '1 2 3 4 5'
    }
  }

  if (lowerTitle.includes('implement selection sort')) {
    return {
      explanation: 'Write a program that implements selection sort algorithm.',
      inputFormat: 'First line: n. Second line: n integers.',
      outputFormat: 'Print the sorted array.',
      sampleInput: '5\n3 1 4 2 5',
      sampleOutput: '1 2 3 4 5'
    }
  }

  if (lowerTitle.includes('implement insertion sort')) {
    return {
      explanation: 'Write a program that implements insertion sort algorithm.',
      inputFormat: 'First line: n. Second line: n integers.',
      outputFormat: 'Print the sorted array.',
      sampleInput: '5\n3 1 4 2 5',
      sampleOutput: '1 2 3 4 5'
    }
  }

  // Linked List
  if (lowerTitle.includes('create a linked list')) {
    return {
      explanation: 'Write a program that creates a linked list with given elements.',
      inputFormat: 'First line: n. Second line: n integers.',
      outputFormat: 'Print the linked list elements.',
      sampleInput: '5\n1 2 3 4 5',
      sampleOutput: '1 2 3 4 5'
    }
  }

  if (lowerTitle.includes('traverse a linked list')) {
    return {
      explanation: 'Write a program that traverses a linked list and prints elements.',
      inputFormat: 'First line: n. Second line: n integers.',
      outputFormat: 'Print the linked list elements.',
      sampleInput: '5\n1 2 3 4 5',
      sampleOutput: '1 2 3 4 5'
    }
  }

  // Stack
  if (lowerTitle.includes('implement stack using array')) {
    return {
      explanation: 'Write a program that implements stack operations using array.',
      inputFormat: 'Multiple operations: push/pop commands with values.',
      outputFormat: 'Print results of operations.',
      sampleInput: 'push 1\npush 2\npop\npush 3',
      sampleOutput: '1\n2\n3'
    }
  }

  if (lowerTitle.includes('check balanced parentheses')) {
    return {
      explanation: 'Write a program that checks if parentheses in expression are balanced.',
      inputFormat: 'A string containing parentheses.',
      outputFormat: 'Print "Balanced" or "Not Balanced".',
      sampleInput: '(a+b)',
      sampleOutput: 'Balanced'
    }
  }

  // Queue
  if (lowerTitle.includes('implement queue using array')) {
    return {
      explanation: 'Write a program that implements queue operations using array.',
      inputFormat: 'Multiple operations: enqueue/dequeue commands.',
      outputFormat: 'Print results of operations.',
      sampleInput: 'enqueue 1\nenqueue 2\ndequeue\nenqueue 3',
      sampleOutput: '1\n2\n3'
    }
  }

  // Trees
  if (lowerTitle.includes('create binary tree')) {
    return {
      explanation: 'Write a program that creates a binary tree from given elements.',
      inputFormat: 'First line: n. Second line: n integers for level order.',
      outputFormat: 'Print tree traversal.',
      sampleInput: '5\n1 2 3 4 5',
      sampleOutput: '1 2 3 4 5'
    }
  }

  if (lowerTitle.includes('inorder traversal')) {
    return {
      explanation: 'Write a program that performs inorder traversal of binary tree.',
      inputFormat: 'Tree input format.',
      outputFormat: 'Print inorder traversal.',
      sampleInput: '1 2 3 4 5',
      sampleOutput: '4 2 5 1 3'
    }
  }

  // Heap
  if (lowerTitle.includes('implement max heap')) {
    return {
      explanation: 'Write a program that implements max heap operations.',
      inputFormat: 'Multiple operations: insert/extract commands.',
      outputFormat: 'Print heap after operations.',
      sampleInput: 'insert 5\ninsert 3\ninsert 7\nextract',
      sampleOutput: '7 5 3'
    }
  }

  // Graphs
  if (lowerTitle.includes('implement adjacency list')) {
    return {
      explanation: 'Write a program that implements graph using adjacency list.',
      inputFormat: 'First line: vertices edges. Next lines: edges.',
      outputFormat: 'Print adjacency list.',
      sampleInput: '3 2\n0 1\n1 2',
      sampleOutput: '0: 1\n1: 0 2\n2: 1'
    }
  }

  if (lowerTitle.includes('implement bfs traversal')) {
    return {
      explanation: 'Write a program that implements BFS traversal of graph.',
      inputFormat: 'Graph input format.',
      outputFormat: 'Print BFS traversal from source.',
      sampleInput: '0 1 2 3',
      sampleOutput: '0 1 2 3'
    }
  }

  // Dynamic Programming
  if (lowerTitle.includes('implement fibonacci using dp')) {
    return {
      explanation: 'Write a program that calculates nth Fibonacci number using DP.',
      inputFormat: 'A single integer n.',
      outputFormat: 'Print the nth Fibonacci number.',
      sampleInput: '5',
      sampleOutput: '5'
    }
  }

  if (lowerTitle.includes('find longest common subsequence')) {
    return {
      explanation: 'Write a program that finds length of longest common subsequence.',
      inputFormat: 'Two strings separated by space.',
      outputFormat: 'Print the length of LCS.',
      sampleInput: 'abc def',
      sampleOutput: '1'
    }
  }

  if (lowerTitle.includes('implement 0/1 knapsack')) {
    return {
      explanation: 'Write a program that solves 0/1 knapsack problem using DP.',
      inputFormat: 'First line: n W. Second line: weights. Third line: values.',
      outputFormat: 'Print maximum value.',
      sampleInput: '3 50\n10 20 30\n60 100 120',
      sampleOutput: '220'
    }
  }

  // Default fallback
  return {
    explanation: 'Solve this coding problem by writing efficient code that passes all test cases.',
    inputFormat: 'See sample input for format.',
    outputFormat: 'See sample output for format.',
    sampleInput: 'Sample input',
    sampleOutput: 'Sample output'
  }
}

const getTestCasesForProblem = (title: string): TestCase[] => {
  const lowerTitle = title.toLowerCase()

  if (lowerTitle.includes('swap two numbers')) {
    return [
      { input: '5 10', expectedOutput: '10 5', description: 'Basic swap' },
      { input: '-1 7', expectedOutput: '7 -1', description: 'Negative and positive' },
      { input: '0 0', expectedOutput: '0 0', description: 'Same numbers' },
      { input: '100 -50', expectedOutput: '-50 100', description: 'Large numbers' }
    ]
  }

  if (lowerTitle.includes('largest element in an array')) {
    return [
      { input: '5\n1 2 3 4 5', expectedOutput: '5', description: 'Basic case' },
      { input: '4\n-1 -2 -3 -4', expectedOutput: '-1', description: 'Negative numbers' },
      { input: '1\n10', expectedOutput: '10', description: 'Single element' },
      { input: '3\n5 5 5', expectedOutput: '5', description: 'All same' }
    ]
  }

  if (lowerTitle.includes('second largest element in an array')) {
    return [
      { input: '5\n1 2 3 4 5', expectedOutput: '4', description: 'Basic case' },
      { input: '4\n-1 -2 -3 -4', expectedOutput: '-2', description: 'Negative numbers' },
      { input: '2\n10 20', expectedOutput: '10', description: 'Two elements' },
      { input: '3\n5 5 4', expectedOutput: '5', description: 'Duplicates' }
    ]
  }

  if (lowerTitle.includes('sum of all elements in an array')) {
    return [
      { input: '5\n1 2 3 4 5', expectedOutput: '15', description: 'Basic case' },
      { input: '4\n-1 -2 -3 -4', expectedOutput: '-10', description: 'Negative numbers' },
      { input: '1\n10', expectedOutput: '10', description: 'Single element' },
      { input: '3\n0 0 0', expectedOutput: '0', description: 'All zeros' }
    ]
  }

  if (lowerTitle.includes('check whether a number is positive or negative')) {
    return [
      { input: '5', expectedOutput: 'Positive', description: 'Positive number' },
      { input: '-3', expectedOutput: 'Negative', description: 'Negative number' },
      { input: '0', expectedOutput: 'Zero', description: 'Zero' },
      { input: '100', expectedOutput: 'Positive', description: 'Large positive' }
    ]
  }

  if (lowerTitle.includes('check whether a number is even or odd')) {
    return [
      { input: '4', expectedOutput: 'Even', description: 'Even number' },
      { input: '7', expectedOutput: 'Odd', description: 'Odd number' },
      { input: '0', expectedOutput: 'Even', description: 'Zero' },
      { input: '100', expectedOutput: 'Even', description: 'Large even' }
    ]
  }

  if (lowerTitle.includes('count even and odd numbers in an array')) {
    return [
      { input: '5\n1 2 3 4 5', expectedOutput: 'Even: 2, Odd: 3', description: 'Mixed numbers' },
      { input: '4\n2 4 6 8', expectedOutput: 'Even: 4, Odd: 0', description: 'All even' },
      { input: '3\n1 3 5', expectedOutput: 'Even: 0, Odd: 3', description: 'All odd' },
      { input: '1\n0', expectedOutput: 'Even: 1, Odd: 0', description: 'Zero' }
    ]
  }

  if (lowerTitle.includes('reverse an array')) {
    return [
      { input: '5\n1 2 3 4 5', expectedOutput: '5 4 3 2 1', description: 'Basic case' },
      { input: '1\n10', expectedOutput: '10', description: 'Single element' },
      { input: '3\n1 2 3', expectedOutput: '3 2 1', description: 'Three elements' },
      { input: '4\n-1 -2 -3 -4', expectedOutput: '-4 -3 -2 -1', description: 'Negative numbers' }
    ]
  }

  if (lowerTitle.includes('factorial')) {
    return [
      { input: '5', expectedOutput: '120', description: 'Factorial of 5' },
      { input: '0', expectedOutput: '1', description: 'Factorial of 0' },
      { input: '1', expectedOutput: '1', description: 'Factorial of 1' },
      { input: '3', expectedOutput: '6', description: 'Factorial of 3' }
    ]
  }

  if (lowerTitle.includes('fibonacci')) {
    return [
      { input: '5', expectedOutput: '0 1 1 2 3', description: 'First 5 fibonacci' },
      { input: '1', expectedOutput: '0', description: 'First 1 fibonacci' },
      { input: '3', expectedOutput: '0 1 1', description: 'First 3 fibonacci' },
      { input: '7', expectedOutput: '0 1 1 2 3 5 8', description: 'First 7 fibonacci' }
    ]
  }

  if (lowerTitle.includes('find the length of a string')) {
    return [
      { input: 'a', expectedOutput: '1', description: 'Single character' },
      { input: 'ab', expectedOutput: '2', description: 'Two characters' },
      { input: 'abc', expectedOutput: '3', description: 'Three characters' },
      { input: 'abcd', expectedOutput: '4', description: 'Four characters' }
    ]
  }

  // Default test cases for other problems
  return [
    { input: '1', expectedOutput: '1', description: 'Sample input 1' },
    { input: '2', expectedOutput: '2', description: 'Sample input 2' },
    { input: '3', expectedOutput: '3', description: 'Sample input 3' },
    { input: '4', expectedOutput: '4', description: 'Sample input 4' }
  ]
}

const getDefaultCodeForProblem = (title: string, language: string): string => {
  const lowerTitle = title.toLowerCase()

  if (language === 'python') {
    if (lowerTitle.includes('swap two numbers')) {
      return `a, b = map(int, input().split())
temp = a
a = b
b = temp
print(a, b)`
    }

    if (lowerTitle.includes('largest element in an array')) {
      return `n = int(input())
arr = list(map(int, input().split()))
max_element = max(arr)
print(max_element)`
    }

    if (lowerTitle.includes('second largest element in an array')) {
      return `n = int(input())
arr = list(map(int, input().split()))
arr.sort()
print(arr[-2])`
    }

    if (lowerTitle.includes('sum of all elements in an array')) {
      return `n = int(input())
arr = list(map(int, input().split()))
total = sum(arr)
print(total)`
    }

    if (lowerTitle.includes('check whether a number is positive or negative')) {
      return `num = int(input())
if num > 0:
    print("Positive")
elif num < 0:
    print("Negative")
else:
    print("Zero")`
    }

    if (lowerTitle.includes('check whether a number is even or odd')) {
      return `num = int(input())
if num % 2 == 0:
    print("Even")
else:
    print("Odd")`
    }

    if (lowerTitle.includes('count even and odd numbers in an array')) {
      return `n = int(input())
arr = list(map(int, input().split()))
even_count = sum(1 for x in arr if x % 2 == 0)
odd_count = n - even_count
print(f"Even: {even_count}, Odd: {odd_count}")`
    }

    if (lowerTitle.includes('reverse an array')) {
      return `n = int(input())
arr = list(map(int, input().split()))
arr.reverse()
print(' '.join(map(str, arr)))`
    }

    if (lowerTitle.includes('factorial')) {
      return `def factorial(n):
    if n == 0 or n == 1:
        return 1
    return n * factorial(n - 1)

n = int(input())
print(factorial(n))`
    }

    if (lowerTitle.includes('fibonacci')) {
      return `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

n = int(input())
for i in range(n):
    print(fibonacci(i), end=' ')`
    }

    if (lowerTitle.includes('find the length of a string')) {
      return `str = input()
print(len(str))`
    }
  }

  if (language === 'java') {
    if (lowerTitle.includes('swap two numbers')) {
      return `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int a = scanner.nextInt();
        int b = scanner.nextInt();
        
        int temp = a;
        a = b;
        b = temp;
        
        System.out.println(a + " " + b);
    }
}`
    }

    if (lowerTitle.includes('largest element in an array')) {
      return `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] arr = new int[n];
        
        for (int i = 0; i < n; i++) {
            arr[i] = scanner.nextInt();
        }
        
        int max = arr[0];
        for (int i = 1; i < n; i++) {
            if (arr[i] > max) {
                max = arr[i];
            }
        }
        
        System.out.println(max);
    }
}`
    }

    if (lowerTitle.includes('second largest element in an array')) {
      return `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] arr = new int[n];
        
        for (int i = 0; i < n; i++) {
            arr[i] = scanner.nextInt();
        }
        
        int max = Integer.MIN_VALUE;
        int secondMax = Integer.MIN_VALUE;
        
        for (int num : arr) {
            if (num > max) {
                secondMax = max;
                max = num;
            } else if (num > secondMax && num != max) {
                secondMax = num;
            }
        }
        
        System.out.println(secondMax);
    }
}`
    }

    if (lowerTitle.includes('sum of all elements in an array')) {
      return `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] arr = new int[n];
        int sum = 0;
        
        for (int i = 0; i < n; i++) {
            arr[i] = scanner.nextInt();
            sum += arr[i];
        }
        
        System.out.println(sum);
    }
}`
    }

    if (lowerTitle.includes('check whether a number is positive or negative')) {
      return `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int num = scanner.nextInt();
        
        if (num > 0) {
            System.out.println("Positive");
        } else if (num < 0) {
            System.out.println("Negative");
        } else {
            System.out.println("Zero");
        }
    }
}`
    }

    if (lowerTitle.includes('check whether a number is even or odd')) {
      return `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int num = scanner.nextInt();
        
        if (num % 2 == 0) {
            System.out.println("Even");
        } else {
            System.out.println("Odd");
        }
    }
}`
    }

    if (lowerTitle.includes('count even and odd numbers in an array')) {
      return `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] arr = new int[n];
        int evenCount = 0;
        
        for (int i = 0; i < n; i++) {
            arr[i] = scanner.nextInt();
            if (arr[i] % 2 == 0) {
                evenCount++;
            }
        }
        
        int oddCount = n - evenCount;
        System.out.println("Even: " + evenCount + ", Odd: " + oddCount);
    }
}`
    }

    if (lowerTitle.includes('reverse an array')) {
      return `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] arr = new int[n];
        
        for (int i = 0; i < n; i++) {
            arr[i] = scanner.nextInt();
        }
        
        for (int i = n - 1; i >= 0; i--) {
            System.out.print(arr[i] + " ");
        }
        System.out.println();
    }
}`
    }

    if (lowerTitle.includes('factorial')) {
      return `import java.util.Scanner;

public class Main {
    public static int factorial(int n) {
        if (n == 0 || n == 1) {
            return 1;
        }
        return n * factorial(n - 1);
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        System.out.println(factorial(n));
    }
}`
    }

    if (lowerTitle.includes('fibonacci')) {
      return `import java.util.Scanner;

public class Main {
    public static int fibonacci(int n) {
        if (n <= 1) {
            return n;
        }
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        
        for (int i = 0; i < n; i++) {
            System.out.print(fibonacci(i) + " ");
        }
        System.out.println();
    }
}`
    }
  }

  if (language === 'cpp') {
    if (lowerTitle.includes('swap two numbers')) {
      return `#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    
    int temp = a;
    a = b;
    b = temp;
    
    cout << a << " " << b << endl;
    return 0;
}`
    }

    if (lowerTitle.includes('largest element in an array')) {
      return `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int arr[n];
    
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    
    int max = arr[0];
    for (int i = 1; i < n; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    
    cout << max << endl;
    return 0;
}`
    }

    if (lowerTitle.includes('second largest element in an array')) {
      return `#include <iostream>
#include <climits>
using namespace std;

int main() {
    int n;
    cin >> n;
    int arr[n];
    
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    
    int max = INT_MIN;
    int secondMax = INT_MIN;
    
    for (int i = 0; i < n; i++) {
        if (arr[i] > max) {
            secondMax = max;
            max = arr[i];
        } else if (arr[i] > secondMax && arr[i] != max) {
            secondMax = arr[i];
        }
    }
    
    cout << secondMax << endl;
    return 0;
}`
    }

    if (lowerTitle.includes('sum of all elements in an array')) {
      return `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int arr[n];
    int sum = 0;
    
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
        sum += arr[i];
    }
    
    cout << sum << endl;
    return 0;
}`
    }

    if (lowerTitle.includes('check whether a number is positive or negative')) {
      return `#include <iostream>
using namespace std;

int main() {
    int num;
    cin >> num;
    
    if (num > 0) {
        cout << "Positive" << endl;
    } else if (num < 0) {
        cout << "Negative" << endl;
    } else {
        cout << "Zero" << endl;
    }
    
    return 0;
}`
    }

    if (lowerTitle.includes('check whether a number is even or odd')) {
      return `#include <iostream>
using namespace std;

int main() {
    int num;
    cin >> num;
    
    if (num % 2 == 0) {
        cout << "Even" << endl;
    } else {
        cout << "Odd" << endl;
    }
    
    return 0;
}`
    }

    if (lowerTitle.includes('count even and odd numbers in an array')) {
      return `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int arr[n];
    int evenCount = 0;
    
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
        if (arr[i] % 2 == 0) {
            evenCount++;
        }
    }
    
    int oddCount = n - evenCount;
    cout << "Even: " << evenCount << ", Odd: " << oddCount << endl;
    return 0;
}`
    }

    if (lowerTitle.includes('reverse an array')) {
      return `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int arr[n];
    
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    
    for (int i = n - 1; i >= 0; i--) {
        cout << arr[i] << " ";
    }
    cout << endl;
    
    return 0;
}`
    }

    if (lowerTitle.includes('factorial')) {
      return `#include <iostream>
using namespace std;

int factorial(int n) {
    if (n == 0 || n == 1) {
        return 1;
    }
    return n * factorial(n - 1);
}

int main() {
    int n;
    cin >> n;
    cout << factorial(n) << endl;
    return 0;
}`
    }

    if (lowerTitle.includes('fibonacci')) {
      return `#include <iostream>
using namespace std;

int fibonacci(int n) {
    if (n <= 1) {
        return n;
    }
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main() {
    int n;
    cin >> n;
    
    for (int i = 0; i < n; i++) {
        cout << fibonacci(i) << " ";
    }
    cout << endl;
    
    return 0;
}`
    }
  }

  if (language === 'javascript') {
    if (lowerTitle.includes('swap two numbers')) {
      return `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(' ');
let a = parseInt(input[0]);
let b = parseInt(input[1]);

let temp = a;
a = b;
b = temp;

console.log(a, b);`
    }

    if (lowerTitle.includes('largest element in an array')) {
      return `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split('\n');
const n = parseInt(input[0]);
const arr = input[1].trim().split(' ').map(Number);

const maxElement = Math.max(...arr);
console.log(maxElement);`
    }

    if (lowerTitle.includes('second largest element in an array')) {
      return `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split('\n');
const n = parseInt(input[0]);
const arr = input[1].trim().split(' ').map(Number);

arr.sort((a, b) => b - a);
console.log(arr[1]);`
    }

    if (lowerTitle.includes('sum of all elements in an array')) {
      return `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split('\n');
const n = parseInt(input[0]);
const arr = input[1].trim().split(' ').map(Number);

const sum = arr.reduce((acc, curr) => acc + curr, 0);
console.log(sum);`
    }

    if (lowerTitle.includes('check whether a number is positive or negative')) {
      return `const fs = require('fs');
const num = parseInt(fs.readFileSync(0, 'utf-8').trim());

if (num > 0) {
    console.log("Positive");
} else if (num < 0) {
    console.log("Negative");
} else {
    console.log("Zero");
}`
    }

    if (lowerTitle.includes('check whether a number is even or odd')) {
      return `const fs = require('fs');
const num = parseInt(fs.readFileSync(0, 'utf-8').trim());

if (num % 2 === 0) {
    console.log("Even");
} else {
    console.log("Odd");
}`
    }

    if (lowerTitle.includes('count even and odd numbers in an array')) {
      return `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split('\n');
const n = parseInt(input[0]);
const arr = input[1].trim().split(' ').map(Number);

const evenCount = arr.filter(x => x % 2 === 0).length;
const oddCount = n - evenCount;
console.log(\`Even: \${evenCount}, Odd: \${oddCount}\`);`
    }

    if (lowerTitle.includes('reverse an array')) {
      return `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split('\n');
const n = parseInt(input[0]);
const arr = input[1].trim().split(' ').map(Number);

arr.reverse();
console.log(arr.join(' '));`
    }

    if (lowerTitle.includes('factorial')) {
      return `const fs = require('fs');

function factorial(n) {
    if (n === 0 || n === 1) {
        return 1;
    }
    return n * factorial(n - 1);
}

const n = parseInt(fs.readFileSync(0, 'utf-8').trim());
console.log(factorial(n));`
    }

    if (lowerTitle.includes('fibonacci')) {
      return `const fs = require('fs');

function fibonacci(n) {
    if (n <= 1) {
        return n;
    }
    return fibonacci(n - 1) + fibonacci(n - 2);
}

const n = parseInt(fs.readFileSync(0, 'utf-8').trim());
const result = [];
for (let i = 0; i < n; i++) {
    result.push(fibonacci(i));
}
console.log(result.join(' '));`
    }
  }

  // Default fallback
  const comment = language === 'python' ? '#' : '//'
  return `${comment} Write your ${language} code here`
}

export default function CodingProblemPage() {
  const params = useParams()
  const topic = params.topic as string
  const id = parseInt(params.id as string)

  const [problem, setProblem] = useState<Problem | null>(null)
  const [loading, setLoading] = useState(true)
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('python')
  const [output, setOutput] = useState('Run the code to see results.')
  const [isRunning, setIsRunning] = useState(false)
  const [testResults, setTestResults] = useState<{ passed: number; total: number; details: string[] } | null>(null)
  const [fontSize, setFontSize] = useState(14)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [allPassed, setAllPassed] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const editorRef = useRef<any>(null)

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await fetch(`/api/learn-practice/${topic}`)
        const data = await response.json()
        const foundProblem = data.problems.find((p: Problem) => p.id === id)
        if (foundProblem) {
          setProblem(foundProblem)
          const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
          setIsCompleted(localStorage.getItem(`solved-${slug}-${id}`) === 'true')
        }
      } catch (error) {
        console.error('Error fetching problem:', error)
      } finally {
        setLoading(false)
      }
    }

    if (topic && id) {
      fetchProblem()
    }
  }, [topic, id])

  useEffect(() => {
    if (showHint && problem) {
      setCode(getDefaultCodeForProblem(problem.title, language))
    } else {
      setCode('')
    }
  }, [showHint, language, problem])

  const problemDetails = problem ? getProblemDetails(problem.title) : {
    explanation: 'Loading...',
    inputFormat: 'Loading...',
    outputFormat: 'Loading...',
    sampleInput: 'Loading...',
    sampleOutput: 'Loading...'
  }

  const testCases = problem ? getTestCasesForProblem(problem.title) : []

  const submitCode = () => {
    const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    localStorage.setItem(`solved-${slug}-${id}`, 'true')
    setIsCompleted(true)
    alert('Problem submitted successfully! Marked as completed.')
    // In real app, update database
  }

  const runCode = async () => {
    setIsRunning(true)
    setOutput('Running code...')
    setTestResults(null)

    const results: string[] = []
    let passed = 0

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i]
      try {
        const response = await fetch('/api/code-execute', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            language,
            code,
            input: testCase.input,
          }),
        })

        const data = await response.json()

        if (data.error) {
          results.push(`Test ${i + 1}: Error - ${data.error}`)
        } else if (data.run.stderr) {
          results.push(`Test ${i + 1}: Error - ${data.run.stderr}`)
        } else {
          const actualOutput = data.run.stdout.trim()
          const expected = testCase.expectedOutput.trim()
          if (actualOutput === expected) {
            results.push(`Test ${i + 1}: PASSED`)
            passed++
          } else {
            results.push(`Test ${i + 1}: FAILED - Expected: "${expected}", Got: "${actualOutput}"`)
          }
        }
      } catch (error) {
        results.push(`Test ${i + 1}: Error - ${error}`)
      }
    }

    setTestResults({ passed, total: testCases.length, details: results })
    setOutput(results.join('\n'))
    setAllPassed(passed === testCases.length)
    setIsRunning(false)
  }

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading problem...</p>
        </div>
      </div>
    )
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Problem Not Found</h1>
          <p className="text-gray-600">The requested problem could not be found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-8rem)]">
          {/* Left Panel - Problem Description */}
          <div className="space-y-6 overflow-y-auto">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold">{problem.title}</CardTitle>
                  {isCompleted && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      Completed
                    </span>
                  )}
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  problem.difficulty === 'Easy' ? 'bg-green-50 text-green-700 border border-green-200' :
                  problem.difficulty === 'Medium' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                  'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {problem.difficulty}
                </span>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Problem Explanation</h3>
                  <p className="text-gray-700">
                    {problemDetails.explanation}
                  </p>
                  <p className="text-gray-700 mt-2">
                    <strong>Input Format:</strong> {problemDetails.inputFormat}
                  </p>
                  <p className="text-gray-700 mt-2">
                    <strong>Output Format:</strong> {problemDetails.outputFormat}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Sample Input</h3>
                  <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">
                    {problemDetails.sampleInput.split('\n').map((line, index) => (
                      <div key={index}>{line}</div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Sample Output</h3>
                  <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">
                    {problemDetails.sampleOutput}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Testcases</h3>
                  <p className="text-gray-600 text-sm">Your code will be tested against multiple test cases automatically when you run it.</p>
                </div>

                {/* Test Results */}
                {testResults && (
                  <div>
                    <h3 className="font-semibold mb-2">Test Results</h3>
                    <div className="bg-white p-4 rounded-lg border">
                      <div className="text-sm">
                        <p className="font-semibold">
                          {testResults.passed}/{testResults.total} tests passed
                        </p>
                        <div className="mt-2 space-y-1">
                          {testResults.details.map((detail, index) => (
                            <p key={index} className={`text-xs ${detail.includes('PASSED') ? 'text-green-600' : 'text-red-600'}`}>
                              {detail}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Code Editor */}
          <div className={`space-y-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-white p-4' : ''}`}>
            {/* Editor Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
              <h2 className="text-lg font-semibold">Code Editor</h2>
              <div className="flex items-center gap-2">
                {!showHint && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowHint(true)}
                  >
                    Show Hint
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                >
                  {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                </Button>
              </div>
            </div>

            {showHint && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  💡 <strong>Hint:</strong> The initial code template has been loaded. This provides a starting structure for the problem. You can modify it as needed to solve the challenge.
                </p>
              </div>
            )}

            {/* Code Editor */}
            <div className={`bg-white border rounded-lg overflow-hidden ${isFullscreen ? 'h-[calc(100vh-120px)]' : ''}`}>
              <Editor
                height={isFullscreen ? "100%" : "400px"}
                language={language}
                value={code}
                onChange={(value) => setCode(value || '')}
                onMount={handleEditorDidMount}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize,
                  lineNumbers: 'on',
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            </div>

            {!isFullscreen && (
              <>
                {/* Output / Console Area */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Output</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-black text-green-400 p-4 rounded-md text-sm font-mono whitespace-pre-wrap min-h-[100px] overflow-auto">
                      {output}
                    </pre>
                  </CardContent>
                </Card>

                {/* Bottom Controls */}
                <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
                  <div className="flex items-center space-x-4">
                    <Button
                      onClick={runCode}
                      disabled={isRunning}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {isRunning ? 'Running...' : 'Run Code'}
                    </Button>
                    <Button variant="outline" disabled={!allPassed} onClick={submitCode}>
                      Save & Submit
                    </Button>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setFontSize(Math.max(10, fontSize - 2))}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        A-
                      </button>
                      <span className="text-sm">{fontSize}px</span>
                      <button
                        onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        A+
                      </button>
                    </div>

                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="python">Python</SelectItem>
                        <SelectItem value="javascript">JavaScript</SelectItem>
                        <SelectItem value="java">Java</SelectItem>
                        <SelectItem value="cpp">C++</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}