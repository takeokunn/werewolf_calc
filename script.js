(function() {
    'use strict';

    /**
     * @callback StorageManager~removeIfCallback
     * @param obj {any} An element of array
     * @returns {boolean}
     */

    /**
     * @brief detect variable type
     * @detail
     * JavaScriptでオブジェクトの型を判別するのにtypeof演算子使うとツラいよね - Qiita
     * http://qiita.com/Layzie/items/465e715dae14e2f601de
     * @param type {string} 'String', 'Number', 'Boolean', 'Date', 'Error', 'Array', 'Function', 'RegExp', 'Object'
     * @param obj {any} target variable
     * @returns {boolean}
     */
    function is(type, obj) {
        const clas = Object.prototype.toString.call(obj).slice(8, -1);
        return obj !== undefined && obj !== null && clas === type;
    }

    class StorageManager {
        get id() {
            const re = localStorage.getItem('jinrou_id');
            // check null or undefined
            if (null == re) {
                localStorage.setItem('jinrou_id', (0).toString());
                return 0;
            }
            return parseInt(re, 10);
        }
        set id(n) {
            if (is('Number', n)) localStorage.setItem('jinrou_id', (n).toString());
        }
        /**
         * @returns {any[]}
         */
        get stateArray() {
            const app = localStorage.getItem('jinrou_app');
            return app || JSON.parse(app);
        }
        set stateArray(arr) {
            localStorage.setItem('jinrou_app', JSON.stringify(arr));
        }
        /**
         * @brief push element to stateArray
         * @param e {any} element
         */
        push(e) {
            const arr = this.stateArray;
            arr.push(e);
            // call setter explicitly
            this.stateArray = arr;
            ++this.id;
        }
        /**
         * @brief remove if callback returns true.
         * @param f {StorageManager~removeIfCallback}
         */
        removeIf(f) {
            this.stateArray = this.stateArray.filter(f);
        }
        /**
         * @brief clear storage
         */
        clear() {
            localStorage.removeItem('jinrou_id');
            localStorage.removeItem('jinrou_app');
        }
    }

    const storage = new StorageManager();

    const localizeRole = {
        'murabito':  '村人',
        'jinrou':    '人狼',
        'kaitou':    '怪盗',
        'kyoujin':   '狂人',
        'uranaishi': '占い師',
        'teruteru':  'てるてる',
    };

    const isWin = {
        1: 'win',
        2: 'lose',
    };

    function addTableColumn(id, localizedRole, battle) {
        const tbl = `
            <tr>
                <td>
                    ${id}
                </td>
                <td>
                    ${localizedRole}
                </td>
                <td>
                    ${battle}
                </td>
                <td>
                    <input id=${id} type='button' class='btn btn-danger' value='削除'>
                </td>
            </tr>
        `;
        $('#logTableBody').prepend(tbl);
    }

    function removeAllTableColumn() {
        $('#logTableBody').empty().append('<tr></tr>');
    }

    /**
     * @param winNum {number}
     * @param sum {number}
     */
    function calcPercent(winNum, sum) {
        const tmp = Math.floor(winNum / sum * 100);
        return (isNaN(tmp) ? 0 : tmp) + '%';
    }

    function adaptPercentage() {
        const roles = {
            'murabito':  {num: 0, sum: 0},
            'jinrou':    {num: 0, sum: 0},
            'kaitou':    {num: 0, sum: 0},
            'kyoujin':   {num: 0, sum: 0},
            'uranaishi': {num: 0, sum: 0},
            'teruteru':  {num: 0, sum: 0},
        };
        for (let x of storage.stateArray) { // eslint-disable-line no-alert, prefer-const
            roles[x.role].sum++;
            if (isWin[x.battle] === 'win') roles[x.role].num++;
        }
        Object.keys(roles).forEach(
            r => $('#percentage-' + r).text(calcPercent(roles[r].num, roles[r].sum))
        );
    }

    $(document).ready(() => {
        for (let x of storage.stateArray) { // eslint-disable-line no-alert, prefer-const
            addTableColumn(x.id, localizeRole[x.role], isWin[x.battle]);
        }
        adaptPercentage();
    });

    // form validation
    $('.form-control').change(() => {
        /** @type {string} */
        const inputRole = $('#role').val();
        /** @type {string} */
        const inputBattle = $('#battle').val();
        $('#add').prop('disabled', (inputRole == 0 || inputBattle == 0));
    });

    // add form
    $('#add').on('click', () => {
        /** @type {string} */
        const inputRole = $('#role').val();
        /** @type {string} */
        const inputBattle = $('#battle').val();
        addTableColumn(storage.id, localizeRole[inputRole], isWin[inputBattle]);
        storage.push({
            id:     storage.id,
            role:   inputRole,
            battle: inputBattle,
        });
        adaptPercentage();
    });

    // clear all state
    $('#clear').on('click', () => {
        if (!confirm('ログを全部削除してもよろしいでしょうか？')) return;
        storage.clear();
        removeAllTableColumn();
        adaptPercentage();
    });

    // delete table
    $('tbody').on('click', '.btn-danger', function() {
        if (!confirm('ログを削除してもよろしいでしょうか？')) return;
        const stateId = parseInt($(this)[0].id, 10);
        $(this).parent().parent().remove();
        storage.removeIf(obj => obj.id !== stateId);
        adaptPercentage();
    });
}());
