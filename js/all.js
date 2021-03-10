let ticketName = document.getElementById('ticketName');
let ticketImg = document.getElementById('ticketImgUrl');
let ticketRegion = document.getElementById('ticketRegion');
let ticketPrice = document.getElementById('ticketPrice');
let ticketNum = document.getElementById('ticketNum');
let ticketRate = document.getElementById('ticketRate');
let ticketDescription = document.getElementById('ticketDescription');
// 
let addTicketBtn = document.querySelector('.addTicket-btn');
let regionSelect = document.querySelector('.regionSearch');
let searchResultText = document.querySelector('#searchResult-text');
//
let ticketCard = document.querySelector('.ticketCard-area');
let ticketData = [];
let remoteData = [];

axios.get('https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json')
    .then(function (response) {
        remoteData = response.data.data;
        ticketData = JSON.parse(localStorage.getItem('ticketData')) || remoteData;
        showTicketCard(ticketData);
        console.log(remoteData);
    })
    .catch(function (error) {
        console.log(error);
    })

let showTicketCard = (data) => {
    let str = '';
    data.forEach((item) => {
        str +=
            `
        <li class="ticketCard">
            <div class="ticketCard-img">
                <a href="#">
                    <img src="${item.imgUrl}" alt="">
                </a>
                <div class="ticketCard-region">${item.area}</div>
                <div class="ticketCard-rank">${item.rate}</div>
            </div>
            <div class="ticketCard-content">
                <div>
                    <h3>
                        <a href="#" class="ticketCard-name">${item.name}</a>
                    </h3>
                    <p class="ticketCard-description">
                        ${item.description}
                    </p>
                </div>
                <div class="ticketCard-info">
                    <div class="ticketCard-num">
                        <p>
                            <span><i class="fas fa-exclamation-circle"></i></span>
                            剩下最後 <span id="ticketCard-num"> ${item.group} </span> 組
                        </p>
                    </div>
                    <p class="ticketCard-price">
                        TWD <span id="ticketCard-price">$${item.price}</span>
                    </p>
                </div>
            </div>
        </li>
        `;
    })
    ticketCard.innerHTML = str;
    if (data.length > 0) {
        searchResultText.textContent = `本次搜尋共 ${data.length} 筆資料`;
    } else {
        searchResultText.textContent = `本次搜尋共 ${data.length} 筆資料，無符合項目`;
    }
}

let addTicketData = () => {
    let tempData = {
        id: ticketData.length,
        name: ticketName.value,
        imgUrl: ticketImg.value,
        area: ticketRegion.value,
        description: ticketDescription.value,
        group: ticketNum.value,
        price: ticketPrice.value,
        rate: ticketRate.value
    };
    ticketData = JSON.parse(localStorage.getItem('ticketData')) || remoteData;
    ticketData.push(tempData);
    localStorage.setItem('ticketData', JSON.stringify(ticketData));
    showTicketCard(ticketData);
    document.querySelector('.cantFind-area').setAttribute("style", "display: none;");
    ticketCard.setAttribute("style", "display: flex;");
    
    ticketName.value = "";
    ticketImg.value = "";
    ticketRegion.value = "";
    ticketPrice.value = "";
    ticketNum.value = "";
    ticketRate.value = "";
    ticketDescription.value = "";
}

let areaSearch = (e) => {
    let area = regionSelect.value.trim();
    ticketData = JSON.parse(localStorage.getItem('ticketData')) || remoteData;
    // 秀卡片
    ticketData = ticketData.filter((item) => {
        return (item.area.match(area));
    });
    if(ticketData.length > 0) {
        ticketCard.setAttribute("style", "display: flex;");
        document.querySelector('.cantFind-area').setAttribute("style", "display: none;");
    }else{
        ticketCard.setAttribute("style", "display: none;");
        document.querySelector('.cantFind-area').setAttribute("style", "display: block;");
    }
    showTicketCard(ticketData);
}

regionSelect.addEventListener('change', areaSearch, false);

// validate.js
; (function () {
    let constraints = {
        "套票名稱": {
            presence: {
                message: "是必填的欄位"
            },
        },
        "圖片網址": {
            presence: {
                message: "是必填的欄位",
            },
            url: {
                message: "格式有誤",
                schemes: ["http", "https"]
            }
        },
        "景點地區": {
            presence: {
                message: "是必填的欄位"
            },
        },
        "套票描述": {
            presence: {
                message: "是必填的欄位"
            },

        },
        "套票星級": {
            presence: {
                message: "是必填的欄位"
            },

        },
        "套票組數": {
            presence: {
                message: "是必填的欄位"
            },
            numericality:{
                message: "必須大於零",
                greaterThan: 0,
            }
        },
        "套票金額": {
            presence: {
                message: "是必填的欄位",  
            },
            numericality:{
                message: "必須大於零",
                greaterThan: 0,
            }
        },
    };

    // 綁定 Form 表單，在送出前做欄位檢查
    let form = document.querySelector('.addTicket-form');
    let inputs = document.querySelectorAll(".addTicket-input input, .addTicket-input select, .addTicket-input textarea");
    let messages = document.querySelectorAll('.alert-message p');
    form.addEventListener("submit", handleFormSubmit, false);

    // 沒有錯誤就顯示成功傳送
    function handleFormSubmit(e) {
        e.preventDefault();
        // 如果驗證通過，errors 的值為 undefined, 為 falsy 值。驗證不通過，errors 會儲存錯誤訊息。
        let errors = validate(form, constraints);
        if (errors) {
            showErrors(errors); // 顯示錯誤訊息，errors 是物件形式
        } else {
            addTicketData();
        }
        // console.log(messages);
    }
    // 監聽 input 值改變的狀況
    inputs.forEach((item) => {
        item.addEventListener("change", function (e) {
            e.preventDefault();
            let targetName = item.name;
            let errors = validate(form, constraints);
            let str = `${item.id}-message`;
            console.log(errors[targetName]);
            if (errors[targetName]) {
                // 取得要輸出錯誤訊息的 p 標籤
                document.querySelector(`#${str}`).innerHTML = 
                `
                    <i class="fas fa-exclamation-circle"></i>
                    <span>${errors[targetName]}</span>
                `;
            } else {
                document.querySelector(`#${str}`).innerHTML = "";
            }
        });
    })
    // 更新錯誤訊息
    function showErrors(errors) {
        messages.forEach((item) => {
            item.innerHTML = "";
            if(errors[item.dataset.message]){
                item.innerHTML = `
                <i class="fas fa-exclamation-circle"></i>
                <span>${errors[item.dataset.message]}</span>
            `;
            }
        })
    }
})();
