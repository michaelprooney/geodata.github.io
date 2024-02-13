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

interface Population {
  id: string,
  number: string,
  admin_division: string,
  pop_2020: string,
  pop_2010: string,
  pop_2000: string,
  pop_1990: string,
  pop_1982: string,
  pop_1964: string,
  pop_1954: string,
  pop_1947: string,
  pop_1937: string,
  pop_1928: string,
  pop_1912: string,
  p_12_28: string,
  p_28_37: string,
  p_37_47: string,
  p_47_54:string,
  p_54_64: string,
  p_64_82: string,
  p_82_90: string,
  p_90_00: string,
  p_00_10: string,
  p_10_20: string,
  non_zero: string,
  average: string,
}

// function getTopFieldValues(data: Games[], field: keyof Games, topCount: number): {
//   [x: string]: string | number;
//   count: number;
// }[] {
//   const fieldCounts: Record<string, number> = {};
//   const fieldSums: Record<string, number> = {}; // New record to store the sum of opening_ply for each field
//   const fieldAverage: Record<string, number> = {};

//   // Count occurrences of the specified field
//   data.forEach((item) => {
//     const fieldValue = item[field];
//     const openingPly = Number(item['opening_ply']);
//     fieldCounts[fieldValue] = (fieldCounts[fieldValue] || 0) + 1;
//     fieldSums[fieldValue] = (fieldSums[fieldValue] || 0) + openingPly;
//   });

//   // Convert the counts into an array of objects
//   const fieldCountArray = Object.entries(fieldCounts).map(([value, count]) => { 
//     const average = fieldSums[value] / count;
//     return {[field]: value, count, ["Average # of moves per opening"]:average};
//   });

//   // Sort the array by count in descending order
//   fieldCountArray.sort((a, b) => b.count - a.count);

//   // Take the top N field values
//   const topFieldValues = fieldCountArray.slice(0, topCount);

//   return topFieldValues;
// }

async function main(): Promise<void> {
  const pop_data: Array<Population> = await d3.csv("data/Chinese_pop_province_iso.csv");
  console.log(pop_data);
  const china_population = new Map<number, number>();

  pop_data.forEach((d: { number: string, pop_2020: string }) => {
      china_population.set(+d.number, +d.pop_2020);
  });
  console.log(china_population);
  // const population_2020: Map<number, number> = new Map(pop_data.map(d => [+d.number, +d.pop_2020]));
  // console.log(population_2020);
  // const population_2010: Map<number, number> = new Map(pop_data.map(d => [+d.number, +d.pop_2010]));
  // console.log(population_2010);
  const domain = ["1912","1928","1937","1947","1954","1964","1982","1990", "2000", "2010", "2020"];
  const china_year = document.createElement("input") as HTMLInputElement;

  // Set attributes for the input element
  china_year.type = "range"; // Use type="range" for slider
  china_year.min = "0";      // Minimum value index in domain
  china_year.max = (domain.length - 1).toString(); // Maximum value index in domain
  china_year.step = "1";     // Step size
  china_year.value = "0";    // Initial value

  // Create a label for the slider
  const label = document.createElement("label");
  label.innerHTML = "Year: ";

  // Create a span element to display the selected value
  const valueSpan = document.createElement("span");
  valueSpan.innerHTML = domain[0]; // Initial value

  // Append the label, input, and span elements to a container (e.g., a div)
  const container = document.createElement("div");
  container.appendChild(label);
  container.appendChild(china_year);
  container.appendChild(valueSpan);

  // Add an event listener to update the span with the selected value
  china_year.addEventListener("input", function() {
      const index = parseInt(this.value);
      valueSpan.innerHTML = domain[index];
      console.log(valueSpan.innerHTML)
  });

  // Add the container to the document body or any desired parent element
  document.querySelector("#after")?.append(container);
}

window.addEventListener("DOMContentLoaded", async (_evt) => {
  await main();
});