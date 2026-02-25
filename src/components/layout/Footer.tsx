'use client';

import React from 'react';
import Link from 'next/link';

interface FooterProps {
  className?: string;
  variant?: 'full' | 'minimal';
}

const Footer: React.FC<FooterProps> = ({
  className = '',
  variant = 'full',
}) => {
  const currentYear = new Date().getFullYear();

  if (variant === 'minimal') {
    return (
      <footer
        className={`bg-gray-50 border-t border-gray-200 py-4 ${className}`}
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-600">
            © {currentYear} DogNote. All rights reserved.
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer className={`bg-white border-t border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 브랜드 정보 */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="text-2xl">🐕</div>
              <h3 className="text-xl font-bold text-gray-900">DogNote</h3>
            </div>
            <p className="text-gray-600 mb-4">
              반려견과 함께하는 모든 순간을 기록하고 관리하는 스마트한 반려견
              케어 플랫폼입니다.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Facebook"
              >
                📘
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Instagram"
              >
                📷
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Twitter"
              >
                🐦
              </a>
            </div>
          </div>

          {/* 주요 기능 */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">주요 기능</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/walks"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  산책 추적
                </Link>
              </li>
              <li>
                <Link
                  href="/health"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  건강 관리
                </Link>
              </li>
              <li>
                <Link
                  href="/schedule"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  일정 관리
                </Link>
              </li>
              <li>
                <Link
                  href="/community"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  커뮤니티
                </Link>
              </li>
            </ul>
          </div>

          {/* 지원 */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">지원</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/help"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  도움말
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  문의하기
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  이용약관
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 하단 저작권 */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600">
              © {currentYear} DogNote. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                href="/privacy"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                개인정보처리방침
              </Link>
              <Link
                href="/terms"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                이용약관
              </Link>
              <Link
                href="/contact"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                문의하기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
