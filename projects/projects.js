import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";
import { fetchJSON, renderProjects } from '../global.js';

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');

renderProjects(projects, projectsContainer, 'h2');

const title = document.querySelector('.projects-title');
let projectsCount = projects.length;
title.textContent =  `${projectsCount} ${title.textContent}`;

let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

// let projects = await fetchJSON('../lib/projects.json');
let rolledData = d3.rollups(
    projects,
    (v) => v.length,
    (d) => d.year,
);

let data = rolledData.map(([year, count]) => {
    return { value: count, label: year };
});
let sliceGenerator = d3.pie().value((d) => d.value);
let arcData = sliceGenerator(data);
let arcs = arcData.map((d) => arcGenerator(d));
let colors = d3.scaleOrdinal(d3.schemeTableau10);

arcs.forEach((arc, idx) => {
    (d3
        .select('svg')
        .append('path')
        .attr('d', arc)
        .attr('fill', colors(idx))
    );
})

let legend = d3.select('.legend');
data.forEach((d, idx) => {
    (legend
        .append('li')
        .attr('style', `--color:${colors(idx)}`)
        .attr('class', 'legend-item')
        .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
    );
})