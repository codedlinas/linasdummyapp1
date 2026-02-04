#!/usr/bin/env python3
"""
Unit tests for the Fibonacci calculator module.

Comprehensive test suite covering all functions with various edge cases.
"""

import unittest
from fibonacci import fibonacci_iterative, fibonacci_recursive, fibonacci_sequence


class TestFibonacciIterative(unittest.TestCase):
    """Test cases for the iterative Fibonacci function."""
    
    def test_base_cases(self):
        """Test base cases n=0 and n=1."""
        self.assertEqual(fibonacci_iterative(0), 0)
        self.assertEqual(fibonacci_iterative(1), 1)
    
    def test_small_values(self):
        """Test small Fibonacci numbers."""
        self.assertEqual(fibonacci_iterative(2), 1)
        self.assertEqual(fibonacci_iterative(3), 2)
        self.assertEqual(fibonacci_iterative(4), 3)
        self.assertEqual(fibonacci_iterative(5), 5)
        self.assertEqual(fibonacci_iterative(6), 8)
    
    def test_medium_values(self):
        """Test medium-sized Fibonacci numbers."""
        self.assertEqual(fibonacci_iterative(10), 55)
        self.assertEqual(fibonacci_iterative(15), 610)
        self.assertEqual(fibonacci_iterative(20), 6765)
    
    def test_large_values(self):
        """Test that iterative method handles large values efficiently."""
        self.assertEqual(fibonacci_iterative(50), 12586269025)
        self.assertEqual(fibonacci_iterative(100), 354224848179261915075)
    
    def test_negative_input(self):
        """Test that negative input raises ValueError."""
        with self.assertRaises(ValueError) as context:
            fibonacci_iterative(-1)
        self.assertIn("non-negative", str(context.exception))
    
    def test_invalid_type(self):
        """Test that non-integer input raises TypeError."""
        with self.assertRaises(TypeError):
            fibonacci_iterative(3.5)
        with self.assertRaises(TypeError):
            fibonacci_iterative("10")
        with self.assertRaises(TypeError):
            fibonacci_iterative(None)


class TestFibonacciRecursive(unittest.TestCase):
    """Test cases for the recursive Fibonacci function."""
    
    def test_base_cases(self):
        """Test base cases n=0 and n=1."""
        self.assertEqual(fibonacci_recursive(0), 0)
        self.assertEqual(fibonacci_recursive(1), 1)
    
    def test_small_values(self):
        """Test small Fibonacci numbers."""
        self.assertEqual(fibonacci_recursive(2), 1)
        self.assertEqual(fibonacci_recursive(3), 2)
        self.assertEqual(fibonacci_recursive(4), 3)
        self.assertEqual(fibonacci_recursive(5), 5)
        self.assertEqual(fibonacci_recursive(10), 55)
    
    def test_memoization_efficiency(self):
        """Test that memoization makes large values computable."""
        # Without memoization, n=50 would be extremely slow
        self.assertEqual(fibonacci_recursive(50), 12586269025)
        # This should be fast due to cached values
        self.assertEqual(fibonacci_recursive(45), 1134903170)
    
    def test_consistency_with_iterative(self):
        """Test that recursive matches iterative for various values."""
        for n in range(0, 30):
            self.assertEqual(
                fibonacci_recursive(n),
                fibonacci_iterative(n),
                f"Mismatch at n={n}"
            )
    
    def test_negative_input(self):
        """Test that negative input raises ValueError."""
        with self.assertRaises(ValueError) as context:
            fibonacci_recursive(-1)
        self.assertIn("non-negative", str(context.exception))
    
    def test_invalid_type(self):
        """Test that non-integer input raises TypeError."""
        with self.assertRaises(TypeError):
            fibonacci_recursive(3.5)


class TestFibonacciSequence(unittest.TestCase):
    """Test cases for the Fibonacci sequence generator."""
    
    def test_empty_sequence(self):
        """Test generating zero Fibonacci numbers."""
        self.assertEqual(fibonacci_sequence(0), [])
    
    def test_single_element(self):
        """Test generating one Fibonacci number."""
        self.assertEqual(fibonacci_sequence(1), [0])
    
    def test_two_elements(self):
        """Test generating two Fibonacci numbers."""
        self.assertEqual(fibonacci_sequence(2), [0, 1])
    
    def test_small_sequence(self):
        """Test generating a small sequence."""
        expected = [0, 1, 1, 2, 3]
        self.assertEqual(fibonacci_sequence(5), expected)
    
    def test_medium_sequence(self):
        """Test generating a medium-sized sequence."""
        expected = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
        self.assertEqual(fibonacci_sequence(10), expected)
    
    def test_sequence_length(self):
        """Test that sequence has correct length."""
        for count in [0, 1, 5, 10, 20, 50]:
            seq = fibonacci_sequence(count)
            self.assertEqual(len(seq), count)
    
    def test_sequence_values(self):
        """Test that sequence values match individual calculations."""
        count = 15
        seq = fibonacci_sequence(count)
        for i in range(count):
            self.assertEqual(
                seq[i],
                fibonacci_iterative(i),
                f"Mismatch at index {i}"
            )
    
    def test_negative_count(self):
        """Test that negative count raises ValueError."""
        with self.assertRaises(ValueError) as context:
            fibonacci_sequence(-1)
        self.assertIn("non-negative", str(context.exception))
    
    def test_invalid_type(self):
        """Test that non-integer count raises TypeError."""
        with self.assertRaises(TypeError):
            fibonacci_sequence(3.5)
        with self.assertRaises(TypeError):
            fibonacci_sequence("10")


class TestEdgeCases(unittest.TestCase):
    """Test edge cases and special scenarios."""
    
    def test_very_large_fibonacci(self):
        """Test that the implementation handles very large numbers."""
        # Python handles arbitrary precision integers
        result = fibonacci_iterative(200)
        self.assertIsInstance(result, int)
        self.assertGreater(result, 0)
    
    def test_consistency_across_methods(self):
        """Test that all methods produce consistent results."""
        for n in [0, 1, 5, 10, 15, 20]:
            iter_result = fibonacci_iterative(n)
            rec_result = fibonacci_recursive(n)
            seq_result = fibonacci_sequence(n + 1)[n]
            
            self.assertEqual(iter_result, rec_result)
            self.assertEqual(iter_result, seq_result)


if __name__ == "__main__":
    # Run tests with verbose output
    unittest.main(verbosity=2)
