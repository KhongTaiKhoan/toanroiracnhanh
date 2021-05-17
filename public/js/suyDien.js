$('#gia-thiet').on('click', '.them', e => {
    $('#gia-thiet').children().last().removeClass('menh-de-them-moi_last');
    $('#gia-thiet').append(`  
    <div class="menh-de-them-moi mb-1 position-relative menh-de-them-moi_last">
    <div contenteditable="true" class="form-control bg-white noi-dung menh-de"></div>
    <div class='them-xoa-menh-de'>
        <span class="them" id='them-1'></span>
        <span class="xoa " id='xoa-1'></span>
    </div>
    </div>`);
    let n = document.querySelector('.menh-de-them-moi_last .noi-dung');
    n.addEventListener('click',function () {
        menhDe= $(this) 
    });
});

$('#gia-thiet').on('click', '.xoa', e => {
    $('.menh-de-them-moi_last').remove();
    $('#gia-thiet').children().last().addClass('menh-de-them-moi_last');
});




let menhDe = undefined;
$('.toan-tu').on('click', (e) => {
    if(menhDe === undefined) return ;
    let insert_ = $(e.currentTarget).html().trim();
    if (insert_ === 'TRUE') insert_ = 1;
    if (insert_ === 'FALSE') insert_ = 0;

    menhDe.append(insert_);
    menhDe = undefined;
})

$('.menh-de').on('click',(e) =>{
    menhDe = $(e.currentTarget);
})



$('#nop').on('click', e => {

    let stringDeBai = [];
    let deBais = document.getElementsByClassName('noi-dung');
    $('.bai-giai').removeClass('d-none');
    $('#chi-tiet-loi-giai').html('');
    $('#mo-ta-de-bai').html('');
    for (let i = 0; i < deBais.length; i++) {
        stringDeBai.push(deBais[i].innerHTML);
        $('#mo-ta-de-bai').append(`<div>${deBais[i].innerHTML}</div>`)
    }
    
    stringDeBai.push(document.getElementById('noi-dung-ket-luan').innerHTML);
    $('#mo-ta-de-bai').append('<hr>')
    $('#mo-ta-de-bai').append(`<div>Kết luận: ${document.getElementById('noi-dung-ket-luan').innerHTML}</div>`)

    $.ajax({
        url: '/suy-dien',
        method:'POST',
        data:{
           deBai:stringDeBai
        }
    }).done(rs=>{
        if(rs.msg === true){
            let datas=[];
            datas = rs.data;
            inKetQua(0,datas.length,.2,datas)

        }
        else{
           $('#chi-tiet-loi-giai').append('<div class="loi-giai-row font-itim tien-de-giai mb-0">Không thể suy luận từ giả thiết ra kết luận</div>')    
        }
    })
})



function inKetQua(i,length,time,datas){
    if(i >= length) {
        $('#chi-tiet-loi-giai').append('<div class="loi-giai-row font-itim tien-de-giai mb-0"> Vậy đã suy diễn ra được kết luận (đpcm)</div>');
    }
    else {
        // console.log(loiGiai[i]);
        $('#chi-tiet-loi-giai').append(`
        <div class="loi-giai-row font-itim tien-de-giai mb-0 d-flex">
            <div class="left-sd">${datas[i][0]}</div>
            <div class="rigt-sd">${datas[i][1]}</div>
        </div>`)
        let t = $('#toc-do').val() * 1000 ;

        setTimeout( 
            inKetQua
            ,time,
            i+1,length,t,datas
        )
    }
}

