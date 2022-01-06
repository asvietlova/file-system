const uniqueFiles = new Set();

let editedLiElement = null;

const filesList = document.getElementById("files");
const fileMenu = document.getElementById("file-menu");
const createMenu = document.getElementById("create-menu");
const deleteSelectedMenu = document.getElementById("delete-selected-menu");

let eventAfterSelection = false;

function hideAllMenus() {
    createMenu.style.visibility = "hidden";
    fileMenu.style.visibility = "hidden";
    deleteSelectedMenu.style.visibility = "hidden";

    unselectForDeletion();
}

function getShowFileMenuCallback(liElement) {
    return (event) => {
        hideAllMenus();
        console.log("Show FileMenu event", liElement);
        event.preventDefault();
        fileMenu.style.visibility = "visible";
        fileMenu.style.top = event.clientY + "px";
        fileMenu.style.left = event.clientX + "px";
        editedLiElement = liElement;
        console.log(editedLiElement);
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
    // check for uniqueness of file name
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
    fileNameLi.setAttribute('draggable', true);
    fileNameLi.innerText = fileName;
    fileNameLi.addEventListener('dragstart', handleDragStart, false);
    fileNameLi.addEventListener('dragenter', handleDragEnter, false);
    fileNameLi.addEventListener('dragover', handleDragOver, false);
    fileNameLi.addEventListener('dragleave', handleDragLeave, false);
    fileNameLi.addEventListener('drop', handleDrop, false);
    fileNameLi.addEventListener('dragend', handleDragEnd, false);

    fileNameLi.addEventListener("contextmenu", getShowFileMenuCallback(fileNameLi));
    filesList.appendChild(fileNameLi);
});

document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    hideAllMenus();
    createMenu.style.visibility = "visible";
    createMenu.style.top = event.clientY + "px";
    createMenu.style.left = event.clientX + "px";
    event.stopPropagation();

});
document.addEventListener("click", (event) => {
    if (event.button !== 2) {
        console.log("mouse click check btn")
        if (eventAfterSelection) {
            eventAfterSelection = false;
            return;
        }

        hideAllMenus();
    }
});

document.getElementById("file-menu-rename").addEventListener("click", (event) => {
    hideAllMenus();
    event.stopPropagation();
    if (editedLiElement == null) {
        return;
    }
    let oldName = editedLiElement.innerText;
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
    editedLiElement.innerText = newName;
    editedLiElement = null;

});

document.getElementById("file-menu-delete").addEventListener("click", (event) => {
    hideAllMenus();
    event.stopPropagation();
    editedLiElement.remove();
    uniqueFiles.delete(editedLiElement.innerText);
    editedLiElement = null;
});


// Selected area;
let mouseDown = false;
let xStart, yStart, xEnd, yEnd;

document.addEventListener("mousedown", (event) => {
    console.log("Select area mousedown", event);
    xStart = event.pageX;
    yStart = event.pageY;
    mouseDown = true;
});

document.addEventListener("mousemove", (event) => {
    if (!mouseDown) {
        return;
    }
    // console.log("Select area - mousemove", event);
    xEnd = event.pageX;
    yEnd = event.pageY;
});

let selectedItemsForDeletion = [];

document.addEventListener("mouseup", (event) => {
    if (!mouseDown) {
        return;
    }
    mouseDown = false;

    if (xEnd == undefined || yEnd == undefined) {
        // it was not selection
        return;
    }

    console.log("Select area - mouseup", event);
    let selectedAreaTop = yStart < yEnd ? yStart : yEnd;
    let selectedAreaBottom = yStart > yEnd ? yStart : yEnd;
    let selectedAreaRight = xStart < xEnd ? xStart : xEnd;
    let selectedAreaLeft = xStart > xEnd ? xStart : xEnd;

    // !!! it's required to cleanup them
    yEnd = undefined;
    xEnd = undefined;

    selectedItemsForDeletion = [];
    for (let li of filesList.children) {
        let rect = li.getBoundingClientRect();

        if (selectedAreaTop <= rect.top && rect.bottom <= selectedAreaBottom &&
            selectedAreaRight <= rect.right && rect.left <= selectedAreaLeft) {
            // item located within selected area
            li.style.backgroundColor = "rgb(34, 91, 197)";
            selectedItemsForDeletion.push(li);
        }
    }

    if (selectedItemsForDeletion.length != 0) {
        deleteSelectedMenu.style.visibility = "visible";
        deleteSelectedMenu.style.top = event.clientY + "px";
        deleteSelectedMenu.style.left = event.clientX + "px";
        eventAfterSelection = true;
    }
});

function unselectForDeletion() {
    for (let li of selectedItemsForDeletion) {
        li.style.backgroundColor = "white";
    }
}

deleteSelectedMenu.addEventListener("click", (event) => {
    for (let li of selectedItemsForDeletion) {
        li.remove();
        uniqueFiles.delete(li.innerText);
    }
    selectedItemsForDeletion = [];
    deleteSelectedMenu.style.visibility = "hidden";
});



// Drag'n'dropp
let dragSrcEl = null;

function handleDragStart(e) {
    this.style.opacity = '0.4';

    dragSrcEl = this;
    console.log("Srag start ", dragSrcEl)

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragEnd(e) {
    this.style.opacity = '1';
    let items = document.getElementsByTagName("li")
    for (let item of items) {
        item.classList.remove('over');
    }
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }

    return false;
}

function handleDragEnter(e) {
    this.classList.add('over');
}

function handleDragLeave(e) {
    this.classList.remove('over');
}

function handleDrop(e) {
    e.stopPropagation();

    if (dragSrcEl !== this) {
        dragSrcEl.innerHTML = this.innerHTML;
        this.innerHTML = e.dataTransfer.getData('text/html');
    }

    return false;
}