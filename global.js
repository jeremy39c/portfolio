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
    {url: 'index.html', title: 'Home'},
    {url: 'projects/index.html', title: 'Projects'},
    {url: 'contact/index.html', title: 'Contact'},
    {url: 'https://github.com/jeremy39c', title: 'Profile'},
    {url: 'resume/index.html', title: 'Resume'},
];
let nav = document.createElement('nav');
document.body.prepend(nav);
for (let p of pages) {
    let url = p.url;
    let title = p.title;
    nav.insertAdjacentHTML('beforeend', `<a href="${url}">${title}</a>`);
}
const ARE_WE_HOME = document.documentElement.classList.contains('home');
if(!ARE_WE_HOME && !url.startsWith('http')) {
    url = '../' + url;
}
// url = !ARE_WE_HOME && !url.startsWith('http') ? '../' + url : url;