"use client";

import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";

const SHEET_CSV =
  "https://docs.google.com/spreadsheets/d/1F6Ey-whXAsTSMCWVmfexGd77jj6WDgv6Z7hkK3BHahs/export?format=csv&gid=1009621464";

type Player = {
  player: string;
  race: string;
  tier: string;
  zerg: string;
  protoss: string;
  terran: string;
  total: string;
  winrate: string;
  elo: string;
  rank: string;
  awards: string;
};

const maps = [
  {
    name: "매치포인트",
    en: "MatchPoint",
    people: "2인용",
    size: "112×128",
    tileset: "Space Platform",
    type: "고지형 난전맵",
    rush: "38초",
    image: "/maps/matchpoint.png",
  },

  {
    name: "실피드",
    en: "Neo Sylphid",
    people: "3인용",
    size: "128×128",
    tileset: "Jungle World",
    type: "평지형 힘싸움맵",
    rush: "33초",
    image: "/maps/sylphid.png",
  },

  {
    name: "투혼",
    en: "Fighting Spirit",
    people: "4인용",
    size: "128×128",
    tileset: "Space Platform",
    type: "중앙 난전맵",
    rush: "가로 29초, 세로 27초, 대각선 36초",
    image: "/maps/fightingspirit.png",
  },

  {
  name: "폴리포이드",
  en: "Polypoid",
  people: "4인용",
  size: "128×128",
  tileset: "Jungle",
  type: "중앙 힘싸움맵",
  rush: "가로/세로 30초, 대각선 40초",
  matchup: "T vs P 전적없음",
  image: "/maps/polypoid.png",
},

  {
    name: "옥타곤",
    en: "Octagon",
    people: "4인용",
    size: "128×128",
    tileset: "Jungle World",
    type: "평지형 힘싸움맵",
    rush: "가로 32초, 대각선 38초",
    image: "/maps/octagon.png",
  },

  {
    name: "폴스타",
    en: "Pole Star",
    people: "4인용",
    size: "128×128",
    tileset: "Space Platform",
    type: "평지형 힘싸움맵",
    rush: "가로 29초, 세로 29초, 대각선 39초",
    image: "/maps/polestar.png",
  },

  {
    name: "녹아웃",
    en: "KnockOut",
    people: "4인용",
    size: "128×128",
    tileset: "Space Platform",
    type: "전술형 힘싸움맵",
    rush: "가로 35초, 세로 28초, 대각선 39초",
    image: "/maps/knockout.png",
  },

  {
    name: "애티튜드",
    en: "Attitude",
    people: "4인용",
    size: "128×128",
    tileset: "Jungle World",
    type: "전술형 힘싸움맵",
    rush: "가로 29초, 대각 38초",
    image: "/maps/attitude.png",
  },
];

function parseCSV(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quote = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && quote && next === '"') {
      cell += '"';
      i++;
    } else if (char === '"') {
      quote = !quote;
    } else if (char === "," && !quote) {
      row.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !quote) {
      if (cell || row.length) {
        row.push(cell);
        rows.push(row);
        row = [];
        cell = "";
      }
    } else {
      cell += char;
    }
  }

  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }

  return rows;
}

