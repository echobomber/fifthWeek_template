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
                            ???????????? <span id="ticketCard-num"> ${item.group} </span> ???
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
        searchResultText.textContent = `??????????????? ${data.length} ?????????`;
    } else {
        searchResultText.textContent = `??????????????? ${data.length} ???????????????????????????`;
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
    // ?????????
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
        "????????????": {
            presence: {
                message: "??????????????????"
            },
        },
        "????????????": {
            presence: {
                message: "??????????????????",
            },
            url: {
                message: "????????????",
                schemes: ["http", "https"]
            }
        },
        "????????????": {
            presence: {
                message: "??????????????????"
            },
        },
        "????????????": {
            presence: {
                message: "??????????????????"
            },

        },
        "????????????": {
            presence: {
                message: "??????????????????"
            },

        },
        "????????????": {
            presence: {
                message: "??????????????????"
            },
            numericality:{
                message: "???????????????",
                greaterThan: 0,
            }
        },
        "????????????": {
            presence: {
                message: "??????????????????",  
            },
            numericality:{
                message: "???????????????",
                greaterThan: 0,
            }
        },
    };

    // ?????? Form ????????????????????????????????????
    let form = document.querySelector('.addTicket-form');
    let inputs = document.querySelectorAll(".addTicket-input input, .addTicket-input select, .addTicket-input textarea");
    let messages = document.querySelectorAll('.alert-message p');
    form.addEventListener("submit", handleFormSubmit, false);

    // ?????????????????????????????????
    function handleFormSubmit(e) {
        e.preventDefault();
        // ?????????????????????errors ????????? undefined, ??? falsy ????????????????????????errors ????????????????????????
        let errors = validate(form, constraints);
        if (errors) {
            showErrors(errors); // ?????????????????????errors ???????????????
        } else {
            addTicketData();
        }
        // console.log(messages);
    }
    // ?????? input ??????????????????
    inputs.forEach((item) => {
        item.addEventListener("change", function (e) {
            e.preventDefault();
            let targetName = item.name;
            let errors = validate(form, constraints);
            let str = `${item.id}-message`;
            console.log(errors[targetName]);
            if (errors[targetName]) {
                // ?????????????????????????????? p ??????
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
    // ??????????????????
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
