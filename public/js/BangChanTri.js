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
    $('.bai-giai').removeClass('d-none');
    $('#chi-tiet-loi-giai').html('');
    console.log(menhDeGoc);
    $.ajax({
        method: "POST",
        url: '/bang-chan-tri',
        data: {
            deBai: menhDeGoc
        }
    }).done(rs => {
       if(rs.msg===true){
           let table = `<table class="table table-bordered">
           <thead> <tr>`

           console.log(rs.loiGiai)
           rs.loiGiai._head.forEach(e => {
               table+=`<th scope="col">${e}</th>`;
           }); 
           table += `</tr> </thead>  <tbody> `;

           rs.loiGiai._body.forEach(e=>{
               table+='<tr>';
               e.forEach(e1=>
                table+= `<td>${e1}</td>`
                )
                table+='</tr>';
           })
          
           table+= '</tbody> </table>';

           $('#chi-tiet-loi-giai').append(table);

       }
       else {
           $('#chi-tiet-loi-giai').append('Không thể giải tiếp được,mời xem lại đề bài!');
       }
    })
})

