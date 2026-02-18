#!/usr/bin/env python3
"""
A simple Hello World program demonstrating Python best practices.

This module provides a basic example of a well-structured Python script
with proper documentation, type hints, and error handling.
"""

import sys
from typing import NoReturn


def main() -> int:
    """
    Main function that prints 'Hello, World!' to stdout.
    
    Returns:
        int: Exit code (0 for success, non-zero for failure)
    
    Example:
        >>> main()
        Hello, World!
        0
    """
    try:
        print("Hello, World!")
        return 0
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        return 1


def run() -> NoReturn:
    """
    Entry point that calls main and exits with appropriate code.
    
    This function never returns as it calls sys.exit().
    """
    sys.exit(main())


if __name__ == "__main__":
    run()
