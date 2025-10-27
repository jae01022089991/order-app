
    import React from 'react';
    import { render, screen } from '@testing-library/react';
    import { describe, it, expect } from 'vitest';
    import Cart from './Cart';

    // @testing-library/react를 사용하려면 jsdom 환경이 필요합니다.
    // vitest.config.js에 environment: 'jsdom'을 추가해주세요.

    describe('Cart Component', () => {
      it('장바구니 총액을 정확하게 계산해야 한다', () => {
        const mockItems = [
          { key: '1', name: '아메리카노(ICE)', price: 4000, qty: 2, options: { shot: false } }, // 8000
          { key: '2', name: '카페라떼', price: 5000, qty: 1, options: { shot: true } },      // 5500
          { key: '3', name: '아메리카노(HOT)', price: 4000, qty: 1, options: { shot: false } }  // 4000
        ];

        render(<Cart items={mockItems} />);

        // 총액: 8000 + 5500 + 4000 = 17,500
        const totalAmountElement = screen.getByText(/17,500원/i);
        expect(totalAmountElement).not.toBeNull();
      });

      it('장바구니가 비어있을 때 "장바구니가 비어있습니다." 메시지를 표시해야 한다', () => {
        render(<Cart items={[]} />);
        
        const emptyMessage = screen.getByText(/장바구니가 비어있습니다./i);
        expect(emptyMessage).not.toBeNull();
      });
    });
    