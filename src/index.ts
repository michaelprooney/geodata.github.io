import * as Plot from "@observablehq/plot";
import * as d3 from 'd3';
//import {addTooltips} from "@mkfreeman/plot-tooltip"

// interface Player {
//   name: string;
//   team: string;
//   usg_pct: number;
//   ts_pct: number;
//   playoff_mp: number;
//   playoff_usg_pct: number;
//   playoff_ts_pct: number;
//   playoff_mpg: number;
// }

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

function getTopFieldValues(data: Games[], field: keyof Games, topCount: number): {
  [x: string]: string | number;
  count: number;
}[] {
  const fieldCounts: Record<string, number> = {};
  const fieldSums: Record<string, number> = {}; // New record to store the sum of opening_ply for each field
  const fieldAverage: Record<string, number> = {};

  // Count occurrences of the specified field
  data.forEach((item) => {
    const fieldValue = item[field];
    const openingPly = Number(item['opening_ply']);
    fieldCounts[fieldValue] = (fieldCounts[fieldValue] || 0) + 1;
    fieldSums[fieldValue] = (fieldSums[fieldValue] || 0) + openingPly;
  });

  // Convert the counts into an array of objects
  const fieldCountArray = Object.entries(fieldCounts).map(([value, count]) => { 
    const average = fieldSums[value] / count;
    return {[field]: value, count, ["Average # of moves per opening"]:average};
  });

  // Sort the array by count in descending order
  fieldCountArray.sort((a, b) => b.count - a.count);

  // Take the top N field values
  const topFieldValues = fieldCountArray.slice(0, topCount);

  return topFieldValues;
}

async function main(): Promise<void> {
  const chess: Array<Games> = await d3.csv("data/Lichess.csv");
  //const data = (await res.json()) as Array<Player>;

  const filteredData = getTopFieldValues(chess, "opening_name", 20)

  const sideways = Plot.plot({
    title: "Top 20 Most Popular Chess Openings",
    height: 240,
    y: {
      label: "Name of Openings",
    },
    x: {
      label: "# of Games Used",
    },
    color: {
      type: "threshold",
      scheme: "turbo",
      legend: true,
      domain: [2,3,4,5,6,7]
    },
    // y: {
    //   domain: d3.sort(filteredData, d => -d.count).map(d => d.opening_name)
    // },
    marginLeft: 250,
    marks: [
      Plot.barX(filteredData, {
        x: "count" , y: "opening_name", fill: "Average # of moves per opening", tip: true, sort: {y: "-x"}}),
      Plot.ruleX([0]),
      //Plot.axisLeft(yScale).tickSize(0)
    ]
  })
  
  document.querySelector("#plot")?.append(sideways);


  const barchart = Plot.plot({
    title: "Openings Sequences Length",
    marginTop: 100,
    width: 640,
    grid: true,
    x: {
      label: "# of moves",
    },
    y: {
      label: "frequency",
    },
    marks: [
      Plot.barY(chess, Plot.groupX({
        y: "count"} , //title: (elems: string | any[]) => `${elems.length} games` }, 
        {x: d => Number(d.opening_ply), tip: true})),
      Plot.tip(
        [`Most opening sequences are 3 moves in duration.`],
        {x: 3, y: 3490, dy: 3, anchor: "bottom"}
      ),
      Plot.ruleY([0]),
    ],
  });
  
  document.querySelector("#vanilla")?.append(barchart);

  // const chess: Array<Games> = await d3.csv("data/Lichess.csv");

  const differences = chess.map(d => ({
    "Difference in rating between players": Math.abs(Number(d.white_rating) - Number(d.black_rating)),
    winner: d.winner,
    underdog: ((d.winner === "white" && d.white_rating < d.black_rating) ||  (d.winner === "black" && d.white_rating > d.black_rating)) ? "underdog" : d.victory_status === "draw" ? "draw" : "favorite",
    victory_status: d.victory_status,
    opening_name: d.opening_name
  }));

  
  const scatter = Plot.plot({
    title: "Games Outcomes vs. Difference in Ratings",
    marginLeft: 70,
    marginTop: 25,
    color: {
      type: "threshold",
      scheme: "turbo",
      legend: true,
      domain: [200,400,600,800,1000,1200,1400,1600]
    },
    x: {
      inset: 10,
      label: "Rating Differential",
    },
    y: {
      label: "Outcome",
    },
    marks: [
      Plot.dot(differences, {
        x: "Difference in rating between players", 
        y: "underdog", 
        stroke: "Difference in rating between players",
        // title: (d) =>
        //   `${d.winner} \n Game Status: ${d.victory_status} \n Opening Play: ${d.opening_name}` // \n makes a new line
      }),
      Plot.tip(
        differences,
        Plot.pointer({
          x: "Difference in rating between players",
          y: "underdog",
          title: (d) =>
            `Winner: ${d.winner} \n Game Status: ${d.victory_status} \n Opening Play: ${d.opening_name}` // \n makes a new line,
        }),
      )
      
    ],
    
  })

  document.querySelector("#after")?.append(scatter);
}

window.addEventListener("DOMContentLoaded", async (_evt) => {
  await main();
});