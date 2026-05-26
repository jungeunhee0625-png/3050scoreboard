"use client";

import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, onSnapshot } from "firebase/firestore";

export default function EntryOverlayPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "entryOverlay", "current"),
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
    <main
      style={{
        width: "1920px",
        height: "1080px",
        position: "relative",
        overflow: "hidden",
        background: "transparent",
        transformOrigin: "top left",
      }}
    >
      {/* 배경 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, #dbeafe 0%, #7dd3fc 50%, #22d3ee 100%)",
          opacity: 0.95,
        }}
      />

      {/* 제목 */}
      <div
        style={{
          position: "absolute",
          top: 30,
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 80,
            fontWeight: 900,
            fontStyle: "italic",
            color: "#083067",
            lineHeight: 1,
          }}
        >
          TODAY&apos;S ENTRY
        </div>

        <div
          style={{
            marginTop: 10,
            fontSize: 40,
            fontWeight: 900,
            fontStyle: "italic",
            color: "#ffe21a",
          }}
        >
          {data.round}
        </div>
      </div>

      {/* 상단 바 */}
      <div
        style={{
          position: "absolute",
          top: 140,
          left: 110,
          width: 1700,
          height: 100,
          background: "#082f6a",
          borderRadius: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: 160,
          paddingRight: 160,
        }}
      >
        {/* HOME */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 25,
          }}
        >
          <img
            src={`/team-profile/${data.home.logo}.png`}
            style={{
              width: 120,
              height: 120,
              objectFit: "contain",
            }}
          />

          <div
            style={{
              fontSize: 60,
              fontWeight: 900,
              color: "white",
            }}
          >
            {data.home.shortName}
          </div>
        </div>

        {/* VS */}
        <div
          style={{
            fontSize: 70,
            fontWeight: 900,
            color: "#ffe21a",
            fontStyle: "italic",
          }}
        >
          VS
        </div>

        {/* AWAY */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 25,
          }}
        >
          <div
            style={{
              fontSize: 60,
              fontWeight: 900,
              color: "white",
            }}
          >
            {data.away.shortName}
          </div>

          <img
            src={`/team-profile/${data.away.logo}.png`}
            style={{
              width: 120,
              height: 120,
              objectFit: "contain",
            }}
          />
        </div>
      </div>

      {/* 엔트리 목록 */}
      <div
        style={{
          position: "absolute",
          top: 280,
          left: 120,
          width: 1680,
        }}
      >
        {data.sets?.map((set: any, index: number) => (
          <div
            key={index}
            style={{
              height: 100,
              display: "grid",
              gridTemplateColumns: "1fr 320px 1fr",
              alignItems: "center",
              borderBottom: "2px dotted rgba(8,48,103,0.5)",
            }}
          >
            {/* 왼쪽 선수 */}
            <div
              style={{
                textAlign: "center",
                fontSize: 52,
                fontWeight: 900,
                fontStyle: "italic",
                color: "#083067",
              }}
            >
              {set.left}
            </div>

            {/* 세트 */}
            <div
              style={{
                textAlign: "center",
                lineHeight: 1.1,
              }}
            >
              <div
                style={{
                  fontSize: 34,
                  fontWeight: 900,
                  color: "#ffe21a",
                }}
              >
                {set.setName}
              </div>

              <div
                style={{
                  fontSize: 34,
                  fontWeight: 900,
                  color: "#ffe21a",
                }}
              >
                {set.map}
              </div>
            </div>

            {/* 오른쪽 선수 */}
            <div
              style={{
                textAlign: "center",
                fontSize: 52,
                fontWeight: 900,
                fontStyle: "italic",
                color: "#083067",
              }}
            >
              {set.right}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}