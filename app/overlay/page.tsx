"use client";

import { useEffect, useState } from "react";

import { db } from "../../firebase";

import {
  doc,
  onSnapshot,
} from "firebase/firestore";

const defaultData = {
  roundText: "1라운드 1주차 1경기",

  centerTitle: "1SET(갓/킹)",
  centerMap: "매치포인트",

  leftPlayer: "(JO)iCho(Z)",
  rightPlayer: "(S)barcode(P)",

  leftScore: 0,
  rightScore: 0,

  leftCode: "Z5",
  rightCode: "P7",

  leftTeam: "스타강의반",
  rightTeam: "제이디",
};

export default function OverlayPage() {

  const [data, setData] = useState(defaultData);

  const [scale, setScale] = useState(1);

  useEffect(() => {

    const unsub = onSnapshot(
      doc(db, "scoreboard", "current"),
      (snapshot) => {

        if (snapshot.exists()) {
          setData(snapshot.data() as typeof defaultData);
        }

      }
    );

    return () => unsub();

  }, []);

  useEffect(() => {

    const resize = () => {

      const baseW = 500;
      const baseH = 210;

      const s = Math.min(
        window.innerWidth / baseW,
        window.innerHeight / baseH
      );

      setScale(s);

    };

    resize();

    window.addEventListener("resize", resize);

    return () =>
      window.removeEventListener("resize", resize);

  }, []);

  return (
    <main className="w-screen h-screen bg-transparent overflow-hidden">

      <div
        className="relative w-[500px] h-[210px]"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >

        {/* 배경 */}
        <img
          src="/S11스코어보드.png"
          className="absolute inset-0 w-full h-full"
        />

        {/* 왼쪽 팀 이미지 */}
        <img
          src={`/${data.leftTeam}.jpg`}
          className="absolute top-[43px] left-[0px] w-[108px] h-[51px] object-cover"
        />

        {/* 오른쪽 팀 이미지 */}
        <img
          src={`/${data.rightTeam}.jpg`}
          className="absolute top-[43px] right-[0px] w-[108px] h-[51px] object-cover"
        />

        {/* 중앙 세트 정보 */}
        <div className="absolute top-[48px] left-1/2 -translate-x-1/2 text-center leading-none">

          <div className="text-[18px] font-black text-[#6d1cff]">
            {data.centerTitle}
          </div>

          <div className="text-[18px] font-black text-[#6d1cff]">
            {data.centerMap}
          </div>

        </div>

         {/* 경기 정보 */}
        <div className="absolute top-[3px] left-[280px] text-[24px] font-black tracking-[-1px] text-yellow-300">
          {data.roundText}
        </div>

        {/* 왼쪽 선수 */}
        <div className="absolute top-[101px] left-[20px] w-[120px] text-center text-[26px] font-black tracking-[-1px] text-black">
          {data.leftPlayer}
        </div>

        {/* 왼쪽 점수 */}
        <div className="absolute top-[95px] left-[212px] w-[30px] text-center text-[38px] font-black text-white">
          {data.leftScore}
        </div>

        {/* 오른쪽 점수 */}
        <div className="absolute top-[95px] left-[255px] w-[30px] text-center text-[38px] font-black text-white">
          {data.rightScore}
        </div>

        {/* 오른쪽 선수 */}
        <div className="absolute top-[101px] right-[40px] w-[150px] text-center text-[26px] font-black tracking-[-1px] text-black">
          {data.rightPlayer}
        </div>

        {/* 왼쪽 하단 */}
        <div className="absolute bottom-[1px] left-[28px] text-[38px] font-black text-red-600">
          {data.leftCode}
        </div>

        {/* 오른쪽 하단 */}
        <div className="absolute bottom-[1px] right-[28px] text-[38px] font-black text-blue-500">
          {data.rightCode}
        </div>

      </div>

    </main>
  );
}