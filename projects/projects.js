import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";
import { fetchJSON, renderProjects } from '../global.js';

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');

renderProjects(projects, projectsContainer, 'h2');

const title = document.querySelector('.projects-title');
let projectsCount = projects.length;
title.textContent =  `${projectsCount} ${title.textContent}`;

let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

let data = [1, 2];
let sliceGenerator = d3.pie();
let arcData = sliceGenerator(data);
let arcs = arcData.map((d) => arcGenerator(d));
let colors = ['gold', 'purple'];

arcs.forEach((arc, idx) => {
    (d3
        .select('svg')
        .append('path')
        .attr('d', arc)
        .attr('fill', colors[idx])
    );
})