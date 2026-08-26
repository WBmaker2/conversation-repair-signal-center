import type { Mission } from '../../domain/mission';
import type { MissionEvidence } from '../../domain/session';
import { CURRICULUM_LINKS } from '../../content/curriculum';

export interface TeacherSummaryProps {
  mission: Mission;
  evidence: MissionEvidence;
}

const LEARNING_TARGETS = [
  ['이해', '다시 묻기와 확인하기가 자연스러운 의사소통 전략임을 알아요.'],
  ['적용', '불명확한 정보의 종류에 맞는 수리 표현을 선택해요.'],
  ['분석', '무엇이 빠졌거나 두 가지로 해석되는지 찾아요.'],
  ['생성', '수리 표현과 확인 응답을 연결해 대화를 완성해요.'],
] as const;

const ACHIEVEMENT_EVIDENCE = [
  '불명확한 부분을 찾았어요',
  '상황에 맞는 수리 전략을 골랐어요',
  '상대의 추가 응답과 의미를 연결했어요',
  '확인 질문으로 협력적으로 대화를 이어 갔어요',
] as const;

export function TeacherSummary({ mission, evidence }: TeacherSummaryProps) {
  void evidence;
  const curriculumLinks = mission.curriculumCodes.map((code) => CURRICULUM_LINKS.find((link) => link.code === code));
  const hasUnknownCurriculum = curriculumLinks.some((link) => !link);

  return (
    <details aria-label="교사용 보기">
      <summary>교사용 보기</summary>
      <div>
        <h3>교육과정 연결</h3>
        {hasUnknownCurriculum ? (
          <p role="alert">교육과정 연결 정보를 표시할 수 없습니다.</p>
        ) : (
          <dl>
            {curriculumLinks.map((link) => link && (
              <div key={link.code}>
                <dt>{link.code}</dt>
                <dd>{link.descriptionKo}</dd>
              </div>
            ))}
          </dl>
        )}

        <h3>네 가지 학습 목표</h3>
        <ul>
          {LEARNING_TARGETS.map(([label, target]) => (
            <li key={label}><strong>{label}</strong>: {target}</li>
          ))}
        </ul>

        <h3>성취를 보여 주는 활동 증거</h3>
        <ul>
          {ACHIEVEMENT_EVIDENCE.map((evidence) => <li key={evidence}>{evidence}</li>)}
        </ul>
        <p>이 내용은 이번 활동에서 확인한 학습 과정의 참고 기록입니다.</p>
      </div>
    </details>
  );
}
