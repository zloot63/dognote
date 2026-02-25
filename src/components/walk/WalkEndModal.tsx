'use client';

import React, { useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Checkbox,
  TextArea,
} from '@/components/ui';
import { formatDistance, formatDuration } from '@/lib/gps';
import { cn } from '@/lib/utils';

interface WalkEndModalProps {
  isOpen: boolean;
  walkData: {
    duration: number;
    distance: number;
    startTime: Date;
  };
  onClose: () => void;
  onSubmit: (data: WalkEndData) => void;
  isLoading?: boolean;
}

export interface WalkEndData {
  issues: string[];
  notes: string;
  rating: number;
}

// 산책 중 발생할 수 있는 이슈 목록
const WALK_ISSUES = [
  { id: 'aggression', label: '다른 개와의 공격성', category: '행동' },
  { id: 'fear', label: '소음이나 환경에 대한 두려움', category: '행동' },
  { id: 'pulling', label: '줄 당기기', category: '행동' },
  { id: 'disobedience', label: '명령 불복종', category: '행동' },
  { id: 'excessive_barking', label: '과도한 짖음', category: '행동' },
  { id: 'refuse_walk', label: '산책 거부', category: '행동' },
  { id: 'limping', label: '다리 절뚝거림', category: '건강' },
  { id: 'heavy_breathing', label: '과도한 헐떡거림', category: '건강' },
  { id: 'vomiting', label: '구토', category: '건강' },
  { id: 'diarrhea', label: '설사', category: '건강' },
  { id: 'lethargy', label: '무기력함', category: '건강' },
  { id: 'injury', label: '부상', category: '건강' },
  { id: 'weather', label: '날씨 문제', category: '환경' },
  { id: 'traffic', label: '교통 상황', category: '환경' },
  { id: 'crowded', label: '사람이 많음', category: '환경' },
  { id: 'other_dogs', label: '다른 개들과의 문제', category: '환경' },
];

const WalkEndModal: React.FC<WalkEndModalProps> = ({
  isOpen,
  walkData,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState(5);

  // 모달이 열리지 않은 경우 렌더링하지 않음
  if (!isOpen) return null;

  // 이슈 선택/해제 처리
  const handleIssueToggle = (issueId: string) => {
    setSelectedIssues(prev =>
      prev.includes(issueId)
        ? prev.filter(id => id !== issueId)
        : [...prev, issueId]
    );
  };

  // 폼 제출 처리
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const walkEndData: WalkEndData = {
      issues: selectedIssues,
      notes: notes.trim(),
      rating,
    };

    onSubmit(walkEndData);
  };

  // 이슈를 카테고리별로 그룹화
  const issuesByCategory = WALK_ISSUES.reduce(
    (acc, issue) => {
      if (!acc[issue.category]) {
        acc[issue.category] = [];
      }
      acc[issue.category].push(issue);
      return acc;
    },
    {} as Record<string, typeof WALK_ISSUES>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-center">산책 완료</CardTitle>
          <div className="flex justify-center space-x-4 text-sm text-muted-foreground">
            <span>시간: {formatDuration(walkData.duration)}</span>
            <span>거리: {formatDistance(walkData.distance)}</span>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 산책 평가 */}
            <div className="space-y-3">
              <label className="text-sm font-medium">산책 만족도</label>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={cn(
                      'text-2xl transition-colors',
                      star <= rating ? 'text-yellow-400' : 'text-gray-300'
                    )}
                  >
                    ⭐
                  </button>
                ))}
              </div>
              <p className="text-xs text-center text-muted-foreground">
                {rating === 1 && '매우 불만족'}
                {rating === 2 && '불만족'}
                {rating === 3 && '보통'}
                {rating === 4 && '만족'}
                {rating === 5 && '매우 만족'}
              </p>
            </div>

            {/* 이슈 선택 */}
            <div className="space-y-3">
              <label className="text-sm font-medium">
                산책 중 발생한 이슈 (해당사항 선택)
              </label>

              {Object.entries(issuesByCategory).map(([category, issues]) => (
                <div key={category} className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    {category}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {issues.map(issue => (
                      <div
                        key={issue.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          checked={selectedIssues.includes(issue.id)}
                          onChange={() => handleIssueToggle(issue.id)}
                        />
                        <label className="text-sm cursor-pointer">
                          {issue.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* 선택된 이슈 표시 */}
            {selectedIssues.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">선택된 이슈</label>
                <div className="flex flex-wrap gap-2">
                  {selectedIssues.map(issueId => {
                    const issue = WALK_ISSUES.find(i => i.id === issueId);
                    return (
                      <Badge key={issueId} variant="secondary">
                        {issue?.label}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 메모 입력 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                추가 메모 (선택사항)
              </label>
              <TextArea
                value={notes}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setNotes(e.target.value)
                }
                placeholder="산책 중 특별한 사항이나 반려견의 상태에 대해 기록해주세요..."
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground text-right">
                {notes.length}/500
              </p>
            </div>

            {/* 액션 버튼 */}
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1"
              >
                취소
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? '저장 중...' : '산책 완료'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalkEndModal;
