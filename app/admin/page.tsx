"use client";

import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, setDoc, onSnapshot } from "firebase/firestore";

const teams = ["외모지상주의", "월드클래스", "스타강의반", "최강파파", "제이디", "칸"];
const teamProfiles = {
  제이디: {
    shortName: "JD",
    logo: "제이디",
    quote: "준비된 자에게는 반드시 기회가 온다",
    coach: "(갓) DayDream T",
    subCoach: "(퀸) DD T",
    protectedPlayer: "(퀸) MARVEL T",
    seasonRecord: "23-24시즌 준우승, S9 준우승, S10, S11",
    message: "즐기면서 우승!",
    predict: "0:0 승",
  },

  스타강의반: {
    shortName: "스타강의반",
    logo: "스타강의반",
    quote: "목표는 우승! 이겨라!",
    coach: "(잭) Bisu P",
    subCoach: "(퀸) Una^^ Z",
    protectedPlayer: "(퀸) Zergteacher Z",
    seasonRecord: "S11",
    message: "마지막으로 하는 스타라는 심정으로 최선을 다하겠습니다.",
    predict: "0:0 승",
  },

  외모지상주의: {
    shortName: "외모지상주의",
    logo: "외모지상주의",
    quote: "오늘도 신나게, 웃으면서 다 함께!",
    coach: "(스페이드) Bird Z",
    subCoach: "(잭) HS P",
    protectedPlayer: "(킹) HiDDen Z",
    seasonRecord: "S11",
    message: "얼굴로 세계정복",
    predict: "0:0 승",
  },

  최강파파: {
    shortName: "최강파파",
    logo: "최강파파",
    quote: "우리팀은 최강이다",
    coach: "(스페이드) PaPa P",
    subCoach: "(조커) Code T",
    protectedPlayer: "(갓) Teddy Z",
    seasonRecord: "S11",
    message:
      "우승이란 한번의 짧은 날숨, 입술로 내뱉는 두글자의 음절.",
    predict: "0:0 승",
  },

  월드클래스: {
    shortName: "WorldClass",
    logo: "월드클래스",
    quote: "재능은 게임을 이기게 한다. 그러나 팀워크는 우승을 가져온다",
    coach: "(잭) Jelka Z",
    subCoach: "(킹) BadbOy P",
    protectedPlayer: "(갓) OnlyYou T",
    seasonRecord: "S11",
    message: "팀보다 위대한 선수는 없다",
    predict: "0:0 승",
  },

  칸: {
    shortName: "KHAN",
    logo: "칸",
    quote: "WE ARE THE KING, WE ARE THE BEST",
    coach: "(스페이드) SM P",
    subCoach: "(퀸) Inter Z",
    protectedPlayer: "(잭) Aptiv Z",
    seasonRecord: "S11",
    message: "시즌이 끝나고, 가장 위에 있는 팀이 되겠습니다.",
    predict: "0:0 승",
  },
};
const scoreDefault = {
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

const SHEET_CSV =
  "https://docs.google.com/spreadsheets/d/1F6Ey-whXAsTSMCWVmfexGd77jj6WDgv6Z7hkK3BHahs/export?format=csv&gid=1009621464";

const ENTRY_SHEET_CSV =
  "https://docs.google.com/spreadsheets/d/1nKJmEy6h3AL0p-kCyPfLPV1x4rUFCEhxGMQfzlAXypo/export?format=csv&gid=0";

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
type EntryPlayer = {
  player: string;
  race: string;
  tier: string;
  tierCombo: string;
  map: string;
  team: string;
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

export default function AdminPage() {
 const [tab, setTab] = useState<
  "score" | "player" | "team" | "entry" | "matchup"
>("score");

  const [scoreData, setScoreData] = useState(scoreDefault);
const [entryPlayers, setEntryPlayers] = useState<EntryPlayer[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [leftName, setLeftName] = useState("");
  const [rightName, setRightName] = useState("");
  const [mapName, setMapName] = useState("폴스타");
  const [leftSearch, setLeftSearch] = useState("");
  const [rightSearch, setRightSearch] = useState("");
const [homeTeam, setHomeTeam] = useState("제이디");
const [awayTeam, setAwayTeam] = useState("스타강의반");

const [homePredict, setHomePredict] = useState("0:0 승");
const [awayPredict, setAwayPredict] = useState("0:0 승");
const [matchHome, setMatchHome] = useState("스타강의반");
const [matchAway, setMatchAway] = useState("제이디");

const [matchRound, setMatchRound] = useState("1라운드 1주차 1경기");
const [matchDate, setMatchDate] = useState("05.12 TUE 21:30");
const [matchBJ, setMatchBJ] = useState("BJ-Chiwoo");
const saveMatchupOverlay = async () => {
  await setDoc(doc(db, "matchupOverlay", "current"), {
    home: teamProfiles[matchHome as keyof typeof teamProfiles],
    away: teamProfiles[matchAway as keyof typeof teamProfiles],
    matchRound,
    matchDate,
    matchBJ,
  });

  alert("매치업 방송 적용 완료!");
};
const [entryHome, setEntryHome] = useState("제이디");
const [entryAway, setEntryAway] = useState("스타강의반");

const [entryRound, setEntryRound] = useState("1라운드 1주차");
const [entryHomeScore, setEntryHomeScore] = useState(0);
const [entryAwayScore, setEntryAwayScore] = useState(0);
const [entryList, setEntryList] = useState([
  { left: "", setName: "", map: "", right: "", winner:"" },
  { left: "", setName: "", map: "", right: "", winner:"" },
  { left: "", setName: "", map: "", right: "", winner:"" },
  { left: "", setName: "", map: "", right: "", winner:"" },
  { left: "", setName: "", map: "", right: "", winner:"" },
  { left: "", setName: "", map: "", right: "", winner:"" },
  { left: "", setName: "", map: "", right: "", winner:"" },
]);



const saveTeamOverlay = async (
  side: "HOME" | "AWAY"
) => {
 const selectedTeam =
  side === "HOME"
    ? teamProfiles[homeTeam as keyof typeof teamProfiles]
    : teamProfiles[awayTeam as keyof typeof teamProfiles];

  const predict =
    side === "HOME"
      ? homePredict
      : awayPredict;

  await setDoc(
    doc(db, "teamProfile", "current"),
    {
      side,
      team: selectedTeam,
      predict,
    }
  );
};
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
        });

      setPlayers(data);
    });
}, []);


