import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";
import { fetchJSON, renderProjects } from '../global.js';

let projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');

renderProjects(projects, projectsContainer, 'h2');

const title = document.querySelector('.projects-title');
let projectsCount = projects.length;
title.textContent =  `${projectsCount} ${title.textContent}`;

let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

let colors = d3.scaleOrdinal(d3.schemeTableau10);

let selectedIndex = -1;

function renderPieChart(projectsGiven) {    
    let newRolledData = d3.rollups(
        projectsGiven,
        (v) => v.length,
        (d) => d.year,
    );
    
    let newData = newRolledData.map(([year, count]) => {
        return { value: count, label: year };
    });
    
    let newSliceGenerator = d3.pie().value((d) => d.value);
    let newArcData = newSliceGenerator(newData);
    let newArcs = newArcData.map((d) => arcGenerator(d));

    let newSVG = d3.select('svg');
    newSVG.selectAll('path').remove();
    let newLegend = d3.select('.legend');
    newLegend.selectAll('li').remove();

    newArcs.forEach((arc, idx) => {
        (newSVG
            .append('path')
            .attr('d', arc)
            .attr('fill', colors(idx))
        );
    });
    newData.forEach((d, idx) => {
        (newLegend
            .append('li')
            .attr('style', `--color:${colors(idx)}`)
            .attr('class', 'legend-item')
            .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
        );
    });
    newSVG.selectAll('path').remove();
    newArcs.forEach((arc, i) => {
        (newSVG
            .append('path')
            .attr('d', arc)
            .attr('fill', colors(i))
            .on('click', () => {
                selectedIndex = selectedIndex === i ? -1 : i;
            
            (newSVG
                .selectAll('path')
                .attr('class', (_, idx) => {
                    if (idx == selectedIndex) {
                        return 'selected';
                    }
                }));
            
            (newLegend
                .selectAll('li')
                .attr('class', (_, idx) => {
                    if (idx == selectedIndex) {
                        return 'legend-item selected';
                    }
                    else {
                        return 'legend-item';
                    }
                }));
            if (selectedIndex === -1) {
                renderProjects(projectsGiven, projectsContainer, 'h2');
            }
            else {
                let filteredProjects = projectsGiven.filter((project) => project.year == newData[selectedIndex].label);
                renderProjects(filteredProjects, projectsContainer, 'h2');
                projects = filteredProjects;
            }
        }));
    });
}

renderPieChart(projects);

let query = '';

let searchInput = document.querySelector('.searchBar');

searchInput.addEventListener('change', (event) => {
    query = event.target.value;
    let filteredProjects = projects.filter((project) => {
        let values = Object.values(project).join('\n').toLowerCase();
        return values.includes(query.toLowerCase());
    });
    renderProjects(filteredProjects, projectsContainer, 'h2');
    renderPieChart(filteredProjects);
});