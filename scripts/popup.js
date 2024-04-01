console.log("extension popup - popup.js");
const addBtn = document.getElementById("add-btn");
const urlInput = document.getElementById("url-input");
const urlListEl = document.querySelector(".url-list");
const savedUrls = getSavedUrls();

const urlList = savedUrls;

rendrUrlList();

addBtn.addEventListener('click', () => {
    const urlName = urlInput.value;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if(savedUrls.some(({title}) => title === urlName || title === tabs[0].title) || savedUrls.some(({url}) => url === tabs[0].url)) return;

        const pageTitle = urlName.length > 0 ? urlName : tabs[0].title;

        const url = {url: tabs[0].url, title: pageTitle};
        urlList.push(url)

        localStorage.setItem("urls", JSON.stringify(urlList));
        urlInput.value = "";
        rendrUrlList();
    })
})
urlInput.addEventListener("keypress", (e) => {if(e.key === "Enter") addBtn.click();})

function getSavedUrls() {
    const def = [{url: "https://youtube.com/@webdebwithron?sub_confirmation=1", title: "Subscribe"}, {url: "https://www.youtube.com", title: "Extension Tutorial"}, {url: "https://www.google.com", title: "Press Trash To Delete"}];
    if(!localStorage.getItem("default")){localStorage.setItem("urls", JSON.stringify(def)); localStorage.setItem("default", true);}
    if(localStorage.getItem("urls")) return JSON.parse(localStorage.getItem("urls"));
    return []
}

function rendrUrlList(){
    urlListEl.innerHTML = "";
    urlList.forEach(({url, title}) => {
        const urlEl = document.createElement("div");
        urlEl.classList.add("url", "list-group-item",  "list-group-item-action");
        urlEl.innerHTML = `<a class="text-decoration-none text-dark w-100" href="${url}">${title}</a><i class="bi bi-trash text-danger"></i>`;
        urlListEl.appendChild(urlEl);
    })

    const links = document.querySelectorAll("a");
    links.forEach(link => {
        link.addEventListener('click', () => {
            chrome.tabs.create({url: link.href});
        })
    })

    const deleteBtns = document.querySelectorAll(".bi-trash");
    deleteBtns.forEach((deleteBtn, index) => {
        deleteBtn.addEventListener('click', () => {
            urlList.splice(index, 1);
            localStorage.setItem("urls", JSON.stringify(urlList));
            rendrUrlList();
        })
    })
}