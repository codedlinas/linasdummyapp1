import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import {
  Skeleton,
  FlightCardSkeleton,
  DealCardSkeleton,
  AlertCardSkeleton,
  HistoryItemSkeleton,
} from '../components/SkeletonLoader';

describe('SkeletonLoader Components', () => {
  describe('Skeleton', () => {
    it('should render a skeleton div with base class', () => {
      const { container } = render(<Skeleton />);
      
      const skeleton = container.querySelector('.skeleton');
      expect(skeleton).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(<Skeleton className="w-12 h-12" />);
      
      const skeleton = container.querySelector('.skeleton');
      expect(skeleton).toHaveClass('w-12');
      expect(skeleton).toHaveClass('h-12');
    });
  });

  describe('FlightCardSkeleton', () => {
    it('should render flight card skeleton with card class', () => {
      const { container } = render(<FlightCardSkeleton />);
      
      const card = container.querySelector('.card');
      expect(card).toBeInTheDocument();
    });

    it('should render multiple skeleton elements', () => {
      const { container } = render(<FlightCardSkeleton />);
      
      const skeletons = container.querySelectorAll('.skeleton');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should have proper layout structure', () => {
      const { container } = render(<FlightCardSkeleton />);
      
      expect(container.querySelector('.flex')).toBeInTheDocument();
    });
  });

  describe('DealCardSkeleton', () => {
    it('should render deal card skeleton with card class', () => {
      const { container } = render(<DealCardSkeleton />);
      
      const card = container.querySelector('.card');
      expect(card).toBeInTheDocument();
    });

    it('should render multiple skeleton elements for deal info', () => {
      const { container } = render(<DealCardSkeleton />);
      
      const skeletons = container.querySelectorAll('.skeleton');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe('AlertCardSkeleton', () => {
    it('should render alert card skeleton with card class', () => {
      const { container } = render(<AlertCardSkeleton />);
      
      const card = container.querySelector('.card');
      expect(card).toBeInTheDocument();
    });

    it('should render skeleton elements for alert info', () => {
      const { container } = render(<AlertCardSkeleton />);
      
      const skeletons = container.querySelectorAll('.skeleton');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe('HistoryItemSkeleton', () => {
    it('should render history item skeleton with card class', () => {
      const { container } = render(<HistoryItemSkeleton />);
      
      const card = container.querySelector('.card');
      expect(card).toBeInTheDocument();
    });

    it('should render skeleton elements for history item', () => {
      const { container } = render(<HistoryItemSkeleton />);
      
      const skeletons = container.querySelectorAll('.skeleton');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should have flex layout for content alignment', () => {
      const { container } = render(<HistoryItemSkeleton />);
      
      expect(container.querySelector('.flex')).toBeInTheDocument();
    });
  });

  describe('Multiple Skeletons', () => {
    it('should render multiple flight card skeletons', () => {
      const { container } = render(
        <>
          <FlightCardSkeleton />
          <FlightCardSkeleton />
          <FlightCardSkeleton />
        </>
      );
      
      const cards = container.querySelectorAll('.card');
      expect(cards.length).toBe(3);
    });
  });
});
