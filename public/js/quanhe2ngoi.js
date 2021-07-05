let typeA = 1;
let typeR = 1;
let qhR = '0';
$('input[type=radio][name=kind-A]').change(function () {
    if (this.value == 'option1') {
        $('#lk-A').removeClass('d-none');
        $('#dac-ta-A').addClass('d-none');
        typeA = 1;
    }
    else if (this.value == 'option2') {
        $('#lk-A').addClass('d-none');
        $('#dac-ta-A').removeClass('d-none');
        typeA = 2;
    }
});

// ---------------
$('input[type=radio][name=kind-R]').change(function () {
    if (this.value == 'option1') {
        $('#lk-R').removeClass('d-none');
        $('#dac-ta-R').addClass('d-none');
        typeR = 1;
    }
    else if (this.value == 'option2') {
        $('#lk-R').addClass('d-none');
        $('#dac-ta-R').removeClass('d-none');
        typeR = 2;
    }
});

// ------------- SELECT R
$('#dk-R').change(function () {
    var optionSelected = $(this).find("option:selected");
    var valueSelected = optionSelected.val();
    var textSelected = optionSelected.text();
    qhR = valueSelected;
    if (valueSelected == 8 || valueSelected == 9) {
        $('#input-right-expr-R').prop('disabled', true)
    } else {
        $('#input-right-expr-R').prop('disabled', false)
    }
});

// --------------- NOP
$('#nop').on('click', (e) => {
    $('#chi-tiet-loi-giai').empty();

    let dataA = '';
    let dataR = '';

    if (typeA === 1) {
        dataA = $('#lk-A').val();
    } else {
        dataA = '';

    }

    if (typeR === 1) {
        dataR = $('#lk-R').val();
    } else {
        dataR = $('#input-left-expr-R').val() + '@' + qhR + '@' + $('#input-right-expr-R').val()
    }

    $.ajax({
        method: 'POST',
        url: '/quan-he-thu-tu',
        data: {
            typeA: typeA,
            typeR: typeR,
            dataA: dataA,
            dataR: dataR
        }
    }).done(rs => {
        $('.bai-giai').removeClass('d-none');
        if (rs.type === 1) {
            if (rs.rs === true)
                in_tinh_chat(rs.msg);
            else {
                //// THONG BAO DE BAI KHONGG HO TRO
                $('#chi-tiet-loi-giai').append(rs.msg);
            }
        } else if (rs.type === 2) {
            in_quan_he_tuog_duong(rs.msg);
        }
        else if (rs.type === 3) {
            if (rs.rs === true)
                in_quan_he_thu_tu(rs.msg, rs.exp);
            else
                in_quan_he_thu_tu(rs.msg);
        }

    })
});


function in_tinh_chat(rs, length = undefined) {
    if (length === undefined) length = rs.length;
    for (let i = 0; i < length; i++) {
        let div = '<div class= "mt-4">';

        for (let j = 0; j < rs[i].length; j++) {
            if (j == 0)
                div += `<div><b>${rs[i][j]}</b></div>`;
            else if (j == rs[i].length - 1)
                div += `<div class ='mt-2'><i>${rs[i][j]}</i></div>`;
            else
                div += `<div>${rs[i][j]}</div>`;
        }

        div += '</div>';
        $('#chi-tiet-loi-giai').append(div);
    }
}

function in_quan_he_tuog_duong(rs) {
    in_tinh_chat(rs, 4);
    for (let i = 4; i < rs.length; i++) {
        let div = '<div class= "mt-4">';

        for (let j = 0; j < rs[i].length; j++) {
            div += `<div>${rs[i][j]}</div>`;
        }

        div += '</div>';
        $('#chi-tiet-loi-giai').append(div);
    }
}

function in_quan_he_thu_tu(rs, exp = undefined) {
    in_tinh_chat(rs, 4);
    for (let i = 4; i < rs.length; i++) {
        let div = '<div class= "mt-4">';

        for (let j = 0; j < rs[i].length; j++) {
            div += `<div>${rs[i][j]}</div>`;
        }

        div += '</div>';
        $('#chi-tiet-loi-giai').append(div);
    }

    if (undefined) return;
    if (exp.giaTriLonNhat.length !== 0)
        $('#chi-tiet-loi-giai').append(`<div class='mt-3'>Giá trị lớn nhất là: ${exp.giaTriLonNhat}</div>`);
    else
        $('#chi-tiet-loi-giai').append(`<div class='mt-3'>Giá trị lớn nhất là: Không có</div>`);
    if (exp.giaTriNhoNhat.length !== 0)
        $('#chi-tiet-loi-giai').append(`<div>Giá trị nhỏ nhất là: ${exp.giaTriNhoNhat}</div>`);
    else
        $('#chi-tiet-loi-giai').append(`<div>Giá trị nhỏ nhất là: không có</div>`);
    $('#chi-tiet-loi-giai').append(`<div>Thành phần tối đại là: ${exp.thanhPhanToiDai}</div>`);
    $('#chi-tiet-loi-giai').append(`<div>Thành phần tối tiểu là: ${exp.thanhPhanToiTieu}</div>`);

    //// IN NODE
    $('#chi-tiet-loi-giai').append("<div id='new-row'><div class ='mb-2'>Sơ đồ Hasse như sau:</div></div>");
    let drawObj = new DrawObj('#new-row');
    let nodes = [];
    for (let i = 0; i < exp.seed.length; i++) {
        for (let j = 0; j < exp.seed[i].length; j++) {
            let node = new Node_(i, j, exp.seed[i][j]);
            nodes.push(node);
            drawObj.drawNode(node);
        }
    }

    /// IN EDGE
    for (let i = 0; i < exp.soDo.length; i++) {

        let index_1 = nodes.findIndex(e => { return exp.soDo[i][0] === e.id; });
        let index_2 = nodes.findIndex(e => { return exp.soDo[i][1] === e.id; });

        drawObj.drawEdge(nodes[index_1], nodes[index_2]);


    }


};