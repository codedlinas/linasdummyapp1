#!/usr/bin/env python3
"""
Fibonacci Numbers Calculator

This module provides functions to calculate Fibonacci numbers using different methods.
"""


def fibonacci_iterative(n):
    """
    Calculate the nth Fibonacci number using an iterative approach.
    
    Args:
        n (int): The position in the Fibonacci sequence (0-indexed)
        
    Returns:
        int: The nth Fibonacci number
        
    Raises:
        ValueError: If n is negative
        
    Examples:
        >>> fibonacci_iterative(0)
        0
        >>> fibonacci_iterative(1)
        1
        >>> fibonacci_iterative(10)
        55
    """
    if n < 0:
        raise ValueError("n must be a non-negative integer")
    
    if n <= 1:
        return n
    
    prev, curr = 0, 1
    for _ in range(2, n + 1):
        prev, curr = curr, prev + curr
    
    return curr


def fibonacci_recursive(n):
    """
    Calculate the nth Fibonacci number using a recursive approach.
    
    Note: This method is less efficient for large values of n.
    
    Args:
        n (int): The position in the Fibonacci sequence (0-indexed)
        
    Returns:
        int: The nth Fibonacci number
        
    Raises:
        ValueError: If n is negative
        
    Examples:
        >>> fibonacci_recursive(0)
        0
        >>> fibonacci_recursive(1)
        1
        >>> fibonacci_recursive(5)
        5
    """
    if n < 0:
        raise ValueError("n must be a non-negative integer")
    
    if n <= 1:
        return n
    
    return fibonacci_recursive(n - 1) + fibonacci_recursive(n - 2)


def fibonacci_sequence(count):
    """
    Generate a sequence of Fibonacci numbers.
    
    Args:
        count (int): Number of Fibonacci numbers to generate
        
    Returns:
        list: A list containing the first 'count' Fibonacci numbers
        
    Raises:
        ValueError: If count is negative
        
    Examples:
        >>> fibonacci_sequence(5)
        [0, 1, 1, 2, 3]
        >>> fibonacci_sequence(10)
        [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
    """
    if count < 0:
        raise ValueError("count must be a non-negative integer")
    
    if count == 0:
        return []
    if count == 1:
        return [0]
    
    sequence = [0, 1]
    for i in range(2, count):
        sequence.append(sequence[i - 1] + sequence[i - 2])
    
    return sequence


def main():
    """
    Main function to demonstrate Fibonacci number calculations.
    
    Prompts the user for input and displays Fibonacci numbers.
    """
    print("=" * 50)
    print("Fibonacci Numbers Calculator")
    print("=" * 50)
    
    try:
        n = int(input("\nEnter the position (n) to calculate Fibonacci number: "))
        
        # Calculate using iterative method
        result = fibonacci_iterative(n)
        print(f"\nFibonacci number at position {n}: {result}")
        
        # Display sequence
        count = int(input("\nHow many Fibonacci numbers would you like to see? "))
        sequence = fibonacci_sequence(count)
        print(f"\nFirst {count} Fibonacci numbers:")
        print(sequence)
        
    except ValueError as e:
        print(f"\nError: {e}")
        print("Please enter a valid non-negative integer.")
    except KeyboardInterrupt:
        print("\n\nProgram interrupted by user.")
    except Exception as e:
        print(f"\nAn unexpected error occurred: {e}")


if __name__ == "__main__":
    main()