/* 👇 여기 추가 */
const entryMaps = [
  ...new Set(entryPlayers.map((p) => p.map).filter(Boolean)),
];

const entryCombos = [
  ...new Set(entryPlayers.map((p) => p.tierCombo).filter(Boolean)),
];
/* 👇 바로 여기 추가 */
useEffect(() => {
  fetch(ENTRY_SHEET_CSV)
    .then((res) => res.text())
    .then((text) => {
      const rows = parseCSV(text);
      const header = rows[0].map((h) => h.trim());

      const setIndex = header.indexOf("세트");
      const mapIndex = header.indexOf("맵");
      const comboIndex = header.indexOf("티어조합");
      const playerIndex = header.indexOf("선수명");
      const teamIndex = header.indexOf("팀");
      const raceIndex = header.indexOf("종족");
      const data = rows
  .slice(1)
  .map((r) => ({
    set: r[setIndex]?.trim() || "",
    map: r[mapIndex]?.trim() || "",
    tierCombo: r[comboIndex]?.trim() || "",
    race: r[raceIndex]?.trim() || "",
tier: r[comboIndex]?.trim() || "",
tierCombo: r[comboIndex]?.trim() || "",
player: r[playerIndex]?.trim() || "",
  }))
  .filter((p) => p.player);

      setEntryPlayers(data);
    });
}, []);

  const updateScore = async (key: string, value: string | number) => {
    const newData = { ...scoreData, [key]: value };
    setScoreData(newData);
    await setDoc(doc(db, "scoreboard", "current"), newData);
  };

  const filteredLeftPlayers = players.filter((p) =>
    p.player.toLowerCase().includes(leftSearch.toLowerCase())
  );

  const filteredRightPlayers = players.filter((p) =>
    p.player.toLowerCase().includes(rightSearch.toLowerCase())
  );

  const leftPlayer = players.find((p) => p.player === leftName);
  const rightPlayer = players.find((p) => p.player === rightName);
  const map = maps.find((m) => m.name === mapName) || maps[0];
