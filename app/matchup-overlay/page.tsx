"use client";

import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, onSnapshot } from "firebase/firestore";

export default function MatchupOverlayPage() {
  const [data, setData] = useState<any>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "matchupOverlay", "current"),
      (snap) => {
        if (snap.exists()) setData(snap.data());
      }
    );

    return () => unsub();
  }, []);

  // 자동 축소/확대
  useEffect(() => {
    const resize = () => {
      const scaleX = window.innerWidth / 1920;
      const scaleY = window.innerHeight / 1080;

      setScale(Math.min(scaleX, scaleY));
    };

    resize();

    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
  }, []);

  if (!data) return null;

  return (
    <main
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "transparent",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* 자동 스케일 */}
      <div
        style={{
          width: 1920,
          height: 1080,
          position: "relative",
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          flexShrink: 0,
        }}
      >
        {/* 제목 */}
        <div
          style={{
            position: "absolute",
            top: 48,
            left: 0,
            width: "100%",
            textAlign: "center",
            fontSize: 92,
            fontWeight: 900,
            fontStyle: "italic",
            color: "#07366f",
            lineHeight: 1,
          }}
        >
          TODAY&apos;S MATCH UP
        </div>

        {/* 라운드 */}
        <div
          style={{
            position: "absolute",
            top: 155,
            left: 0,
            width: "100%",
            textAlign: "center",
            fontSize: 44,
            fontWeight: 900,
            fontStyle: "italic",
            color: "#ffe21a",
          }}
        >
          {data.matchRound}
        </div>

        {/* HOME */}
        <img
          src={`/team-profile/${data.home.logo}.png`}
          style={{
            position: "absolute",
            left: 180,
            top: 285,
            width: 500,
            height: 500,
            objectFit: "contain",
          }}
        />

        {/* AWAY */}
        <img
          src={`/team-profile/${data.away.logo}.png`}
          style={{
            position: "absolute",
            right: 180,
            top: 285,
            width: 500,
            height: 500,
            objectFit: "contain",
          }}
        />

        {/* 중앙 */}
        <div
          style={{
            position: "absolute",
            top: 315,
            left: "50%",
            transform: "translateX(-50%)",
            width: 620,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 92,
              fontWeight: 900,
              color: "white",
              lineHeight: 1,
              whiteSpace: "nowrap",
            }}
          >
            {data.home.shortName}
          </div>

          <div
            style={{
              marginTop: 60,
              fontSize: 130,
              fontWeight: 900,
              fontStyle: "italic",
              color: "#07366f",
              lineHeight: 1,
            }}
          >
            VS
          </div>

          <div
            style={{
              marginTop: 60,
              fontSize: 92,
              fontWeight: 900,
              color: "white",
              lineHeight: 1,
              whiteSpace: "nowrap",
            }}
          >
            {data.away.shortName}
          </div>

          {/* 선 */}
          <div
            style={{
              marginTop: 85,
              marginLeft: "auto",
              marginRight: "auto",
              width: 520,
              height: 2,
              background: "rgba(7, 54, 111, 0.25)",
            }}
          />

          {/* 날짜 */}
          <div
            style={{
              marginTop: 40,
              fontSize: 58,
              fontWeight: 900,
              fontStyle: "italic",
              color: "#07366f",
              lineHeight: 1,
            }}
          >
            {data.matchDate}
          </div>

          {/* BJ */}
          <div
            style={{
              marginTop: 28,
              fontSize: 52,
              fontWeight: 900,
              fontStyle: "italic",
              color: "#07366f",
              lineHeight: 1,
            }}
          >
            {data.matchBJ}
          </div>

          {/* 아래 선 */}
          <div
            style={{
              marginTop: 35,
              marginLeft: "auto",
              marginRight: "auto",
              width: 520,
              height: 2,
              background: "rgba(7, 54, 111, 0.25)",
            }}
          />
        </div>
      </div>
    </main>
  );
}