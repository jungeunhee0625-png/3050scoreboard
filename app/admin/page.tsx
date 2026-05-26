"use client";

import { useEffect, useState } from "react";

import { db } from "../../firebase";

import {
  doc,
  setDoc,
  onSnapshot,
} from "firebase/firestore";

const teams = [
  "외모지상주의",
  "월드클래스",
  "스타강의반",
  "최강파파",
  "제이디",
  "칸",
];

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

export default function AdminPage() {

  const [data, setData] = useState(defaultData);

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

  const updateData = async (
    key: string,
    value: string | number
  ) => {

    const newData = {
      ...data,
      [key]: value,
    };

    setData(newData);

    await setDoc(
      doc(db, "scoreboard", "current"),
      newData
    );

  };

  return (
    <main className="min-h-screen bg-[#222] flex flex-col items-center justify-center gap-5 p-5">

      {/* 방송 화면 */}
      <div className="relative w-[500px] h-[210px]">

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
        <div className="absolute top-[105px] left-[55px] w-[120px] text-center text-[24px] font-black tracking-[-1px] text-black">
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
        <div className="absolute top-[105px] right-[60px] w-[150px] text-center text-[24px] font-black tracking-[-1px] text-black">
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

      {/* 관리자 패널 */}
      <div className="w-[500px] rounded-xl bg-white p-4 text-black space-y-3">

        {/* 경기 정보 */}
        <input
          className="w-full border p-2"
          value={data.roundText}
          onChange={(e) =>
            updateData("roundText", e.target.value)
          }
        />

        {/* 중앙 세트 정보 */}
        <div className="grid grid-cols-2 gap-3">

          <input
            className="border p-2"
            value={data.centerTitle}
            onChange={(e) =>
              updateData("centerTitle", e.target.value)
            }
          />

          <input
            className="border p-2"
            value={data.centerMap}
            onChange={(e) =>
              updateData("centerMap", e.target.value)
            }
          />

        </div>

        {/* 팀 선택 */}
        <div className="grid grid-cols-2 gap-3">

          <select
            className="border p-2"
            value={data.leftTeam}
            onChange={(e) =>
              updateData("leftTeam", e.target.value)
            }
          >

            {teams.map((team) => (
              <option key={team}>
                {team}
              </option>
            ))}

          </select>

          <select
            className="border p-2"
            value={data.rightTeam}
            onChange={(e) =>
              updateData("rightTeam", e.target.value)
            }
          >

            {teams.map((team) => (
              <option key={team}>
                {team}
              </option>
            ))}

          </select>

        </div>

        {/* 선수명 */}
        <div className="grid grid-cols-2 gap-3">

          <input
            className="border p-2"
            value={data.leftPlayer}
            onChange={(e) =>
              updateData("leftPlayer", e.target.value)
            }
          />

          <input
            className="border p-2"
            value={data.rightPlayer}
            onChange={(e) =>
              updateData("rightPlayer", e.target.value)
            }
          />

        </div>

        {/* 코드 */}
        <div className="grid grid-cols-2 gap-3">

          <input
            className="border p-2"
            value={data.leftCode}
            onChange={(e) =>
              updateData("leftCode", e.target.value)
            }
          />

          <input
            className="border p-2"
            value={data.rightCode}
            onChange={(e) =>
              updateData("rightCode", e.target.value)
            }
          />

        </div>

        {/* 점수 */}
        <div className="grid grid-cols-2 gap-3">

          {/* 왼쪽 */}
          <div className="flex items-center gap-2">

            <button
              className="bg-gray-300 px-4 py-2"
              onClick={() =>
                updateData(
                  "leftScore",
                  Math.max(0, data.leftScore - 1)
                )
              }
            >
              -
            </button>

            <div className="flex-1 text-center text-2xl font-black">
              {data.leftScore}
            </div>

            <button
              className="bg-blue-500 text-white px-4 py-2"
              onClick={() =>
                updateData(
                  "leftScore",
                  data.leftScore + 1
                )
              }
            >
              +
            </button>

          </div>

          {/* 오른쪽 */}
          <div className="flex items-center gap-2">

            <button
              className="bg-gray-300 px-4 py-2"
              onClick={() =>
                updateData(
                  "rightScore",
                  Math.max(0, data.rightScore - 1)
                )
              }
            >
              -
            </button>

            <div className="flex-1 text-center text-2xl font-black">
              {data.rightScore}
            </div>

            <button
              className="bg-red-500 text-white px-4 py-2"
              onClick={() =>
                updateData(
                  "rightScore",
                  data.rightScore + 1
                )
              }
            >
              +
            </button>

          </div>

        </div>

      </div>

    </main>
  );
}