const savePlayerOverlay = async () => {
  const leftPlayer = players.find((p) => p.player === leftName);
  const rightPlayer = players.find((p) => p.player === rightName);
  const map = maps.find((m) => m.name === mapName) || maps[0];

  await setDoc(doc(db, "playerOverlay", "current"), {
    leftPlayer,
    rightPlayer,
    map,
  });

  alert("선수 소개 방송 적용 완료!");
};
  const saveEntryOverlay = async () => {

  const setsWithRace = entryList.map((set) => {

    const leftPlayer = entryPlayers.find(
      (p) =>
        p.team === entryHome &&
        p.player === set.left
    );

    const rightPlayer = entryPlayers.find(
      (p) =>
        p.team === entryAway &&
        p.player === set.right
    );

   return {
  ...set,
  leftTier: leftPlayer?.tier || "",
  leftRace: leftPlayer?.race || "",
  rightTier: rightPlayer?.tier || "",
  rightRace: rightPlayer?.race || "",
};

  });

  await setDoc(doc(db, "entryOverlay", "current"), {
  home: teamProfiles[entryHome as keyof typeof teamProfiles],
  away: teamProfiles[entryAway as keyof typeof teamProfiles],
  round: entryRound,
  homeScore: entryHomeScore,
  awayScore: entryAwayScore,
  sets: setsWithRace,
});

  alert("엔트리 방송 적용 완료!");

};

  return (
    <main className="min-h-screen bg-[#020b2b] text-white p-5">
      <div className="mx-auto max-w-[1500px]">
<div className="mb-6 flex flex-wrap gap-3">

  <button
    onClick={() => setTab("score")}
    className={`rounded-xl px-5 py-3 font-black ${
      tab === "score"
        ? "bg-blue-600 text-white"
        : "bg-white text-black"
    }`}
  >
    스코어보드 관리
  </button>

  <button
    onClick={() => setTab("player")}
    className={`rounded-xl px-5 py-3 font-black ${
      tab === "player"
        ? "bg-purple-600 text-white"
        : "bg-white text-black"
    }`}
  >
    선수전적 · 맵 소개 관리
  </button>

  <button
    onClick={() => setTab("team")}
    className={`rounded-xl px-5 py-3 font-black ${
      tab === "team"
        ? "bg-yellow-400 text-black"
        : "bg-white text-black"
    }`}
  >
    팀 프로필 관리
  </button>

  <button
    onClick={() => setTab("entry")}
    className={`rounded-xl px-5 py-3 font-black ${
      tab === "entry"
        ? "bg-green-500 text-white"
        : "bg-white text-black"
    }`}
  >
    엔트리 관리
  </button>

  <button
    onClick={() => setTab("matchup")}
    className={`rounded-xl px-5 py-3 font-black ${
      tab === "matchup"
        ? "bg-pink-500 text-white"
        : "bg-white text-black"
    }`}
  >
    매치업 관리
  </button>

</div>

        {tab === "score" && (
          <section className="flex flex-col items-center justify-center gap-5">
            <div className="relative h-[210px] w-[500px]">
              <img src="/S11스코어보드.png" className="absolute inset-0 h-full w-full" />

              <img
                src={`/${scoreData.leftTeam}.jpg`}
                className="absolute left-[0px] top-[43px] h-[51px] w-[108px] object-cover"
              />

              <img
                src={`/${scoreData.rightTeam}.jpg`}
                className="absolute right-[0px] top-[43px] h-[51px] w-[108px] object-cover"
              />

              <div className="absolute left-1/2 top-[48px] -translate-x-1/2 text-center leading-none">
                <div className="text-[18px] font-black text-[#6d1cff]">
                  {scoreData.centerTitle}
                </div>
                <div className="text-[18px] font-black text-[#6d1cff]">
                  {scoreData.centerMap}
                </div>
              </div>

              <div className="absolute left-[280px] top-[3px] text-[24px] font-black tracking-[-1px] text-yellow-300">
                {scoreData.roundText}
              </div>

              <div className="absolute left-[20px] top-[105px] w-[120px] text-center text-[21px] font-black tracking-[-1px] text-black">
                {scoreData.leftPlayer}
              </div>

              <div className="absolute left-[212px] top-[95px] w-[30px] text-center text-[38px] font-black text-white">
                {scoreData.leftScore}
              </div>

              <div className="absolute left-[255px] top-[95px] w-[30px] text-center text-[38px] font-black text-white">
                {scoreData.rightScore}
              </div>

              <div className="absolute right-[40px] top-[105px] w-[150px] text-center text-[21px] font-black tracking-[-1px] text-black">
                {scoreData.rightPlayer}
              </div>

              <div className="absolute bottom-[1px] left-[28px] text-[38px] font-black text-red-600">
                {scoreData.leftCode}
              </div>

              <div className="absolute bottom-[1px] right-[28px] text-[38px] font-black text-blue-500">
                {scoreData.rightCode}
              </div>
            </div>

            <div className="w-[500px] space-y-3 rounded-xl bg-white p-4 text-black">
              <input
                className="w-full border p-2"
                value={scoreData.roundText}
                onChange={(e) => updateScore("roundText", e.target.value)}
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  className="border p-2"
                  value={scoreData.centerTitle}
                  onChange={(e) => updateScore("centerTitle", e.target.value)}
                />
                <input
                  className="border p-2"
                  value={scoreData.centerMap}
                  onChange={(e) => updateScore("centerMap", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <select
                  className="border p-2"
                  value={scoreData.leftTeam}
                  onChange={(e) => updateScore("leftTeam", e.target.value)}
                >
                  {teams.map((team) => (
                    <option key={team}>{team}</option>
                  ))}
                </select>

                <select
                  className="border p-2"
                  value={scoreData.rightTeam}
                  onChange={(e) => updateScore("rightTeam", e.target.value)}
                >
                  {teams.map((team) => (
                    <option key={team}>{team}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  className="border p-2"
                  value={scoreData.leftPlayer}
                  onChange={(e) => updateScore("leftPlayer", e.target.value)}
                />
                <input
                  className="border p-2"
                  value={scoreData.rightPlayer}
                  onChange={(e) => updateScore("rightPlayer", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  className="border p-2"
                  value={scoreData.leftCode}
                  onChange={(e) => updateScore("leftCode", e.target.value)}
                />
                <input
                  className="border p-2"
                  value={scoreData.rightCode}
                  onChange={(e) => updateScore("rightCode", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <button
                    className="bg-gray-300 px-4 py-2"
                    onClick={() =>
                      updateScore("leftScore", Math.max(0, scoreData.leftScore - 1))
                    }
                  >
                    -
                  </button>
                  <div className="flex-1 text-center text-2xl font-black">
                    {scoreData.leftScore}
                  </div>
                  <button
                    className="bg-blue-500 px-4 py-2 text-white"
                    onClick={() => updateScore("leftScore", scoreData.leftScore + 1)}
                  >
                    +
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="bg-gray-300 px-4 py-2"
                    onClick={() =>
                      updateScore("rightScore", Math.max(0, scoreData.rightScore - 1))
                    }
                  >
                    -
                  </button>
                  <div className="flex-1 text-center text-2xl font-black">
                    {scoreData.rightScore}
                  </div>
                  <button
                    className="bg-red-500 px-4 py-2 text-white"
                    onClick={() => updateScore("rightScore", scoreData.rightScore + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {tab === "player" && (
          <section className="flex gap-8">
            <div className="w-[350px]">
              <h1 className="text-[30px] font-black leading-none">
                선수 정보 화면 관리
              </h1>

              <p className="mt-4 text-[18px] text-slate-300">
                구글 스프레드시트 선수 데이터를 불러와 방송 화면에 적용합니다.
              </p>

              <div className="mt-10 space-y-6">
                <div>
                  <div className="mb-4 text-[22px] font-black">1. 선수 선택</div>

                  <div className="mb-3 text-[18px]">왼쪽 선수</div>
                  <input
                    className="mb-2 w-full rounded border border-slate-600 bg-slate-800 p-3 text-[16px]"
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
                    className="w-full rounded border border-slate-600 bg-slate-800 p-2 text-[18px]"
                    value={leftName}
                    onChange={(e) => setLeftName(e.target.value)}
                  >
                    {filteredLeftPlayers.map((p) => (
                      <option key={p.player}>{p.player}</option>
                    ))}
                  </select>

                  <div className="mb-3 mt-5 text-[18px]">오른쪽 선수</div>
                  <input
                    className="mb-2 w-full rounded border border-slate-600 bg-slate-800 p-3 text-[16px]"
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
                    className="w-full rounded border border-slate-600 bg-slate-800 p-2 text-[18px]"
                    value={rightName}
                    onChange={(e) => setRightName(e.target.value)}
                  >
                    {filteredRightPlayers.map((p) => (
                      <option key={p.player}>{p.player}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="mb-3 text-[22px] font-black">2. 맵 선택</div>

                  <select
                    className="w-full rounded border border-slate-600 bg-slate-800 p-2 text-[18px]"
                    value={mapName}
                    onChange={(e) => setMapName(e.target.value)}
                  >
                    {maps.map((m) => (
                      <option key={m.name}>{m.name}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={savePlayerOverlay}
                  className="w-full rounded-xl bg-blue-600 p-3 text-[20px] font-black hover:bg-blue-500"
                
                >
                  저장 및 적용
                </button>
              </div>
            </div>

            <div className="flex-1">
              <div className="mb-4 text-[30px] font-black">미리보기</div>

              <div className="grid grid-cols-[300px_590px_300px] gap-3">
                <PlayerCard player={leftPlayer} />
                <MapCard map={map} />
                <PlayerCard player={rightPlayer} />
              </div>
            </div>
          </section>
        )}

{tab === "team" && (
  <section className="flex flex-col items-center">
    <div className="mb-8 grid w-full max-w-[1400px] grid-cols-2 gap-6 rounded-2xl bg-slate-900 p-6">
      <div className="rounded-xl bg-slate-800 p-5">
        <div className="mb-4 text-[28px] font-black text-cyan-300">HOME TEAM</div>

        <select
          className="mb-4 w-full rounded border border-slate-600 bg-slate-700 p-3 text-[18px]"
          value={homeTeam}
          onChange={(e) => setHomeTeam(e.target.value)}
        >
          {teams.map((team) => (
            <option key={team}>{team}</option>
          ))}
        </select>

        <input
          className="w-full rounded border border-slate-600 bg-slate-700 p-3 text-[18px]"
          placeholder="HOME 예상스코어"
          value={homePredict}
          onChange={(e) => setHomePredict(e.target.value)}
        />
        <button
  onClick={() => saveTeamOverlay("HOME")}
  className="mt-4 w-full rounded-xl bg-cyan-500 p-3 text-[20px] font-black hover:bg-cyan-400"
>
  HOME 방송 적용
</button>
      </div>

      <div className="rounded-xl bg-slate-800 p-5">
        <div className="mb-4 text-[28px] font-black text-pink-300">AWAY TEAM</div>

        <select
          className="mb-4 w-full rounded border border-slate-600 bg-slate-700 p-3 text-[18px]"
          value={awayTeam}
          onChange={(e) => setAwayTeam(e.target.value)}
        >
          {teams.map((team) => (
            <option key={team}>{team}</option>
          ))}
        </select>

        <input
          className="w-full rounded border border-slate-600 bg-slate-700 p-3 text-[18px]"
          placeholder="AWAY 예상스코어"
          value={awayPredict}
          onChange={(e) => setAwayPredict(e.target.value)}
        />
        <button
  onClick={() => saveTeamOverlay("AWAY")}
  className="mt-4 w-full rounded-xl bg-pink-500 p-3 text-[20px] font-black hover:bg-pink-400"
>
  AWAY 방송 적용
</button>
      </div>
    </div>

    <div className="flex flex-col items-center gap-16 bg-transparent">
<TeamProfileCard
  side="HOME"
  team={teamProfiles[homeTeam as keyof typeof teamProfiles]}
  predict={homePredict}
/>

<TeamProfileCard
  side="AWAY"
  team={teamProfiles[awayTeam as keyof typeof teamProfiles]}
  predict={awayPredict}
/>
    </div>
  </section>
)}

{tab === "entry" && (
  <section className="rounded-2xl bg-slate-900 p-8">

    <div className="rounded-2xl bg-slate-800/60 p-8">

      <h1 className="text-[54px] font-black text-green-400">
        엔트리 관리
      </h1>

      <p className="mt-3 text-[22px] text-slate-300">
        TODAY'S ENTRY 방송 화면에 들어갈 엔트리를 설정합니다.
      </p>

    </div>

    {/* 팀 선택 */}
    <div className="mt-8 grid grid-cols-2 gap-6">

      <div className="rounded-2xl bg-slate-800/60 p-6">
        <div className="mb-3 text-[22px] font-black text-white">
          HOME 팀 선택
        </div>

        <select
          value={entryHome}
          onChange={(e) => setEntryHome(e.target.value)}
          className="w-full rounded-xl border border-slate-600 bg-slate-700 p-5 text-[26px] text-white"
        >
          {teams.map((team) => (
            <option key={team}>{team}</option>
          ))}
        </select>
      </div>

      <div className="rounded-2xl bg-slate-800/60 p-6">
        <div className="mb-3 text-[22px] font-black text-white">
          AWAY 팀 선택
        </div>

        <select
          value={entryAway}
          onChange={(e) => setEntryAway(e.target.value)}
          className="w-full rounded-xl border border-slate-600 bg-slate-700 p-5 text-[26px] text-white"
        >
          {teams.map((team) => (
            <option key={team}>{team}</option>
          ))}
        </select>
      </div>

    </div>

    {/* 라운드 */}
    <div className="mt-6 rounded-2xl bg-slate-800/60 p-6">

      <div className="mb-3 text-[22px] font-black text-white">
        라운드
      </div>

      <input
        value={entryRound}
        onChange={(e) => setEntryRound(e.target.value)}
        className="w-full rounded-xl border border-slate-600 bg-slate-700 p-5 text-[26px] text-white"
      />

    </div>
<div className="mt-8 mb-5 flex items-center justify-center gap-10">

  {/* HOME */}
  <div className="flex items-center gap-3">

    <button
      onClick={() =>
        setEntryHomeScore((prev) => Math.max(0, prev - 1))
      }
      className="h-12 w-12 rounded-xl bg-slate-400 text-[28px] font-black"
    >
      -
    </button>

    <div className="w-16 text-center text-[34px] font-black text-white">
      {entryHomeScore}
    </div>

    <button
      onClick={() => setEntryHomeScore((prev) => prev + 1)}
      className="h-12 w-12 rounded-xl bg-blue-500 text-[28px] font-black text-white"
    >
      +
    </button>

  </div>

  {/* AWAY */}
  <div className="flex items-center gap-3">

    <button
      onClick={() =>
        setEntryAwayScore((prev) => Math.max(0, prev - 1))
      }
      className="h-14 w-14 rounded-xl bg-slate-400 text-[28px] font-black"
    >
      -
    </button>

    <div className="w-16 text-center text-[34px] font-black text-white">
      {entryAwayScore}
    </div>

    <button
      onClick={() => setEntryAwayScore((prev) => prev + 1)}
      className="h-14 w-14 rounded-xl bg-red-500 text-[28px] font-black text-white"
    >
      +
    </button>

  </div>

</div>
    {/* 세트 */}
    <div className="mt-8 flex flex-col gap-4">

      {entryList.map((set, index) => (

        <div
          key={index}
          className="rounded-2xl border border-slate-700 bg-slate-800/60 p-5"
        >

          <div className="mb-5 flex items-center gap-4">

            <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-green-500 text-[26px] font-black text-black">
              {index + 1}
            </div>

            <div className="text-[32px] font-black text-white">
              세트
            </div>

          </div>

          <div className="grid grid-cols-4 gap-4">

{/* HOME 선수 */}
<select
  value={set.left}
  onChange={(e) => {
    const updated = [...entryList];
    updated[index].left = e.target.value;
    setEntryList(updated);
  }}
  className="rounded-xl border border-slate-600 bg-slate-700 p-4 text-[24px] text-white"
>
  <option value="">HOME 선수 선택</option>

  {entryPlayers
    .filter((p) => p.team === entryHome)
    .map((p) => (
      <option key={`${entryHome}-${p.player}`} value={p.player}>
        {p.player}
      </option>
    ))}
</select>

{/* 세트명 */}
<select
  value={set.setName}
  onChange={(e) => {
    const updated = [...entryList];
    updated[index].setName = e.target.value;
    setEntryList(updated);
  }}
  className="rounded-xl border border-slate-600 bg-slate-700 p-4 text-[24px] text-white"
>
  <option value="">티어조합 선택</option>

  {entryCombos.map((combo) => (
    <option key={combo} value={combo}>
      {combo}
    </option>
  ))}
</select>

            {/* 맵 */}
           <select
  value={set.map}
  onChange={(e) => {
    const updated = [...entryList];
    updated[index].map = e.target.value;
    setEntryList(updated);
  }}
  className="rounded-xl border border-slate-600 bg-slate-700 p-4 text-[24px] text-white"
>
  <option value="">맵 선택</option>

  {entryMaps.map((map) => (
    <option key={map} value={map}>
      {map}
    </option>
  ))}
</select>
{/* AWAY 선수 */}
<select
  value={set.right}
  onChange={(e) => {
    const updated = [...entryList];
    updated[index].right = e.target.value;
    setEntryList(updated);
  }}
  className="rounded-xl border border-slate-600 bg-slate-700 p-4 text-[24px] text-white"
>
  <option value="">AWAY 선수 선택</option>

  {entryPlayers
    .filter((p) => p.team === entryAway)
    .map((p) => (
      <option
        key={`${entryAway}-${p.player}`}
        value={p.player}
      >
        {p.player}
      </option>
    ))}
</select>

{/* 👇 여기 추가 */}
<div className="col-span-4 grid grid-cols-2 gap-4">
  <button
    onClick={() => {
      const updated = [...entryList];
      updated[index].winner = "HOME";
      setEntryList(updated);
    }}
    className={`rounded-xl p-4 text-[22px] font-black ${
      set.winner === "HOME"
        ? "bg-cyan-400 text-black"
        : "bg-slate-700 text-white"
    }`}
  >
    HOME 승리 체크
  </button>

  <button
    onClick={() => {
      const updated = [...entryList];
      updated[index].winner = "AWAY";
      setEntryList(updated);
    }}
    className={`rounded-xl p-4 text-[22px] font-black ${
      set.winner === "AWAY"
        ? "bg-pink-400 text-black"
        : "bg-slate-700 text-white"
    }`}
  >
    AWAY 승리 체크
  </button>
</div>

</div>

        </div>

      ))}

    </div>

    {/* 적용 버튼 */}
    <button
      onClick={saveEntryOverlay}
      className="mt-8 w-full rounded-2xl bg-green-500 p-6 text-[32px] font-black text-black transition hover:bg-green-400"
    >
      엔트리 방송 적용
    </button>

  </section>
)}

{tab === "matchup" && (
  <section className="flex flex-col items-center">

    {/* 관리자 */}
    <div className="mb-8 grid w-full max-w-[1400px] grid-cols-2 gap-6 rounded-2xl bg-slate-900 p-6">

      <div className="rounded-xl bg-slate-800 p-5">
        <div className="mb-4 text-[28px] font-black text-cyan-300">
          HOME TEAM
        </div>

        <select
          className="mb-4 w-full rounded border border-slate-600 bg-slate-700 p-3 text-[18px]"
          value={matchHome}
          onChange={(e) => setMatchHome(e.target.value)}
        >
          {teams.map((team) => (
            <option key={team}>{team}</option>
          ))}
        </select>

        <input
          className="w-full rounded border border-slate-600 bg-slate-700 p-3 text-[18px]"
          value={matchRound}
          onChange={(e) => setMatchRound(e.target.value)}
        />
      </div>

      <div className="rounded-xl bg-slate-800 p-5">
        <div className="mb-4 text-[28px] font-black text-pink-300">
          AWAY TEAM
        </div>

        <select
          className="mb-4 w-full rounded border border-slate-600 bg-slate-700 p-3 text-[18px]"
          value={matchAway}
          onChange={(e) => setMatchAway(e.target.value)}
        >
          {teams.map((team) => (
            <option key={team}>{team}</option>
          ))}
        </select>

        <input
          className="w-full rounded border border-slate-600 bg-slate-700 p-3 text-[18px]"
          value={matchDate}
          onChange={(e) => setMatchDate(e.target.value)}
        />
      </div>

    </div>

    <input
      className="mb-8 w-[500px] rounded border border-slate-600 bg-slate-700 p-3 text-[18px]"
      value={matchBJ}
      onChange={(e) => setMatchBJ(e.target.value)}
    />
<button
  onClick={saveMatchupOverlay}
  className="mb-8 w-[500px] rounded-xl bg-pink-500 p-3 text-[20px] font-black hover:bg-pink-400"
>
  매치업 방송 적용
</button>

    {/* 방송 미리보기 */}
    <div className="relative h-[1080px] w-[1920px] overflow-hidden bg-transparent">

      <div className="absolute inset-0 bg-gradient-to-r from-slate-100 via-sky-300 to-sky-400" />

      <div className="absolute left-1/2 top-[40px] -translate-x-1/2 text-center">

        <div className="text-[90px] font-black italic text-[#083067]">
          TODAY'S MATCH UP
        </div>

        <div className="text-[50px] font-black italic text-yellow-300">
          {matchRound}
        </div>

      </div>

      {/* 팀 로고 */}
      <div className="absolute left-[180px] top-[250px]">
        <img
          src={`/team-profile/${teamProfiles[matchHome as keyof typeof teamProfiles].logo}.png`}
          className="h-[500px] w-[500px] object-contain"
        />
      </div>

      <div className="absolute right-[180px] top-[250px]">
        <img
          src={`/team-profile/${teamProfiles[matchAway as keyof typeof teamProfiles].logo}.png`}
          className="h-[500px] w-[500px] object-contain"
        />
      </div>

      {/* 중앙 */}
      <div className="absolute left-1/2 top-[260px] -translate-x-1/2 text-center">

        <div className="text-[90px] font-black text-white">
          {teamProfiles[matchHome as keyof typeof teamProfiles].shortName}
        </div>

        <div className="my-8 text-[130px] font-black italic text-[#083067]">
          VS
        </div>

        <div className="text-[90px] font-black text-white">
          {teamProfiles[matchAway as keyof typeof teamProfiles].shortName}
        </div>

        <div className="mt-16 border-t border-b border-[#083067]/30 py-6">
          <div className="text-[70px] font-black italic text-[#083067]">
            {matchDate}
          </div>

          <div className="text-[60px] font-black italic text-[#083067]">
            {matchBJ}
          </div>
        </div>

      </div>

    </div>

  </section>
)}
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
    <div className="w-[1500px] rounded-[40px] bg-gradient-to-r from-sky-300/90 to-cyan-400/90 p-10 text-white shadow-2xl">
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

            <div className="mt-10 space-y-6 text-[45px] font-semibold leading-snug">
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
function PlayerCard({ player }: { player?: Player }) {
  if (!player) return <div>선수 없음</div>;

  return (
    <div className="h-[360px] bg-gradient-to-b from-cyan-400 to-blue-600 border-[4px] border-yellow-400 text-white flex flex-col">
      <div className="border-b border-yellow-300 p-4">
        <div className="text-center text-[30px] font-black leading-none">
          {player.tier}
        </div>

        <div className="mt-1 text-center text-[24px] font-black leading-none text-yellow-300">
          {player.player}
        </div>
      </div>

      <div className="flex-1 p-5">
        <div className="text-center text-[18px] font-black leading-snug text-yellow-300 underline">
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
    <div className="h-[360px] bg-gradient-to-b from-sky-400 to-blue-600 border-[4px] border-yellow-400 text-white p-4">
      <div className="text-center">
        <div className="text-[44px] font-black leading-none">{map.name}</div>
        <div className="mt-1 text-[24px] font-black leading-none text-yellow-300">
          {map.en}
        </div>
      </div>

      <div className="mt-5 flex gap-4">
        <img
          src={map.image}
          className="h-[220px] w-[220px] border-[3px] border-yellow-300 object-cover"
        />

        <div className="flex-1 space-y-2 text-[16px] font-black">
          <p>▶ 인원수 : {map.people}</p>
          <p>▶ 사이즈 : {map.size}</p>
          <p>▶ 타일셋 : {map.tileset}</p>
          <p>▶ 러시거리</p>
          <p className="text-[14px] leading-snug">({map.rush})</p>
          <p>▶ 타입 : {map.type}</p>
          <p>▶ 종족별 승률 : 3050프로리그 기준</p>
          <p className="text-yellow-300">{map.matchup || "-"}</p>
        </div>
      </div>
    </div>
  );
}