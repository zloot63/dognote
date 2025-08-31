'use client';

import React from 'react';
import {Card} from '@/components/ui/Card';
import {spacing} from '@/styles/theme';
import { useState } from 'react';

/**
 * 스페이싱 예제 컴포넌트
 * 간격 시스템과 사용 예시를 보여줍니다.
 */
export function SpacingExamples() {
    const [copiedText, setCopiedText] = useState<string>("");

    const handleCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedText(text);
            setTimeout(() => setCopiedText(''), 2000);
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    // 스페이싱 값을 카테고리별로 그룹화
    const spacingGroups = {
        'extra-small': Object.entries(spacing).filter(([key]) =>
            ['px', '0', '0.5', '1', '1.5', '2', '2.5'].includes(key)
        ),
        'small': Object.entries(spacing).filter(([key]) =>
            ['3', '3.5', '4', '5', '6'].includes(key)
        ),
        'medium': Object.entries(spacing).filter(([key]) =>
            ['7', '8', '9', '10', '11', '12', '14', '16'].includes(key)
        ),
        'large': Object.entries(spacing).filter(([key]) =>
            ['20', '24', '28', '32', '36', '40'].includes(key)
        ),
        'extra-large': Object.entries(spacing).filter(([key]) =>
            ['44', '48', '52', '56', '60', '64', '72', '80', '96'].includes(key)
        ),
    };

    return (
        <div className="space-y-10">
            {/* 스페이싱 시스템 개요 */}
            <section className="space-y-4">
                <h3 className="text-xl font-semibold">스페이싱 시스템</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-6 border-2 border-neutral-300">
                        <h4 className="font-medium text-lg mb-3">4px 그리드 시스템</h4>
                        <p className="mb-4">
                            DogNote의 스페이싱 시스템은 4px 그리드를 기반으로 합니다. 이는 일관된 UI를 구축하고
                            요소 간의 관계를 명확하게 하는 데 도움이 됩니다.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {[1, 2, 3, 4, 5, 6].map((value) => (
                                <div
                                    key={value}
                                    className="flex flex-col items-center"
                                >
                                    <div
                                        className="bg-primary-200 dark:bg-primary-800"
                                        style={{width: `${value * 4}px`, height: `${value * 4}px`}}
                                    />
                                    <span className="text-xs mt-1">{value * 4}px</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                    <Card className="p-6 border-2 border-neutral-300">
                        <h4 className="font-medium text-lg mb-3">스페이싱 사용 원칙</h4>
                        <ul className="list-disc pl-5 space-y-2 text-neutral-700 dark:text-neutral-300">
                            <li>작은 요소 간 간격에는 작은 값(1-4) 사용</li>
                            <li>섹션 간 간격에는 중간 값(5-8) 사용</li>
                            <li>큰 레이아웃 간격에는 큰 값(10+) 사용</li>
                            <li>일관된 간격 사용으로 시각적 리듬 유지</li>
                            <li>모바일에서는 더 작은 간격 고려</li>
                        </ul>
                    </Card>
                </div>
            </section>

            {/* 스페이싱 값 테이블 */}
            <section className="space-y-4">
                <h3 className="text-xl font-semibold">스페이싱 값</h3>
                <Card className="overflow-hidden border-2 border-neutral-300">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="bg-neutral-50 dark:bg-neutral-800">
                                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-300">토큰</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-300">값</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-300">픽셀</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-300">시각화</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-300">패딩
                                    예시
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-300">마진
                                    예시
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                            {Object.entries(spacingGroups).map(([groupName, values]) => (
                                <React.Fragment key={groupName}>
                                    <tr className="bg-neutral-100 dark:bg-neutral-800/80">
                                        <td colSpan={6}
                                            className="px-4 py-2 font-medium text-neutral-700 dark:text-neutral-300 text-sm">
                                            {groupName === 'extra-small' ? '아주 작은 간격' :
                                                groupName === 'small' ? '작은 간격' :
                                                    groupName === 'medium' ? '중간 간격' :
                                                        groupName === 'large' ? '큰 간격' : '아주 큰 간격'}
                                        </td>
                                    </tr>
                                    {values.map(([key, value]) => {
                                        // px 값 추출 (예: 0.25rem -> 4px)
                                        const pxValue = value === '1px' ? 1 :
                                            value === '0' ? 0 :
                                                parseFloat(value as string) * 16;

                                        return (
                                            <tr key={key} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                                                <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-300 font-mono">{key}</td>
                                                <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-300 font-mono">{value}</td>
                                                <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-300 font-mono">
                                                    {pxValue === 0 ? '0px' : `${pxValue}px`}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div
                                                        className="bg-primary-400 dark:bg-primary-600"
                                                        style={{width: `${Math.max(4, pxValue)}px`, height: '16px'}}
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <CopyButton text={`p-${key}`} copiedText={copiedText}
                                                                onCopy={handleCopy}/>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <CopyButton text={`m-${key}`} copiedText={copiedText}
                                                                onCopy={handleCopy}/>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </React.Fragment>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </section>

            {/* 스페이싱 사용 예시 */}
            <section className="space-y-4">
                <h3 className="text-xl font-semibold">스페이싱 사용 예시</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-6 space-y-6 border-2 border-neutral-300">
                        <h4 className="font-semibold text-lg">패딩 예시</h4>
                        <div className="space-y-4">
                            <div>
                                <div
                                    className="p-2 bg-neutral-100 dark:bg-neutral-800 border border-dashed border-neutral-300 dark:border-neutral-600">
                                    <div className="bg-primary-100 dark:bg-primary-900 p-4 text-center">p-2 (외부), p-4
                                        (내부)
                                    </div>
                                </div>
                                <code className="text-xs text-neutral-500 mt-1 block">작은 컴포넌트에 적합한 패딩</code>
                            </div>
                            <div>
                                <div
                                    className="p-4 bg-neutral-100 dark:bg-neutral-800 border border-dashed border-neutral-300 dark:border-neutral-600">
                                    <div className="bg-primary-100 dark:bg-primary-900 p-6 text-center">p-4 (외부), p-6
                                        (내부)
                                    </div>
                                </div>
                                <code className="text-xs text-neutral-500 mt-1 block">카드와 섹션에 적합한 패딩</code>
                            </div>
                            <div>
                                <div
                                    className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 border border-dashed border-neutral-300 dark:border-neutral-600">
                                    <div className="bg-primary-100 dark:bg-primary-900 text-center py-1">px-4 py-2 (외부),
                                        py-1 (내부)
                                    </div>
                                </div>
                                <code className="text-xs text-neutral-500 mt-1 block">버튼과 같은 인라인 요소에 적합한 패딩</code>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 space-y-6 border-2 border-neutral-300">
                        <h4 className="font-semibold text-lg">마진과 갭 예시</h4>
                        <div className="space-y-4">
                            <div>
                                <div
                                    className="space-y-2 bg-neutral-100 dark:bg-neutral-800 p-4 border border-dashed border-neutral-300 dark:border-neutral-600">
                                    <div className="bg-primary-100 dark:bg-primary-900 p-2 text-center">항목 1</div>
                                    <div className="bg-primary-100 dark:bg-primary-900 p-2 text-center">항목 2</div>
                                    <div className="bg-primary-100 dark:bg-primary-900 p-2 text-center">항목 3</div>
                                </div>
                                <code className="text-xs text-neutral-500 mt-1 block">space-y-2: 수직 간격</code>
                            </div>
                            <div>
                                <div
                                    className="flex gap-4 bg-neutral-100 dark:bg-neutral-800 p-4 border border-dashed border-neutral-300 dark:border-neutral-600">
                                    <div className="bg-primary-100 dark:bg-primary-900 p-2 flex-1 text-center">항목 1
                                    </div>
                                    <div className="bg-primary-100 dark:bg-primary-900 p-2 flex-1 text-center">항목 2
                                    </div>
                                    <div className="bg-primary-100 dark:bg-primary-900 p-2 flex-1 text-center">항목 3
                                    </div>
                                </div>
                                <code className="text-xs text-neutral-500 mt-1 block">gap-4: Flexbox 간격</code>
                            </div>
                            <div>
                                <div
                                    className="grid grid-cols-3 gap-2 bg-neutral-100 dark:bg-neutral-800 p-4 border border-dashed border-neutral-300 dark:border-neutral-600">
                                    <div className="bg-primary-100 dark:bg-primary-900 p-2 text-center">1</div>
                                    <div className="bg-primary-100 dark:bg-primary-900 p-2 text-center">2</div>
                                    <div className="bg-primary-100 dark:bg-primary-900 p-2 text-center">3</div>
                                    <div className="bg-primary-100 dark:bg-primary-900 p-2 text-center">4</div>
                                    <div className="bg-primary-100 dark:bg-primary-900 p-2 text-center">5</div>
                                    <div className="bg-primary-100 dark:bg-primary-900 p-2 text-center">6</div>
                                </div>
                                <code className="text-xs text-neutral-500 mt-1 block">gap-2: Grid 간격</code>
                            </div>
                        </div>
                    </Card>
                </div>
            </section>

            {/* 반응형 스페이싱 */}
            <section className="space-y-4">
                <h3 className="text-xl font-semibold">반응형 스페이싱</h3>
                <Card className="p-6 border-2 border-neutral-300">
                    <h4 className="font-medium text-lg mb-4">화면 크기에 따른 스페이싱 조정</h4>

                    <div className="mb-6">
                        <p className="mb-3">반응형 스페이싱 예시:</p>
                        <div
                            className="p-2 sm:p-4 md:p-6 lg:p-8 bg-neutral-100 dark:bg-neutral-800 border border-dashed border-neutral-300 dark:border-neutral-600">
                            <div className="bg-primary-100 dark:bg-primary-900 p-4 text-center">
                                화면 크기에 따라 패딩이 변경됩니다
                            </div>
                        </div>
                        <code className="text-xs text-neutral-500 mt-2 block">p-2 sm:p-4 md:p-6 lg:p-8</code>
                    </div>

                    <div
                        className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                        <h5 className="font-medium text-blue-800 dark:text-blue-300 mb-2">반응형 스페이싱 팁</h5>
                        <ul className="list-disc pl-5 space-y-1 text-blue-700 dark:text-blue-300">
                            <li>모바일에서는 더 작은 간격 사용하기</li>
                            <li>화면 크기가 커질수록 여백도 비례해서 늘리기</li>
                            <li>중요 콘텐츠의 가독성을 위해 적절한 여백 유지하기</li>
                            <li>Tailwind 브레이크포인트 활용: sm, md, lg, xl</li>
                            <li>일관된 반응형 패턴 유지하기</li>
                        </ul>
                    </div>
                </Card>
            </section>
        </div>
    );
}

interface CopyButtonProps {
    text: string;
    copiedText: string;
    onCopy: (text: string) => void;
}

function CopyButton({text, copiedText, onCopy}: CopyButtonProps) {
    const isCopied = copiedText === text;

    return (
        <button
            className="inline-flex items-center px-2 py-1 rounded text-xs bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors"
            onClick={() => onCopy(text)}>
            <span className="font-mono">{text}</span>
            {isCopied ? (
                <span className="ml-1.5 text-green-500">✓</span>
            ) : (
                <span className="ml-1.5 text-neutral-500">📋</span>
            )}
        </button>
    );
}
