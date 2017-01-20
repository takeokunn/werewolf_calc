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
    const tbl = '<tr><td>' + id + '</td><td>' + role + '</td><td>' + battle + '</td></tr>';
    $('table > tbody tr:first').before(tbl);
}

const adaptPercentage = function() {
    var murabito = jinrou = kaitou = kyoujin = uranaishi = teruteru = 0;
    const length = state_array.length;
    state_array.map(function(x) {
        if(isWin[x.battle] === 'lose') return;
        switch (x.role) {
        case 'murabito':
            murabito++;
            break;
        case 'jinrou':
            jinrou++;
            break;
        case 'kaitou':
            kaitou++;
            break;
        case 'kyoujin':
            kyoujin++;
            break;
        case 'uranaishi':
            uranaishi++;
            break;
        case 'teruteru':
            teruteru++;
            break;
        }
    });

    $('#percentage-murabito').text(Math.floor(murabito / length * 100) + '%');
    $('#percentage-jinrou').text(Math.floor(jinrou / length * 100) + '%');
    $('#percentage-kaitou').text(Math.floor(kaitou / length * 100) + '%');
    $('#percentage-kyoujin').text(Math.floor(kyoujin / length * 100) + '%');
    $('#percentage-uranaishi').text(Math.floor(uranaishi / length * 100) + '%');
    $('#percentage-teruteru').text(Math.floor(teruteru / length * 100) + '%');
}

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
$('#add').click(function() {
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
});
