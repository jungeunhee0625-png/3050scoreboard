"use client";

import { useState } from "react";

export default function Home() {
  const [roundText, setRoundText] = useState("1라운드 1주차 1경기");

  const [centerTitle, setCenterTitle] = useState("1SET(갓/킹)");
  const [centerMap, setCenterMap] = useState("매치포인트");

  const [leftPlayer, setLeftPlayer] = useState("(JO)iCho(Z)");
  const [rightPlayer, setRightPlayer] = useState("(S)barcode(P)");

  const [leftScore, setLeftScore] = useState(0);
  const [rightScore, setRightScore] = useState(0);

  const [leftCode, setLeftCode] = useState("Z5");
  const [rightCode, setRightCode] = useState("P7");

  const [leftTeam, setLeftTeam] = useState("1K");
  const [rightTeam, setRightTeam] = useState("제이디");

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-5">

      {/* 방송 화면 */}
      <div className="relative w-[500px] h-[210px]">

        {/* 배경 */}
        <img
          src="/S11스코어보드.png"
          className="absolute inset-0 w-full h-full"
        />

        {/* 왼쪽 팀 이미지 */}
        <img
          src={`/${leftTeam}.jpg`}
          className="absolute top-[43px] left-[0px] w-[108px] h-[51px] object-cover"
        />

        {/* 오른쪽 팀 이미지 */}
        <img
          src={`/${rightTeam}.jpg`}
          className="absolute top-[43px] right-[0px] w-[108px] h-[51px] object-cover"
        />

        {/* 중앙 세트 정보 */}
        <div className="absolute top-[48px] left-1/2 -translate-x-1/2 text-center leading-none">

          <div className="text-[18px] font-black text-[#6d1cff]">
            {centerTitle}
          </div>

          <div className="text-[18px] font-black text-[#6d1cff]">
            {centerMap}
          </div>

        </div>

        {/* 경기 정보 */}
        <div className="absolute top-[3px] left-[280px] text-[24px] font-black tracking-[-1px] text-yellow-300">
          {roundText}
        </div>

        {/* 왼쪽 선수 */}
        <div className="absolute top-[105px] left-[55px] w-[120px] text-center text-[24px] font-black tracking-[-1px] text-black">
          {leftPlayer}
        </div>

        {/* 왼쪽 점수 */}
        <div className="absolute top-[95px] left-[212px] w-[30px] text-center text-[38px] font-black text-white">
          {leftScore}
        </div>

        {/* 오른쪽 점수 */}
        <div className="absolute top-[95px] left-[255px] w-[30px] text-center text-[38px] font-black text-white">
          {rightScore}
        </div>

        {/* 오른쪽 선수 */}
        <div className="absolute top-[105px] right-[60px] w-[150px] text-center text-[24px] font-black tracking-[-1px] text-black">
          {rightPlayer}
        </div>

        {/* 왼쪽 하단 */}
        <div className="absolute bottom-[1px] left-[28px] text-[38px] font-black text-red-600">
          {leftCode}
        </div>

        {/* 오른쪽 하단 */}
        <div className="absolute bottom-[1px] right-[28px] text-[38px] font-black text-blue-500">
          {rightCode}
        </div>

      </div>

      {/* 관리자 패널 */}
      <div className="hidden w-[500px] rounded-xl bg-white p-4 text-black space-y-3">

        {/* 경기 정보 */}
        <input
          className="w-full border p-2"
          value={roundText}
          onChange={(e) => setRoundText(e.target.value)}
          placeholder="경기 정보"
        />

        {/* 중앙 세트 정보 */}
        <div className="grid grid-cols-2 gap-3">

          <input
            className="border p-2"
            value={centerTitle}
            onChange={(e) => setCenterTitle(e.target.value)}
            placeholder="1SET(갓/킹)"
          />

          <input
            className="border p-2"
            value={centerMap}
            onChange={(e) => setCenterMap(e.target.value)}
            placeholder="맵 이름"
          />

        </div>

        {/* 팀 선택 */}
        <div className="grid grid-cols-2 gap-3">

          <select
            className="border p-2"
            value={leftTeam}
            onChange={(e) => setLeftTeam(e.target.value)}
          >
            <option>외모지상주의</option>
            <option>월드클래스</option>
            <option>Team 1K</option>
            <option>최강파파</option>
            <option>제이디</option>
            <option>칸</option>
          </select>

          <select
            className="border p-2"
            value={rightTeam}
            onChange={(e) => setRightTeam(e.target.value)}
          >
            <option>외모지상주의</option>
            <option>월드클래스</option>
            <option>Team 1K</option>
            <option>최강파파</option>
            <option>제이디</option>
            <option>칸</option>
          </select>

        </div>

        {/* 선수명 */}
        <div className="grid grid-cols-2 gap-3">

          <input
            className="border p-2"
            value={leftPlayer}
            onChange={(e) => setLeftPlayer(e.target.value)}
            placeholder="왼쪽 선수"
          />

          <input
            className="border p-2"
            value={rightPlayer}
            onChange={(e) => setRightPlayer(e.target.value)}
            placeholder="오른쪽 선수"
          />

        </div>

        {/* 코드 */}
        <div className="grid grid-cols-2 gap-3">

          <input
            className="border p-2"
            value={leftCode}
            onChange={(e) => setLeftCode(e.target.value)}
            placeholder="왼쪽 코드"
          />

          <input
            className="border p-2"
            value={rightCode}
            onChange={(e) => setRightCode(e.target.value)}
            placeholder="오른쪽 코드"
          />

        </div>

        {/* 점수 */}
        <div className="grid grid-cols-2 gap-3">

          <div className="flex items-center gap-2">

            <button
              className="bg-gray-300 px-4 py-2"
              onClick={() => setLeftScore(Math.max(0, leftScore - 1))}
            >
              -
            </button>

            <div className="flex-1 text-center text-2xl font-black">
              {leftScore}
            </div>

            <button
              className="bg-blue-500 text-white px-4 py-2"
              onClick={() => setLeftScore(leftScore + 1)}
            >
              +
            </button>

          </div>

          <div className="flex items-center gap-2">

            <button
              className="bg-gray-300 px-4 py-2"
              onClick={() => setRightScore(Math.max(0, rightScore - 1))}
            >
              -
            </button>

            <div className="flex-1 text-center text-2xl font-black">
              {rightScore}
            </div>

            <button
              className="bg-red-500 text-white px-4 py-2"
              onClick={() => setRightScore(rightScore + 1)}
            >
              +
            </button>

          </div>

        </div>

      </div>

    </main>
  );
}