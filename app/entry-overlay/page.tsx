"use client";

import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, onSnapshot } from "firebase/firestore";

export default function EntryOverlayPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "entryOverlay", "current"), (snap) => {
      if (snap.exists()) {
        setData(snap.data());
      }
    });

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
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "transparent",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 20,
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
            fontSize: 48,
            fontWeight: 900,
            fontStyle: "italic",
            color: "#ffe21a",
          }}
        >
          {data.round}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 240,
          left: 110,
          width: 1700,
          height: 100,
          background: "#082f6a",
          borderRadius: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: 30,
          paddingRight: 30,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 25 }}>
          <img
            src={`/team-logo/${data.home.logo}.png`}
            style={{
              width: 200,
              height: 200,
              objectFit: "contain",
              marginTop: -70,
            }}
          />

          <div style={{ fontSize: 60, fontWeight: 900, color: "white" }}>
            {data.home.shortName}
          </div>
        </div>

<div
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 40,
    transform: "translateX(100px)",
    marginTop: 20,
    marginBottom: 20,
  }}
>
  <div
    style={{
      fontSize: 70,
      fontWeight: 900,
      color: "#ffe21a",
      fontStyle: "italic",
    }}
  >
    {data.homeScore ?? 0}
  </div>

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

  <div
    style={{
      fontSize: 70,
      fontWeight: 900,
      color: "#ffe21a",
      fontStyle: "italic",
    }}
  >
    {data.awayScore ?? 0}
  </div>
</div>

        <div style={{ display: "flex", alignItems: "center", gap: 25 }}>
          <div style={{ fontSize: 60, fontWeight: 900, color: "white" }}>
            {data.away.shortName}
          </div>

          <img
            src={`/team-logo/${data.away.logo}.png`}
            style={{
              width: 200,
              height: 200,
              objectFit: "contain",
              marginTop: -70,
            }}
          />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 350,
          left: 120,
          width: 1680,
        }}
      >
        {data.sets?.map((set: any, index: number) => (
          <div
            key={index}
            style={{
              position: "relative",
              height: 100,
              display: "grid",
              gridTemplateColumns: "1fr 320px 1fr",
              alignItems: "center",
              borderBottom: "2px dotted rgba(8,48,103,0.5)",
            }}
          >
            <div
              style={{
                textAlign: "center",
                fontSize: 52,
                fontWeight: 900,
                fontStyle: "italic",
                color: "#083067",
              }}
            >
              {set.leftTier} {set.left} {set.leftRace}
            </div>

            <div style={{ textAlign: "center", lineHeight: 1.3 }}>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: "#ffe21a",
                }}
              >
                {index + 1}SET
              </div>

              <div
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: "#ffe21a",
                }}
              >
                {set.setName}
              </div>

              <div
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: "#ffe21a",
                }}
              >
                {set.map}
              </div>
            </div>

            <div
              style={{
                textAlign: "center",
                fontSize: 52,
                fontWeight: 900,
                fontStyle: "italic",
                color: "#083067",
              }}
            >
              {set.rightTier} {set.right} {set.rightRace}
            </div>

            {set.winner === "HOME" && (
              <img
                src="/icons/win-check.png"
                style={{
                  position: "absolute",
                  left: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 90,
                  height: 90,
                  objectFit: "contain",
                }}
              />
            )}

            {set.winner === "AWAY" && (
              <img
                src="/icons/win-check.png"
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 90,
                  height: 90,
                  objectFit: "contain",
                }}
              />
            )}
          </div>
        ))}
      </div>
    </main>
  );
}