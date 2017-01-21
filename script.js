var id = 1;
var state_array = [];

const role = {
    'murabito': '村人',
    'jinrou': '人狼',
    'kaitou': '怪盗',
    'kyoujin': '狂人',
    'uranaishi': '占い師',
    'teruteru': 'てるてる'
}

const isWin = {
    1: 'win',
    2: 'lose'
}

const addTableColumn = function(id, role, battle) {
    const tbl = `
        <tr>
            <td>
                ${id}
            </td>
            <td>
                ${role}
            </td>
            <td>
                ${battle}
            </td>
        </tr>
    `;
    $('table > tbody > tr:first').before(tbl);
};

const removeAllTableColumn = function() {
    $('table > tbody > tr').remove();
    $('table > tbody').append('<tr></tr>');
}

const calcPercent = function(win_num, sum_sum) {
    var tmp = Math.floor(win_num / sum_sum * 100);
    return isNaN(tmp)? 0 + '%' : tmp + '%';
}

const adaptPercentage = function() {
    var murabito = jinrou = kaitou = kyoujin = uranaishi = teruteru = 0;
    var murabito_sum = jinrou_sum = kaitou_sum = kyoujin_sum = uranaishi_sum = teruteru_sum = 0;
    console.log(state_array);
    state_array.map(function(x) {
        switch (x.role) {
        case 'murabito':
            murabito_sum++;
            if(isWin[x.battle] === 'win') murabito++;
            break;
        case 'jinrou':
            jinrou_sum++;
            if(isWin[x.battle] === 'win') jinrou++;
            break;
        case 'kaitou':
            kaitou_sum++;
            if(isWin[x.battle] === 'win') kaitou++;
            break;
        case 'kyoujin':
            kyoujin_sum++;
            if(isWin[x.battle] === 'win') kyoujin++;
            break;
        case 'uranaishi':
            uranaishi_sum++;
            if(isWin[x.battle] === 'win') uranaishi++;
            break;
        case 'teruteru':
            teruteru_sum++;
            if(isWin[x.battle] === 'win') teruteru++;
            break;
        }
    });
    $('#percentage-murabito').text(calcPercent(murabito, murabito_sum));
    $('#percentage-jinrou').text(calcPercent(jinrou, jinrou_sum));
    $('#percentage-kaitou').text(calcPercent(kaitou, kaitou_sum));
    $('#percentage-kyoujin').text(calcPercent(kyoujin, kyoujin_sum));
    $('#percentage-uranaishi').text(calcPercent(uranaishi, uranaishi_sum));
    $('#percentage-teruteru').text(calcPercent(teruteru, teruteru_sum));
}

$(document).ready(function(){
    state_array = JSON.parse(localStorage.getItem('jinrou_app'));
    state_array.map(function(x) {
        addTableColumn(x.id, role[x.role], isWin[x.battle]);
    })
    adaptPercentage();
});

// form validation
$('.form-control').change(function() {
    const input_role = $('#role').val();
    const input_battle = $('#battle').val();
    if(input_role == 0 || input_battle == 0) {
        $("#add").prop("disabled", true);
    }
    else {
        $("#add").prop("disabled", false);
    }
})

// form
$('#add').on('click', function() {
    const input_role = $('#role').val();
    const input_battle = $('#battle').val();
    addTableColumn(id, role[input_role], isWin[input_battle]);
    state_array.push({
        id: id,
        role: input_role,
        battle: input_battle
    });
    id++;
    adaptPercentage();

    localStorage.setItem('jinrou_app', JSON.stringify(state_array));
});

$('#clear').on('click', function() {
    if(confirm("ログを削除してもよろしいでしょうか？")) {
        state_array = [];
        localStorage.setItem('jinrou_app', JSON.stringify(state_array));
        removeAllTableColumn();
        adaptPercentage();
    }
});

// delete
$('tbody').on('click', '.btn-danger', function() {
    console.log($(this)[0].id)
});
