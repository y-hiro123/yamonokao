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