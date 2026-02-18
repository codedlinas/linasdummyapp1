#!/usr/bin/env python3
"""
Fibonacci Numbers Calculator

This module provides functions to calculate Fibonacci numbers using different methods.
Includes optimized iterative, memoized recursive, and sequence generation functions.
"""

from functools import lru_cache
from typing import List


def fibonacci_iterative(n: int) -> int:
    """
    Calculate the nth Fibonacci number using an iterative approach.
    
    This is the most efficient method with O(n) time complexity and O(1) space complexity.
    
    Args:
        n: The position in the Fibonacci sequence (0-indexed).
        
    Returns:
        The nth Fibonacci number.
        
    Raises:
        TypeError: If n is not an integer.
        ValueError: If n is negative.
        
    Examples:
        >>> fibonacci_iterative(0)
        0
        >>> fibonacci_iterative(1)
        1
        >>> fibonacci_iterative(10)
        55
    """
    if not isinstance(n, int):
        raise TypeError(f"n must be an integer, got {type(n).__name__}")
    if n < 0:
        raise ValueError(f"n must be non-negative, got {n}")
    
    if n <= 1:
        return n
    
    prev, curr = 0, 1
    for _ in range(2, n + 1):
        prev, curr = curr, prev + curr
    
    return curr


@lru_cache(maxsize=None)
def fibonacci_recursive(n: int) -> int:
    """
    Calculate the nth Fibonacci number using a memoized recursive approach.
    
    Uses @lru_cache decorator to cache results, improving performance from O(2^n) 
    to O(n) time complexity. Space complexity is O(n) due to cache and call stack.
    
    Args:
        n: The position in the Fibonacci sequence (0-indexed).
        
    Returns:
        The nth Fibonacci number.
        
    Raises:
        TypeError: If n is not an integer.
        ValueError: If n is negative.
        
    Examples:
        >>> fibonacci_recursive(0)
        0
        >>> fibonacci_recursive(1)
        1
        >>> fibonacci_recursive(5)
        5
        >>> fibonacci_recursive(50)  # Now efficient even for large n
        12586269025
    """
    if not isinstance(n, int):
        raise TypeError(f"n must be an integer, got {type(n).__name__}")
    if n < 0:
        raise ValueError(f"n must be non-negative, got {n}")
    
    if n <= 1:
        return n
    
    return fibonacci_recursive(n - 1) + fibonacci_recursive(n - 2)


def fibonacci_sequence(count: int) -> List[int]:
    """
    Generate a sequence of Fibonacci numbers.
    
    Efficiently generates the first 'count' Fibonacci numbers using iteration.
    Time complexity: O(n), Space complexity: O(n).
    
    Args:
        count: Number of Fibonacci numbers to generate.
        
    Returns:
        A list containing the first 'count' Fibonacci numbers.
        
    Raises:
        TypeError: If count is not an integer.
        ValueError: If count is negative.
        
    Examples:
        >>> fibonacci_sequence(0)
        []
        >>> fibonacci_sequence(1)
        [0]
        >>> fibonacci_sequence(5)
        [0, 1, 1, 2, 3]
        >>> fibonacci_sequence(10)
        [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
    """
    if not isinstance(count, int):
        raise TypeError(f"count must be an integer, got {type(count).__name__}")
    if count < 0:
        raise ValueError(f"count must be non-negative, got {count}")
    
    if count == 0:
        return []
    if count == 1:
        return [0]
    
    sequence = [0, 1]
    # More efficient: avoid indexing by using previous values
    for _ in range(2, count):
        sequence.append(sequence[-1] + sequence[-2])
    
    return sequence


def main() -> None:
    """
    Main function to demonstrate Fibonacci number calculations.
    
    Provides an interactive CLI for calculating Fibonacci numbers and sequences.
    Handles user input validation and displays results in a formatted manner.
    """
    # Constants for formatting
    SEPARATOR_WIDTH = 50
    
    print("=" * SEPARATOR_WIDTH)
    print("Fibonacci Numbers Calculator")
    print("=" * SEPARATOR_WIDTH)
    print("\nThis calculator uses efficient algorithms to compute Fibonacci numbers.")
    
    try:
        # Get position for single Fibonacci number
        n_input = input("\nEnter the position (n) to calculate Fibonacci number: ")
        n = int(n_input)
        
        # Calculate using iterative method (most efficient)
        result = fibonacci_iterative(n)
        print(f"\nFibonacci number at position {n}: {result:,}")
        
        # Display sequence
        count_input = input("\nHow many Fibonacci numbers would you like to see? ")
        count = int(count_input)
        
        sequence = fibonacci_sequence(count)
        print(f"\nFirst {count} Fibonacci numbers:")
        
        # Format output for better readability
        if count <= 20:
            print(sequence)
        else:
            # For large sequences, show formatted output
            print("[", end="")
            for i, num in enumerate(sequence):
                if i > 0:
                    print(", ", end="")
                if i % 5 == 0 and i > 0:
                    print("\n ", end="")
                print(f"{num}", end="")
            print("]")
        
    except ValueError as e:
        print(f"\n❌ Error: {e}")
        if "invalid literal" in str(e):
            print("Please enter a valid integer.")
    except TypeError as e:
        print(f"\n❌ Type Error: {e}")
    except KeyboardInterrupt:
        print("\n\n👋 Program interrupted by user. Goodbye!")
    except Exception as e:
        print(f"\n❌ An unexpected error occurred: {e}")
        print(f"Error type: {type(e).__name__}")


if __name__ == "__main__":
    main()
