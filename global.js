console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// let navLinks = $$("nav a");
// let currentLink = navLinks.find(
//     (a) => a.host == location.host && a.pathname == location.pathname
// );
// currentLink?.classList.add('current');

let pages = [
    {url: '', title: 'Home'},
    {url: 'projects/', title: 'Projects'},
    {url: 'contact/', title: 'Contact'},
    {url: 'https://github.com/jeremy39c', title: 'Profile'},
    {url: 'resume/', title: 'Resume'},
    {url: 'meta/', title: 'Meta'},
];
let nav = document.createElement('nav');
document.body.prepend(nav);
for (let p of pages) {
    let url = p.url;
    let title = p.title;
    const ARE_WE_HOME = document.documentElement.classList.contains('home');
    if(!ARE_WE_HOME && !url.startsWith('http')) {
        url = '../' + url;
    }
    // url = !ARE_WE_HOME && !url.startsWith('http') ? '../' + url : url;
    let a = document.createElement('a');
    a.href = url;
    a.textContent= title;
    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add('current');
    }
    // a.classList.toggle(
        // 'current',
        // a.host === location.host && a.pathname === location.pathname
    // );
    if (a.host !== location.host) {
        a.target = "_blank";
    }
    nav.append(a);
}

document.body.insertAdjacentHTML(
    'afterbegin',
    `
        <label class="color-scheme">
            Theme:
            <select>
                <option value="light dark">Automatic</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
            </select>
        </label>
    `
);
document.documentElement.style.setProperty('color-scheme', 'light dark');
let select = document.querySelector('select');
function setColorScheme(colorScheme) {
    document.documentElement.style.setProperty('color-scheme', colorScheme);
    select.value = colorScheme;
}
select.addEventListener('input', function (event) {
    console.log('color scheme changed to', event.target.value);
    setColorScheme(event.target.value);
    localStorage.colorScheme = event.target.value;
});
if ("colorScheme" in localStorage) {
    setColorScheme(localStorage.colorScheme);
}

let form = document.querySelector('form');
form?.addEventListener('submit', function (event) {
    event.preventDefault();
    const data = new FormData(form);
    let url = `${form.action}?`;
    for (let [name, value] of data) {
        url = url + `${name}=${encodeURIComponent(value)}&`;
    }
    location.href = url.slice(0, -1);
});

export async function fetchJSON(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch projects: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching or parsing JSON data:', error);
    } 
}

export function renderProjects(project, containerElement, headingLevel = 'h2') {
    containerElement.innerHTML = '';
    for (const proj of project) {
        const article = document.createElement('article');
        article.innerHTML = `
            <${headingLevel}>${proj.title}</${headingLevel}>
            <img src="${proj.image}" alt="${proj.title}">
            <p>${proj.description} (c. ${proj.year})</p>
        `;
        containerElement.appendChild(article);
    }
}

export async function fetchGitHubData(username) {
    return fetchJSON(`https://api.github.com/users/${username}`);
}