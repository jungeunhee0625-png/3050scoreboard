"use client";

import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, onSnapshot } from "firebase/firestore";

export default function TeamOverlayPage() {
  const [data, setData] = useState<any>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "teamProfile", "current"), (snap) => {
      if (snap.exists()) {
        setData(snap.data());
      }
    });

    return () => unsub();
  }, []);
useEffect(() => {
  const unsub = onSnapshot(doc(db, "teamProfile", "current"), (snap) => {
    if (snap.exists()) {
      setData(snap.data());
    }
  });

  return () => unsub();
}, []);

useEffect(() => {
  const resize = () => {

    const baseW = 1920;
    const baseH = 1080;

    setScale(
      Math.min(
        window.innerWidth / baseW,
        window.innerHeight / baseH
      )
    );
  };

  resize();

  window.addEventListener("resize", resize);

  return () => window.removeEventListener("resize", resize);

}, []);
  if (!data) return null;

  return (
    <main className="w-screen h-screen bg-transparent overflow-hidden">
      <div
  className="flex h-full w-full items-center justify-center bg-transparent overflow-hidden"
  style={{
    transform: `scale(${scale})`,
    transformOrigin: "center center",
  }}
>
        <TeamProfileCard
          side={data.side}
          team={data.team}
          predict={data.predict}
        />
      </div>
    </main>
  );
}

function TeamProfileCard({
  side,
  team,
  predict,
}: {
  side: "HOME" | "AWAY";
  team: any;
  predict: string;
}) {
  const color = side === "HOME" ? "#083067" : "#950002";

  return (
    <div className="w-[1500px] rounded-[40px] bg-transparent p-10 text-white">
      <div className="text-center text-[80px] font-black italic tracking-tight text-[#083067]">
        TEAM PROFILE
      </div>

      <div className="mt-12 grid grid-cols-[500px_1fr] gap-16">
        <div>
          <div
            className="py-5 text-center text-[40px] font-black italic"
            style={{ backgroundColor: color }}
          >
            ({side}) {team.shortName}
          </div>

          <img
            src={`/team-profile/${team.logo}.png`}
            className="h-[600px] w-full border-[6px] object-cover"
            style={{ borderColor: color }}
          />
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <div className="text-[45px] font-semibold italic leading-tight text-yellow-300">
              "{team.quote}"
            </div>

            <div className="mt-10 space-y-6 text-[45px] font-black leading-snug">
              <p>감독 : {team.coach}</p>
              <p>부감독 : {team.subCoach}</p>
              <p>보호선수 : {team.protectedPlayer}</p>
              <p>시즌전적 : {team.seasonRecord}</p>
              <p>출사표 : {team.message}</p>
            </div>
          </div>

          <div className="text-[45px] font-semibold italic text-yellow-300">
            예상스코어 {predict}
          </div>
        </div>
      </div>
    </div>
  );
}