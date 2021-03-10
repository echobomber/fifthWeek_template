let ticketName = document.getElementById('ticketName');
let ticketImg = document.getElementById('ticketImgUrl');
let ticketRegion = document.getElementById('ticketRegion');
let ticketPrice = document.getElementById('ticketPrice');
let ticketNum = document.getElementById('ticketNum');
let ticketRank = document.getElementById('ticketRank');
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
        <li class="tickeCard-item">
            <div class="tickeCard-img">
                <p class="img-caption">
                    ${item.area}
                </p>
                <img src="${item.imgUrl}" alt="">
            </div>
            <div class="tickeCard-text">
                <h2>${item.name}</h2>
                <p class="tickeCard-description">${item.description}</p>
                <p class="tickeCard-num">剩下倒數 ${item.group} 組套票 </p>
                <p class="tickeCard-price">$${item.price}</p>
            </div>
        </li>
        `;
    })
    ticketCard.innerHTML = str;
    if (data.length > 0) {
        searchResultText.textContent = `搜尋資料為 ${data.length} 筆`;
    } else {
        searchResultText.textContent = `搜尋資料為 ${data.length} 筆，無符合項目`;
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
        price: ticketPrice.value
    };
    ticketData = JSON.parse(localStorage.getItem('ticketData')) || remoteData;
    ticketData.push(tempData);
    localStorage.setItem('ticketData', JSON.stringify(ticketData));
    showTicketCard(ticketData);
    ticketName.value = "";
    ticketImg.value = "";
    ticketRegion.value = "";
    ticketDescription.value = "";
    ticketNum.value = "";
    ticketPrice.value = "";
}

let keywordSearch = (e) => {
    e.preventDefault();
    let keyword = keywordInput.value.trim();
    ticketData = JSON.parse(localStorage.getItem('ticketData')) || remoteData;
    ticketData = ticketData.filter((item) => {
        return (item.name.match(keyword));
    });
    showTicketCard(ticketData);
}
let areaSearch = (e) => {
    let area = regionSelect.value.trim();
    ticketData = JSON.parse(localStorage.getItem('ticketData')) || remoteData;
    // 要給 C3.js 的資料
    let chartTitle = "地區數量比例";
    let areaNumData = [];
    // 篩出所有地區名稱
    let filterArea = ticketData.map((item) => {
        return item.area;
    })
    // 篩出不重複的地區名稱
    filterArea = filterArea.filter((element, index, self) => {
        return self.indexOf(element) === index;
    });
    // 計算各自的數量
    filterArea.forEach((item) => {
        let Num = 0;
        for(let i = 0; i < ticketData.length; i++){
            if(item === ticketData[i].area){
                Num++;
            }
        }
        areaNumData.push([item, Num]);
    })
    callChart(chartTitle, areaNumData);
    // 秀卡片
    ticketData = ticketData.filter((item) => {
        return (item.area.match(area));
    });
    showTicketCard(ticketData);
}

let priceSearch = (e) => {
    let price = priceSelect.value.trim();
    ticketData = JSON.parse(localStorage.getItem('ticketData')) || remoteData;
    // 要給 C3.js 的資料
    let chartTitle = "價格區間比例";
    let priceNumData = [];
    let Num1 = 0, Num2 = 0, Num3 = 0;
    for(let i = 0; i < ticketData.length; i++){
        if(ticketData[i].price <= 500){
            Num1++;
        }else if(ticketData[i].price > 500 && ticketData[i].price < 1000){
            Num2++;
        }else if (ticketData[i].price >= 1000){
            Num3++;
        }
    }
    console.log(Num1, Num2, Num3)
    priceNumData.push(['500以下', Num1]);
    priceNumData.push(['500 - 1000', Num2]);
    priceNumData.push(['1000 以上', Num3]);
    callChart(chartTitle, priceNumData);
    // 
    if (price === "500以下") {
        ticketData = ticketData.filter((item) => {
            return (item.price <= 500);
        });
    } else if (price === "500-1000") {
        ticketData = ticketData.filter((item) => {
            return (item.price > 500 && item.price < 1000);
        });
    } else if (price === "1000以上") {
        ticketData = ticketData.filter((item) => {
            return (item.price >= 1000);
        });
    }
    showTicketCard(ticketData);
}

// c3.js
let callChart = (chartTitle, NumData) => {    
    let chart = c3.generate({
        data: {
            columns: NumData,
            type: 'donut',
            onclick: function (d, i) { console.log("onclick", d, i); },
            onmouseover: function (d, i) { console.log("onmouseover", d, i); },
            onmouseout: function (d, i) { console.log("onmouseout", d, i); }
        },
        donut: {
            title: chartTitle
        },
        bindto: '#NumChart'
    });
}

regionSelect.addEventListener('change', areaSearch, false);
priceSelect.addEventListener('change', priceSearch, false);
searchBtn.addEventListener('click', keywordSearch, false);

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
    let form = document.querySelector('#addTicketForm');
    let inputs = document.querySelectorAll(".addTicket-form-item input, .addTicket-form-item select, .addTicket-form-item textarea");
    let messages = document.querySelectorAll('[data-message]');
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
    }
    // 監聽 input 值改變的狀況
    inputs.forEach((item) => {
        item.addEventListener("change", function (e) {
            e.preventDefault();
            let targetName = item.name;
            let errors = validate(form, constraints);
            let str = `[data-message="${targetName}"]`;
            if (errors) {
                // 取得要輸出錯誤訊息的 p 標籤
                document.querySelector(str).textContent = errors[targetName];
            } else {
                document.querySelector(str).textContent = "";
            }

        });
    })
    // 更新錯誤訊息
    function showErrors(errors) {
        messages.forEach((item) => {
            item.textContent = "";
            item.textContent = errors[item.dataset.message];
        })
    }
})();