export default function PlayerAdminPage() {
  const [players, setPlayers] = useState<Player[]>([]);

  const [leftName, setLeftName] = useState("");
  const [rightName, setRightName] = useState("");

  const [mapName, setMapName] = useState("폴스타");

const [leftSearch, setLeftSearch] = useState("");
const [rightSearch, setRightSearch] = useState("");
  useEffect(() => {
    fetch(SHEET_CSV)
      .then((res) => res.text())
      .then((text) => {
        const rows = parseCSV(text);

        const header = rows[0];

        const data = rows
          .slice(1)
          .map((r) => {
            const obj: Record<string, string> = {};

            header.forEach((h, i) => {
              obj[h.trim()] = r[i]?.trim() || "";
            });

            return {
              player: obj["플레이어"] || "",
              rank: obj["랭킹"] || "",
              race: obj["종족"] || "",
              tier: obj["티어"] || "",
              zerg: obj["저그전"] || "",
              protoss: obj["프로토스전"] || "",
              terran: obj["테란전"] || "",
              total: obj["총전적"] || "",
              winrate: obj["승률"] || "",
              elo: obj["ELO"] || "",
              awards: obj["수상경력"] || "",
            };
          })
          .filter((p) => p.player);

        setPlayers(
  data.sort((a, b) =>
    a.player.localeCompare(b.player)
  )
);

        setLeftName(data[0]?.player || "");
        setRightName(data[1]?.player || "");
      });
  }, []);

  const filteredLeftPlayers = players.filter((p) =>
  p.player.toLowerCase().includes(leftSearch.toLowerCase())
);

const filteredRightPlayers = players.filter((p) =>
  p.player.toLowerCase().includes(rightSearch.toLowerCase())
);

  const leftPlayer = players.find((p) => p.player === leftName);

  const rightPlayer = players.find((p) => p.player === rightName);

  const map = maps.find((m) => m.name === mapName) || maps[0];

  const save = async () => {
    await setDoc(doc(db, "playerOverlay", "current"), {
      leftPlayer,
      rightPlayer,
      map,
    });

    alert("저장 완료!");
  };

  return (
    <main className="min-h-screen bg-[#020b2b] text-white p-5">

      <div className="max-w-[1500px] mx-auto flex gap-8">

        {/* 왼쪽 관리자 */}
        <div className="w-[350px]">

          <h1 className="text-[30px] font-black leading-none">
            선수 정보 화면 관리
          </h1>

          <p className="mt-4 text-[18px] text-slate-300">
            구글 스프레드시트 선수 데이터를 불러와 방송 화면에 적용합니다.
          </p>

          <div className="mt-10 space-y-6">

            <div>
              <div className="text-[22px] font-black mb-4">
                1. 선수 선택
              </div>

              <div className="mb-3 text-[18px]">
                왼쪽 선수
              </div>
<input
  className="w-full p-3 mb-2 rounded bg-slate-800 border border-slate-600 text-[16px]"
  value={leftSearch}
  onChange={(e) => {
  const value = e.target.value;
  setLeftSearch(value);

  const found = players.find((p) =>
    p.player.toLowerCase().includes(value.toLowerCase())
  );

  if (found) {
    setLeftName(found.player);
  }
}}
  placeholder="왼쪽 선수 검색"
/>
              <select
                className="w-full p-2 rounded bg-slate-800 border border-slate-600 text-[18px]"
                value={leftName}
                onChange={(e) => {
  const value = e.target.value;
  setRightSearch(value);

  const found = players.find((p) =>
    p.player.toLowerCase().includes(value.toLowerCase())
  );

  if (found) {
    setRightName(found.player);
  }
}}
              >
                {filteredLeftPlayers.map((p) => (
                  <option key={p.player}>{p.player}</option>
                ))}
              </select>

              <div className="mb-3 mt-5 text-[18px]">
                오른쪽 선수
              </div>
<input
  className="w-full p-3 mb-2 rounded bg-slate-800 border border-slate-600 text-[16px]"
  value={rightSearch}
  onChange={(e) => {

    const value = e.target.value;

    setRightSearch(value);

    const found = players.find((p) =>
      p.player.toLowerCase().includes(value.toLowerCase())
    );

    if (found) {
      setRightName(found.player);
    }

  }}
  placeholder="오른쪽 선수 검색"
/>

<select
  className="w-full p-2 rounded bg-slate-800 border border-slate-600 text-[18px]"
  value={rightName}
  onChange={(e) => setRightName(e.target.value)}
>
  {filteredRightPlayers.map((p) => (
    <option key={p.player}>{p.player}</option>
  ))}
</select>

              <div className="text-[22px] font-black mb-3">
                2. 맵 선택
              </div>

              <select
                className="w-full p-2 rounded bg-slate-800 border border-slate-600 text-[18px]"
                value={mapName}
                onChange={(e) => setMapName(e.target.value)}
              >
                {maps.map((m) => (
                  <option key={m.name}>{m.name}</option>
                ))}
              </select>

            </div>

            <button
              onClick={save}
              className="w-full bg-blue-600 hover:bg-blue-500 rounded-xl p-3 font-black text-[20px]"
            >
              저장 및 적용
            </button>

          </div>

        </div>

        {/* 오른쪽 미리보기 */}
        <div className="flex-1">

          <div className="text-[30px] font-black mb-4">
            미리보기
          </div>

          <div className="grid grid-cols-[300px_590px_300px] gap-3">

            <PlayerCard player={leftPlayer} />

            <MapCard map={map} />

            <PlayerCard player={rightPlayer} />

          </div>

        </div>

      </div>

    </main>
  );
}

function PlayerCard({ player }: { player?: Player }) {
  if (!player) return <div>선수 없음</div>;

  return (
    <div className="h-[360px] bg-transparent border-[4px] border-yellow-400 text-white flex flex-col">

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
          ELO랭킹 {player.tier} {player.rank}위
        </p>

        <p>승률 {player.winrate}</p>

      </div>

    </div>
  );
}

function MapCard({ map }: { map: any }) {
  return (
    <div className="h-[360px] bg-transparent border-[4px] border-yellow-400 text-white p-4">

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
  {map.matchup || "-"}
</p>

        </div>

      </div>

    </div>
  );
}