//============== Cookie関連 ==============//
// Cookieの名前一覧を取得
function nameCookie() {
    let name = [];
    document.cookie.replace(/ /g, "").split(";").forEach(e => {
        name.push(e.split("=")[0]);
    });
    return name;
}

// Cookieの値一覧を取得
function valueCookie() {
    let value = [];
    document.cookie.replace(/ /g, "").split(";").forEach(e => {
        value.push(e.split("=")[1]);
    });
    return value;
}

// 指定した名前の Cookie の値を取得
function searchValueCookie(item) {
    let index = nameCookie().indexOf(item);
    return index !== -1 ? valueCookie()[index] : "";
}

// 指定した値の Cookie の名前を取得
function searchNameCookie(item) {
    let index = valueCookie().indexOf(item);
    return index !== -1 ? nameCookie()[index] : "";
}

// Cookie を削除
function clearCookie(name) {
    document.cookie = name + "=; max-age=0";
}

//============== 獲得アイテム関連 ==============//
// 獲得したアイテム（画像）を Cookie から取得
function getItemsFromCookie() {
    let cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
        let [name, value] = cookie.split("=");
        if (name === "playerItems") {
            try {
                return JSON.parse(decodeURIComponent(value));  // Cookieのデコード
            } catch (e) {
                return [];
            }
        }
    }
    return [];
}

// 獲得したアイテムをリストに表示
function displayCollectedItems() {
    let collectedItems = getItemsFromCookie();
    let itemList = document.querySelector(".itemlist");

    // 既存のリストをクリア
    while (itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
    }

    if (collectedItems.length === 0) {
        let noItem = document.createElement("li");
        noItem.textContent = "アイテム未獲得";
        itemList.appendChild(noItem);
        return;
    }

    collectedItems.forEach(item => {
        let listItem = document.createElement("li");
        listItem.className = "item";

        let imgElement = document.createElement("img");
        imgElement.src = item;
        imgElement.alt = "獲得アイテム";
        imgElement.style.width = "100px";
        imgElement.style.height = "100px";
        imgElement.style.objectFit = "cover";

        listItem.appendChild(imgElement);
        itemList.appendChild(listItem);
    });
}

//============== ボタン関連 ==============//
// ボーダーの色を変更
function btnBorderChange(selectNum) {
    let selectBtn = document.querySelectorAll('.s-btn')[selectNum];
    if (selectBtn.classList.length === 1) {
        selectBtn.classList.add('s-btncolor0' + (selectNum + 1));
        for (let i = 0; i < 3; i++) {
            if (i !== selectNum) {
                let notSelectBtn = document.querySelector('.s-btncolor0' + (i + 1));
                if (notSelectBtn) {
                    notSelectBtn.classList.remove('s-btncolor0' + (i + 1));
                }
            }
        }
    }
}

// リスト選択時の処理
function selectBoxBtn(selectNum) {
    let itemList = document.querySelector('.itemlist');
    let originalClass = 'itemlist-color0' + itemList.classList.value.slice(-1);
    let changeClass = 'itemlist-color0' + (selectNum + 1);

    if (originalClass === changeClass) return;
    itemList.classList.replace(originalClass, changeClass);
}

// リストのアイテムを削除
function selectBoxRemove() {
    let itemList = document.querySelector('.itemlist');
    while (itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
    }
}

// アイテムを選択
function itemSelect(itemNum) {
    let skinImg = document.querySelectorAll('.item img')[itemNum];
    let skinImgSrc = skinImg.getAttribute('src').slice(4);
    let selectSkin = 'img/' + skinImgSrc;

    document.cookie = 'selectedSkin=' + encodeURIComponent(skinImgSrc) + '; path=/; max-age=31536000'; // 1年間保存

    let itemImage = document.querySelector('.selected_item_img');
    itemImage.src = selectSkin;
}

// メニュー画面で実行
document.addEventListener("DOMContentLoaded", () => {
    displayCollectedItems();

    document.querySelector('.select-btn').addEventListener('click', function(e) {
        if (e.target.className !== 'select-btn') {
            let sbtn = document.querySelectorAll('.s-btn');
            let selectNum = Array.from(sbtn).indexOf(e.target);
            switch (selectNum) {
                case 0: selectItem = 'head'; break;
                case 1: selectItem = 'body'; break;
                case 2: window.location.href = 'gacha.html';
            }
            btnBorderChange(selectNum);
            selectBoxBtn(selectNum);
        }
        selectBoxRemove();
        displayCollectedItems();
    });

    document.querySelector('.itemlist').addEventListener('click', function(e) {
        let item = document.querySelectorAll(".item img");
        let itemNum = Array.from(item).indexOf(e.target);
        itemSelect(itemNum);
    });
});
