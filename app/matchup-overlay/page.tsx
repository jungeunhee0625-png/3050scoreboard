"use client";

import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, onSnapshot } from "firebase/firestore";

export default function MatchupOverlayPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {

    const unsub = onSnapshot(
      doc(db, "matchupOverlay", "current"),
      (snap) => {
        if (snap.exists()) {
          setData(snap.data());
        }
      }
    );

    return () => unsub();

  }, []);

  if (!data) return null;

  return (
    <main className="h-screen w-screen overflow-hidden bg-transparent">

      <div className="flex h-full w-full items-center justify-center bg-transparent">

        <div className="w-[1500px] rounded-[40px] bg-gradient-to-r from-sky-300/90 to-cyan-400/90 p-10 text-white shadow-2xl">

          {/* 제목 */}
          <div className="text-center text-[90px] font-black italic tracking-tight text-[#083067]">
            TODAY'S MATCH UP
          </div>

          {/* 라운드 */}
          <div className="mt-2 text-center text-[50px] font-black italic text-yellow-300">
            {data.matchRound}
          </div>

          {/* 본문 */}
          <div className="mt-8 grid grid-cols-[500px_1fr_500px] items-center gap-10">

            {/* 왼쪽 */}
            <div className="flex flex-col items-center">

              <img
                src={`/team-profile/${data.home.logo}.png`}
                className="h-[500px] w-[500px] object-contain"
              />

              <div className="mt-5 text-center text-[70px] font-black text-white">
                {data.home.shortName}
              </div>

            </div>

            {/* 중앙 */}
            <div className="flex flex-col items-center justify-center">

              <div className="text-[140px] font-black italic text-[#083067]">
                VS
              </div>

              <div className="mt-8 w-full border-y border-[#083067]/30 py-6 text-center">

                <div className="text-[65px] font-black italic text-[#083067]">
                  {data.matchDate}
                </div>

                <div className="text-[55px] font-black italic text-[#083067]">
                  {data.matchBJ}
                </div>

              </div>

            </div>

            {/* 오른쪽 */}
            <div className="flex flex-col items-center">

              <img
                src={`/team-profile/${data.away.logo}.png`}
                className="h-[500px] w-[500px] object-contain"
              />

              <div className="mt-5 text-center text-[70px] font-black text-white">
                {data.away.shortName}
              </div>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}