//==============Cookie==============//
function nameCookie() {
    let name=[2];
    let i = 0;
    let r = document.cookie.replace(/ /g,"").split(';');
    r.forEach(function(e) {
        content = e.split('=');
        name[i] = content[0];
        i++;
    })
    return name;
}
function valueCookie() {
    let value=[2];
    let i = 0;
    let r = document.cookie.replace(/ /g,"").split(';');
    r.forEach(function(e) {
        content = e.split('=');
        value[i] = content[1];
        i++;
    })
    return value;
}
//-----nameを入れるとvalueが返ってくる-----//
function searchValueCookie(item) {
    let i = 0;
    let itemValue = "";
    nameCookie().forEach(function() {
        if (item == nameCookie()[i]) {itemValue =  valueCookie()[i]}
        i++;
    })
    return itemValue;
}
//-----valueを入れるとnameが返ってくる-----//
function searchNameCookie(item) {
    let i = 0;
    let itemName = "";
    valueCookie().forEach(function() {
        if (item == valueCookie()[i]) {itemName =  nameCookie()[i]}
        i++;
    })
    return itemName;
}

function clearCookie(name) {
    document.cookie = name + "=; max-age=0";
}


function btnBorderChange(selectNum) {
    let selectBtn = document.querySelectorAll('.s-btn')[selectNum];
    if (selectBtn.classList.length == 1) {
        selectBtn.classList.add('s-btncolor0' + (selectNum + 1));
        for (let i = 0; i < 3; i++) {
            if (i != selectNum) {
                let notSelectBtn = document.querySelector('.s-btncolor0' + (i + 1));
                if (notSelectBtn != null) {
                    notSelectBtn.classList.remove('s-btncolor0' + (i + 1));
                }
            }
        }
    }
}//btnBorderChange
function selectBoxBtn(selectNum) {
    let itemList = document.querySelector('.itemlist');
    let originalClass = 'itemlist-color0' + itemList.classList.value.slice(-1);
    let changeClass = 'itemlist-color0' + (selectNum + 1);

    if (originalClass == changeClass) { return; };
    itemList.classList.replace(originalClass, changeClass);
}//selectBoxBtn

function selectBoxList() {
    let listNum = 0;
    if (selectItem == 'head') {
        listNum = myHeadSkinNum;
    } else if (selectItem == 'body') {
        listNum = myBodySkinNum;
    }
    while (listNum % 4 != 0) {
        listNum += 1;
    }

    //リスト生成
    let itemList = document.querySelector('.itemlist');
    for (let i = 0; i < listNum; i++) {
        let selectBoxList = document.createElement('li');
        selectBoxList.className = 'item';
        itemList.appendChild(selectBoxList);
    }
}

function selectBoxRemove() {
    let itemList = document.querySelector('.itemlist');
    while (itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
    }
}
function nonSelectBoxImage() {
    let notImgSrc = '';
    if (selectItem == 'head') {
        notImgSrc = HEAD_SKIN_ITEM[0];
    } else {
        notImgSrc = BODY_SKIN_ITEM[0];
    }

    let notImgObj = {
        class: 'not-image',
        src: 'img/' + notImgSrc,
        alt: 'ノーマルスキン'
    }
    let notImg = document.createElement('img');
    FuncSetAttribute(notImg, notImgObj);

    document.querySelector('.item').appendChild(notImg);

}
function selectBoxImage() {
    let mySkinImage = [];
    let pickList = 1;
    let pickNum = 0;
    let skinImage = [];
    let createImage = [];
    for (let i = 1; i < mySkinNum; i++) {
        if (searchValueCookie('mySkin' + i).slice(0, 4) == selectItem) {
            let skinObj = {
                class: 'skin-image',
                src: 'img/' + searchValueCookie('mySkin' + i),
                alt: 'マイスキン',
            }
            skinImage.push(skinObj);
            mySkinImage[pickNum] = document.createElement('img');
            FuncSetAttribute(mySkinImage[pickNum], skinImage[pickNum]);
            createImage.push(document.getElementsByClassName('item')[pickList]);

            createImage[pickNum].appendChild(mySkinImage[pickNum]);
            pickList += 1;
            pickNum += 1;
        }
    }
}

function itemSelect(itemNum) {
    let skinImg = document.querySelectorAll('.item img')[itemNum];
    let skinImgSrc = skinImg.getAttribute('src').slice(4);
    let skinArrayNum = searchArrayNum(skinImgSrc);
    let selectSkin = '';
    if (selectItem == 'head') {
        selectSkin = 'img/' + HEAD_SKIN[skinArrayNum];
        document.cookie = 'selectSkinHead =' + HEAD_SKIN[skinArrayNum];
    } else if (selectItem == 'body') {
        selectSkin = 'img/' + BODY_SKIN[skinArrayNum];
        document.cookie = 'selectSkinBody =' + BODY_SKIN[skinArrayNum];
    }
    let itemImage = document.querySelector('.' + selectItem + '_img');
    itemImage.src = selectSkin;
}
function nonItemSelect() {
    let headItem = document.querySelector('.head_img');
    let bodyItem = document.querySelector('.body_img');
    headItem.src = 'img/' + searchValueCookie('selectSkinHead');
    bodyItem.src = 'img/' + searchValueCookie('selectSkinBody');
}

//==============メニュー.html==============//
path = location.pathname.slice(-10);
if (path == "/menu.html") {

    //menu限定
    selectBoxList();
    nonSelectBoxImage();
    selectBoxImage();
    nonItemSelect();
    document.querySelector('.select-btn').addEventListener('click', function(e) {
        if (e.target.className != 'select-btn') {
            let sbtn = document.querySelectorAll('.s-btn');
            let selectNum = [].slice.call(sbtn).indexOf(e.target);
            
            switch (selectNum) {
                case 0: selectItem = 'head'; break;
                case 1: selectItem = 'body'; break;
                case 2: window.location.href = 'gacha.html';
            }
            btnBorderChange(selectNum);
            selectBoxBtn(selectNum);
        }
        selectBoxRemove();
        selectBoxList();
        nonSelectBoxImage();
        selectBoxImage();
    })
    document.querySelector('.itemlist').addEventListener('click', function(e) {
        let item = document.querySelectorAll(".item img");
        let itemNum = [].slice.call(item).indexOf(e.target);
        itemSelect(itemNum);
    })
} 