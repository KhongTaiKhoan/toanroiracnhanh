let menhDeGoc = '';
// let countApha = 0;
let countSpe = 0;


$('.toan-tu').on('click',(e)=>{
    let insert_ = $(e.currentTarget).html().trim();
    if(insert_==='TRUE')insert_=1;
    if(insert_==='FALSE')insert_=0;
    $('#noi-dung').append(insert_);

    let el = document.getElementById("noi-dung");
    let range = document.createRange();
    let sel = window.getSelection();
 
  
    // console.log($('#noi-dung').html().length)
    range.setStart(el, $('#noi-dung').html().length-countSpe);

    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    menhDeGoc+= insert_;
    countSpe ++;
    // count++;
})

$('#noi-dung').on('forcus')

$('#noi-dung').on('keyup',e=>{
    if(e.keyCode === 32){ return;}
    // let inp = String.fromCharCode(e.keyCode);
    // if (/[a-zA-Z0-9-_ ]/.test(inp)){
    //    menhDeGoc+= e;
    // //    console.log(e.key);
    // //    count++;
    // }
    // console.log(e.keyCode);
    // if(e.key === 56 || e.key === 48) countSpe = 0;
    menhDeGoc = $('#noi-dung').html();
})

$('#nop').on('click', e => {
    $('#chi-tiet-loi-giai').html('');
    $.ajax({
        method: "POST",
        url: '/nop-bai',
        data: {
            noidung: menhDeGoc
        }
    }).done(rs => {
        if (rs.complete == true) {
            $('.bai-giai').removeClass('d-none');
            let loiGiai = rs.loiGiai;
            $('#ve-trai').html('- <b>VT </b>:');
            $('#ve-phai').html('- <b>VP </b>:');
            $('#ve-trai').append(rs.VT);
            $('#ve-phai').append(rs.VP);
            $('#chi-tiet-loi-giai').append(
                `<div class="loi-giai-row font-itim tien-de-giai"> 
                    <div>VT \u2261 ${rs.VT}</div>
                 </div>`
             );
            inKetQua(0,loiGiai.length,$('#toc-do').val() * 1000,loiGiai);

        }else{
            $('#chi-tiet-loi-giai').append('<div class="loi-giai-row font-itim tien-de-giai mb-0">Không thể chứng minh</div>')    
        }

    })
})

function inKetQua(i,length,time,loiGiai){
    if(i >= length) {
        $('#chi-tiet-loi-giai').append(
            `<div class="loi-giai-row font-itim tien-de-giai"> 
                <div><span>Vậy VT đã tương đương VP (đpcm)</span></div>
             </div>`
         );
    }
    else {
        // console.log(loiGiai[i]);
        $('#chi-tiet-loi-giai').append(
            `<div class="loi-giai-row font-itim tien-de-giai"> 
                <div><span>\u2261 ${loiGiai[i].exp}     ${loiGiai[i].rule}</span></div>
             </div>`
         );
        let t = $('#toc-do').val() * 1000 ;

        setTimeout( 
            inKetQua
            ,time,
            i+1,length,t,loiGiai
        )
    }
}

