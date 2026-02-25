'use client';

import React, { useState } from 'react';
import { DatePicker, DateRangePicker } from '@/components/ui/DatePicker';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Label } from '@/components/ui/Label';
import { Badge } from '@/components/ui/Badge';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { ko, enUS } from 'date-fns/locale';

export default function DatePickerExamplePage() {
  // DatePicker 상태
  const [basicDate, setBasicDate] = useState<Date | null>(null);
  const [dateWithTime, setDateWithTime] = useState<Date | null>(null);
  const [dateWithPresets, setDateWithPresets] = useState<Date | null>(null);
  const [localizedDate, setLocalizedDate] = useState<Date | null>(null);
  const [locale, setLocale] = useState<'ko' | 'en'>('ko');

  // DateRangePicker 상태
  const [basicRange, setBasicRange] = useState<DateRange | null>(null);
  const [rangeWithPresets, setRangeWithPresets] = useState<DateRange | null>(
    null
  );
  const [limitedRange, setLimitedRange] = useState<DateRange | null>(null);

  // 날짜 제한 설정
  const minDate = new Date();
  minDate.setDate(minDate.getDate() - 30);
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold">🗓️ DatePicker 컴포넌트 예제</h1>
          <p className="text-muted-foreground mt-2">
            세계적 수준의 날짜 선택 컴포넌트 - 접근성, 국제화, 애니메이션이 모두
            적용된 프리미엄 컴포넌트
          </p>
        </div>

        <Tabs defaultValue="single" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single">단일 날짜 선택</TabsTrigger>
            <TabsTrigger value="range">날짜 범위 선택</TabsTrigger>
          </TabsList>

          <TabsContent value="single" className="space-y-6 mt-6">
            {/* 기본 DatePicker */}
            <Card>
              <CardHeader>
                <CardTitle>기본 DatePicker</CardTitle>
                <CardDescription>
                  가장 기본적인 날짜 선택 컴포넌트입니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <DatePicker
                  value={basicDate}
                  onChange={setBasicDate}
                  label="날짜 선택"
                  helperText="원하는 날짜를 선택해주세요"
                />
                {basicDate && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium">선택된 날짜:</p>
                    <p className="text-lg">
                      {format(basicDate, 'PPP', { locale: ko })}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 시간 선택 포함 DatePicker */}
            <Card>
              <CardHeader>
                <CardTitle>시간 선택 기능 포함</CardTitle>
                <CardDescription>
                  날짜와 시간을 함께 선택할 수 있는 DateTimePicker입니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <DatePicker
                  value={dateWithTime}
                  onChange={setDateWithTime}
                  label="날짜 및 시간"
                  showTimePicker
                  required
                  helperText="날짜와 시간을 모두 선택해주세요"
                />
                {dateWithTime && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium">선택된 일시:</p>
                    <p className="text-lg">
                      {format(dateWithTime, 'PPP HH:mm', { locale: ko })}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 프리셋 포함 DatePicker */}
            <Card>
              <CardHeader>
                <CardTitle>빠른 선택 프리셋</CardTitle>
                <CardDescription>
                  자주 사용되는 날짜를 빠르게 선택할 수 있는 프리셋 기능입니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <DatePicker
                  value={dateWithPresets}
                  onChange={setDateWithPresets}
                  label="프리셋 날짜 선택"
                  showPresets
                  clearable
                  helperText="오늘, 어제, 내일 등을 빠르게 선택할 수 있습니다"
                />
                {dateWithPresets && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium">선택된 날짜:</p>
                    <p className="text-lg">
                      {format(dateWithPresets, 'PPP', { locale: ko })}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 국제화 DatePicker */}
            <Card>
              <CardHeader>
                <CardTitle>국제화 (i18n) 지원</CardTitle>
                <CardDescription>
                  다양한 언어와 로케일을 지원하는 국제화 기능입니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2 mb-4">
                  <Badge
                    variant={locale === 'ko' ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setLocale('ko')}
                  >
                    한국어
                  </Badge>
                  <Badge
                    variant={locale === 'en' ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setLocale('en')}
                  >
                    English
                  </Badge>
                </div>
                <DatePicker
                  value={localizedDate}
                  onChange={setLocalizedDate}
                  label={locale === 'ko' ? '날짜 선택' : 'Select Date'}
                  locale={locale}
                  showPresets
                  helperText={
                    locale === 'ko'
                      ? '언어를 변경해보세요'
                      : 'Try changing the language'
                  }
                />
                {localizedDate && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium">
                      {locale === 'ko' ? '선택된 날짜:' : 'Selected Date:'}
                    </p>
                    <p className="text-lg">
                      {format(localizedDate, 'PPP', {
                        locale: locale === 'ko' ? ko : enUS,
                      })}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 다양한 옵션 */}
            <Card>
              <CardHeader>
                <CardTitle>다양한 옵션과 스타일</CardTitle>
                <CardDescription>
                  크기, 변형, 비활성화 등 다양한 옵션을 제공합니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div>
                    <Label>Small Size</Label>
                    <DatePicker size="sm" placeholder="작은 크기" />
                  </div>
                  <div>
                    <Label>Default Size</Label>
                    <DatePicker size="default" placeholder="기본 크기" />
                  </div>
                  <div>
                    <Label>Large Size</Label>
                    <DatePicker size="lg" placeholder="큰 크기" />
                  </div>
                </div>

                <div className="grid gap-4">
                  <div>
                    <Label>Ghost Variant</Label>
                    <DatePicker variant="ghost" placeholder="Ghost 스타일" />
                  </div>
                  <div>
                    <Label>Outline Variant (Default)</Label>
                    <DatePicker
                      variant="outline"
                      placeholder="Outline 스타일"
                    />
                  </div>
                </div>

                <div className="grid gap-4">
                  <div>
                    <Label>비활성화된 상태</Label>
                    <DatePicker disabled placeholder="선택할 수 없습니다" />
                  </div>
                  <div>
                    <Label>에러 상태</Label>
                    <DatePicker
                      error="날짜를 반드시 선택해주세요"
                      placeholder="에러가 있습니다"
                    />
                  </div>
                </div>

                <div className="grid gap-4">
                  <div>
                    <Label>날짜 제한 (±30일)</Label>
                    <DatePicker
                      minDate={minDate}
                      maxDate={maxDate}
                      helperText="오늘 기준 ±30일 내에서만 선택 가능합니다"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="range" className="space-y-6 mt-6">
            {/* 기본 DateRangePicker */}
            <Card>
              <CardHeader>
                <CardTitle>기본 DateRangePicker</CardTitle>
                <CardDescription>
                  시작일과 종료일을 선택할 수 있는 범위 선택 컴포넌트입니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <DateRangePicker
                  value={basicRange}
                  onChange={setBasicRange}
                  label="기간 선택"
                  helperText="여행 기간이나 프로젝트 일정을 선택해주세요"
                />
                {basicRange?.from && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium">선택된 기간:</p>
                    <p className="text-lg">
                      {format(basicRange.from, 'PPP', { locale: ko })}
                      {basicRange.to && (
                        <>
                          {' ~ '}
                          {format(basicRange.to, 'PPP', { locale: ko })}
                          <Badge className="ml-2">
                            {Math.ceil(
                              (basicRange.to.getTime() -
                                basicRange.from.getTime()) /
                                (1000 * 60 * 60 * 24)
                            ) + 1}
                            일
                          </Badge>
                        </>
                      )}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 프리셋 포함 DateRangePicker */}
            <Card>
              <CardHeader>
                <CardTitle>빠른 선택 프리셋</CardTitle>
                <CardDescription>
                  자주 사용되는 기간을 빠르게 선택할 수 있습니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <DateRangePicker
                  value={rangeWithPresets}
                  onChange={setRangeWithPresets}
                  label="프리셋 기간 선택"
                  showPresets
                  clearable
                  required
                  helperText="지난 7일, 30일, 이번 달 등을 빠르게 선택할 수 있습니다"
                />
                {rangeWithPresets?.from && rangeWithPresets?.to && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium">선택된 기간:</p>
                    <p className="text-lg">
                      {format(rangeWithPresets.from, 'yyyy년 MM월 dd일', {
                        locale: ko,
                      })}
                      {' ~ '}
                      {format(rangeWithPresets.to, 'yyyy년 MM월 dd일', {
                        locale: ko,
                      })}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 제한된 범위 DateRangePicker */}
            <Card>
              <CardHeader>
                <CardTitle>최대 기간 제한</CardTitle>
                <CardDescription>
                  선택 가능한 최대 기간을 제한할 수 있습니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <DateRangePicker
                  value={limitedRange}
                  onChange={setLimitedRange}
                  label="최대 14일 선택 가능"
                  maxRange={14}
                  minDate={new Date()}
                  helperText="최대 2주까지만 선택할 수 있습니다"
                />
                {limitedRange?.from && limitedRange?.to && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium">선택된 기간:</p>
                    <p className="text-lg">
                      {Math.ceil(
                        (limitedRange.to.getTime() -
                          limitedRange.from.getTime()) /
                          (1000 * 60 * 60 * 24)
                      ) + 1}
                      일 선택됨
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 다양한 스타일 옵션 */}
            <Card>
              <CardHeader>
                <CardTitle>다양한 스타일 옵션</CardTitle>
                <CardDescription>
                  크기와 변형 옵션을 제공합니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div>
                    <Label>Small Size</Label>
                    <DateRangePicker size="sm" placeholder="작은 크기" />
                  </div>
                  <div>
                    <Label>Default Size</Label>
                    <DateRangePicker size="default" placeholder="기본 크기" />
                  </div>
                  <div>
                    <Label>Large Size</Label>
                    <DateRangePicker size="lg" placeholder="큰 크기" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 기능 요약 */}
        <Card>
          <CardHeader>
            <CardTitle>✨ 주요 기능</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold">🌍 국제화 (i18n)</h3>
                <p className="text-sm text-muted-foreground">
                  한국어, 영어, 일본어, 중국어 등 7개 언어 지원
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">♿ 접근성 (A11y)</h3>
                <p className="text-sm text-muted-foreground">
                  ARIA 속성, 키보드 네비게이션 완벽 지원
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">⏰ 시간 선택</h3>
                <p className="text-sm text-muted-foreground">
                  날짜와 시간을 함께 선택 가능
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">⚡ 프리셋</h3>
                <p className="text-sm text-muted-foreground">
                  자주 사용하는 날짜/기간 빠른 선택
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">🎨 애니메이션</h3>
                <p className="text-sm text-muted-foreground">
                  부드러운 트랜지션과 호버 효과
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">📱 반응형</h3>
                <p className="text-sm text-muted-foreground">
                  모바일, 태블릿, 데스크톱 완벽 대응
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
