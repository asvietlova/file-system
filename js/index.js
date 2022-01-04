'use strict';

const uniqueFiles = new Set();

let selectedLiElement = null;

const filesList = document.getElementById("files");
const fileMenu = document.getElementById("file-menu");
const createMenu = document.getElementById("create-menu");

function hideAllMenus() {
    createMenu.style.visibility = "hidden";
    fileMenu.style.visibility = "hidden";
}

function getShowFileMenuCallback(liElement) {
    return (event) => {
        hideAllMenus();
        console.log("Show FileMenu event", liElement);
        event.preventDefault();
        fileMenu.style.visibility = "visible";
        fileMenu.style.top = event.clientY + "px";
        fileMenu.style.left = event.clientX + "px";
        selectedLiElement = liElement;
        console.log(selectedLiElement);
        // createMenu.style.visibility = "hidden";
        event.stopPropagation();
    }
}


createMenu.addEventListener("click", (e) => {
    hideAllMenus();
    e.stopPropagation();

    const fileName = prompt("Enter file name");
    console.log("CreateFile event", fileName);
    if (fileName === null) {
        return;
    }

    if (fileName === "") {
        alert("Error: You did not enter a file name.");
        return;
    }

    // Проверить, что имя файла уникально!!

    if (uniqueFiles.has(fileName)) {
        alert("Error! A file with this name already exists!");
        return;
    }
    uniqueFiles.add(fileName);

    // for (let textContent of document.getElementsByTagName("li")) {
    //     console.log("In loop");
    //     if (fileName === textContent.innerText) {
    //         alert("Error! A file with this name already exists!")
    //     }
    // }

    const fileNameLi = document.createElement("li");
    fileNameLi.innerText = fileName;
    fileNameLi.addEventListener("contextmenu", getShowFileMenuCallback(fileNameLi));
    filesList.appendChild(fileNameLi);
});

// document.addEventListener("click", (e) => {
//     console.log("Show CreateMenu event", e);
//     createMenu.style.visibility = "visible";
//     createMenu.style.top = e.clientY + "px";
//     createMenu.style.left = e.clientX + "px";
//     e.stopPropagation();
// });

document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    hideAllMenus();
    createMenu.style.visibility = "visible";
    createMenu.style.top = event.clientY + "px";
    createMenu.style.left = event.clientX + "px";
    // fileMenu.style.visibility = "hidden";
    event.stopPropagation();

});
document.addEventListener("click", (event) => {
    if (event.button !== 2) {
        hideAllMenus();
        // createMenu.style.visibility = "hidden";
        // fileMenu.style.visibility = "hidden";
    }
});

document.getElementById("file-menu-rename").addEventListener("click", (event) => {
    hideAllMenus();
    event.stopPropagation();
    if (selectedLiElement == null) {
        return;
    }
    let oldName = selectedLiElement.innerText;
    let newName = prompt("Please, enter file name!", oldName);
    console.log(newName);
    if (newName == null) {
        return;
    }
    if (newName === oldName) {
        return;
    }
    if (uniqueFiles.has(newName)) {
        alert("Error! A file with this name already exists!");
        return;
    }
    uniqueFiles.delete(oldName);
    uniqueFiles.add(newName);
    selectedLiElement.innerText = newName;
    selectedLiElement = null;

});