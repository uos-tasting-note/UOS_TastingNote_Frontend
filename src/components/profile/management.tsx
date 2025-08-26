"use client";

type Preference = { tagId: number; name: string; aiRecommended: boolean };

type UserResponse = {
  kakaoId: number;
  nickname: string;
  kakaoNickname: string;
  profileImageUrl: string;
  createdAt: string;
  preferences: Record<string, Preference[]>;
};

export default function Management({ user }: { user: UserResponse }) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">계정 관리</h3>
      <p className="text-sm text-gray-600">
        가입일: {new Date(user.createdAt).toLocaleDateString("ko-KR")}
      </p>

      {/* TODO: 로그아웃, 비밀번호 변경, 회원 탈퇴 등 버튼 추가 */}
      <button className="w-full py-3 rounded-lg bg-red-500 text-white">
        로그아웃
      </button>
    </div>
  );
}
