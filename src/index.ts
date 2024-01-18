import * as Plot from "@observablehq/plot";
import * as d3 from 'd3';
//import {addTooltips} from "@mkfreeman/plot-tooltip"

interface Player {
  name: string;
  team: string;
  usg_pct: number;
  ts_pct: number;
  playoff_mp: number;
  playoff_usg_pct: number;
  playoff_ts_pct: number;
  playoff_mpg: number;
}

interface Games {
  id: string;
  rated: string;
  created_at: string;
  last_move_at: string;
  turns: string;
  victory_status: string;
  winner: string;
  increment_code: string;
  white_id: string;
  white_rating: string;
  black_id: string;
  black_rating: string;
  moves: string;
  opening_eco: string;
  opening_name: string;
  opening_ply: string;
}

async function main(): Promise<void> {
  const res = await fetch("data/players_2023.json");
  const data = (await res.json()) as Array<Player>;
  const barchart = Plot.plot({
    title: "NBA Shooting",
    subtitle: "Field goals attempted & attempted in 2022-23",
    width: 640,
    grid: true,
    x: {
      label: "field goals attempted",
    },
    y: {
      label: "field goals made",
    },
    marks: [
      Plot.dot(data, {
        x: "fga",
        y: "fgm",
        fill: "team_abbreviation",
      }),
      Plot.tip(
        data,
        Plot.pointer({
          x: "fga",
          y: "fgm",
          title: (d) => `${d.player_name}\n${d.team_abbreviation}`,
        }),
      ),
      Plot.ruleY([0]),
    ],
  });
  
  document.querySelector("#plot")?.append(barchart);

  const chess: Array<Games> = await d3.csv("data/Lichess.csv");

  const differences = chess.map(d => ({
    difference: Math.abs(Number(d.white_rating) - Number(d.black_rating)),
    winner: d.winner,
    underdog: ((d.winner === "white" && d.white_rating < d.black_rating) ||  (d.winner === "black" && d.white_rating > d.black_rating)) ? "underdog" : d.victory_status === "draw" ? "draw" : "favorite",
    victory_status: d.victory_status,
    opening_name: d.opening_name
  }));

  
  const scatter = Plot.plot({
    marginLeft: 60,
    x: {inset: 10},
    color: {legend: true},
    y: {label: null },
    marks: [
      Plot.dot(differences, {
        x: "difference", 
        y: "underdog", 
        stroke: "difference",
        // title: (d) =>
        //   `${d.winner} \n Game Status: ${d.victory_status} \n Opening Play: ${d.opening_name}` // \n makes a new line
      }),
      Plot.tip(
        differences,
        Plot.pointer({
          x: "difference",
          y: "underdog",
          title: (d) =>
            `${d.winner} \n Game Status: ${d.victory_status} \n Opening Play: ${d.opening_name}` // \n makes a new line,
        }),
      )
      
    ],
    
  })

  document.querySelector("#plot")?.append(scatter);
}

window.addEventListener("DOMContentLoaded", async (_evt) => {
  await main();
});