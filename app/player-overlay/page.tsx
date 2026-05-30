"use client";

import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, onSnapshot } from "firebase/firestore";

type Player = {
  player: string;
  race: string;
  tier: string;
  zerg: string;
  protoss: string;
  terran: string;
  total: string;
 totalRank: string;
  elo: string;
  rank: string;
  awards: string;
};

export default function PlayerOverlayPage() {
  const [leftPlayer, setLeftPlayer] = useState<Player | null>(null);
  const [rightPlayer, setRightPlayer] = useState<Player | null>(null);
  const [map, setMap] = useState<any>(null);
  const [scale, setScale] = useState(1);
useEffect(() => {
  const resize = () => {

    const baseW = 1200;
    const baseH = 360;

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

useEffect(() => {

  const unsub = onSnapshot(
    doc(db, "playerOverlay", "current"),
    (snap) => {

      const data = snap.data();

      if (!data) return;

      setLeftPlayer(data.leftPlayer);
      setRightPlayer(data.rightPlayer);
      setMap(data.map);

    }
  );

  return () => unsub();

}, []);

  if (!leftPlayer || !rightPlayer || !map) {
    return <div className="text-white">불러오는 중...</div>;
  }

  return (
    <main className="w-screen h-screen bg-transparent overflow-hidden">

      <div className="w-fit h-fit flex items-center justify-center">

        <div
  className="grid grid-cols-[300px_590px_300px] gap-3"
style={{
  transform: `translate(4px, 4px) scale(${scale * 0.98})`,
  transformOrigin: "top left",
}}
>

          <PlayerCard player={leftPlayer} />

          <MapCard map={map} />

          <PlayerCard player={rightPlayer} />

        </div>

      </div>

    </main>
  );
}

function PlayerCard({ player }: { player: Player }) {
  return (
    <div className="h-[390px] bg-gradient-to-b from-sky-400 to-blue-600 border-[4px] border-yellow-400 text-white flex flex-col">

      <div className="p-4 border-b border-yellow-300">

        <div className="text-[30px] leading-none font-black text-center">
          {player.tier}
        </div>

        <div className="text-[24px] leading-none font-black text-yellow-300 text-center mt-1">
          {player.player}
        </div>

      </div>

      <div className="flex-1 p-5">

        <div className="text-center text-yellow-300 font-black underline text-[18px] leading-snug">
          3050RECORD
        </div>

        <div className="mt-5 space-y-0 text-[18px] font-black tracking-wide">

          <p>vs ALL {player.total}</p>
          <p>vs Z {player.zerg}</p>
          <p>vs P {player.protoss}</p>
          <p>vs T {player.terran}</p>

        </div>

      </div>

      <div className="border-t border-white/40 p-2 text-[12px] font-black">

        <p className="text-yellow-300">
  전체랭킹 {player.totalRank || "-"}위
</p>

<p className="text-yellow-300">
  티어별랭킹 {player.tier} {player.rank || "-"}위
</p>

      </div>

    </div>
  );
}

function MapCard({ map }: { map: any }) {
  return (
    <div className="h-[390px] bg-gradient-to-b from-sky-400 to-blue-600 border-[4px] border-yellow-400 text-white p-4">

      <div className="text-center">

        <div className="text-[44px] leading-none font-black">
          {map.name}
        </div>

        <div className="text-[24px] leading-none font-black text-yellow-300 mt-1">
          {map.en}
        </div>

      </div>

      <div className="mt-5 flex gap-4">

        <img
          src={map.image}
          className="w-[220px] h-[220px] object-cover border-[3px] border-yellow-300"
        />

        <div className="flex-1 space-y-2 text-[16px] font-black">

          <p>▶ 인원수 : {map.people}</p>
          <p>▶ 사이즈 : {map.size}</p>
          <p>▶ 타일셋 : {map.tileset}</p>

          <p>▶ 러시거리</p>

          <p className="text-[14px] leading-snug">
            ({map.rush})
          </p>

          <p>▶ 타입 : {map.type}</p>

          <p>▶ 종족별 승률 : 3050프로리그 기준</p>

       <p className="text-yellow-300">
  {map.record?.zvp || "-"} / {map.record?.zvt || "-"} / {map.record?.pvt || "-"}
</p>

        </div>

      </div>

    </div>
  );
}