'use client';

import React, {useState} from 'react';
import {Card} from '@/components/ui/Card';
import {cn} from '@/lib/utils';
import {typography} from '@/styles/theme';

/**
 * 타이포그래피 예제 컴포넌트
 * 폰트 패밀리, 크기, 가중치 및 사용 예시를 보여줍니다.
 */
export function TypographyExamples() {
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

    return (
        <div className="space-y-10">
            {/* 폰트 패밀리 섹션 */}
            <section className="space-y-4">
                <h3 className="text-xl font-semibold">폰트 패밀리</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FontFamilyCard
                        name="sans"
                        description="기본 텍스트 폰트"
                        fontFamily={typography.fontFamily.sans.join(', ')}
                        sampleText="DogNote의 기본 폰트입니다. 대부분의 UI 요소에 사용됩니다."
                    />
                    <FontFamilyCard
                        name="mono"
                        description="코드 및 숫자용 폰트"
                        fontFamily={typography.fontFamily.mono.join(', ')}
                        sampleText="코드 블록, 숫자 데이터에 사용됩니다."
                        isMono
                    />
                </div>
            </section>

            {/* 폰트 크기 섹션 */}
            <section className="space-y-4">
                <h3 className="text-xl font-semibold">폰트 크기</h3>
                <Card className="overflow-hidden border-2 border-neutral-300">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="bg-neutral-50 dark:bg-neutral-800">
                                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-300">이름</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-300">크기</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-300">라인
                                    높이
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-300">예시</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-300">코드</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                            {Object.entries(typography.fontSize).map(([key, [size, {lineHeight}]]) => (
                                <tr key={key} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                                    <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-300 font-mono">{key}</td>
                                    <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-300 font-mono">{size}</td>
                                    <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-300 font-mono">{lineHeight}</td>
                                    <td className="px-4 py-3">
                                        <span className={`text-${key}`}>텍스트 예시</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <CopyButton text={`text-${key}`} copiedText={copiedText} onCopy={handleCopy}/>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </section>

            {/* 폰트 가중치 섹션 */}
            <section className="space-y-4">
                <h3 className="text-xl font-semibold">폰트 가중치</h3>
                <Card className="overflow-hidden border-2 border-neutral-300">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="bg-neutral-50 dark:bg-neutral-800">
                                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-300">이름</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-300">가중치</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-300">예시</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-300">코드</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                            {Object.entries(typography.fontWeight).map(([key, value]) => (
                                <tr key={key} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                                    <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-300 font-mono">{key}</td>
                                    <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-300 font-mono">{value}</td>
                                    <td className="px-4 py-3">
                                        <span className={`font-${key}`}>텍스트 예시</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <CopyButton text={`font-${key}`} copiedText={copiedText} onCopy={handleCopy}/>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </section>

            {/* 타이포그래피 사용 예시 */}
            <section className="space-y-4">
                <h3 className="text-xl font-semibold">타이포그래피 사용 예시</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-6 space-y-6 border-2 border-neutral-300">
                        <h4 className="font-semibold text-lg">제목 계층</h4>
                        <div className="space-y-4">
                            <div>
                                <h1 className="text-4xl font-bold">H1 제목</h1>
                                <code className="text-xs text-neutral-500 mt-1">text-4xl font-bold</code>
                            </div>
                            <div>
                                <h2 className="text-3xl font-semibold">H2 제목</h2>
                                <code className="text-xs text-neutral-500 mt-1">text-3xl font-semibold</code>
                            </div>
                            <div>
                                <h3 className="text-2xl font-medium">H3 제목</h3>
                                <code className="text-xs text-neutral-500 mt-1">text-2xl font-medium</code>
                            </div>
                            <div>
                                <h4 className="text-xl font-medium">H4 제목</h4>
                                <code className="text-xs text-neutral-500 mt-1">text-xl font-medium</code>
                            </div>
                            <div>
                                <h5 className="text-lg font-medium">H5 제목</h5>
                                <code className="text-xs text-neutral-500 mt-1">text-lg font-medium</code>
                            </div>
                            <div>
                                <h6 className="text-base font-medium">H6 제목</h6>
                                <code className="text-xs text-neutral-500 mt-1">text-base font-medium</code>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 space-y-6 border-2 border-neutral-300">
                        <h4 className="font-semibold text-lg">본문 텍스트</h4>
                        <div className="space-y-4">
                            <div>
                                <p className="text-lg">큰 본문 텍스트</p>
                                <code className="text-xs text-neutral-500 mt-1">text-lg</code>
                            </div>
                            <div>
                                <p className="text-base">기본 본문 텍스트</p>
                                <code className="text-xs text-neutral-500 mt-1">text-base</code>
                            </div>
                            <div>
                                <p className="text-sm">작은 본문 텍스트</p>
                                <code className="text-xs text-neutral-500 mt-1">text-sm</code>
                            </div>
                            <div>
                                <p className="text-xs">아주 작은 본문 텍스트</p>
                                <code className="text-xs text-neutral-500 mt-1">text-xs</code>
                            </div>
                            <div>
                                <p className="text-base italic">기울임꼴 텍스트</p>
                                <code className="text-xs text-neutral-500 mt-1">italic</code>
                            </div>
                            <div>
                                <p className="text-base underline">밑줄 텍스트</p>
                                <code className="text-xs text-neutral-500 mt-1">underline</code>
                            </div>
                        </div>
                    </Card>
                </div>
            </section>

            {/* 타이포그래피 사용 가이드라인 */}
            <section className="space-y-4">
                <h3 className="text-xl font-semibold">타이포그래피 사용 가이드라인</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-6 bg-green-50 border-2 border-green-200">
                        <h4 className="font-medium text-green-800 mb-2">권장사항</h4>
                        <ul className="list-disc pl-5 space-y-1 text-green-700">
                            <li>일관된 폰트 크기 체계 사용하기</li>
                            <li>적절한 대비를 위해 텍스트 색상 선택하기</li>
                            <li>가독성을 위한 적절한 라인 높이 사용하기</li>
                            <li>모바일에서는 더 큰 폰트 크기 고려하기</li>
                            <li>중요도에 따라 폰트 가중치 차별화하기</li>
                        </ul>
                    </Card>
                    <Card className="p-6 bg-amber-50 border-2 border-amber-200">
                        <h4 className="font-medium text-amber-800 mb-2">피해야 할 사항</h4>
                        <ul className="list-disc pl-5 space-y-1 text-amber-700">
                            <li>너무 많은 폰트 크기 혼합하기</li>
                            <li>지나치게 작은 폰트 사용하기</li>
                            <li>너무 많은 폰트 가중치 사용하기</li>
                            <li>대비가 낮은 텍스트 색상 사용하기</li>
                            <li>과도한 텍스트 장식 사용하기</li>
                        </ul>
                    </Card>
                </div>
            </section>
        </div>
    );
}

interface FontFamilyCardProps {
    name: string;
    description: string;
    fontFamily: string;
    sampleText: string;
    isMono?: boolean;
}

function FontFamilyCard({name, description, fontFamily, sampleText, isMono = false}: FontFamilyCardProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Card className="overflow-hidden border-2 border-neutral-300">
            <div
                className="p-4 bg-neutral-50 dark:bg-primary-600 border-b border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
                <div>
                    <h4 className="font-medium text-neutral-800 dark:text-neutral-200">{name}</h4>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">{description}</p>
                </div>
                <button className="p-1.5 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                        onClick={handleCopy}>
                    {copied ? (
                        <span className="text-green-500">✓</span>
                    ) : (
                        <span className="text-neutral-500 dark:text-neutral-400">📋</span>
                    )}
                </button>
            </div>
            <div className={cn(
                "p-4",
                isMono ? "font-mono" : "font-sans"
            )}>
                <p className="mb-4">{sampleText}</p>
                <div className="text-sm font-medium">
                    <p>ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
                    <p>abcdefghijklmnopqrstuvwxyz</p>
                    <p>0123456789!@#$%^&*()</p>
                    <p>가나다라마바사아자차카타파하</p>
                </div>
            </div>
            <div
                className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700">
                <code className="text-xs text-neutral-600 dark:text-neutral-400">{fontFamily}</code>
            </div>
        </Card>
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
